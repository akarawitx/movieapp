import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="text-xl font-bold text-yellow-400">
        🎬 MovieApp
      </Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-gray-300 text-sm">👤 {user.username}</span>
            <Link to="/movies/create" className="bg-yellow-400 text-gray-900 px-4 py-2 rounded font-semibold text-sm hover:bg-yellow-300">
              + เพิ่มหนัง
            </Link>
            <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded text-sm hover:bg-red-500">
              ออกจากระบบ
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-300 hover:text-white text-sm">
              เข้าสู่ระบบ
            </Link>
            <Link to="/register" className="bg-yellow-400 text-gray-900 px-4 py-2 rounded font-semibold text-sm hover:bg-yellow-300">
              สมัครสมาชิก
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}