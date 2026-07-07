import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DASHBOARD = { customer: '/customer/dashboard', technician: '/technician/dashboard', admin: '/admin/dashboard' }

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-blue-600">ServiceGo</span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/about" className="text-slate-500 hover:text-slate-800">Tentang</Link>
          {user ? (
            <>
              <Link to={DASHBOARD[user.role]} className="text-slate-500 hover:text-slate-800">Dashboard</Link>
              <button onClick={handleLogout} className="rounded-xl bg-slate-100 px-4 py-2 text-slate-600 hover:bg-slate-200">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-500 hover:text-slate-800">Masuk</Link>
              <Link to="/register" className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
