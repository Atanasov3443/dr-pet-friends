"use client"

import { apiUrl } from "@/lib/api"

import { useEffect, useState } from "react"
import { FileText, Search, CalendarDays, Thermometer, Weight } from "lucide-react"

type MedRecord = {
  id: string
  diagnosis: string | null
  treatment: string | null
  medications: string | null
  notes: string | null
  weight: number | null
  temperature: number | null
  nextVisit: string | null
  createdAt: string
  pet:         { name: string; species: string; breed: string | null }
  appointment: { date: string; status: string; owner: { name: string | null } }
}

const SPECIES_EMOJI: Record<string, string> = {
  DOG: "🐶", CAT: "🐱", BIRD: "🐦", RABBIT: "🐰", EXOTIC: "🦎", OTHER: "🐾"
}

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch(apiUrl("/api/dashboard/medical-records"), { credentials: "include" })
      .then(r => r.json())
      .then(data => { setRecords(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = records.filter(r =>
    !search ||
    r.pet.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.appointment.owner.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (r.diagnosis ?? "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Медицински записи</h1>
          <p className="text-gray-500 text-sm mt-1">История на всички прегледи</p>
        </div>
        <div className="sm:ml-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Търси по пациент, собственик..."
            className="pl-9 pr-4 h-10 rounded-xl border border-gray-200 text-sm w-64 focus:outline-none focus:border-[#1083BD]" />
        </div>
      </div>

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
                Медицинските записи се попълват след преглед. Отиди в <strong>Резервации</strong>, избери завършен час и кликни "Медицински запис".
              </p>
              <a href="/dashboard/appointments"
                className="inline-flex items-center gap-2 bg-[#1083BD] hover:bg-[#0d6fa0] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
                Отиди към Резервации →
              </a>
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
                    <span className="font-semibold text-gray-900">
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
                      {new Date(r.appointment.date).toLocaleDateString("bg-BG", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                    <span>Собственик: {r.appointment.owner.name ?? "—"}</span>
                    {r.weight && <span className="flex items-center gap-1"><Weight className="w-3 h-3" />{r.weight} кг</span>}
                    {r.temperature && <span className="flex items-center gap-1"><Thermometer className="w-3 h-3" />{r.temperature}°C</span>}
                  </div>
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {new Date(r.createdAt).toLocaleDateString("bg-BG")}
                </span>
              </button>

              {expanded === r.id && (
                <div className="border-t border-gray-100 p-5 grid md:grid-cols-2 gap-5 bg-gray-50/40">
                  {r.diagnosis && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Диагноза</p>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{r.diagnosis}</p>
                    </div>
                  )}
                  {r.treatment && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Лечение</p>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{r.treatment}</p>
                    </div>
                  )}
                  {r.medications && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Медикаменти</p>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{r.medications}</p>
                    </div>
                  )}
                  {r.notes && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Бележки</p>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{r.notes}</p>
                    </div>
                  )}
                  {r.nextVisit && (
                    <div className="md:col-span-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Следващ преглед</p>
                      <p className="text-sm text-[#1083BD] font-medium">
                        {new Date(r.nextVisit).toLocaleDateString("bg-BG", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
