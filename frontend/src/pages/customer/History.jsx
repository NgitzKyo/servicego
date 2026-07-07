import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import LoadingSpinner from '../../components/LoadingSpinner'
import StatusBadge from '../../components/StatusBadge'
import Modal from '../../components/Modal'
import { orderService } from '../../services/orderService'
import { useNotification } from '../../components/Notification'

const FILTERS = [
  { value: '', label: 'Semua' }, { value: 'menunggu_teknisi', label: 'Menunggu Teknisi' },
  { value: 'diterima', label: 'Diterima' }, { value: 'pengecekan', label: 'Pengecekan' },
  { value: 'menunggu_persetujuan', label: 'Menunggu Persetujuan' }, { value: 'perbaikan', label: 'Perbaikan' },
  { value: 'selesai', label: 'Selesai' }, { value: 'dibatalkan', label: 'Dibatalkan' },
]
const fmt = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0)
const fmtDate = (v) => v ? new Date(v).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'

export default function CustomerHistory() {
  const { notify } = useNotification()
  const [pagination, setPagination] = useState(null)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [ratingModal, setRatingModal] = useState(null)
  const [score, setScore] = useState(5)
  const [review, setReview] = useState('')
  const [complaintModal, setComplaintModal] = useState(null)
  const [complaintText, setComplaintText] = useState('')

  const load = () => {
    setLoading(true)
    orderService.getCustomerOrders({ status: status || undefined, page })
      .then(setPagination).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [status, page]) // eslint-disable-line

  const handleApprove = async (order) => {
    setBusyId(order.id)
    try {
      await orderService.approveOrder(order.id)
      notify('Estimasi disetujui. Teknisi mulai perbaikan.', 'success')
      load()
    } catch (err) { notify(err.response?.data?.message || 'Gagal.', 'error') }
    finally { setBusyId(null) }
  }

  const submitRating = async (e) => {
    e.preventDefault()
    setBusyId(ratingModal.id)
    try {
      await orderService.rateOrder(ratingModal.id, { score, review })
      notify('Rating terkirim.', 'success')
      setRatingModal(null); setScore(5); setReview(''); load()
    } catch (err) { notify(err.response?.data?.message || 'Gagal.', 'error') }
    finally { setBusyId(null) }
  }

  const submitComplaint = async (e) => {
    e.preventDefault()
    setBusyId(complaintModal.id)
    try {
      await orderService.submitComplaint(complaintModal.id, { description: complaintText })
      notify('Komplain terkirim ke admin.', 'success')
      setComplaintModal(null); setComplaintText('')
    } catch (err) { notify(err.response?.data?.message || 'Gagal.', 'error') }
    finally { setBusyId(null) }
  }

  return (
    <DashboardLayout title="Riwayat Servis">
      <div className="mb-4">
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none">
          {FILTERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
      </div>

      {loading || !pagination ? <LoadingSpinner fullScreen /> : pagination.data.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-300 text-sm text-slate-400">Tidak ada order.</div>
      ) : (
        <div className="space-y-4">
          {pagination.data.map(order => (
            <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800">{order.service?.name}</p>
                  <p className="text-xs text-slate-400">{order.order_code} · {fmtDate(order.created_at)}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <p className="mt-2 text-sm text-slate-600">{order.problem_description}</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div><p className="text-xs text-slate-400">Teknisi</p><p className="font-medium">{order.technician?.user?.name || '-'}</p></div>
                <div><p className="text-xs text-slate-400">Tipe</p><p className="font-medium">{order.order_type === 'home_service' ? 'Home Service' : 'Pick-up'}</p></div>
                <div><p className="text-xs text-slate-400">Estimasi Biaya</p><p className="font-medium">{fmt(order.estimated_cost)}</p></div>
                <div><p className="text-xs text-slate-400">Pembayaran</p><StatusBadge status={order.payment_status} /></div>
              </div>
              {order.diagnosis_note && (
                <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                  <span className="font-medium">Diagnosis: </span>{order.diagnosis_note}
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {order.status === 'menunggu_persetujuan' && (
                  <button onClick={() => handleApprove(order)} disabled={busyId === order.id}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60">
                    Setujui Estimasi ({fmt(order.estimated_cost)})
                  </button>
                )}
                {order.status === 'selesai' && !order.rating && (
                  <button onClick={() => setRatingModal(order)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
                    ⭐ Beri Rating
                  </button>
                )}
                {order.status === 'selesai' && order.rating && (
                  <span className="rounded-lg bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700">⭐ Rating: {order.rating.score}/5</span>
                )}
                {!['selesai', 'dibatalkan'].includes(order.status) && (
                  <button onClick={() => setComplaintModal(order)}
                    className="rounded-lg border border-red-200 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50">
                    Ajukan Komplain
                  </button>
                )}
              </div>
            </div>
          ))}
          {pagination.last_page > 1 && (
            <div className="flex justify-center gap-2 pt-2">
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`h-8 w-8 rounded-lg text-sm font-medium ${p === pagination.current_page ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <Modal open={!!ratingModal} onClose={() => setRatingModal(null)} title="Beri Rating Teknisi">
        <form onSubmit={submitRating} className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">Skor</p>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(n => (
                <button type="button" key={n} onClick={() => setScore(n)}
                  className={`h-10 w-10 rounded-xl border text-lg ${n <= score ? 'border-amber-400 bg-amber-50' : 'border-slate-200 text-slate-300'}`}>⭐</button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Ulasan (opsional)</label>
            <textarea value={review} onChange={e => setReview(e.target.value)} rows={3} placeholder="Bagaimana pengalaman Anda?"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <button type="submit" disabled={busyId === ratingModal?.id}
            className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
            Kirim Rating
          </button>
        </form>
      </Modal>

      <Modal open={!!complaintModal} onClose={() => setComplaintModal(null)} title="Ajukan Komplain">
        <form onSubmit={submitComplaint} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Deskripsi Komplain</label>
            <textarea value={complaintText} onChange={e => setComplaintText(e.target.value)} required rows={4}
              placeholder="Jelaskan kendala Anda..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <button type="submit" disabled={busyId === complaintModal?.id}
            className="w-full rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60">
            Kirim Komplain
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
