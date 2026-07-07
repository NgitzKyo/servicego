import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'

const DASHBOARD = { customer: '/customer/dashboard', technician: '/technician/dashboard', admin: '/admin/dashboard' }

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form)
      navigate(DASHBOARD[user.role] || '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa email dan password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-xl font-bold text-slate-800">Masuk ke ServiceGo</h1>
            <p className="mt-1 text-sm text-slate-500">Selamat datang kembali!</p>

            {error && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="email@contoh.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={set('password')}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Belum punya akun?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:underline">Daftar sekarang</Link>
            </p>

            {/* Demo accounts */}
            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
              <p className="font-semibold text-slate-700 mb-2">Akun Demo (password: password)</p>
              {[
                ['Admin', 'admin@servicego.com'],
                ['Customer', 'customer@servicego.com'],
                ['Teknisi', 'technician@servicego.com'],
              ].map(([role, email]) => (
                <div key={role} className="flex justify-between py-0.5">
                  <span className="font-medium">{role}:</span>
                  <button
                    type="button"
                    onClick={() => setForm({ email, password: 'password' })}
                    className="text-blue-600 hover:underline"
                  >
                    {email}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
