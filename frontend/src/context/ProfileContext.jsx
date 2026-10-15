import { createContext, useContext, useState } from 'react'
import { createMockProfile, MOCK_ACTIVITY } from '../data/profile'

const ProfileContext = createContext(null)

// เก็บโปรไฟล์จำลองแยกตาม username ใน state (ล็อกอินชื่อเดิมซ้ำจะยังเห็นข้อมูลที่แก้ไว้)
export function ProfileProvider({ user, onUserChange, children }) {
  const [profiles, setProfiles] = useState({})
  const [activity, setActivity] = useState(MOCK_ACTIVITY)

  const profile = user ? profiles[user] ?? createMockProfile(user) : null

  const updateProfile = (patch) => {
    if (!user) return
    const next = { ...profile, ...patch }
    setProfiles((prev) => {
      const copy = { ...prev }
      delete copy[user]
      copy[next.username] = next
      return copy
    })
    if (next.username !== user) onUserChange(next.username)
  }

  const setAvatar = (dataUrl) => updateProfile({ avatar: dataUrl })
  const removeAvatar = () => updateProfile({ avatar: null })

  const deleteAccount = () => {
    setProfiles((prev) => {
      const copy = { ...prev }
      delete copy[user]
      return copy
    })
    setActivity(MOCK_ACTIVITY)
    onUserChange(null)
  }

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
    }))
    return added
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
        getMyReview,
        saveReview,
        deleteReview,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProfile = () => useContext(ProfileContext)
