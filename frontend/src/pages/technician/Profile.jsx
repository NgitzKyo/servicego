import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import LoadingSpinner from '../../components/LoadingSpinner'
import { technicianService } from '../../services/technicianService'
import { useNotification } from '../../components/Notification'

export default function TechnicianProfile() {
  const { notify } = useNotification()
  const [profile, setProfile] = useState(null)
  const [specialization, setSpecialization] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    technicianService.getProfile().then(res => {
      setProfile(res)
      setSpecialization(res.technician?.specialization || '')
      setBio(res.technician?.bio || '')
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await technicianService.updateProfile({ specialization, bio })
      setProfile(prev => ({ ...prev, technician: res.technician }))
      notify('Profil diperbarui.', 'success')
    } catch { notify('Gagal memperbarui profil.', 'error') }
    finally { setSaving(false) }
  }

  if (!profile) return <DashboardLayout title="Profil"><LoadingSpinner fullScreen /></DashboardLayout>

  return (
    <DashboardLayout title="Profil Teknisi">
      <div className="mx-auto max-w-lg space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
              {profile.name?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{profile.name}</p>
              <p className="text-sm text-slate-500">{profile.email}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-center">
            <div><p className="text-lg font-bold text-slate-800">{profile.technician?.total_jobs || 0}</p><p className="text-xs text-slate-400">Pekerjaan</p></div>
            <div><p className="text-lg font-bold text-slate-800">{profile.technician?.rating_avg || '-'}</p><p className="text-xs text-slate-400">Rating</p></div>
            <div><p className="text-sm font-semibold text-slate-800">{profile.technician?.is_verified ? '✅' : '⏳'}</p><p className="text-xs text-slate-400">Verifikasi</p></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800">Edit Profil</h3>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Spesialisasi</label>
            <input type="text" value={specialization} onChange={e => setSpecialization(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Contoh: Laptop & PC" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Pengalaman dan keahlian Anda..." />
          </div>
          <button type="submit" disabled={saving}
            className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}
