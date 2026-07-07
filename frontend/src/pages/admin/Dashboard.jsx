import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { StatCard } from '../../components/Card'
import LoadingSpinner from '../../components/LoadingSpinner'
import { adminService } from '../../services/adminService'
import { useAuth } from '../../context/AuthContext'

const fmt = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0)

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)

  useEffect(() => { adminService.getDashboard().then(setStats) }, [])

  if (!stats) return <DashboardLayout title="Dashboard"><LoadingSpinner fullScreen /></DashboardLayout>

  return (
    <DashboardLayout title={`Halo, ${user?.name} 👋`}>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <StatCard label="Total User" value={stats.total_user} icon="👥" accent="blue" />
        <StatCard label="Total Order" value={stats.total_order} icon="📦" accent="slate" />
        <StatCard label="Revenue Simulasi" value={fmt(stats.revenue_simulasi)} icon="💰" accent="green" />
        <StatCard label="Customer" value={stats.total_customer} icon="🙋" accent="blue" />
        <StatCard label="Teknisi" value={stats.total_technician} icon="🧰" accent="blue" />
        <StatCard label="Order Selesai" value={stats.order_selesai} icon="✅" accent="green" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Link to="/admin/users" className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-5 hover:bg-amber-100 transition">
          <div>
            <p className="font-semibold text-amber-800">Teknisi Menunggu Verifikasi</p>
            <p className="text-xs text-amber-600">Perlu tindakan admin</p>
          </div>
          <span className="text-2xl font-bold text-amber-700">{stats.teknisi_belum_verifikasi}</span>
        </Link>
        <Link to="/admin/complaints" className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-5 hover:bg-red-100 transition">
          <div>
            <p className="font-semibold text-red-800">Komplain Terbuka</p>
            <p className="text-xs text-red-600">Perlu ditindaklanjuti</p>
          </div>
          <span className="text-2xl font-bold text-red-700">{stats.komplain_terbuka}</span>
        </Link>
      </div>
    </DashboardLayout>
  )
}
