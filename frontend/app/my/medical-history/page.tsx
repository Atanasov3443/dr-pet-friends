"use client"

import { apiUrl } from "@/lib/api"
import { useEffect, useState } from "react"
import { FileText, Syringe, Plus, Trash2, CalendarDays, AlertTriangle, Stethoscope, ChevronDown, ChevronUp, PawPrint, X, Pill, Bug, Scissors, Scale, Heart, StickyNote } from "lucide-react"

type Pet    = { id: string; name: string; species: string; breed: string | null; color: string | null; microchip: string | null; weight: number | null; birthDate: string | null }
type Vacc   = { id: string; name: string; date: string; nextDate: string | null; notes: string | null }
type Entry  = { id: string; type: string; date: string; title: string; data: string | null; notes: string | null; nextDate: string | null }
type MedRec = { id: string; diagnosis: string | null; treatment: string | null; medications: string | null; notes: string | null; weight: number | null; temperature: number | null; nextVisit: string | null; createdAt: string; vet: { displayName: string; specialty: string }; appointment: { date: string } }
type Appt   = { id: string; date: string; status: string; consultationType: string; vet: { displayName: string; specialty: string }; pet: { id: string; name: string }; service: { name: string; price: number } | null }

const SPECIES_EMOJI: Record<string, string> = { DOG:"🐶", CAT:"🐱", BIRD:"🦜", RABBIT:"🐰", EXOTIC:"🦎", OTHER:"🐾" }

const TABS = [
  { id: "info",      label: "Профил",          icon: PawPrint   },
  { id: "vaccs",     label: "Ваксинации",       icon: Syringe    },
  { id: "deworm",    label: "Обезпаразитяване", icon: Bug        },
  { id: "meds",      label: "Медикаменти",      icon: Pill       },
  { id: "proc",      label: "Процедури",        icon: Scissors   },
  { id: "allergies", label: "Алергии",          icon: Heart      },
  { id: "weight",    label: "Тегло",            icon: Scale      },
  { id: "records",   label: "Прегледи",         icon: Stethoscope },
]

const ENTRY_TYPES: Record<string, string> = {
  DEWORMING: "Обезпаразитяване", MEDICATION: "Медикамент",
  PROCEDURE: "Процедура/Операция", WEIGHT: "Тегло",
  ALLERGY: "Алергия/Хронично", NOTE: "Бележка",
}

function daysUntil(d: string) {
  const diff = new Date(d).setHours(0,0,0,0) - new Date().setHours(0,0,0,0)
  return Math.round(diff / 86400000)
}

function AddForm({ onSave, onCancel, typeFixed, placeholder }: {
  onSave: (d: any) => Promise<void>
  onCancel: () => void
  typeFixed?: string
  placeholder?: { title?: string; data?: string; notes?: string }
}) {
  const [form, setForm] = useState({ title: "", date: "", nextDate: "", data: "", notes: "" })
  const [saving, setSaving] = useState(false)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    await onSave({ ...form, type: typeFixed })
    setSaving(false)
  }
  return (
    <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-bold text-gray-900 text-sm">{typeFixed ? ENTRY_TYPES[typeFixed] : "Нов запис"}</p>
        <button type="button" onClick={onCancel}><X className="w-4 h-4 text-gray-400" /></button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-xs font-semibold text-gray-400 block mb-1">Наименование *</label>
          <input value={form.title} onChange={e => set("title", e.target.value)} required placeholder={placeholder?.title ?? "Въведи..."}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1083BD]" />
        </div>
        {typeFixed === "WEIGHT" ? (
          <div className="col-span-2">
            <label className="text-xs font-semibold text-gray-400 block mb-1">Тегло (кг) *</label>
            <input value={form.data} onChange={e => set("data", e.target.value)} required placeholder="4.5" type="number" step="0.1"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1083BD]" />
          </div>
        ) : (
          <div className="col-span-2">
            <label className="text-xs font-semibold text-gray-400 block mb-1">{placeholder?.data ?? "Детайли (доза, препарат...)"}</label>
            <input value={form.data} onChange={e => set("data", e.target.value)} placeholder={placeholder?.data ?? "Доза, клиника..."}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1083BD]" />
          </div>
        )}
        <div>
          <label className="text-xs font-semibold text-gray-400 block mb-1">Дата *</label>
          <input type="date" value={form.date} onChange={e => set("date", e.target.value)} required
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1083BD]" />
        </div>
        {(typeFixed === "DEWORMING" || typeFixed === "MEDICATION") && (
          <div>
            <label className="text-xs font-semibold text-gray-400 block mb-1">Следващо третиране</label>
            <input type="date" value={form.nextDate} onChange={e => set("nextDate", e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1083BD]" />
          </div>
        )}
        <div className="col-span-2">
          <label className="text-xs font-semibold text-gray-400 block mb-1">Бележки</label>
          <input value={form.notes} onChange={e => set("notes", e.target.value)} placeholder={placeholder?.notes ?? "Допълнителна информация..."}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1083BD]" />
        </div>
      </div>
      <button type="submit" disabled={saving} className="w-full py-2.5 bg-[#1083BD] hover:bg-[#0d6fa0] text-white rounded-xl text-sm font-bold disabled:opacity-60">
        {saving ? "Запазва..." : "Запази"}
      </button>
    </form>
  )
}

