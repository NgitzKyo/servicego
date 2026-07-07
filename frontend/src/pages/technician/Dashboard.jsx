import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { StatCard } from '../../components/Card'
import LoadingSpinner from '../../components/LoadingSpinner'
import { technicianService } from '../../services/technicianService'
import { useNotification } from '../../components/Notification'
import { useAuth } from '../../context/AuthContext'

const fmt = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0)

export default function TechnicianDashboard() {
  const { user } = useAuth()
  const { notify } = useNotification()
  const [stats, setStats] = useState(null)
  const [profile, setProfile] = useState(null)
  const [toggling, setToggling] = useState(false)

  const load = () => {
    technicianService.getDashboard().then(setStats)
    technicianService.getProfile().then(setProfile)
  }

  useEffect(() => { load() }, [])

  const handleToggle = async () => {
    const next = profile.technician?.status === 'online' ? 'offline' : 'online'
    setToggling(true)
    try {
      const res = await technicianService.toggleStatus(next)
      setProfile(prev => ({ ...prev, technician: res.technician }))
      notify(`Status diubah ke ${next}.`, 'success')
    } catch { notify('Gagal mengubah status.', 'error') }
    finally { setToggling(false) }
  }

  if (!stats || !profile) return <DashboardLayout title="Dashboard"><LoadingSpinner fullScreen /></DashboardLayout>

  const isOnline = profile.technician?.status === 'online'
  const verified = profile.technician?.is_verified

  return (
    <DashboardLayout title={`Halo, ${user?.name} 👋`}>
      {!verified && (
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          ⚠️ Akun Anda belum diverifikasi admin. Verifikasi diperlukan untuk menerima order.
        </div>
      )}
      <div className="mb-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className={`h-3 w-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-slate-300'}`} />
          <div>
            <p className="text-sm font-semibold text-slate-800">Status: {isOnline ? 'Online' : 'Offline'}</p>
            <p className="text-xs text-slate-400">Aktifkan untuk menerima order baru</p>
          </div>
        </div>
        <button onClick={handleToggle} disabled={toggling || !verified}
          className={`rounded-xl px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${isOnline ? 'bg-slate-600 hover:bg-slate-700' : 'bg-green-600 hover:bg-green-700'}`}>
          {toggling ? '...' : isOnline ? 'Set Offline' : 'Set Online'}
        </button>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pendapatan" value={fmt(stats.pendapatan)} icon="💰" accent="green" />
        <StatCard label="Order Selesai" value={stats.order_selesai} icon="✅" accent="blue" />
        <StatCard label="Order Aktif" value={stats.order_aktif} icon="🧰" accent="amber" />
        <StatCard label="Rating" value={stats.rating_avg ? `${stats.rating_avg} ⭐` : '-'} icon="⭐" accent="slate" />
      </div>
    </DashboardLayout>
  )
}
