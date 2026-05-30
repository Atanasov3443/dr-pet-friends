"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, ChevronLeft, ChevronRight, Check, CalendarCheck, Clock, Stethoscope, PawPrint } from "lucide-react"
import { apiUrl } from "@/lib/api"

type Service = { id: string; name: string; price: number; duration: number }
type Schedule = { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }

interface BookingModalProps {
  isOpen:   boolean
  onClose:  () => void
  vetId:    string
  vetName:  string
  services: Service[]
  schedule: Schedule[]
}

const SPECIES = [
  { v: "DOG",    l: "🐕 Куче" },
  { v: "CAT",    l: "🐈 Котка" },
  { v: "BIRD",   l: "🦜 Птица" },
  { v: "RABBIT", l: "🐇 Заек" },
  { v: "EXOTIC", l: "🦎 Екзотично" },
  { v: "OTHER",  l: "🐾 Друго" },
]

function genSlots(start: string, end: string, duration: number): string[] {
  const slots: string[] = []
  const [sh, sm] = start.split(":").map(Number)
  const [eh, em] = end.split(":").map(Number)
  let cur = sh * 60 + sm
  const endMin = eh * 60 + em
  while (cur + duration <= endMin) {
    const h = Math.floor(cur / 60).toString().padStart(2, "0")
    const m = (cur % 60).toString().padStart(2, "0")
    slots.push(`${h}:${m}`)
    cur += duration
  }
  return slots
}

function getDatesForNextDays(schedule: Schedule[], days = 30): Date[] {
  const dates: Date[] = []
  const activeDays = new Set(schedule.filter(s => s.isActive).map(s => s.dayOfWeek))
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = 1; i <= days; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    if (activeDays.has(d.getDay())) dates.push(d)
  }
  return dates
}

const MONTHS = ["Яну", "Фев", "Мар", "Апр", "Май", "Юни", "Юли", "Авг", "Сеп", "Окт", "Ное", "Дек"]
const DAYS_BG = ["Нед", "Пон", "Вт", "Ср", "Чет", "Пет", "Съб"]

