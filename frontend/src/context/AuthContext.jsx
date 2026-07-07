import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sg_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('sg_token')
    if (token) {
      authService.me()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('sg_token')
          localStorage.removeItem('sg_user')
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    const data = await authService.login(credentials)
    localStorage.setItem('sg_token', data.token)
    localStorage.setItem('sg_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const register = async (form) => {
    const data = await authService.register(form)
    localStorage.setItem('sg_token', data.token)
    localStorage.setItem('sg_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    try { await authService.logout() } catch { /* ignore */ }
    localStorage.removeItem('sg_token')
    localStorage.removeItem('sg_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
