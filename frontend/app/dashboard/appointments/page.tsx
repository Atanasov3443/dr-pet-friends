"use client"

import { apiUrl } from "@/lib/api"

import { useEffect, useState } from "react"
import { CalendarDays, Check, X, Clock, FileText, ChevronDown, ChevronUp } from "lucide-react"

type Appointment = {
  id: string; date: string; status: string; notes: string | null; price: number | null
  owner: { name: string | null; email: string }
  pet:   { name: string; species: string; breed: string | null }
  service: { name: string; duration: number } | null
}

type MedicalForm = {
  diagnosis: string; treatment: string; medications: string
  notes: string; weight: string; temperature: string; nextVisit: string
}

const BLANK_FORM: MedicalForm = { diagnosis: "", treatment: "", medications: "", notes: "", weight: "", temperature: "", nextVisit: "" }

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Чакаща",     color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  CONFIRMED: { label: "Потвърдена", color: "bg-green-50 text-green-700 border-green-200"    },
  CANCELLED: { label: "Отказана",   color: "bg-red-50 text-red-700 border-red-200"          },
  COMPLETED: { label: "Завършена",  color: "bg-gray-100 text-gray-600 border-gray-200"      },
}

const SPECIES_EMOJI: Record<string, string> = {
  DOG: "🐶", CAT: "🐱", BIRD: "🐦", RABBIT: "🐰", EXOTIC: "🦎", OTHER: "🐾"
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading]           = useState(true)
  const [filter, setFilter]             = useState<string>("ALL")
  const [openRecord, setOpenRecord]     = useState<string | null>(null)
  const [forms, setForms]               = useState<Record<string, MedicalForm>>({})
  const [saving, setSaving]             = useState<string | null>(null)
  const [saved, setSaved]               = useState<Record<string, boolean>>({})

  const load = () => {
    setLoading(true)
    fetch(apiUrl("/api/dashboard/appointments"), { credentials: "include" })
      .then(r => r.json())
      .then(data => { setAppointments(Array.isArray(data) ? data : []); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id: string, status: string) => {
    await fetch(apiUrl("/api/dashboard/appointments"), {
      credentials: "include",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    load()
  }

  const toggleRecord = async (id: string) => {
    if (openRecord === id) { setOpenRecord(null); return }
    setOpenRecord(id)
    if (!forms[id]) {
      const res = await fetch(apiUrl(`/api/dashboard/medical-records?appointmentId=${id}`), { credentials: "include" })
      const data = await res.json()
      if (data) {
        setForms(f => ({ ...f, [id]: {
          diagnosis:   data.diagnosis   ?? "",
          treatment:   data.treatment   ?? "",
          medications: data.medications ?? "",
          notes:       data.notes       ?? "",
          weight:      data.weight      != null ? String(data.weight)      : "",
          temperature: data.temperature != null ? String(data.temperature) : "",
          nextVisit:   data.nextVisit   ? data.nextVisit.slice(0, 10) : "",
        }}))
      } else {
        setForms(f => ({ ...f, [id]: { ...BLANK_FORM } }))
      }
    }
  }

  const saveRecord = async (appointmentId: string) => {
    const form = forms[appointmentId]
    if (!form) return
    setSaving(appointmentId)
    await fetch(apiUrl("/api/dashboard/medical-records"), {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appointmentId,
        diagnosis:   form.diagnosis   || null,
        treatment:   form.treatment   || null,
        medications: form.medications || null,
        notes:       form.notes       || null,
        weight:      form.weight      ? Number(form.weight)      : null,
        temperature: form.temperature ? Number(form.temperature) : null,
        nextVisit:   form.nextVisit   || null,
      }),
    })
    setSaving(null)
    setSaved(s => ({ ...s, [appointmentId]: true }))
    setTimeout(() => setSaved(s => ({ ...s, [appointmentId]: false })), 2500)
    load()
  }

  const updateForm = (id: string, field: keyof MedicalForm, value: string) =>
    setForms(f => ({ ...f, [id]: { ...f[id], [field]: value } }))

  const filtered = filter === "ALL" ? appointments : appointments.filter(a => a.status === filter)

  const grouped = filtered.reduce((acc, a) => {
    const day = new Date(a.date).toLocaleDateString("bg-BG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    if (!acc[day]) acc[day] = []
    acc[day].push(a)
    return acc
  }, {} as Record<string, Appointment[]>)

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Резервации</h1>
        <p className="text-gray-500 text-sm mt-1">Всички записи за преглед</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === s ? "bg-[#1083BD] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-[#1083BD]"
            }`}>
            {s === "ALL" ? "Всички" : STATUS_LABELS[s]?.label}
            <span className="ml-1.5 text-xs opacity-70">
              {s === "ALL" ? appointments.length : appointments.filter(a => a.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Зарежда...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Няма резервации</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([day, appts]) => (
            <div key={day}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <CalendarDays className="w-3.5 h-3.5" /> {day}
              </p>
              <div className="space-y-3">
                {appts.map(a => {
                  const s = STATUS_LABELS[a.status]
                  const isOpen = openRecord === a.id
                  const form   = forms[a.id] ?? BLANK_FORM
                  const canRecord = a.status === "CONFIRMED" || a.status === "COMPLETED"
                  return (
                    <div key={a.id} className="bg-white rounded-2xl border border-gray-100">
                      <div className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#1083BD]/10 flex items-center justify-center text-xl shrink-0">
                            {SPECIES_EMOJI[a.pet.species] ?? "🐾"}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {a.pet.name}
                                  {a.pet.breed && <span className="text-gray-400 font-normal"> · {a.pet.breed}</span>}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Собственик: {a.owner.name ?? a.owner.email}
                                </p>
                              </div>
                              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${s.color}`}>
                                {s.label}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(a.date).toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" })}
                                {a.service && ` · ${a.service.name} (${a.service.duration} мин)`}
                              </span>
                              {a.price && <span className="font-medium text-gray-700">{a.price} лв.</span>}
                            </div>

                            {a.notes && (
                              <p className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">{a.notes}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50 flex-wrap">
                          {a.status === "PENDING" && (<>
                            <button onClick={() => updateStatus(a.id, "CONFIRMED")}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium transition-colors">
                              <Check className="w-4 h-4" /> Потвърди
                            </button>
                            <button onClick={() => updateStatus(a.id, "CANCELLED")}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors">
                              <X className="w-4 h-4" /> Откажи
                            </button>
                          </>)}
                          {canRecord && (
                            <button onClick={() => toggleRecord(a.id)}
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                isOpen ? "bg-[#1083BD] text-white" : "bg-[#1083BD]/10 text-[#1083BD] hover:bg-[#1083BD]/20"
                              }`}>
                              <FileText className="w-4 h-4" />
                              Медицински запис
                              {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Inline medical record form */}
                      {isOpen && (
                        <div className="border-t border-gray-100 p-5 bg-blue-50/40">
                          <h4 className="font-semibold text-sm text-gray-800 mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#1083BD]" /> Медицински запис — {a.pet.name}
                          </h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-xs font-semibold text-gray-500 mb-1">Диагноза</label>
                              <textarea value={form.diagnosis} onChange={e => updateForm(a.id, "diagnosis", e.target.value)}
                                rows={2} placeholder="Опишете диагнозата..."
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#1083BD]" />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-semibold text-gray-500 mb-1">Лечение</label>
                              <textarea value={form.treatment} onChange={e => updateForm(a.id, "treatment", e.target.value)}
                                rows={2} placeholder="Предписано лечение..."
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#1083BD]" />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-semibold text-gray-500 mb-1">Медикаменти</label>
                              <textarea value={form.medications} onChange={e => updateForm(a.id, "medications", e.target.value)}
                                rows={2} placeholder="Предписани медикаменти и дозировки..."
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#1083BD]" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 mb-1">Тегло (кг)</label>
                              <input type="number" step="0.1" value={form.weight} onChange={e => updateForm(a.id, "weight", e.target.value)}
                                placeholder="4.5"
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#1083BD]" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 mb-1">Температура (°C)</label>
                              <input type="number" step="0.1" value={form.temperature} onChange={e => updateForm(a.id, "temperature", e.target.value)}
                                placeholder="38.5"
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#1083BD]" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 mb-1">Следващ преглед</label>
                              <input type="date" value={form.nextVisit} onChange={e => updateForm(a.id, "nextVisit", e.target.value)}
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#1083BD]" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-500 mb-1">Допълнителни бележки</label>
                              <input value={form.notes} onChange={e => updateForm(a.id, "notes", e.target.value)}
                                placeholder="Бележки..."
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-[#1083BD]" />
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-4">
                            <button onClick={() => saveRecord(a.id)} disabled={saving === a.id}
                              className="px-5 py-2 bg-[#1083BD] hover:bg-[#0d6fa0] disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors">
                              {saving === a.id ? "Запазва..." : "Запази запис"}
                            </button>
                            {saved[a.id] && (
                              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                                <Check className="w-4 h-4" /> Запазен
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
