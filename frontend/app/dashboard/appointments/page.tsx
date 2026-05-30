"use client"

import { apiUrl } from "@/lib/api"

import { useEffect, useState } from "react"
import { CalendarDays, Check, X, Clock } from "lucide-react"

type Appointment = {
  id: string; date: string; status: string; notes: string | null; price: number | null
  owner: { name: string | null; email: string }
  pet:   { name: string; species: string; breed: string | null }
  service: { name: string; duration: number } | null
}

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

  const load = () => {
    setLoading(true)
    fetch(apiUrl("/api/dashboard/appointments"))
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

  const filtered = filter === "ALL"
    ? appointments
    : appointments.filter(a => a.status === filter)

  const grouped = filtered.reduce((acc, a) => {
    const day = new Date(a.date).toLocaleDateString("bg-BG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    if (!acc[day]) acc[day] = []
    acc[day].push(a)
    return acc
  }, {} as Record<string, Appointment[]>)

  return (
    <div className="p-8">
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
                  return (
                    <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-5">
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

                      {a.status === "PENDING" && (
                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                          <button onClick={() => updateStatus(a.id, "CONFIRMED")}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium transition-colors">
                            <Check className="w-4 h-4" /> Потвърди
                          </button>
                          <button onClick={() => updateStatus(a.id, "CANCELLED")}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors">
                            <X className="w-4 h-4" /> Откажи
                          </button>
                        </div>
                      )}
                      {a.status === "CONFIRMED" && (
                        <div className="mt-4 pt-4 border-t border-gray-50">
                          <button onClick={() => updateStatus(a.id, "COMPLETED")}
                            className="w-full py-2 bg-[#1083BD] hover:bg-[#0d6fa0] text-white rounded-xl text-sm font-medium transition-colors">
                            Маркирай като завършен
                          </button>
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
