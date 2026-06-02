"use client"

import { useState, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Check, Clock, Stethoscope, PawPrint, CalendarCheck, Video, MapPin, CreditCard } from "lucide-react"
import { apiUrl } from "@/lib/api"

type Service  = { id: string; name: string; price: number; duration: number }
type Schedule = { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }

const MONTHS_BG    = ["Януари","Февруари","Март","Април","Май","Юни","Юли","Август","Септември","Октомври","Ноември","Декември"]
const MONTHS_SHORT = ["Яну","Фев","Мар","Апр","Май","Юни","Юли","Авг","Сеп","Окт","Ное","Дек"]
const DAYS_BG      = ["Пн","Вт","Ср","Чт","Пт","Сб","Нд"]
const SPECIES      = [
  { v: "DOG",    l: "🐕 Куче" }, { v: "CAT",    l: "🐈 Котка" },
  { v: "BIRD",   l: "🦜 Птица" }, { v: "RABBIT", l: "🐇 Заек" },
  { v: "EXOTIC", l: "🦎 Екзотично" }, { v: "OTHER",  l: "🐾 Друго" },
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

function mondayFirst(d: Date) { return (d.getDay() + 6) % 7 }

function buildCalendar(year: number, month: number) {
  const firstDay  = new Date(year, month, 1)
  const lastDay   = new Date(year, month + 1, 0)
  const startPad  = mondayFirst(firstDay)
  const cells: (Date | null)[] = []
  for (let i = 0; i < startPad; i++) cells.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function InlineBookingWidget({ vetId, vetName, services, schedule }: {
  vetId: string; vetName: string; services: Service[]; schedule: Schedule[]
}) {
  const router = useRouter()
  const today  = useMemo(() => { const d = new Date(); d.setHours(0,0,0,0); return d }, [])

  const [calYear,  setCalYear]  = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())

  const [consultType, setConsultType] = useState<"IN_CLINIC" | "ONLINE">("IN_CLINIC")
  const [service,     setService]     = useState<Service | null>(null)
  const [date,        setDate]        = useState<Date | null>(null)
  const [slot,        setSlot]        = useState("")
  const [petName,     setPetName]     = useState("")
  const [petSpecies,  setPetSpecies]  = useState("DOG")
  const [notes,       setNotes]       = useState("")
  const [step,        setStep]        = useState<"select" | "confirm" | "done">("select")
  const [saving,      setSaving]      = useState(false)
  const [error,       setError]       = useState("")
  const [appointmentId,    setAppointmentId]    = useState("")
  const [appointmentPrice, setAppointmentPrice] = useState<number | null>(null)
  const [payLoading,  setPayLoading]  = useState(false)

  const activeDays  = useMemo(() => new Set(schedule.filter(s => s.isActive).map(s => s.dayOfWeek)), [schedule])
  const calCells    = useMemo(() => buildCalendar(calYear, calMonth), [calYear, calMonth])
  const duration    = service?.duration ?? 30
  const daySchedule = date ? schedule.filter(s => s.isActive && s.dayOfWeek === date.getDay()) : []
  const slots       = useMemo(() => daySchedule.flatMap(s => genSlots(s.startTime, s.endTime, duration)), [date, duration])

  function isAvailable(d: Date) { return d > today && activeDays.has(d.getDay()) }
  function prevMonth() { if (calMonth === 0) { setCalYear(y => y-1); setCalMonth(11) } else setCalMonth(m => m-1) }
  function nextMonth() { if (calMonth === 11) { setCalYear(y => y+1); setCalMonth(0) } else setCalMonth(m => m+1) }

  const confirm = async () => {
    if (!petName.trim()) { setError("Въведи името на любимеца"); return }
    if (!date || !slot)  { setError("Избери дата и час"); return }
    setSaving(true); setError("")
    const [h, m] = slot.split(":").map(Number)
    const dt = new Date(date); dt.setHours(h, m, 0, 0)
    try {
      const res = await fetch(apiUrl("/api/appointments"), {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vetId, serviceId: service?.id, date: dt.toISOString(), petName: petName.trim(), petSpecies, notes, consultationType: consultType }),
      })
      if (res.ok) {
        const data = await res.json()
        setAppointmentId(data.id ?? "")
        setAppointmentPrice(data.price ?? service?.price ?? null)
        setStep("done")
      } else if (res.status === 401) { router.push("/login") }
      else { const d = await res.json().catch(() => ({})); setError(d.error ?? "Грешка при запазване.") }
    } catch { setError("Сървърна грешка.") }
    finally { setSaving(false) }
  }

  const startPayment = async () => {
    if (!appointmentId) return
    setPayLoading(true)
    try {
      const res  = await fetch(apiUrl("/api/stripe/checkout"), { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ appointmentId }) })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally { setPayLoading(false) }
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  if (step === "done") {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center flex flex-col items-center gap-4 min-h-[400px] justify-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="font-black text-gray-900 text-xl mb-1">Часът е запазен!</h3>
          <p className="text-gray-500 text-sm">{date && `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} · ${slot}`}</p>
          {service && <p className="text-gray-400 text-xs mt-0.5">{service.name}</p>}
          <p className="text-xs text-gray-400 mt-2">Ще получите имейл с потвърждение.</p>
        </div>
        {appointmentPrice && appointmentPrice > 0 && (
          <button onClick={startPayment} disabled={payLoading}
            className="flex items-center gap-2 px-8 py-3 bg-[#10B83D] hover:bg-[#0da033] disabled:opacity-60 text-white rounded-xl font-bold transition-colors">
            <CreditCard className="w-5 h-5" />
            {payLoading ? "Зарежда..." : `Плати ${appointmentPrice} лв. онлайн`}
          </button>
        )}
        <button onClick={() => router.push("/my/appointments")}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          Виж моите часове →
        </button>
      </div>
    )
  }

  // ── Confirm ────────────────────────────────────────────────────────────────
  if (step === "confirm") {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="bg-[#1083BD] px-6 py-4 flex items-center gap-3">
          <button onClick={() => setStep("select")} className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <div>
            <h3 className="text-white font-bold text-sm">Потвърди часа</h3>
            <p className="text-white/70 text-xs">{vetName} · {date?.getDate()} {date && MONTHS_SHORT[date.getMonth()]} · {slot}</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Summary pill */}
          <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-400 text-xs block mb-0.5">Тип</span><span className="font-medium">{consultType === "ONLINE" ? "🖥️ Онлайн" : "🏥 На място"}</span></div>
            <div><span className="text-gray-400 text-xs block mb-0.5">Услуга</span><span className="font-medium">{service?.name ?? "Общ преглед"}</span></div>
            <div><span className="text-gray-400 text-xs block mb-0.5">Дата и час</span><span className="font-medium">{date?.getDate()} {date && MONTHS_SHORT[date.getMonth()]} · {slot}</span></div>
            {service?.price && <div><span className="text-gray-400 text-xs block mb-0.5">Цена</span><span className="font-bold text-[#1083BD]">{service.price} лв.</span></div>}
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2 flex items-center gap-1.5"><PawPrint className="w-3.5 h-3.5" /> Ime на любимеца *</label>
            <input value={petName} onChange={e => { setPetName(e.target.value); setError("") }}
              placeholder="Рекс, Мица..."
              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1083BD] ${error && !petName.trim() ? "border-red-300" : "border-gray-200"}`} />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Вид животно</label>
            <div className="grid grid-cols-3 gap-2">
              {SPECIES.map(s => (
                <button key={s.v} onClick={() => setPetSpecies(s.v)}
                  className={`py-2 rounded-xl text-xs font-medium border transition-colors ${petSpecies === s.v ? "bg-[#1083BD] text-white border-[#1083BD]" : "border-gray-200 text-gray-600 hover:border-[#1083BD]/40"}`}>
                  {s.l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Бележки (симптоми, въпроси...)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Опишете проблема..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1083BD] resize-none" />
          </div>

          {error && <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}

          <button onClick={confirm} disabled={saving}
            className="w-full py-3.5 bg-[#1083BD] hover:bg-[#0d6fa0] text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60 transition-colors">
            <Check className="w-4 h-4" /> {saving ? "Запазва..." : "Потвърди часа"}
          </button>
        </div>
      </div>
    )
  }

  // ── Select (main view) ─────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-[#1083BD] px-6 py-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarCheck className="w-4 h-4 text-white" />
          <h3 className="text-white font-bold">Запази час</h3>
          <span className="text-white/60 text-sm ml-1">· {vetName}</span>
        </div>

        {/* Type toggle */}
        <div className="flex gap-2">
          <button onClick={() => setConsultType("IN_CLINIC")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              consultType === "IN_CLINIC" ? "bg-white text-[#1083BD]" : "bg-white/20 text-white hover:bg-white/30"
            }`}>
            <MapPin className="w-3.5 h-3.5" /> На място
          </button>
          <button onClick={() => setConsultType("ONLINE")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              consultType === "ONLINE" ? "bg-white text-[#EF3988]" : "bg-white/20 text-white hover:bg-white/30"
            }`}>
            <Video className="w-3.5 h-3.5" /> Онлайн
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Service selector */}
        {services.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5" /> Услуга</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setService(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${!service ? "bg-[#1083BD] text-white border-[#1083BD]" : "border-gray-200 text-gray-600 hover:border-[#1083BD]/40"}`}>
                Общ преглед
              </button>
              {services.map(s => (
                <button key={s.id} onClick={() => setService(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${service?.id === s.id ? "bg-[#1083BD] text-white border-[#1083BD]" : "border-gray-200 text-gray-600 hover:border-[#1083BD]/40"}`}>
                  {s.name} · {s.price} лв.
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Calendar + Slots side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calendar */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <button onClick={prevMonth} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>
              <span className="text-sm font-bold text-gray-900">{MONTHS_BG[calMonth]} {calYear}</span>
              <button onClick={nextMonth} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="grid grid-cols-7 mb-1">
              {DAYS_BG.map(d => <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {calCells.map((d, i) => {
                if (!d) return <div key={i} />
                const avail    = isAvailable(d)
                const selected = date?.toDateString() === d.toDateString()
                const isToday  = d.toDateString() === today.toDateString()
                return (
                  <button key={i} disabled={!avail} onClick={() => { setDate(d); setSlot("") }}
                    className={`h-9 w-full rounded-lg text-sm font-semibold transition-colors
                      ${selected ? "bg-[#1083BD] text-white"
                        : avail ? "hover:bg-[#1083BD]/10 text-gray-900"
                        : "text-gray-300 cursor-not-allowed"}
                      ${isToday && !selected ? "ring-1 ring-[#1083BD]/40" : ""}`}>
                    {d.getDate()}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Time slots */}
          <div className="flex flex-col">
            {!date ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-8">
                <Clock className="w-10 h-10 text-gray-200" />
                <p className="text-sm text-gray-300">Изберете дата</p>
              </div>
            ) : (
              <>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {date.getDate()} {MONTHS_SHORT[date.getMonth()]}
                </p>
                {slots.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4">Няма свободни часове</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {slots.map(s => (
                      <button key={s} onClick={() => setSlot(s)}
                        className={`py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                          slot === s ? "bg-[#1083BD] text-white border-[#1083BD]" : "border-gray-200 text-gray-600 hover:border-[#1083BD]/30 hover:bg-blue-50/50"
                        }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* CTA */}
        {date && slot && (
          <div className="mt-5 pt-5 border-t border-gray-100">
            <button onClick={() => setStep("confirm")}
              className="w-full py-3.5 bg-[#EF3988] hover:bg-[#d42f77] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-sm">
              Продължи към потвърждение →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
