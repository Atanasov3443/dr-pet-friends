"use client"

import { apiUrl } from "@/lib/api"

import { useEffect, useState } from "react"
import { Save, User } from "lucide-react"

type Form = {
  displayName: string; specialty: string; bio: string
  image: string; phone: string; experience: number
  isActive: boolean; isEmergency: boolean
}

const empty: Form = { displayName: "", specialty: "", bio: "", image: "", phone: "", experience: 0, isActive: true, isEmergency: false }

export default function ProfilePage() {
  const [form, setForm]     = useState<Form>(empty)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [hasVet, setHasVet]   = useState(false)

  useEffect(() => {
    fetch(apiUrl("/api/dashboard/profile"))
      .then(r => r.json())
      .then(data => {
        if (data.vet) {
          setHasVet(true)
          setForm({
            displayName:  data.vet.displayName  ?? "",
            specialty:    data.vet.specialty    ?? "",
            bio:          data.vet.bio          ?? "",
            image:        data.vet.image        ?? "",
            phone:        data.vet.phone        ?? "",
            experience:   data.vet.experience   ?? 0,
            isActive:     data.vet.isActive     ?? true,
            isEmergency:  data.vet.isEmergency  ?? false,
          })
        }
        setLoading(false)
      })
  }, [])

  const save = async () => {
    setSaving(true)
    await fetch(apiUrl("/api/dashboard/profile"), {
      credentials: "include",
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setSaved(true)
    setHasVet(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return <div className="p-8 text-center text-gray-400">Зарежда...</div>

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Мой профил</h1>
        <p className="text-gray-500 text-sm mt-1">Информацията, която пациентите виждат</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 max-w-4xl">
        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Преглед</p>
            <div className="flex flex-col items-center text-center gap-3">
              {form.image ? (
                <img src={form.image} alt="" className="w-24 h-24 rounded-2xl object-cover border border-gray-100" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-300" />
                </div>
              )}
              <div>
                <p className="font-bold text-gray-900">{form.displayName || "Д-р Вашето Име"}</p>
                <p className="text-sm text-[#1083BD]">{form.specialty || "Специалност"}</p>
                {form.phone && <p className="text-xs text-gray-400 mt-0.5">{form.phone}</p>}
              </div>
              {form.bio && <p className="text-xs text-gray-500 leading-relaxed">{form.bio}</p>}
              <div className="flex gap-2 flex-wrap justify-center">
                {form.isActive   && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">Активен</span>}
                {form.isEmergency && <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">24/7</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="space-y-5">
            <Field label="Пълно Д-р Вашето Лобановски *" value={form.displayName}
              onChange={v => setForm(f => ({...f, displayName: v}))} placeholder="Д-р Иван Петров" />
            <Field label="Специалност *" value={form.specialty}
              onChange={v => setForm(f => ({...f, specialty: v}))} placeholder="Кардиология, Хирургия, Обща практика..." />
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Кратко описание (bio)</label>
              <textarea value={form.bio} onChange={e => setForm(f => ({...f, bio: e.target.value}))}
                rows={4} placeholder="Разкажете за вашия опит, специализации и подход..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD] resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Снимка (URL)</label>
              <input value={form.image} onChange={e => setForm(f => ({...f, image: e.target.value}))}
                placeholder="https://..." type="url"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD]" />
              {form.image && (
                <img src={form.image} alt="" className="mt-2 h-16 rounded-xl object-cover border border-gray-100"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Телефон" value={form.phone}
                onChange={v => setForm(f => ({...f, phone: v}))} placeholder="+359 88..." />
              <Field label="Опит (години)" value={String(form.experience)}
                onChange={v => setForm(f => ({...f, experience: Number(v)}))} type="number" />
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.isActive}
                  onChange={e => setForm(f => ({...f, isActive: e.target.checked}))}
                  className="w-4 h-4 accent-[#1083BD]" />
                Профилът е активен
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.isEmergency}
                  onChange={e => setForm(f => ({...f, isEmergency: e.target.checked}))}
                  className="w-4 h-4 accent-red-500" />
                Спешен 24/7
              </label>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <button onClick={save} disabled={saving}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                saved ? "bg-green-500 text-white" : "bg-[#1083BD] hover:bg-[#0d6fa0] text-white"
              } disabled:opacity-60`}>
              <Save className="w-4 h-4" />
              {saving ? "Запазва..." : saved ? "✓ Запазено!" : hasVet ? "Запази промените" : "Създай профил"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD]" />
    </div>
  )
}
