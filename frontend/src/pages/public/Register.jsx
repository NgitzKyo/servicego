import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'

const SPECIALIZATIONS = ['Laptop & PC', 'Printer', 'AC', 'Smartphone', 'Elektronik Rumah Tangga']
const DASHBOARD = { customer: '/customer/dashboard', technician: '/technician/dashboard' }

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', password_confirmation: '',
    role: 'customer', address: '', specialization: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const user = await register(form)
      navigate(DASHBOARD[user.role] || '/')
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        setErrors({ general: err.response?.data?.message || 'Registrasi gagal.' })
      }
    } finally {
      setLoading(false)
    }
  }

  const field = (key, label, type = 'text', placeholder = '') => (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={set(key)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
      />
      {errors[key] && <p className="mt-1 text-xs text-red-500">{errors[key][0]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-xl font-bold text-slate-800">Buat Akun ServiceGo</h1>

            {errors.general && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{errors.general}</div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Role toggle */}
              <div className="grid grid-cols-2 gap-2">
                {['customer', 'technician'].map(r => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setForm(prev => ({ ...prev, role: r }))}
                    className={`rounded-xl border py-2.5 text-sm font-medium transition ${
                      form.role === r ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    {r === 'customer' ? '🙋 Customer' : '🧰 Teknisi'}
                  </button>
                ))}
              </div>

              {field('name', 'Nama Lengkap', 'text', 'Nama Anda')}
              {field('email', 'Email', 'email', 'email@contoh.com')}
              {field('phone', 'No. HP', 'text', '081234567890')}

              {form.role === 'customer' && field('address', 'Alamat', 'text', 'Jl. Contoh No. 1, Jakarta')}

              {form.role === 'technician' && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Spesialisasi</label>
                  <select
                    value={form.specialization}
                    onChange={set('specialization')}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">-- Pilih spesialisasi --</option>
                    {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.specialization && <p className="mt-1 text-xs text-red-500">{errors.specialization[0]}</p>}
                </div>
              )}

              {field('password', 'Password', 'password')}
              {field('password_confirmation', 'Konfirmasi Password', 'password')}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Sudah punya akun?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:underline">Masuk</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
