import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import LoadingSpinner from '../../components/LoadingSpinner'
import StatusBadge from '../../components/StatusBadge'
import Modal from '../../components/Modal'
import { adminService } from '../../services/adminService'
import { useNotification } from '../../components/Notification'

const fmtDate = (v) => v ? new Date(v).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'

export default function AdminComplaints() {
  const { notify } = useNotification()
  const [pagination, setPagination] = useState(null)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [responseTarget, setResponseTarget] = useState(null)
  const [responseText, setResponseText] = useState('')
  const [responseStatus, setResponseStatus] = useState('diproses')
  const [busy, setBusy] = useState(false)

  const load = () => adminService.getComplaints({ status: status || undefined, page }).then(setPagination)
  useEffect(() => { load() }, [status, page]) // eslint-disable-line

  const openResponse = (c) => {
    setResponseTarget(c)
    setResponseText(c.admin_response || '')
    setResponseStatus(c.status === 'terbuka' ? 'diproses' : c.status)
  }

  const submitResponse = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await adminService.resolveComplaint(responseTarget.id, { status: responseStatus, admin_response: responseText })
      notify('Komplain diperbarui.', 'success'); setResponseTarget(null); load()
    } catch { notify('Gagal.', 'error') } finally { setBusy(false) }
  }

  return (
    <DashboardLayout title="Kelola Komplain">
      <div className="mb-5">
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none">
          {[['', 'Semua'], ['terbuka', 'Terbuka'], ['diproses', 'Diproses'], ['selesai', 'Selesai']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
      {!pagination ? <LoadingSpinner fullScreen /> : pagination.data.length === 0 ? (
        <div className="flex h-24 items-center justify-center rounded-2xl border border-dashed border-slate-300 text-sm text-slate-400">Tidak ada komplain.</div>
      ) : (
        <div className="space-y-3">
          {pagination.data.map(c => (
            <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800">{c.order?.service?.name}</p>
                  <p className="text-xs text-slate-400">{c.customer?.user?.name} · {fmtDate(c.created_at)}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <p className="mt-3 text-sm text-slate-600">{c.description}</p>
              {c.admin_response && (
                <div className="mt-3 rounded-xl bg-blue-50 p-3 text-sm text-blue-700">
                  <span className="font-medium">Respon Admin: </span>{c.admin_response}
                </div>
              )}
              <button onClick={() => openResponse(c)} className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700">
                {c.status === 'terbuka' ? 'Tanggapi' : 'Edit Respon'}
              </button>
            </div>
          ))}
          {pagination.last_page > 1 && (
            <div className="flex justify-center gap-2 pt-2">
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`h-8 w-8 rounded-lg text-sm font-medium ${p === pagination.current_page ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{p}</button>
              ))}
            </div>
          )}
        </div>
      )}

      <Modal open={!!responseTarget} onClose={() => setResponseTarget(null)} title="Tanggapi Komplain">
        <form onSubmit={submitResponse} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
            <select value={responseStatus} onChange={e => setResponseStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none">
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Respon</label>
            <textarea value={responseText} onChange={e => setResponseText(e.target.value)} rows={4} placeholder="Tanggapan Anda..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <button type="submit" disabled={busy} className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
            {busy ? 'Menyimpan...' : 'Simpan Respon'}
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
