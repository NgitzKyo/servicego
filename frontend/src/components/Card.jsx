export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  )
}

const ACCENT = {
  blue:  'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  amber: 'bg-amber-50 text-amber-600',
  slate: 'bg-slate-100 text-slate-600',
}

export function StatCard({ label, value, icon, accent = 'blue' }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg ${ACCENT[accent] || ACCENT.blue}`}>
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-800">{value ?? '-'}</p>
    </div>
  )
}
