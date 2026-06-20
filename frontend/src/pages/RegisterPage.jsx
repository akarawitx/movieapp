import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [form, setForm]       = useState({ username: '', email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { register }          = useAuth()
  const navigate              = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form.username, form.email, form.password)
      navigate('/login')
    } catch (err) {
      const data = err.response?.data
      if (data?.username) setError('ชื่อผู้ใช้นี้ถูกใช้แล้ว')
      else setError('สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">สมัครสมาชิก</h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">ชื่อผู้ใช้</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-400"
              placeholder="กรอกชื่อผู้ใช้"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">อีเมล</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-400"
              placeholder="กรอกอีเมล"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">รหัสผ่าน</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-400"
              placeholder="อย่างน้อย 6 ตัวอักษร"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-300 disabled:opacity-50 transition"
          >
            {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          มีบัญชีแล้ว?{' '}
          <Link to="/login" className="text-yellow-400 hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  )
}