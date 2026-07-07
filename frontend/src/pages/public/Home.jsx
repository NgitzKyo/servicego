import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'

const CATEGORIES = [
  { icon: '💻', name: 'Laptop', desc: 'Servis semua merek laptop' },
  { icon: '🖥️', name: 'PC', desc: 'Desktop & komputer rakitan' },
  { icon: '🖨️', name: 'Printer', desc: 'Inkjet, laser, dot matrix' },
  { icon: '❄️', name: 'AC', desc: 'Cuci, isi freon, perbaikan' },
  { icon: '📱', name: 'Smartphone', desc: 'Semua merek & OS' },
  { icon: '🔌', name: 'Elektronik Rumah Tangga', desc: 'Kulkas, mesin cuci, dan lainnya' },
]

const FEATURES = [
  { icon: '🧰', title: 'Teknisi Terverifikasi', desc: 'Semua teknisi telah melalui proses verifikasi admin.' },
  { icon: '📍', title: 'Teknisi Terdekat', desc: 'Sistem mencocokkan teknisi yang paling dekat dengan lokasi Anda.' },
  { icon: '🛡️', title: 'Garansi 30 Hari', desc: 'Setiap servis yang selesai mendapat garansi otomatis 30 hari.' },
  { icon: '💰', title: 'Escrow Pembayaran', desc: 'Dana Anda aman, diteruskan ke teknisi setelah servis selesai.' },
  { icon: '📋', title: 'Estimasi Transparan', desc: 'Teknisi memberikan estimasi biaya sebelum mulai perbaikan.' },
  { icon: '⭐', title: 'Rating & Ulasan', desc: 'Nilai pengalaman Anda dan bantu pengguna lain memilih teknisi.' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Servis Elektronik <span className="text-blue-200">Mudah & Terpercaya</span>
          </h1>
          <p className="mt-4 text-lg text-blue-100">
            Hubungkan Anda dengan teknisi profesional terdekat. Cepat, transparan, dan bergaransi.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 shadow hover:bg-blue-50"
            >
              Mulai Sekarang
            </Link>
            <Link
              to="/about"
              className="rounded-xl border border-blue-400 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-2 text-center text-2xl font-bold text-slate-800">Layanan Kami</h2>
          <p className="mb-10 text-center text-slate-500">Kami melayani berbagai kategori perangkat elektronik</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {CATEGORIES.map(cat => (
              <div key={cat.name} className="rounded-2xl border border-slate-200 p-5 text-center hover:border-blue-300 hover:shadow-md transition">
                <span className="text-3xl">{cat.icon}</span>
                <h3 className="mt-2 font-semibold text-slate-800">{cat.name}</h3>
                <p className="mt-1 text-xs text-slate-400">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-16 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-slate-800">Mengapa ServiceGo?</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(f => (
              <div key={f.title} className="rounded-2xl bg-white p-5 shadow-sm">
                <span className="text-2xl">{f.icon}</span>
                <h3 className="mt-3 font-semibold text-slate-800">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Siap memulai?</h2>
        <p className="mt-2 text-slate-500">Daftar gratis dan temukan teknisi terdekat sekarang.</p>
        <Link
          to="/register"
          className="mt-6 inline-block rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Daftar Gratis
        </Link>
      </section>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-400">
        © 2025 ServiceGo — Platform Servis Elektronik. Dibuat untuk Tugas Technopreneur.
      </footer>
    </div>
  )
}
