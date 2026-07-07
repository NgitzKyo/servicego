import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner fullScreen />
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    const redirect = { customer: '/customer/dashboard', technician: '/technician/dashboard', admin: '/admin/dashboard' }
    return <Navigate to={redirect[user.role] || '/'} replace />
  }
  return children
}
