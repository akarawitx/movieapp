import { createContext, useContext, useEffect, useState } from 'react'
import { createMockProfile, MOCK_ACTIVITY } from '../data/profile'
import { SEED_ACTIVITIES, SEED_PROFILES } from '../data/accounts'
import { useAccounts } from './AccountsContext'
import { load, save } from '../utils/storage'

const ProfileContext = createContext(null)

// ย้ายข้อมูลจาก key เดิมไป key ใหม่ (ใช้ตอนเปลี่ยน username)
const moveKey = (obj, from, to, value) => {
  const copy = { ...obj }
  delete copy[from]
  if (value !== undefined) copy[to] = value
  return copy
}

// โปรไฟล์และกิจกรรม (watchlist, รีวิว ฯลฯ) เก็บแยกตาม username และบันทึกลง localStorage
export function ProfileProvider({ user, onUserChange, children }) {
  const { accounts, renameAccount, removeAccount, updateAccount } = useAccounts()
  const [profiles, setProfiles] = useState(() => load('profiles', {}))
  const [activities, setActivities] = useState(() => load('activities', {}))

  useEffect(() => {
    save('profiles', profiles)
  }, [profiles])

  useEffect(() => {
    save('activities', activities)
  }, [activities])

  // ผู้ใช้ที่ยังไม่เคยบันทึกโปรไฟล์ → ใช้ข้อมูลจำลอง (อีเมลจากทะเบียนบัญชี)
  const resolveProfile = (username) =>
    profiles[username] ?? {
      ...createMockProfile(username),
      ...SEED_PROFILES[username],
      ...(accounts[username]?.email && { email: accounts[username].email }),
    }
  // ข้อมูลที่บันทึกจากเวอร์ชันเก่าอาจไม่มีบาง field → เติมจากค่าตั้งต้น
  const resolveActivity = (username, saved = activities) => ({
    ...(SEED_ACTIVITIES[username] ?? MOCK_ACTIVITY),
    ...saved[username],
  })

  const profile = user ? resolveProfile(user) : null
  const activity = resolveActivity(user)

  const setActivityOf = (username, update) =>
    setActivities((prev) => ({ ...prev, [username]: update(resolveActivity(username, prev)) }))
  const setActivity = (update) => setActivityOf(user, update)

  const updateProfile = (patch) => {
    if (!user) return
    const next = { ...profile, ...patch }
    setProfiles((prev) => moveKey(prev, user, next.username, next))
    if (next.email !== profile.email) updateAccount(user, { email: next.email })
    if (next.username !== user) {
      setActivities((prev) => moveKey(prev, user, next.username, prev[user]))
      renameAccount(user, next.username)
      onUserChange(next.username)
    }
  }

  const setAvatar = (dataUrl) => updateProfile({ avatar: dataUrl })
  const removeAvatar = () => updateProfile({ avatar: null })

  const deleteAccount = () => {
    setProfiles((prev) => moveKey(prev, user))
    setActivities((prev) => moveKey(prev, user))
    removeAccount(user)
    onUserChange(null)
  }

  // ── สำหรับผู้ดูแล: อ่าน/แก้ข้อมูลของผู้ใช้คนอื่น ──
  const getUserData = (username) => ({
    profile: resolveProfile(username),
    activity: resolveActivity(username),
  })

  const adminUpdateProfile = (username, patch) => {
    setProfiles((prev) => ({ ...prev, [username]: { ...resolveProfile(username), ...patch } }))
    if (patch.email) updateAccount(username, { email: patch.email })
  }

  const adminDeleteUserData = (username) => {
    setProfiles((prev) => moveKey(prev, username))
    setActivities((prev) => moveKey(prev, username))
  }

  const adminDeleteUserReview = (username, movieId) =>
    setActivityOf(username, (a) => ({
      ...a,
      reviews: a.reviews.filter((r) => r.movieId !== movieId),
      ratings: a.ratings.filter((r) => r.movieId !== movieId),
    }))

  // ── Watchlist ──
  const isInWatchlist = (movieId) => activity.watchlist.includes(movieId)

  const addToWatchlist = (movieId) =>
    setActivity((a) =>
      a.watchlist.includes(movieId) ? a : { ...a, watchlist: [movieId, ...a.watchlist] }
    )

  const toggleWatchlist = (movieId) => {
    const added = !isInWatchlist(movieId)
    setActivity((a) => ({
      ...a,
      watchlist: added
        ? [movieId, ...a.watchlist]
        : a.watchlist.filter((id) => id !== movieId),
      watched: added ? a.watched : a.watched.filter((id) => id !== movieId),
    }))
    return added
  }

  // ใส่กลับตำแหน่งเดิม (ใช้กับปุ่ม "เลิกทำ")
  const restoreWatchlist = (movieId, index, wasWatched) =>
    setActivity((a) => {
      if (a.watchlist.includes(movieId)) return a
      const watchlist = [...a.watchlist]
      watchlist.splice(Math.min(index, watchlist.length), 0, movieId)
      return {
        ...a,
        watchlist,
        watched: wasWatched ? [...a.watched, movieId] : a.watched,
      }
    })

  const isWatched = (movieId) => activity.watched.includes(movieId)

  const toggleWatched = (movieId) => {
    const nowWatched = !isWatched(movieId)
    setActivity((a) => ({
      ...a,
      watched: nowWatched
        ? [...a.watched, movieId]
        : a.watched.filter((id) => id !== movieId),
    }))
    return nowWatched
  }

  // ── รีวิวและคะแนน (ผู้ใช้ 1 คนรีวิวหนัง 1 เรื่องได้ 1 ครั้ง เหมือน backend) ──
  const getMyReview = (movieId) => activity.reviews.find((r) => r.movieId === movieId)

  const saveReview = (movieId, { score, title, body, spoiler }) =>
    setActivity((a) => {
      const existing = a.reviews.find((r) => r.movieId === movieId)
      const review = {
        id: existing?.id ?? `u-${movieId}`,
        movieId,
        score,
        title,
        body,
        spoiler,
        date: new Date().toISOString().slice(0, 10),
      }
      return {
        ...a,
        reviews: [review, ...a.reviews.filter((r) => r.movieId !== movieId)],
        ratings: [
          { movieId, score },
          ...a.ratings.filter((r) => r.movieId !== movieId),
        ],
      }
    })

  const deleteReview = (movieId) =>
    setActivity((a) => ({
      ...a,
      reviews: a.reviews.filter((r) => r.movieId !== movieId),
      ratings: a.ratings.filter((r) => r.movieId !== movieId),
    }))

  return (
    <ProfileContext.Provider
      value={{
        profile,
        activity,
        updateProfile,
        setAvatar,
        removeAvatar,
        deleteAccount,
        isInWatchlist,
        addToWatchlist,
        toggleWatchlist,
        restoreWatchlist,
        isWatched,
        toggleWatched,
        getMyReview,
        saveReview,
        deleteReview,
        getUserData,
        adminUpdateProfile,
        adminDeleteUserData,
        adminDeleteUserReview,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProfile = () => useContext(ProfileContext)
