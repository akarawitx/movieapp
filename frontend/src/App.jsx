import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MovieListPage from './pages/MovieListPage'
import MovieCreatePage from './pages/MovieCreatePage'
import MovieEditPage from './pages/MovieEditPage'
import MovieDetailPage from './pages/MovieDetailPage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="text-white text-center mt-20">Loading...</div>
  return user ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <Routes>
        <Route path="/"                element={<MovieListPage />} />
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/register"        element={<RegisterPage />} />
        <Route path="/movies/:id"      element={<MovieDetailPage />} />
        <Route path="/movies/create"   element={<ProtectedRoute><MovieCreatePage /></ProtectedRoute>} />
        <Route path="/movies/:id/edit" element={<ProtectedRoute><MovieEditPage /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}