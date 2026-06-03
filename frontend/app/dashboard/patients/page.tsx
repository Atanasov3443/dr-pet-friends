"use client"

import { apiUrl } from "@/lib/api"
import { useEffect, useState } from "react"
import { Search, PawPrint, CalendarDays, FileText, ChevronRight, X, Syringe, Stethoscope, Clock } from "lucide-react"

type Patient = {
  pet:           { id: string; name: string; species: string; breed: string | null; weight: number | null; birthDate: string | null; image: string | null }
  owner:         { name: string | null; email: string; phone: string | null }
  lastVisit:     string
  totalVisits:   number
  lastDiagnosis: string | null
}

type PetDetail = {
  id: string; name: string; species: string; breed: string | null; weight: number | null; birthDate: string | null; image: string | null
  owner: { name: string | null; email: string; phone: string | null }
  vaccinations:  { id: string; name: string; date: string; nextDate: string | null }[]
  medicalRecords: { id: string; diagnosis: string | null; treatment: string | null; medications: string | null; createdAt: string; appointment: { date: string } }[]
  appointments:  { id: string; date: string; status: string; service: { name: string } | null }[]
}

const SPECIES_EMOJI: Record<string, string> = { DOG:"🐶", CAT:"🐱", BIRD:"🦜", RABBIT:"🐰", EXOTIC:"🦎", OTHER:"🐾" }

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700", CONFIRMED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-600", COMPLETED: "bg-gray-100 text-gray-600"
}
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Чакаща", CONFIRMED: "Потвърдена", CANCELLED: "Отказана", COMPLETED: "Завършена"
}

export default function PatientsPage() {
  const [patients,  setPatients]  = useState<Patient[]>([])
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState("")
  const [selected,  setSelected]  = useState<PetDetail | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  useEffect(() => {
    fetch(apiUrl("/api/dashboard/patients"), { credentials: "include" })
      .then(r => r.json())
      .then(data => { setPatients(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const openPatient = async (petId: string) => {
    setLoadingDetail(true)
    const data = await fetch(apiUrl(`/api/dashboard/patients/${petId}`), { credentials: "include" }).then(r => r.json())
    setSelected(data)
    setLoadingDetail(false)
  }

  const filtered = patients.filter(p =>
    !search ||
    p.pet.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.owner.name ?? "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 flex gap-6 h-full">
      {/* Patient list */}
      <div className={`flex flex-col ${selected ? "w-80 shrink-0" : "flex-1"}`}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Пациенти</h1>
            <p className="text-gray-500 text-sm mt-0.5">{patients.length} пациента</p>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Търси пациент или собственик..."
            className="w-full pl-9 pr-4 h-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1083BD]" />
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Зарежда...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <PawPrint className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Нямате пациенти все още</p>
            <p className="text-gray-300 text-xs mt-1">Пациентите се появяват след резервации</p>
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto flex-1">
            {filtered.map(p => (
              <button key={p.pet.id} onClick={() => openPatient(p.pet.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all hover:shadow-sm ${selected?.id === p.pet.id ? "border-[#1083BD] bg-blue-50/30" : "border-gray-100 bg-white hover:border-[#1083BD]/30"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1083BD]/10 flex items-center justify-center text-xl shrink-0 overflow-hidden">
                    {p.pet.image ? <img src={p.pet.image} className="w-full h-full object-cover" alt="" /> : (SPECIES_EMOJI[p.pet.species] ?? "🐾")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm">{p.pet.name}</p>
                    <p className="text-xs text-gray-400 truncate">{p.owner.name ?? p.owner.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-500 font-medium">{p.totalVisits} посещ.</p>
                    <p className="text-[10px] text-gray-400">{new Date(p.lastVisit).toLocaleDateString("bg-BG", { day:"numeric", month:"short" })}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                </div>
                {p.lastDiagnosis && (
                  <p className="text-xs text-gray-400 mt-2 line-clamp-1 pl-13">{p.lastDiagnosis}</p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Patient detail */}
      {selected && (
        <div className="flex-1 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1083BD] to-[#0D67F7] p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl overflow-hidden shrink-0">
                {selected.image ? <img src={selected.image} className="w-full h-full object-cover rounded-2xl" alt="" /> : (SPECIES_EMOJI[selected.species] ?? "🐾")}
              </div>
              <div className="flex-1">
                <h2 className="text-white font-black text-xl">{selected.name}</h2>
                <p className="text-white/70 text-sm">{selected.breed || "Домашен любимец"} {selected.weight ? `· ${selected.weight} кг` : ""}</p>
                <p className="text-white/60 text-xs mt-0.5">Собственик: {selected.owner.name ?? selected.owner.email}</p>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Посещения", value: selected.appointments.length },
                  { label: "Записи", value: selected.medicalRecords.length },
                  { label: "Ваксинации", value: selected.vaccinations.length },
                ].map(s => (
                  <div key={s.label} className="bg-gray-50 rounded-2xl p-4 text-center">
                    <p className="font-black text-2xl text-[#1083BD]">{s.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Medical records */}
              {selected.medicalRecords.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                    <Stethoscope className="w-4 h-4 text-[#1083BD]" /> Медицински записи
                  </h3>
                  <div className="space-y-2">
                    {selected.medicalRecords.map(r => (
                      <div key={r.id} className="bg-gray-50 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-400">{new Date(r.appointment.date).toLocaleDateString("bg-BG", { day:"numeric", month:"long", year:"numeric" })}</span>
                        </div>
                        {r.diagnosis    && <p className="text-sm text-gray-800 mb-1"><span className="font-semibold text-gray-500">Диагноза: </span>{r.diagnosis}</p>}
                        {r.treatment    && <p className="text-sm text-gray-600"><span className="font-semibold text-gray-500">Лечение: </span>{r.treatment}</p>}
                        {r.medications  && <p className="text-sm text-gray-600"><span className="font-semibold text-gray-500">Медикаменти: </span>{r.medications}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vaccinations */}
              {selected.vaccinations.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                    <Syringe className="w-4 h-4 text-green-600" /> Ваксинации
                  </h3>
                  <div className="space-y-2">
                    {selected.vaccinations.map(v => (
                      <div key={v.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                        <span className="text-sm font-medium text-gray-900">{v.name}</span>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">{new Date(v.date).toLocaleDateString("bg-BG")}</p>
                          {v.nextDate && <p className="text-xs text-green-600">Следваща: {new Date(v.nextDate).toLocaleDateString("bg-BG")}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Appointment history */}
              <div>
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-gray-400" /> История на посещенията
                </h3>
                <div className="space-y-2">
                  {selected.appointments.map(a => (
                    <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm text-gray-700">{new Date(a.date).toLocaleDateString("bg-BG", { day:"numeric", month:"long", year:"numeric" })}</p>
                        {a.service && <p className="text-xs text-gray-400">{a.service.name}</p>}
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[a.status]}`}>{STATUS_LABELS[a.status]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {loadingDetail && (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#1083BD] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
