import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

const GENRES = [
  'action','comedy','drama','horror',
  'romance','sci-fi','thriller','animation','documentary','other'
]

export default function MovieCreatePage() {
  const [form, setForm]       = useState({
    title: '', description: '', genre: 'other',
    release_year: '', director: ''
  })
  const [image, setImage]     = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const navigate              = useNavigate()

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
      const res = await api.post('/movies/', data)
      navigate(`/movies/${res.data.id}`)
    } catch {
      setError('เพิ่มหนังไม่สำเร็จ กรุณาตรวจสอบข้อมูล')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">🎬 เพิ่มหนังใหม่</h1>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-xl space-y-5">

        {/* รูปภาพ */}
        <div>
          <label className="block text-gray-400 text-sm mb-2">รูปภาพหนัง</label>
          {preview && (
            <img src={preview} alt="preview"
              className="w-full h-48 object-cover rounded-lg mb-3" />
          )}
          <input type="file" accept="image/*" onChange={handleImage}
            className="w-full text-gray-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-400 file:text-gray-900 file:font-semibold hover:file:bg-yellow-300" />
        </div>

        {/* ชื่อหนัง */}
        <div>
          <label className="block text-gray-400 text-sm mb-1">ชื่อหนัง *</label>
          <input type="text" name="title" value={form.title}
            onChange={handleChange} required
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-400"
            placeholder="ชื่อหนัง" />
        </div>

        {/* คำอธิบาย */}
        <div>
          <label className="block text-gray-400 text-sm mb-1">คำอธิบาย *</label>
          <textarea name="description" value={form.description}
            onChange={handleChange} required rows={4}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-400 resize-none"
            placeholder="เขียนเนื้อเรื่องย่อ..." />
        </div>

        {/* ผู้กำกับ + ปี */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">ผู้กำกับ *</label>
            <input type="text" name="director" value={form.director}
              onChange={handleChange} required
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-400"
              placeholder="ชื่อผู้กำกับ" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">ปีที่ออกฉาย *</label>
            <input type="number" name="release_year" value={form.release_year}
              onChange={handleChange} required min="1900" max="2099"
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-400"
              placeholder="เช่น 2024" />
          </div>
        </div>

        {/* แนวหนัง */}
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
          {loading ? 'กำลังบันทึก...' : 'บันทึกหนัง'}
        </button>
      </form>
    </div>
  )
}