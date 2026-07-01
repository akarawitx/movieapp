import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const token     = localStorage.getItem('access_token')
      const savedUser = localStorage.getItem('user')
      if (token && savedUser) return JSON.parse(savedUser)
    } catch { return null }
    return null
  })

  const login = async (username, password) => {
    const res = await api.post('/auth/login/', { username, password })
    localStorage.setItem('access_token', res.data.access)
    localStorage.setItem('refresh_token', res.data.refresh)
    const userData = { username }
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return res.data
  }

  const register = async (username, email, password) => {
    const res = await api.post('/auth/register/', { username, email, password })
    return res.data
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)