import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import LoadingSpinner from '../../components/LoadingSpinner'
import StatusBadge from '../../components/StatusBadge'
import Modal from '../../components/Modal'
import { orderService } from '../../services/orderService'
import { useNotification } from '../../components/Notification'

const fmt = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0)
const fmtDate = (v) => v ? new Date(v).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'

export default function TechnicianOrders() {
  const { notify } = useNotification()
  const [tab, setTab] = useState('available')
  const [available, setAvailable] = useState(null)
  const [mine, setMine] = useState(null)
  const [page, setPage] = useState(1)
  const [busyId, setBusyId] = useState(null)
  const [spareparts, setSpareparts] = useState([])
  const [diagnosisOrder, setDiagnosisOrder] = useState(null)
  const [diagnosisNote, setDiagnosisNote] = useState('')
  const [laborCost, setLaborCost] = useState('')
  const [selectedParts, setSelectedParts] = useState([])

  const loadAvailable = () => orderService.getTechnicianOrders({ scope: 'available' }).then(setAvailable)
  const loadMine = () => orderService.getTechnicianOrders({ page }).then(setMine)

  useEffect(() => { loadAvailable(); orderService.getSpareparts().then(setSpareparts) }, [])
  useEffect(() => { if (tab === 'mine') loadMine() }, [tab, page]) // eslint-disable-line

  const handleAccept = async (order) => {
    setBusyId(order.id)
    try {
      await orderService.acceptOrder(order.id)
      notify('Order diterima!', 'success')
      loadAvailable()
    } catch (err) { notify(err.response?.data?.message || 'Gagal menerima order.', 'error') }
    finally { setBusyId(null) }
  }

  const handleStatus = async (order, status) => {
    setBusyId(order.id)
    try {
      await orderService.updateOrderStatus(order.id, status)
      notify(status === 'selesai' ? 'Order selesai! Garansi 30 hari aktif.' : 'Status diperbarui.', 'success')
      loadMine()
    } catch (err) { notify(err.response?.data?.message || 'Gagal.', 'error') }
    finally { setBusyId(null) }
  }

  const addPart = () => setSelectedParts(p => [...p, { sparepart_id: '', qty: 1 }])
  const updPart = (i, k, v) => setSelectedParts(p => p.map((r, j) => j === i ? { ...r, [k]: v } : r))
  const delPart = (i) => setSelectedParts(p => p.filter((_, j) => j !== i))

  const openDiagnosis = (order) => {
    setDiagnosisOrder(order); setDiagnosisNote(''); setLaborCost(''); setSelectedParts([])
  }

  const estimatedTotal = Number(laborCost || 0) + selectedParts.reduce((sum, p) => {
    const sp = spareparts.find(s => String(s.id) === String(p.sparepart_id))
    return sum + (sp ? sp.price * Number(p.qty || 0) : 0)
  }, 0)

  const submitDiagnosis = async (e) => {
    e.preventDefault()
    setBusyId(diagnosisOrder.id)
    try {
      await orderService.submitDiagnosis(diagnosisOrder.id, {
        diagnosis_note: diagnosisNote,
        labor_cost: Number(laborCost),
        spareparts: selectedParts.filter(p => p.sparepart_id).map(p => ({ sparepart_id: Number(p.sparepart_id), qty: Number(p.qty) })),
      })
      notify('Diagnosis dikirim ke customer.', 'success')
      setDiagnosisOrder(null); loadMine()
    } catch (err) { notify(err.response?.data?.message || 'Gagal.', 'error') }
    finally { setBusyId(null) }
  }

  return (
    <DashboardLayout title="Kelola Order">
      <div className="mb-5 flex gap-2 border-b border-slate-200">
        {[['available', `Tersedia${available ? ` (${available.length})` : ''}`], ['mine', 'Order Saya']].map(([val, lbl]) => (
          <button key={val} onClick={() => setTab(val)}
            className={`px-4 py-2.5 text-sm font-medium ${tab === val ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}>
            {lbl}
          </button>
        ))}
      </div>

      {tab === 'available' && (
        available === null ? <LoadingSpinner fullScreen /> : available.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-2xl border border-dashed border-slate-300 text-sm text-slate-400">Tidak ada order tersedia.</div>
        ) : (
          <div className="space-y-3">
            {available.map(order => (
              <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div>
                  <p className="font-semibold text-slate-800">{order.service?.name}</p>
                  <p className="text-xs text-slate-400">{order.order_code} · {order.customer?.user?.name} · {fmtDate(order.created_at)}</p>
                  <p className="mt-1 text-sm text-slate-600">{order.problem_description}</p>
                </div>
                <button onClick={() => handleAccept(order)} disabled={busyId === order.id}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60">
                  Terima Order
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'mine' && (
        mine === null ? <LoadingSpinner fullScreen /> : mine.data.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-2xl border border-dashed border-slate-300 text-sm text-slate-400">Belum ada order.</div>
        ) : (
          <div className="space-y-3">
            {mine.data.map(order => (
              <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-800">{order.service?.name}</p>
                    <p className="text-xs text-slate-400">{order.order_code} · {order.customer?.user?.name}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <p className="mt-2 text-sm text-slate-600">{order.problem_description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {order.status === 'diterima' && (
                    <button onClick={() => handleStatus(order, 'pengecekan')} disabled={busyId === order.id}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60">
                      Mulai Pengecekan
                    </button>
                  )}
                  {order.status === 'pengecekan' && (
                    <button onClick={() => openDiagnosis(order)}
                      className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-medium text-white hover:bg-orange-700">
                      Input Diagnosis & Biaya
                    </button>
                  )}
                  {order.status === 'menunggu_persetujuan' && (
                    <span className="rounded-lg bg-orange-50 px-4 py-2 text-xs text-orange-600">Menunggu persetujuan customer</span>
                  )}
                  {order.status === 'perbaikan' && (
                    <button onClick={() => handleStatus(order, 'selesai')} disabled={busyId === order.id}
                      className="rounded-lg bg-green-600 px-4 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-60">
                      Selesaikan Servis
                    </button>
                  )}
                </div>
              </div>
            ))}
            {mine.last_page > 1 && (
              <div className="flex justify-center gap-2 pt-2">
                {Array.from({ length: mine.last_page }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`h-8 w-8 rounded-lg text-sm font-medium ${p === mine.current_page ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        )
      )}

      <Modal open={!!diagnosisOrder} onClose={() => setDiagnosisOrder(null)} title={`Diagnosis — ${diagnosisOrder?.order_code || ''}`}>
        <form onSubmit={submitDiagnosis} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Catatan Diagnosis</label>
            <textarea value={diagnosisNote} onChange={e => setDiagnosisNote(e.target.value)} required rows={3}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Hasil pengecekan..." />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Biaya Jasa (Rp)</label>
            <input type="number" min="0" value={laborCost} onChange={e => setLaborCost(e.target.value)} required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Sparepart</label>
              <button type="button" onClick={addPart} className="text-xs text-blue-600 hover:underline">+ Tambah</button>
            </div>
            {selectedParts.map((row, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <select value={row.sparepart_id} onChange={e => updPart(idx, 'sparepart_id', e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none">
                  <option value="">Pilih sparepart...</option>
                  {spareparts.map(sp => <option key={sp.id} value={sp.id}>{sp.name} ({fmt(sp.price)})</option>)}
                </select>
                <input type="number" min="1" value={row.qty} onChange={e => updPart(idx, 'qty', e.target.value)}
                  className="w-16 rounded-lg border border-slate-200 px-2 py-2 text-sm" />
                <button type="button" onClick={() => delPart(idx)} className="text-slate-400 hover:text-red-500">✕</button>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-sm">
            <span className="text-slate-500">Total Estimasi: </span>
            <span className="font-semibold text-slate-800">{fmt(estimatedTotal)}</span>
          </div>
          <button type="submit" disabled={busyId === diagnosisOrder?.id}
            className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
            Kirim ke Customer
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
