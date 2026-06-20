import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function MovieDetailPage() {
  const { id }                        = useParams()
  const { user }                      = useAuth()
  const navigate                      = useNavigate()
  const [movie, setMovie]             = useState(null)
  const [loading, setLoading]         = useState(true)
  const [userRating, setUserRating]   = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewForm, setReviewForm]   = useState({ title: '', body: '' })
  const [commentForms, setCommentForms] = useState({})
  const [submitting, setSubmitting]   = useState(false)
  const [message, setMessage]         = useState('')

  const fetchMovie = () => {
    api.get(`/movies/${id}/`)
      .then(res => setMovie(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchMovie() }, [id])

  // ---- Rating ----
  const handleRate = async (score) => {
    if (!user) return navigate('/login')
    try {
      const existing = movie.ratings.find(r => r.user.username === user.username)
      if (existing) {
        await api.patch(`/movies/${id}/ratings/${existing.id}/`, { score })
      } else {
        await api.post(`/movies/${id}/ratings/`, { score })
      }
      setUserRating(score)
      fetchMovie()
    } catch {
      setMessage('ให้คะแนนไม่สำเร็จ')
    }
  }

  // ---- Review ----
  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    setSubmitting(true)
    try {
      await api.post(`/movies/${id}/reviews/`, reviewForm)
      setReviewForm({ title: '', body: '' })
      setMessage('เพิ่มรีวิวสำเร็จ!')
      fetchMovie()
    } catch {
      setMessage('เพิ่มรีวิวไม่สำเร็จ (อาจรีวิวซ้ำ)')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('ลบรีวิวนี้?')) return
    try {
      await api.delete(`/movies/${id}/reviews/${reviewId}/`)
      fetchMovie()
    } catch {
      setMessage('ลบรีวิวไม่สำเร็จ')
    }
  }

  // ---- Comment ----
  const handleCommentSubmit = async (e, reviewId) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    try {
      await api.post(`/movies/${id}/reviews/${reviewId}/comments/`, {
        body: commentForms[reviewId] || ''
      })
      setCommentForms({ ...commentForms, [reviewId]: '' })
      fetchMovie()
    } catch {
      setMessage('เพิ่มคอมเมนต์ไม่สำเร็จ')
    }
  }

  const handleDeleteComment = async (reviewId, commentId) => {
    if (!confirm('ลบคอมเมนต์นี้?')) return
    try {
      await api.delete(`/movies/${id}/reviews/${reviewId}/comments/${commentId}/`)
      fetchMovie()
    } catch {
      setMessage('ลบคอมเมนต์ไม่สำเร็จ')
    }
  }

  // ---- Delete Movie ----
  const handleDeleteMovie = async () => {
    if (!confirm('ลบหนังเรื่องนี้?')) return
    try {
      await api.delete(`/movies/${id}/`)
      navigate('/')
    } catch {
      setMessage('ลบหนังไม่สำเร็จ')
    }
  }

  if (loading) return <div className="text-white text-center mt-20">กำลังโหลด...</div>
  if (!movie)  return null

  const myRating = movie.ratings.find(r => r.user.username === user?.username)

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {message && (
        <div className="bg-yellow-400/20 border border-yellow-400 text-yellow-300 px-4 py-3 rounded mb-6 text-sm flex justify-between">
          {message}
          <button onClick={() => setMessage('')}>✕</button>
        </div>
      )}

      {/* ---- หนัง ---- */}
      <div className="bg-gray-900 rounded-xl overflow-hidden mb-8">
        {movie.image && (
          <img src={movie.image}
            alt={movie.title}
            className="w-full h-72 object-cover" />
        )}
        <div className="p-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{movie.title}</h1>
              <p className="text-gray-400 mt-1">{movie.director} • {movie.release_year} • {movie.genre}</p>
            </div>
            {user?.username === movie.created_by?.username && (
              <div className="flex gap-2 shrink-0">
                <Link to={`/movies/${id}/edit`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-500">
                  ✏️ แก้ไข
                </Link>
                <button onClick={handleDeleteMovie}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-500">
                  🗑️ ลบ
                </button>
              </div>
            )}
          </div>

          <p className="text-gray-300 mt-4 leading-relaxed">{movie.description}</p>

          {/* Rating */}
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-yellow-400 text-2xl font-bold">
                ⭐ {movie.average_rating > 0 ? `${movie.average_rating}/10` : 'ยังไม่มีคะแนน'}
              </span>
              <span className="text-gray-500 text-sm">({movie.ratings.length} คะแนน)</span>
            </div>
            {user && (
              <div>
                <p className="text-gray-400 text-sm mb-2">
                  {myRating ? `คะแนนของคุณ: ${myRating.score}/10` : 'ให้คะแนนหนังเรื่องนี้:'}
                </p>
                <div className="flex gap-1">
                  {[1,2,3,4,5,6,7,8,9,10].map(score => (
                    <button key={score}
                      onClick={() => handleRate(score)}
                      onMouseEnter={() => setHoverRating(score)}
                      onMouseLeave={() => setHoverRating(0)}
                      className={`w-8 h-8 rounded text-sm font-bold transition ${
                        score <= (hoverRating || myRating?.score || userRating)
                          ? 'bg-yellow-400 text-gray-900'
                          : 'bg-gray-700 text-gray-400'
                      }`}>
                      {score}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---- เขียนรีวิว ---- */}
      {user && (
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">✍️ เขียนรีวิว</h2>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="หัวข้อรีวิว"
              value={reviewForm.title}
              onChange={e => setReviewForm({ ...reviewForm, title: e.target.value })}
              required
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-400"
            />
            <textarea
              placeholder="เขียนรีวิวของคุณ..."
              value={reviewForm.body}
              onChange={e => setReviewForm({ ...reviewForm, body: e.target.value })}
              required rows={4}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-400 resize-none"
            />
            <button type="submit" disabled={submitting}
              className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-bold hover:bg-yellow-300 disabled:opacity-50">
              {submitting ? 'กำลังส่ง...' : 'ส่งรีวิว'}
            </button>
          </form>
        </div>
      )}

      {/* ---- รายการรีวิว ---- */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">
          💬 รีวิวทั้งหมด ({movie.reviews.length})
        </h2>

        {movie.reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">ยังไม่มีรีวิว เป็นคนแรกที่รีวิวหนังเรื่องนี้!</p>
        ) : (
          <div className="space-y-6">
            {movie.reviews.map(review => (
              <div key={review.id} className="bg-gray-900 rounded-xl p-6">

                {/* Review Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-bold text-lg">{review.title}</h3>
                    <p className="text-gray-500 text-sm">
                      👤 {review.user.username} • {new Date(review.created_at).toLocaleDateString('th-TH')}
                    </p>
                  </div>
                  {user?.username === review.user.username && (
                    <button onClick={() => handleDeleteReview(review.id)}
                      className="text-red-400 hover:text-red-300 text-sm">
                      🗑️ ลบ
                    </button>
                  )}
                </div>

                <p className="text-gray-300 leading-relaxed mb-4">{review.body}</p>

                {/* Comments */}
                <div className="border-t border-gray-800 pt-4">
                  <p className="text-gray-500 text-sm mb-3">
                    💭 คอมเมนต์ ({review.comments.length})
                  </p>

                  {review.comments.map(comment => (
                    <div key={comment.id} className="flex justify-between items-start bg-gray-800 rounded-lg px-4 py-3 mb-2">
                      <div>
                        <span className="text-yellow-400 text-sm font-semibold">
                          {comment.user.username}
                        </span>
                        <p className="text-gray-300 text-sm mt-1">{comment.body}</p>
                      </div>
                      {user?.username === comment.user.username && (
                        <button onClick={() => handleDeleteComment(review.id, comment.id)}
                          className="text-red-400 hover:text-red-300 text-xs ml-4 shrink-0">
                          ลบ
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Comment Form */}
                  {user && (
                    <form onSubmit={e => handleCommentSubmit(e, review.id)}
                      className="flex gap-2 mt-3">
                      <input
                        type="text"
                        placeholder="เขียนคอมเมนต์..."
                        value={commentForms[review.id] || ''}
                        onChange={e => setCommentForms({
                          ...commentForms, [review.id]: e.target.value
                        })}
                        required
                        className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-400 text-sm"
                      />
                      <button type="submit"
                        className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-300">
                        ส่ง
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}