import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { StatCard } from '../../components/Card'
import StatusBadge from '../../components/StatusBadge'
import LoadingSpinner from '../../components/LoadingSpinner'
import { orderService } from '../../services/orderService'
import { useAuth } from '../../context/AuthContext'

const formatDate = (v) => v ? new Date(v).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [orders, setOrders] = useState(null)
  const [warranties, setWarranties] = useState(null)

  useEffect(() => {
    orderService.getCustomerOrders({ page: 1 }).then(setOrders)
    orderService.getWarranties().then(setWarranties)
  }, [])

  const total = orders?.total ?? '-'
  const activeWarranties = warranties?.filter(w => w.status === 'aktif').length ?? '-'
  const completed = orders?.data?.filter(o => o.status === 'selesai').length ?? 0

  return (
    <DashboardLayout title={`Halo, ${user?.name} 👋`}>
      <div className="grid gap-5 sm:grid-cols-3 mb-6">
        <StatCard label="Total Order" value={total} icon="📦" accent="blue" />
        <StatCard label="Garansi Aktif" value={activeWarranties} icon="🛡️" accent="green" />
        <StatCard label="Servis Selesai" value={completed} icon="✅" accent="slate" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-700">Order Terbaru</h2>
        <Link to="/customer/history" className="text-sm text-blue-600 hover:underline">Lihat semua</Link>
      </div>

      {orders === null ? (
        <LoadingSpinner fullScreen />
      ) : orders.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-12 text-center">
          <p className="text-slate-400 text-sm">Belum ada order.</p>
          <Link to="/customer/order" className="mt-3 rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Buat Order Pertama
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.data.slice(0, 5).map(order => (
            <div key={order.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <div>
                <p className="font-medium text-slate-800">{order.service?.name}</p>
                <p className="text-xs text-slate-400">{order.order_code} · {formatDate(order.created_at)}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
