import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import LoadingSpinner from '../../components/LoadingSpinner'
import Table from '../../components/Table'
import StatusBadge from '../../components/StatusBadge'
import { adminService } from '../../services/adminService'

const FILTERS = [
  ['', 'Semua'], ['menunggu_teknisi', 'Menunggu Teknisi'], ['diterima', 'Diterima'],
  ['pengecekan', 'Pengecekan'], ['menunggu_persetujuan', 'Menunggu Persetujuan'],
  ['perbaikan', 'Perbaikan'], ['selesai', 'Selesai'], ['dibatalkan', 'Dibatalkan'],
]
const fmt = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0)
const fmtDate = (v) => v ? new Date(v).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'

export default function OrderManagement() {
  const [pagination, setPagination] = useState(null)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    adminService.getOrders({ status: status || undefined, page }).then(setPagination)
  }, [status, page])

  const columns = [
    { key: 'order_code', label: 'Kode Order' },
    { key: 'service', label: 'Servis', render: r => r.service?.name },
    { key: 'customer', label: 'Customer', render: r => r.customer?.user?.name },
    { key: 'technician', label: 'Teknisi', render: r => r.technician?.user?.name || '-' },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
    { key: 'cost', label: 'Biaya', render: r => fmt(r.estimated_cost) },
    { key: 'date', label: 'Tanggal', render: r => fmtDate(r.created_at) },
  ]

  return (
    <DashboardLayout title="Kelola Order">
      <div className="mb-5">
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none">
          {FILTERS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
      {!pagination ? <LoadingSpinner fullScreen /> : (
        <>
          <Table columns={columns} data={pagination.data} emptyMessage="Tidak ada order." />
          {pagination.last_page > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`h-8 w-8 rounded-lg text-sm font-medium ${p === pagination.current_page ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{p}</button>
              ))}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  )
}