function EntryList({ entries, onDelete, typeFilter, addForm }: { entries: Entry[]; onDelete: (id: string) => void; typeFilter: string; addForm: React.ReactNode }) {
  const filtered = entries.filter(e => e.type === typeFilter)
  return (
    <div className="space-y-3">
      {addForm}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-300">
          <p className="text-sm">Няма записи</p>
        </div>
      ) : filtered.map(e => {
        const days = e.nextDate ? daysUntil(e.nextDate) : null
        const overdue = days !== null && days < 0
        const soon    = days !== null && days <= 30
        return (
          <div key={e.id} className={`bg-white rounded-2xl border p-4 flex gap-3 ${overdue ? "border-red-200" : soon ? "border-yellow-100" : "border-gray-100"}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-gray-900 text-sm">{e.title}</p>
                <span className="text-xs text-gray-400 shrink-0">{new Date(e.date).toLocaleDateString("bg-BG")}</span>
              </div>
              {e.data  && <p className="text-xs text-[#1083BD] mt-0.5">{typeFilter === "WEIGHT" ? `${e.data} кг` : e.data}</p>}
              {e.notes && <p className="text-xs text-gray-400 mt-0.5 italic">{e.notes}</p>}
              {e.nextDate && (
                <p className={`text-xs mt-1 font-medium ${overdue ? "text-red-500" : soon ? "text-yellow-600" : "text-green-600"}`}>
                  Следващо: {new Date(e.nextDate).toLocaleDateString("bg-BG")}
                  {overdue && " ⚠️"}{soon && days === 0 && " — Днес!"}
                  {soon && days! > 0 && ` (след ${days} дни)`}
                </p>
              )}
            </div>
            <button onClick={() => onDelete(e.id)} className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center shrink-0">
              <Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-400" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default function MedicalHistoryPage() {
  const [pets,      setPets]      = useState<Pet[]>([])
  const [pet,       setPet]       = useState<Pet | null>(null)
  const [vaccs,     setVaccs]     = useState<Vacc[]>([])
  const [entries,   setEntries]   = useState<Entry[]>([])
  const [records,   setRecords]   = useState<MedRec[]>([])
  const [appts,     setAppts]     = useState<Appt[]>([])
  const [tab,       setTab]       = useState("info")
  const [loading,   setLoading]   = useState(false)
  const [showForm,  setShowForm]  = useState(false)
  const [expanded,  setExpanded]  = useState<string | null>(null)

  useEffect(() => {
    fetch(apiUrl("/api/my/pets"), { credentials: "include" })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) { setPets(data); setPet(data[0]) } })
  }, [])

  useEffect(() => {
    if (!pet) return
    setLoading(true)
    Promise.all([
      fetch(apiUrl(`/api/my/vaccinations?petId=${pet.id}`), { credentials: "include" }).then(r => r.json()),
      fetch(apiUrl(`/api/my/health-entries?petId=${pet.id}`), { credentials: "include" }).then(r => r.json()),
      fetch(apiUrl(`/api/my/medical-records?petId=${pet.id}`), { credentials: "include" }).then(r => r.json()),
      fetch(apiUrl("/api/my/appointments"), { credentials: "include" }).then(r => r.json()),
    ]).then(([v, e, m, a]) => {
      setVaccs(Array.isArray(v) ? v : [])
      setEntries(Array.isArray(e) ? e : [])
      setRecords(Array.isArray(m) ? m : [])
      // Filter appointments for this pet
      setAppts(Array.isArray(a) ? a.filter((x: Appt) => x.pet?.id === pet.id) : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [pet])

  const addVacc = async (form: any) => {
    const res  = await fetch(apiUrl("/api/my/vaccinations"), { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ petId: pet!.id, name: form.title, date: form.date, nextDate: form.nextDate || null, notes: form.notes || null }) })
    const data = await res.json()
    if (data.id) { setVaccs(v => [data, ...v]); setShowForm(false) }
  }

  const addEntry = async (form: any) => {
    const res  = await fetch(apiUrl("/api/my/health-entries"), { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ petId: pet!.id, ...form }) })
    const data = await res.json()
    if (data.id) { setEntries(e => [data, ...e]); setShowForm(false) }
  }

  const delVacc  = async (id: string) => { await fetch(apiUrl("/api/my/vaccinations"), { method: "DELETE", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); setVaccs(v => v.filter(x => x.id !== id)) }
  const delEntry = async (id: string) => { await fetch(apiUrl("/api/my/health-entries"), { method: "DELETE", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); setEntries(e => e.filter(x => x.id !== id)) }

  // Upcoming reminders
  const upcomingVaccs   = vaccs.filter(v => v.nextDate && daysUntil(v.nextDate) >= 0 && daysUntil(v.nextDate) <= 30)
  const upcomingEntries = entries.filter(e => e.nextDate && daysUntil(e.nextDate) >= 0 && daysUntil(e.nextDate) <= 30)
  const allReminders    = [...upcomingVaccs.map(v => ({ name: v.name, date: v.nextDate! })), ...upcomingEntries.map(e => ({ name: e.title, date: e.nextDate! }))]

  const weightEntries = entries.filter(e => e.type === "WEIGHT").sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const calcAge = (birthDate: string) => {
    const years = Math.floor((Date.now() - new Date(birthDate).getTime()) / (365.25 * 24 * 3600 * 1000))
    return years < 1 ? "< 1 година" : `${years} г.`
  }

  if (pets.length === 0) return (
    <div className="p-8 text-center py-16">
      <PawPrint className="w-12 h-12 text-gray-200 mx-auto mb-3" />
      <p className="text-gray-400 mb-2">Нямате добавени любимци</p>
      <a href="/my/pets" className="text-[#EF3988] text-sm font-medium hover:underline">Добавете любимец →</a>
    </div>
  )

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Здравна история</h1>
        <p className="text-gray-400 text-sm mt-0.5">Пълен здравен дневник на любимеца</p>
      </div>

      {/* Pet selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {pets.map(p => (
          <button key={p.id} onClick={() => { setPet(p); setShowForm(false); setExpanded(null) }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${pet?.id === p.id ? "bg-[#EF3988] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-[#EF3988]"}`}>
            {SPECIES_EMOJI[p.species] ?? "🐾"} {p.name}
          </button>
        ))}
      </div>

      {/* Reminders banner */}
      {allReminders.length > 0 && (
        <div className="mb-5 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-yellow-800 text-sm mb-1">Предстоящи третирания</p>
            {allReminders.map((r, i) => <p key={i} className="text-yellow-700 text-xs"><strong>{r.name}</strong> — {new Date(r.date).toLocaleDateString("bg-BG")} ({daysUntil(r.date) === 0 ? "днес" : `след ${daysUntil(r.date)} дни`})</p>)}
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Left sidebar — tabs */}
        <div className="w-44 shrink-0 space-y-1">
          {TABS.map(t => {
            const Icon = t.icon
            return (
              <button key={t.id} onClick={() => { setTab(t.id); setShowForm(false) }}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${tab === t.id ? "bg-[#1083BD] text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                <Icon className="w-4 h-4 shrink-0" /> {t.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {loading ? <div className="text-center py-12 text-gray-400">Зарежда...</div> : (

            <>
            {/* ПРОФИЛ */}
            {tab === "info" && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <h3 className="font-bold text-gray-900">Основна информация</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Ime", pet?.name],
                    ["Вид / Порода", pet?.breed || "—"],
                    ["Дата на раждане", pet?.birthDate ? new Date(pet.birthDate).toLocaleDateString("bg-BG") : "—"],
                    ["Възраст", pet?.birthDate ? calcAge(pet.birthDate) : "—"],
                    ["Тегло", pet?.weight ? `${pet.weight} кг` : "—"],
                    ["Цвят", pet?.color || "—"],
                    ["Микрочип", pet?.microchip || "—"],
                  ].map(([label, value]) => (
                    <div key={label as string} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                      <p className="font-semibold text-gray-900">{value as string}</p>
                    </div>
                  ))}
                </div>
                <a href="/my/pets" className="text-xs text-[#1083BD] hover:underline">Редактирай в Моите любимци →</a>
              </div>
            )}

            {/* ВАКСИНАЦИИ */}
            {tab === "vaccs" && (
              <div className="space-y-3">
                {!showForm && <button onClick={() => setShowForm(true)} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 hover:border-[#1083BD] text-gray-400 hover:text-[#1083BD] rounded-2xl text-sm font-medium transition-colors"><Plus className="w-4 h-4" /> Добави ваксинация</button>}
                {showForm && <AddForm typeFixed="VACCINATION" onSave={addVacc} onCancel={() => setShowForm(false)} placeholder={{ title: "Бяс, Чума, Парвовирус...", data: "Доза, клиника...", notes: "Лекар..." }} />}
                {vaccs.length === 0 ? <div className="text-center py-10 text-gray-300 text-sm">Няма ваксинации</div> : vaccs.map(v => {
                  const days = v.nextDate ? daysUntil(v.nextDate) : null
                  const overdue = days !== null && days < 0
                  const soon    = days !== null && days <= 30
                  return (
                    <div key={v.id} className={`bg-white rounded-2xl border p-4 flex gap-3 ${overdue ? "border-red-200" : soon ? "border-yellow-100" : "border-gray-100"}`}>
                      <Syringe className={`w-4 h-4 mt-0.5 shrink-0 ${overdue ? "text-red-500" : soon ? "text-yellow-500" : "text-green-500"}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900 text-sm">{v.name}</p>
                          <span className="text-xs text-gray-400">{new Date(v.date).toLocaleDateString("bg-BG")}</span>
                        </div>
                        {v.notes && <p className="text-xs text-gray-400 mt-0.5">{v.notes}</p>}
                        {v.nextDate && <p className={`text-xs mt-0.5 font-medium ${overdue ? "text-red-500" : soon ? "text-yellow-600" : "text-green-600"}`}>Следваща: {new Date(v.nextDate).toLocaleDateString("bg-BG")}{overdue && " ⚠️"}{soon && days! > 0 && ` (след ${days} дни)`}</p>}
                      </div>
                      <button onClick={() => delVacc(v.id)}><Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-400" /></button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ОБЕЗПАРАЗИТЯВАНЕ */}
            {tab === "deworm" && (
              <EntryList entries={entries} onDelete={delEntry} typeFilter="DEWORMING"
                addForm={showForm
                  ? <AddForm typeFixed="DEWORMING" onSave={addEntry} onCancel={() => setShowForm(false)} placeholder={{ title: "Вътрешно / Външно", data: "Препарат, доза", notes: "Клиника..." }} />
                  : <button onClick={() => setShowForm(true)} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 hover:border-[#1083BD] text-gray-400 hover:text-[#1083BD] rounded-2xl text-sm font-medium transition-colors"><Plus className="w-4 h-4" /> Добави запис</button>}
              />
            )}

            {/* МЕДИКАМЕНТИ */}
            {tab === "meds" && (
              <EntryList entries={entries} onDelete={delEntry} typeFilter="MEDICATION"
                addForm={showForm
                  ? <AddForm typeFixed="MEDICATION" onSave={addEntry} onCancel={() => setShowForm(false)} placeholder={{ title: "Наименование на медикамента", data: "Доза и период на прием", notes: "Причина..." }} />
                  : <button onClick={() => setShowForm(true)} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 hover:border-[#1083BD] text-gray-400 hover:text-[#1083BD] rounded-2xl text-sm font-medium transition-colors"><Plus className="w-4 h-4" /> Добави медикамент</button>}
              />
            )}

            {/* ПРОЦЕДУРИ */}
            {tab === "proc" && (
              <EntryList entries={entries} onDelete={delEntry} typeFilter="PROCEDURE"
                addForm={showForm
                  ? <AddForm typeFixed="PROCEDURE" onSave={addEntry} onCancel={() => setShowForm(false)} placeholder={{ title: "Кастрация, зъбен камък...", data: "Клиника, лекар", notes: "Бележки..." }} />
                  : <button onClick={() => setShowForm(true)} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 hover:border-[#1083BD] text-gray-400 hover:text-[#1083BD] rounded-2xl text-sm font-medium transition-colors"><Plus className="w-4 h-4" /> Добави процедура</button>}
              />
            )}

            {/* АЛЕРГИИ */}
            {tab === "allergies" && (
              <EntryList entries={entries} onDelete={delEntry} typeFilter="ALLERGY"
                addForm={showForm
                  ? <AddForm typeFixed="ALLERGY" onSave={addEntry} onCancel={() => setShowForm(false)} placeholder={{ title: "Алергия / Хронично заболяване", data: "Специална диета, третиране", notes: "Бележки..." }} />
                  : <button onClick={() => setShowForm(true)} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 hover:border-[#1083BD] text-gray-400 hover:text-[#1083BD] rounded-2xl text-sm font-medium transition-colors"><Plus className="w-4 h-4" /> Добави алергия/хронично</button>}
              />
            )}

            {/* ТЕГЛО */}
            {tab === "weight" && (
              <div className="space-y-3">
                {!showForm
                  ? <button onClick={() => setShowForm(true)} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 hover:border-[#1083BD] text-gray-400 hover:text-[#1083BD] rounded-2xl text-sm font-medium transition-colors"><Plus className="w-4 h-4" /> Добави измерване</button>
                  : <AddForm typeFixed="WEIGHT" onSave={addEntry} onCancel={() => setShowForm(false)} placeholder={{ title: "Измерване на тегло" }} />
                }
                {weightEntries.length === 0 ? <div className="text-center py-10 text-gray-300 text-sm">Няма записи за тегло</div> : (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="space-y-2">
                      {[...weightEntries].reverse().map(e => (
                        <div key={e.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                          <span className="text-sm text-gray-600">{new Date(e.date).toLocaleDateString("bg-BG")}</span>
                          <span className="font-bold text-[#1083BD] text-lg">{e.data} кг</span>
                          <button onClick={() => delEntry(e.id)}><Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-400" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ПРЕГЛЕДИ */}
            {tab === "records" && (
              <div className="space-y-3">
                {appts.length === 0 && records.length === 0 && <div className="text-center py-10 text-gray-300 text-sm">Няма посещения при ветеринар</div>}

                {/* Upcoming appointments */}
                {appts.filter(a => new Date(a.date) >= new Date() && a.status !== "CANCELLED").map(a => (
                  <div key={a.id} className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 items-start">
                    <div className="w-10 h-10 rounded-xl bg-[#1083BD]/10 flex items-center justify-center shrink-0">
                      <CalendarDays className="w-5 h-5 text-[#1083BD]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-gray-900 text-sm">{a.vet?.displayName}</p>
                        <span className="text-xs text-[#1083BD] font-medium">{new Date(a.date).toLocaleDateString("bg-BG", { day:"numeric", month:"long" })} · {new Date(a.date).toLocaleTimeString("bg-BG", { hour:"2-digit", minute:"2-digit" })}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{a.vet?.specialty}{a.service ? ` · ${a.service.name}` : ""}</p>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${a.status === "CONFIRMED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {a.status === "CONFIRMED" ? "Потвърден" : "Чакащ"}{a.consultationType === "ONLINE" ? " · Онлайн" : ""}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Past appointments & medical records */}
                {records.length === 0 && appts.filter(a => new Date(a.date) < new Date() || a.status === "CANCELLED").length === 0 ? null : records.map(r => (
                  <div key={r.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <button onClick={() => setExpanded(expanded === r.id ? null : r.id)} className="w-full text-left p-4 flex items-start gap-3 hover:bg-gray-50/50 transition-colors">
                      <Stethoscope className="w-4 h-4 text-[#1083BD] mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-gray-900 text-sm">{r.vet.displayName}</p>
                          <span className="text-xs text-gray-400">{new Date(r.appointment.date).toLocaleDateString("bg-BG")}</span>
                        </div>
                        {r.diagnosis && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{r.diagnosis}</p>}
                      </div>
                      {expanded === r.id ? <ChevronUp className="w-4 h-4 text-gray-300" /> : <ChevronDown className="w-4 h-4 text-gray-300" />}
                    </button>
                    {expanded === r.id && (
                      <div className="border-t border-gray-100 p-4 grid grid-cols-2 gap-3 bg-gray-50/30 text-sm">
                        {r.diagnosis   && <div><p className="text-xs font-bold text-gray-400 mb-0.5">ДИАГНОЗА</p><p className="text-gray-700">{r.diagnosis}</p></div>}
                        {r.treatment   && <div><p className="text-xs font-bold text-gray-400 mb-0.5">ЛЕЧЕНИЕ</p><p className="text-gray-700">{r.treatment}</p></div>}
                        {r.medications && <div><p className="text-xs font-bold text-gray-400 mb-0.5">МЕДИКАМЕНТИ</p><p className="text-gray-700">{r.medications}</p></div>}
                        {r.notes       && <div><p className="text-xs font-bold text-gray-400 mb-0.5">БЕЛЕЖКИ</p><p className="text-gray-700">{r.notes}</p></div>}
                        <div className="flex gap-4 text-xs text-gray-400">
                          {r.weight && <span>⚖️ {r.weight} кг</span>}
                          {r.temperature && <span>🌡️ {r.temperature}°C</span>}
                          {r.nextVisit && <span className="text-[#1083BD]">📅 Следващ: {new Date(r.nextVisit).toLocaleDateString("bg-BG")}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
