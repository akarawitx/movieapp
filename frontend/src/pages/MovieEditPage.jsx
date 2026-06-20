import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'

const GENRES = [
  'action','comedy','drama','horror',
  'romance','sci-fi','thriller','animation','documentary','other'
]

export default function MovieEditPage() {
  const { id }            = useParams()
  const [form, setForm]   = useState({
    title: '', description: '', genre: 'other',
    release_year: '', director: ''
  })
  const [image, setImage]     = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const navigate              = useNavigate()

  useEffect(() => {
    api.get(`/movies/${id}/`).then(res => {
      const m = res.data
      setForm({
        title: m.title, description: m.description,
        genre: m.genre, release_year: m.release_year, director: m.director
      })
      if (m.image) setPreview(m.image)
    })
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    setImage(file)
    if (file) setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => data.append(k, v))
      if (image) data.append('image', image)
      await api.patch(`/movies/${id}/`, data)
      navigate(`/movies/${id}`)
    } catch {
      setError('แก้ไขหนังไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">✏️ แก้ไขหนัง</h1>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl space-y-5">

        <div>
          <label className="block text-gray-400 text-sm mb-2">รูปภาพหนัง</label>
          {preview && (
            <img src={preview} alt="preview"
              className="w-full h-48 object-cover rounded-lg mb-3" />
          )}
          <input type="file" accept="image/*" onChange={handleImage}
            className="w-full text-gray-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-400 file:text-gray-900 file:font-semibold hover:file:bg-yellow-300" />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">ชื่อหนัง *</label>
          <input type="text" name="title" value={form.title}
            onChange={handleChange} required
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-400" />
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">คำอธิบาย *</label>
          <textarea name="description" value={form.description}
            onChange={handleChange} required rows={4}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-400 resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">ผู้กำกับ *</label>
            <input type="text" name="director" value={form.director}
              onChange={handleChange} required
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-400" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">ปีที่ออกฉาย *</label>
            <input type="number" name="release_year" value={form.release_year}
              onChange={handleChange} required
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-400" />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">แนวหนัง</label>
          <select name="genre" value={form.genre} onChange={handleChange}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-400">
            {GENRES.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-300 disabled:opacity-50 transition">
          {loading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
        </button>
      </form>
    </div>
  )
}