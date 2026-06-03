"use client"

import { apiUrl } from "@/lib/api"
import { useEffect, useState } from "react"
import { FileText, Syringe, Plus, Trash2, CalendarDays, AlertTriangle, Stethoscope, ChevronDown, ChevronUp, PawPrint, X } from "lucide-react"

type Pet     = { id: string; name: string; species: string; breed: string | null }
type Vacc    = { id: string; name: string; date: string; nextDate: string | null; notes: string | null }
type MedRec  = {
  id: string; diagnosis: string | null; treatment: string | null
  medications: string | null; notes: string | null
  weight: number | null; temperature: number | null; nextVisit: string | null
  createdAt: string
  vet: { displayName: string; specialty: string }
  appointment: { date: string }
}

const SPECIES_EMOJI: Record<string, string> = {
  DOG: "🐶", CAT: "🐱", BIRD: "🦜", RABBIT: "🐰", EXOTIC: "🦎", OTHER: "🐾"
}

function daysUntil(dateStr: string) {
  const d    = new Date(dateStr)
  const now  = new Date()
  d.setHours(0,0,0,0); now.setHours(0,0,0,0)
  return Math.round((d.getTime() - now.getTime()) / 86400000)
}

export default function MedicalHistoryPage() {
  const [pets,       setPets]       = useState<Pet[]>([])
  const [activePet,  setActivePet]  = useState<Pet | null>(null)
  const [vaccs,      setVaccs]      = useState<Vacc[]>([])
  const [records,    setRecords]    = useState<MedRec[]>([])
  const [loading,    setLoading]    = useState(false)
  const [expanded,   setExpanded]   = useState<string | null>(null)
  const [tab,        setTab]        = useState<"vaccs" | "records">("vaccs")
  const [showVaccForm, setShowVaccForm] = useState(false)
  const [vaccForm, setVaccForm]     = useState({ name: "", date: "", nextDate: "", notes: "" })
  const [savingVacc, setSavingVacc] = useState(false)

  useEffect(() => {
    fetch(apiUrl("/api/my/pets"), { credentials: "include" })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) { setPets(data); setActivePet(data[0]) } })
  }, [])

  useEffect(() => {
    if (!activePet) return
    setLoading(true)
    Promise.all([
      fetch(apiUrl(`/api/my/vaccinations?petId=${activePet.id}`), { credentials: "include" }).then(r => r.json()),
      fetch(apiUrl(`/api/my/medical-records?petId=${activePet.id}`), { credentials: "include" }).then(r => r.json()),
    ]).then(([v, m]) => {
      setVaccs(Array.isArray(v) ? v : [])
      setRecords(Array.isArray(m) ? m : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [activePet])

  const addVacc = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activePet || !vaccForm.name || !vaccForm.date) return
    setSavingVacc(true)
    const res  = await fetch(apiUrl("/api/my/vaccinations"), {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ petId: activePet.id, ...vaccForm }),
    })
    const data = await res.json()
    if (data.id) { setVaccs(v => [data, ...v]); setVaccForm({ name: "", date: "", nextDate: "", notes: "" }); setShowVaccForm(false) }
    setSavingVacc(false)
  }

  const deleteVacc = async (id: string) => {
    await fetch(apiUrl("/api/my/vaccinations"), {
      method: "DELETE", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    setVaccs(v => v.filter(x => x.id !== id))
  }

  // Upcoming vaccination reminders
  const upcoming = vaccs.filter(v => v.nextDate && daysUntil(v.nextDate) <= 30 && daysUntil(v.nextDate) >= 0)

  if (pets.length === 0) return (
    <div className="p-8 text-center py-16">
      <PawPrint className="w-12 h-12 text-gray-200 mx-auto mb-3" />
      <p className="text-gray-400 mb-2">Нямате добавени любимци</p>
      <a href="/my/pets" className="text-[#EF3988] text-sm font-medium hover:underline">Добавете любимец →</a>
    </div>
  )

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Здравна история</h1>
        <p className="text-gray-400 text-sm mt-0.5">Ваксинации и медицински записи</p>
      </div>

      {/* Pet selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {pets.map(pet => (
          <button key={pet.id} onClick={() => { setActivePet(pet); setExpanded(null) }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activePet?.id === pet.id ? "bg-[#EF3988] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-[#EF3988]"
            }`}>
            <span>{SPECIES_EMOJI[pet.species] ?? "🐾"}</span>
            {pet.name}
            {pet.breed && <span className="opacity-70 text-xs">· {pet.breed}</span>}
          </button>
        ))}
      </div>

      {/* Upcoming vaccination warning */}
      {upcoming.length > 0 && (
        <div className="mb-5 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-yellow-800 text-sm">Предстоящи ваксинации</p>
            <div className="mt-1 space-y-0.5">
              {upcoming.map(v => (
                <p key={v.id} className="text-yellow-700 text-xs">
                  <strong>{v.name}</strong> — {new Date(v.nextDate!).toLocaleDateString("bg-BG")}
                  {" "}({daysUntil(v.nextDate!) === 0 ? "днес" : `след ${daysUntil(v.nextDate!)} дни`})
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-full p-1 gap-1 w-fit mb-6">
        <button onClick={() => setTab("vaccs")}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all ${tab === "vaccs" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}>
          <Syringe className="w-3.5 h-3.5" /> Ваксинации ({vaccs.length})
        </button>
        <button onClick={() => setTab("records")}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all ${tab === "records" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}>
          <FileText className="w-3.5 h-3.5" /> Прегледи ({records.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Зарежда...</div>
      ) : tab === "vaccs" ? (
        <div className="space-y-3">
          {/* Add vaccination button */}
          {!showVaccForm ? (
            <button onClick={() => setShowVaccForm(true)}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 hover:border-[#EF3988] text-gray-400 hover:text-[#EF3988] rounded-2xl text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" /> Добави ваксинация
            </button>
          ) : (
            <form onSubmit={addVacc} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-bold text-gray-900 text-sm">Нова ваксинация</p>
                <button type="button" onClick={() => setShowVaccForm(false)}><X className="w-4 h-4 text-gray-400" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-400 block mb-1">Наименование *</label>
                  <input value={vaccForm.name} onChange={e => setVaccForm(f => ({...f, name: e.target.value}))} required
                    placeholder="Бяс, Чума, Парвовирус..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#EF3988]" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">Дата *</label>
                  <input type="date" value={vaccForm.date} onChange={e => setVaccForm(f => ({...f, date: e.target.value}))} required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#EF3988]" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-1">Следваща (по желание)</label>
                  <input type="date" value={vaccForm.nextDate} onChange={e => setVaccForm(f => ({...f, nextDate: e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#EF3988]" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-400 block mb-1">Бележки</label>
                  <input value={vaccForm.notes} onChange={e => setVaccForm(f => ({...f, notes: e.target.value}))}
                    placeholder="Доза, ветеринар..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#EF3988]" />
                </div>
              </div>
              <button type="submit" disabled={savingVacc}
                className="w-full py-2.5 bg-[#EF3988] hover:bg-[#d42f77] text-white rounded-xl text-sm font-bold disabled:opacity-60">
                {savingVacc ? "Запазва..." : "Запази"}
              </button>
            </form>
          )}

          {vaccs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Syringe className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Няма добавени ваксинации за {activePet?.name}</p>
            </div>
          ) : vaccs.map(v => {
            const days = v.nextDate ? daysUntil(v.nextDate) : null
            const overdue = days !== null && days < 0
            const soon    = days !== null && days >= 0 && days <= 30
            return (
              <div key={v.id} className={`bg-white rounded-2xl border p-4 flex items-start gap-4 ${overdue ? "border-red-200" : soon ? "border-yellow-200" : "border-gray-100"}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${overdue ? "bg-red-50" : soon ? "bg-yellow-50" : "bg-green-50"}`}>
                  <Syringe className={`w-5 h-5 ${overdue ? "text-red-500" : soon ? "text-yellow-600" : "text-green-600"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{v.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Поставена: {new Date(v.date).toLocaleDateString("bg-BG")}
                    {v.nextDate && (
                      <span className={`ml-2 font-medium ${overdue ? "text-red-500" : soon ? "text-yellow-600" : "text-green-600"}`}>
                        · Следваща: {new Date(v.nextDate).toLocaleDateString("bg-BG")}
                        {overdue && " ⚠️ Просрочена"}
                        {soon && days === 0 && " — Днес!"}
                        {soon && days! > 0 && ` — след ${days} дни`}
                      </span>
                    )}
                  </p>
                  {v.notes && <p className="text-xs text-gray-400 mt-1 italic">{v.notes}</p>}
                </div>
                <button onClick={() => deleteVacc(v.id)} className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center shrink-0">
                  <Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-400" />
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        /* Medical Records Tab */
        <div className="space-y-3">
          {records.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Stethoscope className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Няма медицински записи за {activePet?.name}</p>
            </div>
          ) : records.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                className="w-full text-left p-5 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#1083BD]/10 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-5 h-5 text-[#1083BD]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{r.vet.displayName}</p>
                      <p className="text-xs text-gray-400">{r.vet.specialty}</p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(r.appointment.date).toLocaleDateString("bg-BG", { day: "numeric", month: "long" })}
                    </span>
                  </div>
                  {r.diagnosis && <p className="mt-1 text-sm text-gray-600 line-clamp-1">{r.diagnosis}</p>}
                  <div className="flex gap-3 mt-1 text-xs text-gray-400">
                    {r.weight && <span>{r.weight} кг</span>}
                    {r.temperature && <span>{r.temperature}°C</span>}
                    {r.nextVisit && <span className="text-[#1083BD]">Следващ: {new Date(r.nextVisit).toLocaleDateString("bg-BG")}</span>}
                  </div>
                </div>
                {expanded === r.id ? <ChevronUp className="w-4 h-4 text-gray-300 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-300 shrink-0" />}
              </button>
              {expanded === r.id && (
                <div className="border-t border-gray-100 p-5 grid md:grid-cols-2 gap-4 bg-gray-50/30 text-sm">
                  {r.diagnosis    && <div><p className="text-xs font-bold text-gray-400 mb-1">ДИАГНОЗА</p><p className="text-gray-700">{r.diagnosis}</p></div>}
                  {r.treatment    && <div><p className="text-xs font-bold text-gray-400 mb-1">ЛЕЧЕНИЕ</p><p className="text-gray-700">{r.treatment}</p></div>}
                  {r.medications  && <div><p className="text-xs font-bold text-gray-400 mb-1">МЕДИКАМЕНТИ</p><p className="text-gray-700">{r.medications}</p></div>}
                  {r.notes        && <div><p className="text-xs font-bold text-gray-400 mb-1">БЕЛЕЖКИ</p><p className="text-gray-700">{r.notes}</p></div>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
