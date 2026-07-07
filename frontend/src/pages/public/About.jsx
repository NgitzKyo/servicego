import Navbar from '../../components/Navbar'

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold text-slate-800">Tentang ServiceGo</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          ServiceGo adalah platform marketplace yang menghubungkan customer dengan teknisi reparasi elektronik profesional.
          Proyek ini dibuat sebagai MVP untuk mata kuliah Technopreneur dengan fokus pada kemudahan, transparansi, dan keamanan transaksi.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {[['5+', 'Teknisi Aktif'], ['14', 'Jenis Layanan'], ['30 Hari', 'Garansi Servis']].map(([val, lbl]) => (
            <div key={lbl} className="rounded-2xl bg-blue-50 p-5 text-center">
              <p className="text-2xl font-bold text-blue-700">{val}</p>
              <p className="text-sm text-slate-500">{lbl}</p>
            </div>
          ))}
        </div>
        <h2 className="mt-12 text-xl font-bold text-slate-800">Alur Servis</h2>
        <ol className="mt-4 space-y-3">
          {[
            'Customer membuat order dan memilih layanan.',
            'Sistem mencocokkan teknisi terdekat yang online & terverifikasi.',
            'Teknisi menerima order dan melakukan pengecekan.',
            'Teknisi mengirim diagnosis & estimasi biaya ke customer.',
            'Customer menyetujui estimasi — dana ditahan sistem (escrow).',
            'Teknisi menyelesaikan servis — dana diteruskan, garansi 30 hari otomatis aktif.',
            'Customer memberi rating dan dapat klaim garansi jika ada kendala.',
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="text-sm text-slate-600 pt-1">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