export function BookingModal({ isOpen, onClose, vetId, vetName, services, schedule }: BookingModalProps) {
  const router  = useRouter()
  const [step, setStep]           = useState(1)
  const [service, setService]     = useState<Service | null>(null)
  const [date, setDate]           = useState<Date | null>(null)
  const [slot, setSlot]           = useState<string>("")
  const [petName, setPetName]     = useState("")
  const [petSpecies, setPetSpecies] = useState("DOG")
  const [notes, setNotes]         = useState("")
  const [saving, setSaving]       = useState(false)
  const [done, setDone]           = useState(false)
  const [error, setError]         = useState("")

  if (!isOpen) return null

  const duration    = service?.duration ?? 30
  const availDates  = getDatesForNextDays(schedule)
  const daySchedule = date ? schedule.filter(s => s.isActive && s.dayOfWeek === date.getDay()) : []
  const slots       = daySchedule.flatMap(s => genSlots(s.startTime, s.endTime, duration))

  const confirm = async () => {
    if (!petName.trim()) { setError("Въведи името на любимеца"); return }
    if (!date || !slot) return
    setSaving(true)
    setError("")
    const [h, m] = slot.split(":").map(Number)
    const dt = new Date(date)
    dt.setHours(h, m, 0, 0)

    try {
      const res = await fetch(apiUrl("/api/appointments"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vetId, serviceId: service?.id, date: dt.toISOString(), petName: petName.trim(), petSpecies, notes }),
        credentials: "include",
      })
      if (res.ok) { setDone(true) }
      else if (res.status === 401) { onClose(); router.push("/login") }
      else {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? "Грешка при запазване. Опитай отново.")
      }
    } catch {
      setError("Сървърна грешка. Провери интернет връзката.")
    } finally {
      setSaving(false)
    }
  }

  const reset = () => { setStep(1); setService(null); setDate(null); setSlot(""); setPetName(""); setDone(false); setError("") }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-[#1083BD] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarCheck className="w-5 h-5 text-white" />
            <div>
              <p className="text-white font-bold text-sm">Запази час</p>
              <p className="text-white/70 text-xs">{vetName}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Step indicator */}
        {!done && (
          <div className="flex px-6 pt-4 gap-2">
            {[1,2,3,4].map(s => (
              <div key={s} className={`flex-1 h-1 rounded-full transition-colors ${s <= step ? "bg-[#1083BD]" : "bg-gray-100"}`} />
            ))}
          </div>
        )}

        <div className="p-6">

          {/* Done state */}
          {done && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Часът е запазен!</h3>
              <p className="text-gray-500 text-sm mb-1">
                {date && `${date.getDate()} ${MONTHS[date.getMonth()]} · ${slot}`}
              </p>
              {service && <p className="text-gray-400 text-xs mb-6">{service.name}</p>}
              <div className="flex gap-3">
                <button onClick={() => { reset(); onClose() }}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
                  Затвори
                </button>
                <button onClick={() => { reset(); onClose(); router.push("/my/appointments") }}
                  className="flex-1 py-2.5 bg-[#1083BD] text-white rounded-xl text-sm font-medium">
                  Моите часове
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Service */}
          {!done && step === 1 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-[#1083BD]" /> Избери услуга
              </h3>
              <div className="space-y-2">
                <button onClick={() => { setService(null); setStep(2) }}
                  className={`w-full text-left p-3 rounded-xl border transition-colors ${!service ? "border-[#1083BD] bg-blue-50" : "border-gray-200 hover:border-[#1083BD]/40"}`}>
                  <p className="font-semibold text-sm text-gray-900">Общ преглед</p>
                  <p className="text-xs text-gray-400">30 мин</p>
                </button>
                {services.map(s => (
                  <button key={s.id} onClick={() => { setService(s); setStep(2) }}
                    className={`w-full text-left p-3 rounded-xl border transition-colors ${service?.id === s.id ? "border-[#1083BD] bg-blue-50" : "border-gray-200 hover:border-[#1083BD]/40"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.duration} мин</p>
                      </div>
                      <span className="text-[#1083BD] font-bold text-sm">{s.price} лв.</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date */}
          {!done && step === 2 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-[#1083BD]" /> Избери дата
              </h3>
              {availDates.length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm">Няма налични дати</p>
              ) : (
                <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
                  {availDates.map((d, i) => (
                    <button key={i} onClick={() => { setDate(d); setSlot(""); setStep(3) }}
                      className={`p-2 rounded-xl text-center border transition-colors ${date?.toDateString() === d.toDateString() ? "bg-[#1083BD] text-white border-[#1083BD]" : "border-gray-200 text-gray-900 hover:border-[#1083BD]/40"}`}>
                      <p className="text-xs font-semibold">{DAYS_BG[d.getDay()]}</p>
                      <p className="text-lg font-black leading-tight">{d.getDate()}</p>
                      <p className="text-xs opacity-70">{MONTHS[d.getMonth()]}</p>
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => setStep(1)} className="mt-4 text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
                <ChevronLeft className="w-3 h-3" /> Назад
              </button>
            </div>
          )}

          {/* Step 3: Time slot */}
          {!done && step === 3 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1083BD]" /> Избери час
              </h3>
              {date && <p className="text-xs text-gray-400 mb-4">{date.getDate()} {MONTHS[date.getMonth()]} · {DAYS_BG[date.getDay()]}</p>}
              {slots.length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm">Няма свободни часове</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                  {slots.map(s => (
                    <button key={s} onClick={() => { setSlot(s); setStep(4) }}
                      className={`py-2.5 rounded-xl text-sm font-semibold border transition-colors ${slot === s ? "bg-[#1083BD] text-white border-[#1083BD]" : "border-gray-200 hover:border-[#1083BD]/40 text-gray-700"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => setStep(2)} className="mt-4 text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1">
                <ChevronLeft className="w-3 h-3" /> Назад
              </button>
            </div>
          )}

          {/* Step 4: Confirm */}
          {!done && step === 4 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <PawPrint className="w-4 h-4 text-[#1083BD]" /> Твоят любимец
              </h3>

              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm space-y-1">
                <div className="flex justify-between text-gray-600">
                  <span>Услуга</span><span className="font-semibold">{service?.name ?? "Общ преглед"}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Дата</span><span className="font-semibold">{date && `${date.getDate()} ${MONTHS[date.getMonth()]}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Час</span><span className="font-semibold">{slot}</span>
                </div>
                {service?.price && (
                  <div className="flex justify-between text-gray-600 pt-1 border-t border-gray-200 mt-1">
                    <span>Цена</span><span className="font-bold text-[#1083BD]">{service.price} лв.</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Име на любимеца *</label>
                  <input value={petName} onChange={e => { setPetName(e.target.value); setError("") }} placeholder="Рекс, Мица..."
                    style={{ color: "#111827" }}
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD] ${error && !petName.trim() ? "border-red-400 bg-red-50" : "border-gray-200"}`} />
                  {error && !petName.trim() && <p className="text-xs text-red-500 mt-1">{error}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Вид животно</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {SPECIES.map(s => (
                      <button key={s.v} onClick={() => setPetSpecies(s.v)}
                        className={`py-1.5 rounded-lg text-xs font-medium border transition-colors ${petSpecies === s.v ? "bg-[#1083BD] text-white border-[#1083BD]" : "border-gray-200 text-gray-600 hover:border-[#1083BD]/40"}`}>
                        {s.l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Бележки (по желание)</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Симптоми, въпроси..."
                    style={{ color: "#111827" }}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD]" />
                </div>
              </div>

              {error && petName.trim() && (
                <div className="mt-3 text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</div>
              )}

              <div className="flex gap-3 mt-5">
                <button onClick={() => setStep(3)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={confirm} disabled={saving}
                  className="flex-1 py-2.5 bg-[#1083BD] hover:bg-[#0d6fa0] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60 transition-colors">
                  <Check className="w-4 h-4" /> {saving ? "Запазва..." : "Потвърди часа"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
