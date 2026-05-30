"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Star, Phone, X, Check } from "lucide-react"

type Vet = {
  id: string; displayName: string; specialty: string; bio: string | null
  image: string | null; phone: string | null; experience: number
  rating: number; isActive: boolean; isEmergency: boolean
  user: { email: string; name: string | null }
}

type Form = Partial<Omit<Vet, "id"|"user"|"rating">> & { email?: string; password?: string }

const empty: Form = { displayName: "", specialty: "", bio: "", image: "", phone: "", experience: 0, isActive: true, isEmergency: false, email: "", password: "" }

export default function VetsPage() {
  const [vets, setVets]       = useState<Vet[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState<"add"|"edit"|null>(null)
  const [form, setForm]       = useState<Form>(empty)
  const [editId, setEditId]   = useState<string|null>(null)
  const [saving, setSaving]   = useState(false)

  const load = async () => {
    setLoading(true)
    const res  = await fetch("/api/admin/vets")
    const data = await res.json()
    setVets(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd  = () => { setForm(empty); setEditId(null); setModal("add") }
  const openEdit = (v: Vet) => {
    setForm({ displayName: v.displayName, specialty: v.specialty, bio: v.bio ?? "", image: v.image ?? "", phone: v.phone ?? "", experience: v.experience, isActive: v.isActive, isEmergency: v.isEmergency })
    setEditId(v.id)
    setModal("edit")
  }

  const save = async () => {
    setSaving(true)
    await fetch("/api/admin/vets", {
      method: modal === "add" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modal === "edit" ? { ...form, id: editId } : form),
    })
    setSaving(false)
    setModal(null)
    load()
  }

  const del = async (id: string) => {
    if (!confirm("Изтрий ветеринаря?")) return
    await fetch("/api/admin/vets", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ветеринари</h1>
          <p className="text-gray-500 text-sm mt-1">Управление на профили</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1083BD] hover:bg-[#0d6fa0] text-white rounded-xl text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Добави ветеринар
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Зарежда...</div>
      ) : vets.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Няма ветеринари все още</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {vets.map((v) => (
            <div key={v.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4">
              <img src={v.image || "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=80&h=80&fit=crop"}
                alt={v.displayName} className="w-14 h-14 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">{v.displayName}</p>
                    <p className="text-sm text-[#1083BD]">{v.specialty}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{v.user.email}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium">{v.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${v.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {v.isActive ? "Активен" : "Неактивен"}
                  </span>
                  {v.isEmergency && <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700">24/7</span>}
                  {v.phone && <span className="text-xs text-gray-400 flex items-center gap-0.5"><Phone className="w-3 h-3" />{v.phone}</span>}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(v)} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-700 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => del(v.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">{modal === "add" ? "Добави ветеринар" : "Редактирай ветеринар"}</h2>
              <button onClick={() => setModal(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <div className="space-y-4">
              {modal === "add" && (
                <>
                  <Field label="Имейл *" value={form.email ?? ""} onChange={v => setForm(f => ({...f, email: v}))} placeholder="email@example.com" />
                  <Field label="Парола *" value={form.password ?? ""} onChange={v => setForm(f => ({...f, password: v}))} placeholder="Минимум 8 символа" type="password" />
                </>
              )}
              <Field label="Име *" value={form.displayName ?? ""} onChange={v => setForm(f => ({...f, displayName: v}))} placeholder="Д-р Иван Петров" />
              <Field label="Специалност *" value={form.specialty ?? ""} onChange={v => setForm(f => ({...f, specialty: v}))} placeholder="Кардиология, Хирургия..." />
              <Field label="Снимка (URL)" value={form.image ?? ""} onChange={v => setForm(f => ({...f, image: v}))} placeholder="https://..." />
              <Field label="Телефон" value={form.phone ?? ""} onChange={v => setForm(f => ({...f, phone: v}))} placeholder="+359 88..." />
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Описание (bio)</label>
                <textarea value={form.bio ?? ""} onChange={e => setForm(f => ({...f, bio: e.target.value}))}
                  rows={3} placeholder="Кратко описание..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD]" />
              </div>
              <Field label="Опит (години)" value={String(form.experience ?? 0)} onChange={v => setForm(f => ({...f, experience: Number(v)}))} type="number" />
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isActive ?? true} onChange={e => setForm(f => ({...f, isActive: e.target.checked}))}
                    className="w-4 h-4 accent-[#1083BD]" />
                  Активен
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isEmergency ?? false} onChange={e => setForm(f => ({...f, isEmergency: e.target.checked}))}
                    className="w-4 h-4 accent-red-500" />
                  24/7 Спешен
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
                Отказ
              </button>
              <button onClick={save} disabled={saving}
                className="flex-1 py-2.5 bg-[#1083BD] hover:bg-[#0d6fa0] text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60">
                <Check className="w-4 h-4" /> {saving ? "Запазва..." : "Запази"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD]" />
    </div>
  )
}
