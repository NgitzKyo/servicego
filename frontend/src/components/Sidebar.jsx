import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const MENUS = {
  customer: [
    { path: '/customer/dashboard', label: '🏠 Dashboard' },
    { path: '/customer/order', label: '➕ Buat Order' },
    { path: '/customer/history', label: '📋 Riwayat Servis' },
    { path: '/customer/warranty', label: '🛡️ Garansi' },
  ],
  technician: [
    { path: '/technician/dashboard', label: '🏠 Dashboard' },
    { path: '/technician/orders', label: '🧰 Kelola Order' },
    { path: '/technician/profile', label: '👤 Profil' },
  ],
  admin: [
    { path: '/admin/dashboard', label: '🏠 Dashboard' },
    { path: '/admin/users', label: '👥 Kelola User' },
    { path: '/admin/orders', label: '📦 Kelola Order' },
    { path: '/admin/complaints', label: '📣 Komplain' },
  ],
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const menus = MENUS[user?.role] || []

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <aside className="flex h-full w-60 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-5 py-4">
        <Link to="/" className="text-lg font-bold text-blue-600">ServiceGo</Link>
        <p className="text-xs text-slate-400 capitalize mt-0.5">{user?.role}</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menus.map(m => (
          <Link
            key={m.path}
            to={m.path}
            className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              location.pathname === m.path
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {m.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-slate-100 px-5 py-4">
        <p className="text-sm font-medium text-slate-700 truncate">{user?.name}</p>
        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
        <button
          onClick={handleLogout}
          className="mt-3 w-full rounded-xl bg-slate-100 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}
