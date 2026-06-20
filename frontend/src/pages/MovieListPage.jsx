import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function MovieListPage() {
  const [movies, setMovies]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/movies/')
      .then(res => setMovies(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="text-white text-center mt-20">กำลังโหลด...</div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">🎬 รายการหนังทั้งหมด</h1>

      {movies.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-xl mb-4">ยังไม่มีหนัง</p>
          <Link to="/movies/create" className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-300">
            + เพิ่มหนังเรื่องแรก
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map(movie => (
            <Link to={`/movies/${movie.id}`} key={movie.id}
              className="bg-gray-900 rounded-xl overflow-hidden hover:ring-2 hover:ring-yellow-400 transition">
              {movie.image ? (
                <img src={movie.image}
                  alt={movie.title}
                  className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gray-800 flex items-center justify-center text-5xl">
                  🎬
                </div>
              )}
              <div className="p-4">
                <h2 className="text-white font-bold text-lg truncate">{movie.title}</h2>
                <p className="text-gray-400 text-sm mt-1">{movie.director} • {movie.release_year}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">
                    {movie.genre}
                  </span>
                  <span className="text-yellow-400 font-bold">
                    ⭐ {movie.average_rating > 0 ? movie.average_rating : 'ยังไม่มีคะแนน'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}