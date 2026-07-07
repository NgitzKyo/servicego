import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import LoadingSpinner from '../../components/LoadingSpinner'
import Table from '../../components/Table'
import Modal from '../../components/Modal'
import { adminService } from '../../services/adminService'
import { useNotification } from '../../components/Notification'

export default function UserManagement() {
  const { notify } = useNotification()
  const [pagination, setPagination] = useState(null)
  const [role, setRole] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [busyId, setBusyId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = () => adminService.getUsers({ role: role || undefined, search: search || undefined, page }).then(setPagination)
  useEffect(() => { load() }, [role, page]) // eslint-disable-line

  const handleVerify = async (u) => {
    setBusyId(u.id)
    try {
      await adminService.verifyTechnician(u.technician.id)
      notify(`${u.name} diverifikasi.`, 'success'); load()
    } catch { notify('Gagal.', 'error') } finally { setBusyId(null) }
  }

  const handleDelete = async () => {
    setBusyId(deleteTarget.id)
    try {
      await adminService.deleteUser(deleteTarget.id)
      notify('User dihapus.', 'success'); setDeleteTarget(null); load()
    } catch { notify('Gagal.', 'error') } finally { setBusyId(null) }
  }

  const columns = [
    { key: 'name', label: 'Nama' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: r => <span className="capitalize">{r.role}</span> },
    {
      key: 'status', label: 'Status', render: r => r.role === 'technician'
        ? r.technician?.is_verified
          ? <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">Terverifikasi</span>
          : <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">Belum Verifikasi</span>
        : <span className="text-slate-300">—</span>
    },
    {
      key: 'action', label: 'Aksi', render: r => (
        <div className="flex gap-2">
          {r.role === 'technician' && !r.technician?.is_verified && (
            <button onClick={() => handleVerify(r)} disabled={busyId === r.id}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60">Verifikasi</button>
          )}
          <button onClick={() => setDeleteTarget(r)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">Hapus</button>
        </div>
      )
    },
  ]

  return (
    <DashboardLayout title="Kelola User">
      <div className="mb-5 flex flex-wrap gap-3">
        <select value={role} onChange={e => { setRole(e.target.value); setPage(1) }}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none">
          {[['', 'Semua Role'], ['customer', 'Customer'], ['technician', 'Teknisi']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <form onSubmit={e => { e.preventDefault(); setPage(1); load() }} className="flex gap-2">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama..."
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          <button type="submit" className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200">Cari</button>
        </form>
      </div>

      {!pagination ? <LoadingSpinner fullScreen /> : (
        <>
          <Table columns={columns} data={pagination.data} emptyMessage="Tidak ada user." />
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

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Hapus User"
        footer={<>
          <button onClick={() => setDeleteTarget(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600">Batal</button>
          <button onClick={handleDelete} disabled={busyId === deleteTarget?.id} className="rounded-xl bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-60">
            {busyId === deleteTarget?.id ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </>}>
        <p className="text-sm text-slate-600">Hapus user <span className="font-medium">{deleteTarget?.name}</span>? Tindakan ini tidak dapat dibatalkan.</p>
      </Modal>
    </DashboardLayout>
  )
}
