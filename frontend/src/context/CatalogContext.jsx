import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { seedCatalog } from '../data/catalog'
import { load, save } from '../utils/storage'

const CatalogContext = createContext(null)

// แคตตาล็อกหนัง + แนวหนัง + รีวิวที่ถูกซ่อน (เก็บใน localStorage จนกว่าจะต่อ API)
export function CatalogProvider({ children }) {
  const [catalog, setCatalog] = useState(() => load('catalog', null) ?? seedCatalog())

  useEffect(() => {
    save('catalog', catalog)
  }, [catalog])

  const { genres, hiddenReviews } = catalog

  // เติม genreLabel จากรายการแนวหนัง (ป้ายตรงกับ id เสมอ)
  const allMovies = useMemo(() => {
    const labels = Object.fromEntries(catalog.genres.map((g) => [g.id, g.label]))
    return catalog.movies.map((m) => ({ ...m, genreLabel: labels[m.genre] ?? m.genre }))
  }, [catalog.movies, catalog.genres])

  // หน้าเว็บเห็นเฉพาะหนังที่เผยแพร่
  const movies = useMemo(() => allMovies.filter((m) => m.status === 'published'), [allMovies])

  const update = (key, fn) => setCatalog((prev) => ({ ...prev, [key]: fn(prev[key]) }))

  // ── หนัง ──
  const getMovie = (id) => allMovies.find((m) => m.id === id)

  const createMovie = (data) => {
    const now = new Date().toISOString()
    const movie = { ...data, createdAt: now, updatedAt: now }
    update('movies', (list) => [movie, ...list])
    return movie
  }

  const updateMovie = (id, patch) =>
    update('movies', (list) =>
      list.map((m) => (m.id === id ? { ...m, ...patch, id, updatedAt: new Date().toISOString() } : m))
    )

  // คืนข้อมูลเดิม + ตำแหน่ง ไว้ใช้กับปุ่ม "เลิกทำ"
  const deleteMovie = (id) => {
    const index = catalog.movies.findIndex((m) => m.id === id)
    const removed = catalog.movies[index]
    update('movies', (list) => list.filter((m) => m.id !== id))
    return { movie: removed, index }
  }

  const restoreMovie = (movie, index) =>
    update('movies', (list) => {
      if (list.some((m) => m.id === movie.id)) return list
      const copy = [...list]
      copy.splice(Math.min(index, copy.length), 0, movie)
      return copy
    })

  // ── แนวหนัง ──
  const countByGenre = (genreId) => catalog.movies.filter((m) => m.genre === genreId).length

  const saveGenre = (genre, originalId) =>
    setCatalog((prev) => {
      const exists = prev.genres.some((g) => g.id === originalId)
      const genres = exists
        ? prev.genres.map((g) => (g.id === originalId ? genre : g))
        : [...prev.genres, genre]
      // เปลี่ยน id ของแนว → อัปเดตหนังที่ใช้แนวนั้นด้วย
      const movies =
        exists && originalId !== genre.id
          ? prev.movies.map((m) => (m.genre === originalId ? { ...m, genre: genre.id } : m))
          : prev.movies
      return { ...prev, genres, movies }
    })

  const moveGenre = (id, dir) =>
    update('genres', (list) => {
      const i = list.findIndex((g) => g.id === id)
      const j = i + dir
      if (i < 0 || j < 0 || j >= list.length) return list
      const copy = [...list]
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
      return copy
    })

  const deleteGenre = (id) => {
    if (countByGenre(id) > 0) return { error: 'ยังมีหนังที่ใช้แนวนี้อยู่ ย้ายหนังไปแนวอื่นก่อน' }
    update('genres', (list) => list.filter((g) => g.id !== id))
    return {}
  }

  // ── รีวิว (ซ่อนจากสาธารณะ) ──
  const isReviewHidden = (reviewId) => hiddenReviews.includes(reviewId)
  const setReviewHidden = (reviewId, hidden) =>
    update('hiddenReviews', (list) =>
      hidden ? [...new Set([...list, reviewId])] : list.filter((id) => id !== reviewId)
    )

  const resetCatalog = () => setCatalog(seedCatalog())

  return (
    <CatalogContext.Provider
      value={{
        movies,
        allMovies,
        genres,
        getMovie,
        createMovie,
        updateMovie,
        deleteMovie,
        restoreMovie,
        countByGenre,
        saveGenre,
        moveGenre,
        deleteGenre,
        hiddenReviews,
        isReviewHidden,
        setReviewHidden,
        resetCatalog,
      }}
    >
      {children}
    </CatalogContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCatalog = () => useContext(CatalogContext)
