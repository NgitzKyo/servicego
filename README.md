# ServiceGo — Platform Marketplace Jasa Teknisi Elektronik

MVP marketplace yang menghubungkan customer dengan teknisi reparasi elektronik profesional. Dibuat untuk tugas mata kuliah Technopreneur.

---

## Persyaratan Sistem

| Software | Versi Minimum |
|---|---|
| PHP | 8.2+ |
| Composer | 2.x |
| Node.js | 18+ |
| MySQL | 8.0+ (atau MariaDB via XAMPP) |

---

## Instalasi & Menjalankan Project

### 1. Backend (Laravel 13)

```bash
cd backend

# Install dependency PHP
composer install

# Salin dan konfigurasi .env
cp .env.example .env
php artisan key:generate
```

Edit file `.env` — sesuaikan koneksi database MySQL Anda:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=servicego
DB_USERNAME=root
DB_PASSWORD=           # kosong jika XAMPP default
```

```bash
# Buat database 'servicego' di MySQL, lalu jalankan migrasi & seeder
php artisan migrate --seed

# Jalankan server backend
php artisan serve
```

Backend berjalan di: **http://localhost:8000**

---

### 2. Frontend (React + Vite)

Buka terminal baru:

```bash
cd frontend

# Install dependency JavaScript
npm install

# Jalankan development server
npm run dev
```

Frontend berjalan di: **http://localhost:5173**

---

## Akun Demo

Semua akun menggunakan password: `password`

| Role | Email |
|---|---|
| **Admin** | admin@servicego.com |
| **Customer** | customer@servicego.com |
| **Teknisi** | technician@servicego.com |

Akun tambahan: `teknisi2@servicego.com` hingga `teknisi5@servicego.com`, `customer2@servicego.com` hingga `customer5@servicego.com`

---

## Fitur

### Customer
- Buat order servis (pilih kategori → layanan → tipe → deskripsi)
- Lihat teknisi terdekat setelah order dibuat
- Setujui estimasi biaya dari teknisi
- Riwayat order dengan filter status
- Klaim garansi 30 hari setelah servis selesai
- Beri rating & ajukan komplain

### Teknisi
- Toggle status online/offline
- Lihat order tersedia & terima order
- Input diagnosis + sparepart + estimasi biaya
- Progress order: Pengecekan → Perbaikan → Selesai

### Admin
- Dashboard statistik platform
- Verifikasi teknisi baru
- Kelola semua order
- Tanggapi komplain customer

---

## Alur Servis

```
Customer buat order
    ↓
Sistem cari teknisi terdekat (online & terverifikasi)
    ↓
Teknisi terima order → Mulai Pengecekan
    ↓
Input Diagnosis + Estimasi Biaya → Kirim ke Customer
    ↓
Customer Setujui Estimasi (dana ditahan / escrow simulasi)
    ↓
Teknisi Selesaikan Perbaikan
    ↓
Garansi 30 hari otomatis aktif + Dana diteruskan ke teknisi
    ↓
Customer beri Rating (opsional klaim garansi)
```

---

## Struktur Folder

```
servicego/
├── backend/           ← Laravel 13 API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/   ← Auth, Order, Technician, Admin, dll.
│   │   │   └── Middleware/        ← RoleMiddleware
│   │   └── Models/                ← User, Customer, Technician, Order, dll.
│   ├── database/
│   │   ├── migrations/            ← 11 tabel
│   │   └── seeders/               ← User, Service, Sparepart, Order seeder
│   ├── routes/api.php             ← Semua API routes
│   ├── artisan                    ← Laravel CLI ✓
│   ├── composer.json
│   └── .env.example
│
└── frontend/          ← React 19 + Vite + Tailwind CSS
    ├── src/
    │   ├── context/AuthContext.jsx
    │   ├── services/              ← api, auth, order, technician, admin
    │   ├── components/            ← Navbar, Sidebar, Modal, StatusBadge, dll.
    │   └── pages/
    │       ├── public/            ← Home, About, Login, Register
    │       ├── customer/          ← Dashboard, OrderService, History, Warranty
    │       ├── technician/        ← Dashboard, Orders, Profile
    │       └── admin/             ← Dashboard, UserManagement, OrderManagement, Complaints
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── .env.example
```

---

## Catatan Teknis

- **Autentikasi**: Laravel Sanctum (token-based, cocok untuk SPA)
- **CORS**: dikonfigurasi di `config/cors.php` untuk `http://localhost:5173`
- **Pencarian Teknisi**: simulasi Euclidean distance dari koordinat dummy Jakarta (tanpa Google Maps)
- **Escrow**: simulasi via `payment_status` enum (`belum_dibayar` → `dana_ditahan` → `dana_diteruskan`)
- **Garansi**: dibuat otomatis saat order `selesai`, berlaku 30 hari
- **Database**: MySQL, bisa dijalankan via XAMPP
