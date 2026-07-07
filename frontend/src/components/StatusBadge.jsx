const STATUS_CONFIG = {
  menunggu_teknisi:     { label: 'Menunggu Teknisi', cls: 'bg-slate-100 text-slate-600' },
  diterima:             { label: 'Diterima',          cls: 'bg-blue-100 text-blue-700' },
  pengecekan:           { label: 'Pengecekan',         cls: 'bg-indigo-100 text-indigo-700' },
  menunggu_persetujuan: { label: 'Menunggu Persetujuan', cls: 'bg-orange-100 text-orange-700' },
  perbaikan:            { label: 'Perbaikan',          cls: 'bg-yellow-100 text-yellow-700' },
  selesai:              { label: 'Selesai',             cls: 'bg-green-100 text-green-700' },
  dibatalkan:           { label: 'Dibatalkan',          cls: 'bg-red-100 text-red-600' },
  belum_dibayar:        { label: 'Belum Dibayar',       cls: 'bg-slate-100 text-slate-600' },
  dana_ditahan:         { label: 'Dana Ditahan',         cls: 'bg-yellow-100 text-yellow-700' },
  dana_diteruskan:      { label: 'Dana Diteruskan',      cls: 'bg-green-100 text-green-700' },
  aktif:     { label: 'Aktif',     cls: 'bg-green-100 text-green-700' },
  diklaim:   { label: 'Diklaim',   cls: 'bg-blue-100 text-blue-700' },
  kadaluarsa:{ label: 'Kadaluarsa',cls: 'bg-slate-100 text-slate-500' },
  terbuka:   { label: 'Terbuka',   cls: 'bg-red-100 text-red-600' },
  diproses:  { label: 'Diproses',  cls: 'bg-orange-100 text-orange-700' },
  online:    { label: 'Online',    cls: 'bg-green-100 text-green-700' },
  offline:   { label: 'Offline',   cls: 'bg-slate-100 text-slate-500' },
}

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, cls: 'bg-slate-100 text-slate-600' }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${cfg.cls}`}>
      {cfg.label}
    </span>
  )
}
