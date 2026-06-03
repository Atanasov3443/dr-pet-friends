"use client"

import { apiUrl } from "@/lib/api"
import { useEffect, useState } from "react"
import { FileText, Search, CalendarDays, Thermometer, Weight, Plus, X, Check } from "lucide-react"

type MedRecord = {
  id: string; diagnosis: string | null; treatment: string | null
  medications: string | null; notes: string | null
  weight: number | null; temperature: number | null; nextVisit: string | null
  createdAt: string
  pet:         { name: string; species: string; breed: string | null }
  appointment: { date: string; status: string; owner: { name: string | null } }
}

const SPECIES_EMOJI: Record<string, string> = { DOG:"🐶", CAT:"🐱", BIRD:"🐦", RABBIT:"🐰", EXOTIC:"🦎", OTHER:"🐾" }

const BLANK = { petName:"", petSpecies:"OTHER", ownerName:"", date:"", diagnosis:"", treatment:"", medications:"", notes:"", weight:"", temperature:"", nextVisit:"" }

export default function MedicalRecordsPage() {
  const [records,   setRecords]   = useState<MedRecord[]>([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState("")
  const [expanded,  setExpanded]  = useState<string | null>(null)
  const [showForm,  setShowForm]  = useState(false)
  const [form,      setForm]      = useState(BLANK)
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)

  const load = () => {
    fetch(apiUrl("/api/dashboard/medical-records"), { credentials: "include" })
      .then(r => r.json())
      .then(data => { setRecords(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res  = await fetch(apiUrl("/api/dashboard/medical-records/standalone"), {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setSaved(true); setShowForm(false); setForm(BLANK)
      setTimeout(() => setSaved(false), 3000)
      load()
    }
    setSaving(false)
  }

  const filtered = records.filter(r =>
    !search ||
    r.pet.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.appointment.owner.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (r.diagnosis ?? "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Медицински записи</h1>
          <p className="text-gray-500 text-sm mt-1">История на всички прегледи</p>
        </div>
        <div className="flex items-center gap-3 sm:ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Търси пациент..."
              className="pl-9 pr-4 h-10 rounded-xl border border-gray-200 text-sm w-48 focus:outline-none focus:border-[#1083BD]" />
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-bold transition-colors ${showForm ? "bg-gray-100 text-gray-600" : "bg-[#1083BD] text-white hover:bg-[#0d6fa0]"}`}>
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? "Затвори" : "Нов запис"}
          </button>
          {saved && <span className="flex items-center gap-1 text-sm text-green-600 font-medium"><Check className="w-4 h-4" /> Запазен!</span>}
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={save} className="bg-white rounded-2xl border border-[#1083BD]/20 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#1083BD]" /> Нов медицински запис
          </h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Пациент *</label>
              <input value={form.petName} onChange={e => set("petName", e.target.value)} required
                placeholder="Рекс, Мица..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD]" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Собственик</label>
              <input value={form.ownerName} onChange={e => set("ownerName", e.target.value)}
                placeholder="Иван Иванов" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD]" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Дата на преглед</label>
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD]" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Диагноза</label>
              <textarea value={form.diagnosis} onChange={e => set("diagnosis", e.target.value)} rows={2}
                placeholder="Описание на диагнозата..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD] resize-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Лечение</label>
              <textarea value={form.treatment} onChange={e => set("treatment", e.target.value)} rows={2}
                placeholder="Предписано лечение..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD] resize-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Медикаменти</label>
              <input value={form.medications} onChange={e => set("medications", e.target.value)}
                placeholder="Наименование, доза..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD]" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Бележки</label>
              <input value={form.notes} onChange={e => set("notes", e.target.value)}
                placeholder="Допълнителни бележки..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD]" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Тегло (кг)</label>
              <input type="number" step="0.1" value={form.weight} onChange={e => set("weight", e.target.value)}
                placeholder="4.5" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD]" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Температура (°C)</label>
              <input type="number" step="0.1" value={form.temperature} onChange={e => set("temperature", e.target.value)}
                placeholder="38.5" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD]" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Следващ преглед</label>
              <input type="date" value={form.nextVisit} onChange={e => set("nextVisit", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD]" />
            </div>
          </div>
          <button type="submit" disabled={saving}
            className="w-full py-3 bg-[#1083BD] hover:bg-[#0d6fa0] text-white rounded-xl font-bold text-sm disabled:opacity-60 transition-colors">
            {saving ? "Запазва..." : "Запази медицинския запис"}
          </button>
        </form>
      )}

      {/* Records list */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Зарежда...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium mb-2">{search ? "Няма намерени записи" : "Все още няма медицински записи"}</p>
          {!search && (
            <>
              <p className="text-gray-400 text-sm max-w-sm mx-auto mb-5">
                Добавете нов запис с бутона горе или попълнете от страницата Резервации след завършен преглед.
              </p>
              <button onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 bg-[#1083BD] hover:bg-[#0d6fa0] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
                <Plus className="w-4 h-4" /> Добави първия запис
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r: MedRecord) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                className="w-full text-left p-5 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-[#1083BD]/10 flex items-center justify-center text-xl shrink-0">
                  {SPECIES_EMOJI[r.pet.species] ?? "🐾"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">
                      {r.pet.name}
                      {r.pet.breed && <span className="text-gray-400 font-normal"> · {r.pet.breed}</span>}
                    </span>
                    {r.diagnosis && (
                      <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full truncate max-w-[200px]">
                        {r.diagnosis.slice(0, 50)}{r.diagnosis.length > 50 ? "…" : ""}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(r.appointment.date).toLocaleDateString("bg-BG", { day:"numeric", month:"long", year:"numeric" })}
                    </span>
                    <span>Собственик: {r.appointment.owner.name ?? "—"}</span>
                    {r.weight && <span className="flex items-center gap-1"><Weight className="w-3 h-3" />{r.weight} кг</span>}
                    {r.temperature && <span className="flex items-center gap-1"><Thermometer className="w-3 h-3" />{r.temperature}°C</span>}
                  </div>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{new Date(r.createdAt).toLocaleDateString("bg-BG")}</span>
              </button>

              {expanded === r.id && (
                <div className="border-t border-gray-100 p-5 grid md:grid-cols-2 gap-5 bg-gray-50/40">
                  {r.diagnosis    && <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Диагноза</p><p className="text-sm text-gray-800">{r.diagnosis}</p></div>}
                  {r.treatment    && <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Лечение</p><p className="text-sm text-gray-800">{r.treatment}</p></div>}
                  {r.medications  && <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Медикаменти</p><p className="text-sm text-gray-800">{r.medications}</p></div>}
                  {r.notes        && <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Бележки</p><p className="text-sm text-gray-800">{r.notes}</p></div>}
                  {r.nextVisit    && <div className="md:col-span-2"><p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Следващ преглед</p><p className="text-sm text-[#1083BD] font-medium">{new Date(r.nextVisit).toLocaleDateString("bg-BG", { day:"numeric", month:"long", year:"numeric" })}</p></div>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
