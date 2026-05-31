"use client"

import { apiUrl } from "@/lib/api"

import { useEffect, useState } from "react"
import { FileText, CalendarDays, Stethoscope, Thermometer, Weight, ChevronDown, ChevronUp, PawPrint } from "lucide-react"

type Pet     = { id: string; name: string; species: string; breed: string | null }
type MedRec  = {
  id: string
  diagnosis:   string | null
  treatment:   string | null
  medications: string | null
  notes:       string | null
  weight:      number | null
  temperature: number | null
  nextVisit:   string | null
  createdAt:   string
  vet:         { displayName: string; specialty: string; image: string | null }
  appointment: { date: string }
}

const SPECIES_EMOJI: Record<string, string> = {
  DOG: "🐶", CAT: "🐱", BIRD: "🐦", RABBIT: "🐰", EXOTIC: "🦎", OTHER: "🐾"
}

export default function MedicalHistoryPage() {
  const [pets,       setPets]       = useState<Pet[]>([])
  const [activePet,  setActivePet]  = useState<Pet | null>(null)
  const [records,    setRecords]    = useState<MedRec[]>([])
  const [loading,    setLoading]    = useState(false)
  const [expanded,   setExpanded]   = useState<string | null>(null)

  useEffect(() => {
    fetch(apiUrl("/api/my/pets"), { credentials: "include" })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) { setPets(data); setActivePet(data[0]) } })
  }, [])

  useEffect(() => {
    if (!activePet) return
    setLoading(true)
    setRecords([])
    fetch(apiUrl(`/api/my/medical-records?petId=${activePet.id}`), { credentials: "include" })
      .then(r => r.json())
      .then(data => { setRecords(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [activePet])

  if (pets.length === 0) {
    return (
      <div className="p-8 text-center py-16">
        <PawPrint className="w-12 h-12 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-400 mb-2">Нямате добавени любимци</p>
        <a href="/my/pets" className="text-[#EF3988] text-sm font-medium hover:underline">Добавете любимец →</a>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Здравна история</h1>
        <p className="text-gray-500 text-sm mt-1">Медицински записи от прегледи</p>
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
            {pet.breed && <span className="opacity-70">· {pet.breed}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Зарежда...</div>
      ) : records.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>Все още няма медицински записи за {activePet?.name}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                className="w-full text-left p-5 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#1083BD]/10 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-5 h-5 text-[#1083BD]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{r.vet.displayName}</p>
                      <p className="text-xs text-gray-400">{r.vet.specialty}</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(r.appointment.date).toLocaleDateString("bg-BG", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                  {r.diagnosis && (
                    <p className="mt-1 text-sm text-gray-600 line-clamp-1">{r.diagnosis}</p>
                  )}
                  <div className="flex gap-3 mt-1.5 text-xs text-gray-400">
                    {r.weight      && <span className="flex items-center gap-1"><Weight className="w-3 h-3" />{r.weight} кг</span>}
                    {r.temperature && <span className="flex items-center gap-1"><Thermometer className="w-3 h-3" />{r.temperature}°C</span>}
                    {r.nextVisit   && (
                      <span className="text-[#1083BD] font-medium">
                        Следващ: {new Date(r.nextVisit).toLocaleDateString("bg-BG")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0 mt-1 text-gray-300">
                  {expanded === r.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {expanded === r.id && (
                <div className="border-t border-gray-100 p-5 grid md:grid-cols-2 gap-5 bg-pink-50/20">
                  {r.diagnosis && (
                    <div className="md:col-span-2">
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
                    <div className="md:col-span-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Бележки</p>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{r.notes}</p>
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
