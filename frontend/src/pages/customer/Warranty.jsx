import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import LoadingSpinner from '../../components/LoadingSpinner'
import StatusBadge from '../../components/StatusBadge'
import Modal from '../../components/Modal'
import { orderService } from '../../services/orderService'
import { useNotification } from '../../components/Notification'

const fmtDate = (v) => v ? new Date(v).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
const daysLeft = (d) => Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000))

export default function CustomerWarranty() {
  const { notify } = useNotification()
  const [warranties, setWarranties] = useState(null)
  const [confirmTarget, setConfirmTarget] = useState(null)
  const [busy, setBusy] = useState(false)

  const load = () => orderService.getWarranties().then(setWarranties)
  useEffect(() => { load() }, [])

  const handleClaim = async () => {
    setBusy(true)
    try {
      await orderService.claimWarranty(confirmTarget.id)
      notify('Klaim berhasil. Order baru Rp0 telah dibuat.', 'success')
      setConfirmTarget(null); load()
    } catch (err) { notify(err.response?.data?.message || 'Gagal klaim.', 'error') }
    finally { setBusy(false) }
  }

  return (
    <DashboardLayout title="Garansi Servis">
      {warranties === null ? <LoadingSpinner fullScreen /> : warranties.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-300 text-sm text-slate-400">
          Belum ada garansi. Garansi 30 hari otomatis setelah servis selesai.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {warranties.map(w => (
            <div key={w.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-800">{w.order?.service?.name}</p>
                  <p className="text-xs text-slate-400">{w.order?.order_code}</p>
                </div>
                <StatusBadge status={w.status} />
              </div>
              <div className="mt-4 space-y-1 text-sm">
                <p className="text-slate-500">Teknisi: <span className="font-medium text-slate-700">{w.order?.technician?.user?.name || '-'}</span></p>
                <p className="text-slate-500">Berlaku: {fmtDate(w.start_date)} — {fmtDate(w.end_date)}</p>
                {w.status === 'aktif' && <p className="text-xs text-green-600">{daysLeft(w.end_date)} hari tersisa</p>}
              </div>
              {w.status === 'aktif' && (
                <button onClick={() => setConfirmTarget(w)} className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-xs font-medium text-white hover:bg-blue-700">
                  Klaim Garansi
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={!!confirmTarget} onClose={() => setConfirmTarget(null)} title="Klaim Garansi"
        footer={<>
          <button onClick={() => setConfirmTarget(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">Batal</button>
          <button onClick={handleClaim} disabled={busy} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
            {busy ? 'Memproses...' : 'Ya, Klaim'}
          </button>
        </>}>
        <p className="text-sm text-slate-600">
          Klaim garansi untuk <span className="font-medium">{confirmTarget?.order?.service?.name}</span>? Order baru dengan biaya Rp0 akan dibuat dengan teknisi yang sama.
        </p>
      </Modal>
    </DashboardLayout>
  )
}
