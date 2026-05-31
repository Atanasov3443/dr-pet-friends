"use client"

import { apiUrl } from "@/lib/api"

import { useEffect, useState } from "react"
import { User, Phone, Mail, Lock, CheckCircle, AlertCircle, Camera } from "lucide-react"
import { useSession } from "next-auth/react"

type Profile = { id: string; name: string | null; email: string; phone: string | null; image: string | null; role: string }

export default function MyProfilePage() {
  const { update } = useSession()
  const [profile,  setProfile]  = useState<Profile | null>(null)
  const [loading,  setLoading]  = useState(true)

  const [name,  setName]  = useState("")
  const [phone, setPhone] = useState("")
  const [image, setImage] = useState("")

  const [curPwd, setCurPwd] = useState("")
  const [newPwd, setNewPwd] = useState("")
  const [newPwd2, setNewPwd2] = useState("")

  const [saving,  setSaving]  = useState(false)
  const [success, setSuccess] = useState("")
  const [error,   setError]   = useState("")

  useEffect(() => {
    fetch(apiUrl("/api/my/profile"), { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        setProfile(data)
        setName(data.name  ?? "")
        setPhone(data.phone ?? "")
        setImage(data.image ?? "")
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(""); setSuccess("")
    if (newPwd && newPwd !== newPwd2) { setError("Паролите не съвпадат"); return }
    if (newPwd && newPwd.length < 6)  { setError("Паролата трябва да е поне 6 знака"); return }

    setSaving(true)
    const body: Record<string, string> = { name, phone, image }
    if (newPwd) { body.currentPassword = curPwd; body.newPassword = newPwd }

    const res = await fetch(apiUrl("/api/my/profile"), {
      credentials: "include",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    setSaving(false)

    if (!res.ok) { setError(data.error ?? "Грешка при запазване"); return }

    setProfile(data)
    setSuccess("Профилът е обновен успешно!")
    setCurPwd(""); setNewPwd(""); setNewPwd2("")
    // Update NextAuth session so the name/image in the navbar reflect the change
    await update({ name: data.name, image: data.image })
  }

  if (loading) return <div className="p-8 text-center text-gray-400">Зарежда...</div>
  if (!profile) return <div className="p-8 text-center text-gray-400">Грешка при зареждане</div>

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Моят профил</h1>
        <p className="text-gray-500 text-sm mt-1">Управлявайте личните си данни</p>
      </div>

      <form onSubmit={save} className="space-y-6">

        {/* Avatar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-[#EF3988]/10 flex items-center justify-center overflow-hidden shrink-0">
              {image ? (
                <img src={image} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-[#EF3988]" />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{profile.name ?? profile.email}</p>
              <p className="text-xs text-gray-400">{profile.email}</p>
              <span className="inline-block mt-1 text-xs bg-[#1083BD]/10 text-[#1083BD] px-2 py-0.5 rounded-full font-medium">
                {profile.role === "OWNER" ? "Собственик" : profile.role}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
              <Camera className="w-3 h-3" /> URL на снимка
            </label>
            <input value={image} onChange={e => setImage(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#EF3988]" />
          </div>
        </div>

        {/* Personal info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-gray-900">Лична информация</h3>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
              <User className="w-3 h-3" /> Ime
            </label>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Иван Иванов"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#EF3988]" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
              <Mail className="w-3 h-3" /> Имейл
            </label>
            <input value={profile.email} disabled
              className="w-full border border-gray-100 rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
            <p className="text-xs text-gray-400 mt-1">Имейлът не може да се промени</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
              <Phone className="w-3 h-3" /> Телефон
            </label>
            <input value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="+359 88..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#EF3988]" />
          </div>
        </div>

        {/* Password change */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-400" /> Промяна на парола
          </h3>
          <p className="text-xs text-gray-400">Оставете полетата празни ако не искате да промените паролата</p>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Текуща парола</label>
            <input type="password" value={curPwd} onChange={e => setCurPwd(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#EF3988]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Нова парола</label>
              <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#EF3988]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Потвърди</label>
              <input type="password" value={newPwd2} onChange={e => setNewPwd2(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#EF3988]" />
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-xl px-4 py-3">
            <CheckCircle className="w-4 h-4 shrink-0" /> {success}
          </div>
        )}

        <button type="submit" disabled={saving}
          className="w-full py-3 bg-[#EF3988] hover:bg-[#d42f77] disabled:opacity-60 text-white rounded-xl font-bold text-sm transition-colors">
          {saving ? "Запазва..." : "Запази промените"}
        </button>
      </form>
    </div>
  )
}
