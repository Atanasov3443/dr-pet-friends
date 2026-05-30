"use client"

import { apiUrl } from "@/lib/api"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, MapPin, X, Check, Star } from "lucide-react"

type Clinic = {
  id: string; name: string; type: string; address: string; city: string
  phone: string | null; description: string | null; hours: string | null
  isEmergency: boolean; isActive: boolean; rating: number
  lat: number | null; lng: number | null
}

type Form = Omit<Clinic, "id"|"rating"> & { rating: string }
const empty: Form = { name: "", type: "VET", address: "", city: "", phone: "", description: "", hours: "", isEmergency: false, isActive: true, rating: "0", lat: null, lng: null }

export default function ClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState<"add"|"edit"|null>(null)
  const [form, setForm]       = useState<Form>(empty)
  const [editId, setEditId]   = useState<string|null>(null)
  const [saving, setSaving]   = useState(false)

  const load = async () => {
    setLoading(true)
    const res  = await fetch(apiUrl("/api/admin/clinics"), { credentials: "include" })
    const data = await res.json()
    setClinics(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd  = () => { setForm(empty); setEditId(null); setModal("add") }
  const openEdit = (c: Clinic) => {
    setForm({ name: c.name, type: c.type, address: c.address, city: c.city, phone: c.phone ?? "", description: c.description ?? "", hours: c.hours ?? "", isEmergency: c.isEmergency, isActive: c.isActive, rating: String(c.rating), lat: c.lat, lng: c.lng })
    setEditId(c.id); setModal("edit")
  }

  const save = async () => {
    setSaving(true)
    const body = { ...form, rating: Number(form.rating) || 0 }
    await fetch(apiUrl("/api/admin/clinics"), {
      credentials: "include",
      method: modal === "add" ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modal === "edit" ? { ...body, id: editId } : body),
    })
    setSaving(false); setModal(null); load()
  }

  const del = async (id: string) => {
    if (!confirm("Изтрий клиниката?")) return
    await fetch(apiUrl("/api/admin/clinics"), { credentials: "include", method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    load()
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Клиники</h1>
          <p className="text-gray-500 text-sm mt-1">Ветеринарни клиники и груминг салони на картата</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1083BD] hover:bg-[#0d6fa0] text-white rounded-xl text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Добави клиника
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Зарежда...</div>
      ) : clinics.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Няма клиники — добави първата</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {clinics.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-gray-900">{c.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${c.type === "VET" ? "bg-blue-50 text-blue-700" : "bg-pink-50 text-[#EF3988]"}`}>
                      {c.type === "VET" ? "Ветеринарна" : "Груминг"}
                    </span>
                    {c.isEmergency && <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700">24/7</span>}
                    {!c.isActive  && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Неактивна</span>}
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" />{c.address}, {c.city}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-gray-500"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />{c.rating.toFixed(1)}</span>
                    {c.hours && <span className="text-xs text-gray-400">{c.hours}</span>}
                    {c.lat && c.lng && <span className="text-xs text-green-600">📍 GPS</span>}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEdit(c)} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => del(c.id)}    className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">{modal === "add" ? "Добави клиника" : "Редактирай клиника"}</h2>
              <button onClick={() => setModal(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <F label="Название *"  value={form.name}    onChange={v => setForm(f=>({...f,name:v}))}    placeholder="Вет Клиника Здраве" />
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Тип</label>
                <div className="flex gap-2">
                  {["VET","GROOMING"].map(t => (
                    <button key={t} onClick={() => setForm(f=>({...f,type:t}))}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${form.type===t?"bg-[#1083BD] text-white border-[#1083BD]":"border-gray-200 text-gray-600"}`}>
                      {t === "VET" ? "Ветеринарна" : "Груминг"}
                    </button>
                  ))}
                </div>
              </div>
              <F label="Адрес *"    value={form.address} onChange={v => setForm(f=>({...f,address:v}))} placeholder="бул. Витоша 45" />
              <F label="Град *"     value={form.city}    onChange={v => setForm(f=>({...f,city:v}))}    placeholder="София" />
              <F label="Телефон"    value={form.phone??""} onChange={v => setForm(f=>({...f,phone:v}))}   placeholder="+359 2..." />
              <F label="Работно време" value={form.hours??""} onChange={v => setForm(f=>({...f,hours:v}))} placeholder="09:00–18:00 или 24/7" />
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">Описание / Специалности</label>
                <textarea value={form.description??""} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <F label="Ширина (lat)" value={String(form.lat??"")} onChange={v=>setForm(f=>({...f,lat:Number(v)||null}))} placeholder="42.6977" />
                <F label="Дължина (lng)" value={String(form.lng??"")} onChange={v=>setForm(f=>({...f,lng:Number(v)||null}))} placeholder="23.3219" />
              </div>
              <F label="Рейтинг (0–5)" value={form.rating} onChange={v=>setForm(f=>({...f,rating:v}))} type="number" placeholder="4.8" />
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e=>setForm(f=>({...f,isActive:e.target.checked}))} className="w-4 h-4 accent-[#1083BD]" />
                  Активна
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isEmergency} onChange={e=>setForm(f=>({...f,isEmergency:e.target.checked}))} className="w-4 h-4 accent-red-500" />
                  Спешна 24/7
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={()=>setModal(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Отказ</button>
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

function F({ label, value, onChange, placeholder, type="text" }: { label:string; value:string; onChange:(v:string)=>void; placeholder?:string; type?:string }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD]" />
    </div>
  )
}
