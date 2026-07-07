import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import LoadingSpinner from '../../components/LoadingSpinner'
import { orderService } from '../../services/orderService'
import { useNotification } from '../../components/Notification'

const CATEGORIES = ['Laptop', 'PC', 'Printer', 'AC', 'Smartphone', 'Elektronik Rumah Tangga']
const ICONS = { Laptop: '💻', PC: '🖥️', Printer: '🖨️', AC: '❄️', Smartphone: '📱', 'Elektronik Rumah Tangga': '🔌' }
const fmt = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0)

export default function OrderService() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [services, setServices] = useState(null)
  const [category, setCategory] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [orderType, setOrderType] = useState('home_service')
  const [problemDescription, setProblemDescription] = useState('')
  const [address, setAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)

  useEffect(() => { orderService.getServices().then(setServices) }, [])

  const filtered = useMemo(() => {
    if (!services) return []
    return category ? services.filter(s => s.category === category) : services
  }, [services, category])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    if (!serviceId) return setErrors({ service_id: 'Pilih jenis servis.' })
    setSubmitting(true)
    try {
      const res = await orderService.createOrder({ service_id: serviceId, order_type: orderType, problem_description: problemDescription, address })
      setResult(res)
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors || {})
      else notify(err.response?.data?.message || 'Gagal membuat order.', 'error')
    } finally { setSubmitting(false) }
  }

  if (result) return (
    <DashboardLayout title="Order Berhasil">
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">✅</div>
        <h2 className="text-xl font-semibold text-slate-900">Order Berhasil Dibuat!</h2>
        <p className="mt-2 text-sm text-slate-500">Kode: <span className="font-semibold text-slate-700">{result.order.order_code}</span></p>
        {result.nearest_technicians?.length > 0 && (
          <div className="mt-5 rounded-xl bg-slate-50 p-4 text-left">
            <p className="mb-2 text-xs font-semibold text-slate-600">Teknisi terdekat ({result.nearest_technicians.length}):</p>
            {result.nearest_technicians.map(t => (
              <div key={t.id} className="flex justify-between py-1 text-sm">
                <span>{t.user?.name} — {t.specialization}</span>
                <span className="text-blue-600">{t.distance?.toFixed(1)} km</span>
              </div>
            ))}
          </div>
        )}
        <div className="mt-5 flex gap-3 justify-center">
          <button onClick={() => navigate('/customer/history')} className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700">Lihat Riwayat</button>
          <button onClick={() => navigate('/customer/dashboard')} className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600">Dashboard</button>
        </div>
      </div>
    </DashboardLayout>
  )

  return (
    <DashboardLayout title="Buat Order Servis">
      {services === null ? <LoadingSpinner fullScreen /> : (
        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5">
          {/* Category */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-slate-700">1. Pilih Kategori</p>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(cat => (
                <button type="button" key={cat} onClick={() => { setCategory(cat); setServiceId('') }}
                  className={`flex flex-col items-center gap-1 rounded-xl border py-3 text-xs font-medium transition ${category === cat ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}`}>
                  <span className="text-xl">{ICONS[cat]}</span>{cat}
                </button>
              ))}
            </div>
          </div>

          {/* Service */}
          {category && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-slate-700">2. Pilih Jenis Servis</p>
              <div className="space-y-2">
                {filtered.map(s => (
                  <label key={s.id} className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition ${serviceId === String(s.id) ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="service" value={s.id} checked={serviceId === String(s.id)} onChange={e => setServiceId(e.target.value)} className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{s.name}</p>
                        <p className="text-xs text-slate-400">{s.description}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">ab {fmt(s.base_price)}</span>
                  </label>
                ))}
              </div>
              {errors.service_id && <p className="mt-2 text-xs text-red-500">{errors.service_id}</p>}
            </div>
          )}

          {/* Type */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-slate-700">3. Metode Servis</p>
            <div className="grid grid-cols-2 gap-3">
              {[['home_service', '🏠 Home Service', 'Teknisi datang ke lokasi Anda'], ['pickup_dropoff', '🚚 Pick-up & Drop-off', 'Barang dijemput dan diantar kembali']].map(([val, lbl, desc]) => (
                <button type="button" key={val} onClick={() => setOrderType(val)}
                  className={`rounded-xl border p-3.5 text-left text-sm font-medium transition ${orderType === val ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}`}>
                  {lbl}<p className="mt-0.5 text-xs font-normal text-slate-400">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Detail */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <p className="text-sm font-semibold text-slate-700">4. Detail Kerusakan</p>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Deskripsi Masalah</label>
              <textarea value={problemDescription} onChange={e => setProblemDescription(e.target.value)} required rows={3}
                placeholder="Contoh: Laptop tidak bisa menyala sejak kemarin..."
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none" />
              {errors.problem_description && <p className="mt-1 text-xs text-red-500">{errors.problem_description[0]}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Alamat</label>
              <textarea value={address} onChange={e => setAddress(e.target.value)} required rows={2}
                placeholder="Alamat lengkap Anda"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none" />
              {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address[0]}</p>}
            </div>
          </div>

          <button type="submit" disabled={submitting} className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
            {submitting ? 'Memproses...' : 'Buat Order Sekarang'}
          </button>
        </form>
      )}
    </DashboardLayout>
  )
}
