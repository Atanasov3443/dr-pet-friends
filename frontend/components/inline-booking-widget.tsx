"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Check, Clock, Stethoscope, PawPrint, CalendarCheck, Video, MapPin } from "lucide-react"
import { apiUrl } from "@/lib/api"

type Service  = { id: string; name: string; price: number; duration: number }
type Schedule = { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }

const MONTHS_BG = ["Януари","Февруари","Март","Април","Май","Юни","Юли","Август","Септември","Октомври","Ноември","Декември"]
const MONTHS_SHORT = ["Яну","Фев","Мар","Апр","Май","Юни","Юли","Авг","Сеп","Окт","Ное","Дек"]
const DAYS_BG = ["Пн","Вт","Ср","Чт","Пт","Сб","Нд"]
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

// Returns Monday-first day index (0=Mon … 6=Sun)
function mondayFirst(d: Date) {
  return (d.getDay() + 6) % 7
}

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

  const [consultType, setConsultType] = useState<"IN_CLINIC" | "ONLINE" | null>(null)
  const [service,    setService]    = useState<Service | null>(null)
  const [date,       setDate]       = useState<Date | null>(null)
  const [slot,       setSlot]       = useState("")
  const [petName,    setPetName]    = useState("")
  const [petSpecies, setPetSpecies] = useState("DOG")
  const [notes,      setNotes]      = useState("")
  const [step,       setStep]       = useState<"type" | "service" | "date" | "confirm" | "done">("type" as "type" | "service" | "date" | "confirm" | "done")
  const [saving,       setSaving]       = useState(false)
  const [error,        setError]        = useState("")
  const [meetLink,     setMeetLink]     = useState("")
  const [appointmentId, setAppointmentId] = useState("")
  const [appointmentPrice, setAppointmentPrice] = useState<number | null>(null)
  const [payLoading,   setPayLoading]   = useState(false)

  const activeDays   = useMemo(() => new Set(schedule.filter(s => s.isActive).map(s => s.dayOfWeek)), [schedule])
  const calCells     = useMemo(() => buildCalendar(calYear, calMonth), [calYear, calMonth])
  const duration     = service?.duration ?? 30
  const daySchedule  = date ? schedule.filter(s => s.isActive && s.dayOfWeek === date.getDay()) : []
  const slots        = useMemo(() => daySchedule.flatMap(s => genSlots(s.startTime, s.endTime, duration)), [date, duration])

  function isAvailable(d: Date) {
    if (d <= today) return false
    return activeDays.has(d.getDay())
  }

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11) }
    else setCalMonth(m => m - 1)
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0) }
    else setCalMonth(m => m + 1)
  }

  const confirm = async () => {
    if (!petName.trim()) { setError("Въведи името на любимеца"); return }
    if (!date || !slot) return
    setSaving(true); setError("")
    const [h, m] = slot.split(":").map(Number)
    const dt = new Date(date); dt.setHours(h, m, 0, 0)
    try {
      const res = await fetch(apiUrl("/api/appointments"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vetId, serviceId: service?.id, date: dt.toISOString(),
          petName: petName.trim(), petSpecies, notes,
          consultationType: consultType ?? "IN_CLINIC",
        }),
        credentials: "include",
      })
      if (res.ok) {
        const data = await res.json()
        if (data.meetLink) setMeetLink(data.meetLink)
        setAppointmentId(data.id ?? "")
        setAppointmentPrice(data.price ?? service?.price ?? null)
        setStep("done")
      }
      else if (res.status === 401) { router.push("/login") }
      else {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? "Грешка при запазване.")
      }
    } catch { setError("Сървърна грешка.") }
    finally { setSaving(false) }
  }

  const startPayment = async () => {
    if (!appointmentId) return
    setPayLoading(true)
    try {
      const res  = await fetch(apiUrl("/api/stripe/checkout"), {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally { setPayLoading(false) }
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  if (step === "done") {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
          <Check className="w-7 h-7 text-green-600" />
        </div>
        <h3 className="font-black text-gray-900 text-lg mb-1">Часът е запазен!</h3>
        <p className="text-gray-500 text-sm mb-1">
          {date && `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]} · ${slot}`}
        </p>
        {service && <p className="text-gray-400 text-xs mb-1">{service.name}</p>}
        <p className="text-xs text-gray-400 mb-5">Ще получите имейл с потвърждение.</p>

        <div className="space-y-2">
          {appointmentPrice && appointmentPrice > 0 ? (
            <>
              <button onClick={startPayment} disabled={payLoading}
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#10B83D] hover:bg-[#0da033] disabled:opacity-60 text-white rounded-xl text-sm font-bold transition-colors">
                💳 {payLoading ? "Зарежда..." : `Плати ${appointmentPrice} лв. онлайн`}
              </button>
              {meetLink && (
                <p className="text-xs text-center text-gray-400">
                  Линкът за онлайн консултацията ще бъде изпратен по имейл след плащане.
                </p>
              )}
            </>
          ) : (
            meetLink && (
              <a href={meetLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#1083BD] hover:bg-[#0d6fa0] text-white rounded-xl text-sm font-bold transition-colors">
                <Video className="w-4 h-4" /> Влез в онлайн консултацията
              </a>
            )
          )}

          <button onClick={() => router.push("/my/appointments")}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-bold transition-colors">
            Виж моите часове
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-[#1083BD] px-5 py-4">
        <div className="flex items-center gap-2 mb-1">
          <CalendarCheck className="w-4 h-4 text-white" />
          <h3 className="text-white font-bold text-sm">Запази час</h3>
        </div>
        <p className="text-white/70 text-xs">{vetName}</p>

        {/* Progress dots */}
        <div className="flex gap-1.5 mt-3">
          {(services.length > 0 ? ["type","service","date","confirm"] : ["type","date","confirm"]).map((s, i, arr) => {
            const s2: string = step
            const currentStep: string = s2 === "done" ? "confirm" : s2
            const currentIdx  = arr.indexOf(currentStep)
            return (
            <div key={s} className={`flex-1 h-1 rounded-full transition-colors ${
              i <= currentIdx ? "bg-white" : "bg-white/25"
            }`} />
          )})}
        </div>
      </div>

      <div className="p-4 space-y-4">

        {/* ── Step: Type ── */}
        {step === "type" && (
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-4">Избери тип консултация</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { setConsultType("IN_CLINIC"); setStep(services.length > 0 ? "service" : "date") }}
                className="flex flex-col items-center gap-3 p-5 border-2 border-gray-100 rounded-2xl hover:border-[#1083BD] hover:bg-blue-50/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-[#1083BD]/10 group-hover:bg-[#1083BD]/20 flex items-center justify-center transition-colors">
                  <MapPin className="w-6 h-6 text-[#1083BD]" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 text-sm">На място</p>
                  <p className="text-gray-400 text-xs mt-0.5">Преглед в клиника</p>
                </div>
              </button>
              <button onClick={() => { setConsultType("ONLINE"); setStep(services.length > 0 ? "service" : "date") }}
                className="flex flex-col items-center gap-3 p-5 border-2 border-gray-100 rounded-2xl hover:border-[#EF3988] hover:bg-pink-50/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-[#EF3988]/10 group-hover:bg-[#EF3988]/20 flex items-center justify-center transition-colors">
                  <Video className="w-6 h-6 text-[#EF3988]" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900 text-sm">Онлайн</p>
                  <p className="text-gray-400 text-xs mt-0.5">Видео консултация</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ── Step: Service ── */}
        {step === "service" && (
          <div>
            {consultType && (
              <div className={`flex items-center gap-2 mb-3 rounded-xl px-3 py-2 text-xs font-semibold ${consultType === "ONLINE" ? "bg-pink-50 text-[#EF3988]" : "bg-blue-50 text-[#1083BD]"}`}>
                {consultType === "ONLINE" ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                {consultType === "ONLINE" ? "Онлайн консултация" : "Преглед на място"}
                <button onClick={() => setStep("type")} className="ml-auto text-xs opacity-60 hover:opacity-100">Промени</button>
              </div>
            )}
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 flex items-center gap-1.5 mb-3">
              <Stethoscope className="w-3.5 h-3.5" /> Избери услуга
            </p>
            <div className="space-y-2">
              <button onClick={() => { setService(null); setStep("date") }}
                className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-[#1083BD]/40 transition-colors">
                <p className="font-semibold text-sm text-gray-900">Общ преглед</p>
                <p className="text-xs text-gray-400">30 мин</p>
              </button>
              {services.map(s => (
                <button key={s.id} onClick={() => { setService(s); setStep("date") }}
                  className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-[#1083BD]/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.duration} мин</p>
                    </div>
                    <span className="text-[#1083BD] font-bold text-sm shrink-0">{s.price} лв.</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step: Date ── */}
        {step === "date" && (
          <div>
            {/* Selected service pill */}
            {service && (
              <div className="flex items-center gap-2 mb-3 bg-blue-50 rounded-xl px-3 py-2">
                <Stethoscope className="w-3.5 h-3.5 text-[#1083BD]" />
                <span className="text-xs font-semibold text-[#1083BD]">{service.name}</span>
                <button onClick={() => setStep("service")} className="ml-auto text-xs text-gray-400 hover:text-gray-600">Промени</button>
              </div>
            )}

            {/* Calendar header */}
            <div className="flex items-center justify-between mb-3">
              <button onClick={prevMonth} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>
              <span className="text-sm font-bold text-gray-900">
                {MONTHS_BG[calMonth]} {calYear}
              </span>
              <button onClick={nextMonth} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS_BG.map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1">{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {calCells.map((d, i) => {
                if (!d) return <div key={i} />
                const avail   = isAvailable(d)
                const selected = date?.toDateString() === d.toDateString()
                const isToday  = d.toDateString() === today.toDateString()
                return (
                  <button
                    key={i}
                    disabled={!avail}
                    onClick={() => { setDate(d); setSlot("") }}
                    className={`
                      h-9 w-full rounded-lg text-sm font-semibold transition-colors
                      ${selected ? "bg-[#1083BD] text-white"
                        : avail ? "hover:bg-[#1083BD]/10 text-gray-900"
                        : "text-gray-300 cursor-not-allowed"}
                      ${isToday && !selected ? "ring-1 ring-[#1083BD]/40" : ""}
                    `}
                  >
                    {d.getDate()}
                  </button>
                )
              })}
            </div>

            {/* Time slots */}
            {date && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 flex items-center gap-1.5 mb-3">
                  <Clock className="w-3.5 h-3.5" /> Часове за {date.getDate()} {MONTHS_SHORT[date.getMonth()]}
                </p>
                {slots.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-3">Няма свободни часове</p>
                ) : (
                  <div className="grid grid-cols-3 gap-1.5">
                    {slots.map(s => (
                      <button key={s} onClick={() => setSlot(s)}
                        className={`py-2 rounded-lg text-sm font-semibold border transition-colors ${
                          slot === s ? "bg-[#1083BD] text-white border-[#1083BD]"
                                     : "border-gray-200 hover:border-[#1083BD]/40 text-gray-700"
                        }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {slot && (
                  <button onClick={() => setStep("confirm")}
                    className="mt-4 w-full py-2.5 bg-[#EF3988] hover:bg-[#d42f77] text-white rounded-xl text-sm font-bold transition-colors">
                    Продължи →
                  </button>
                )}
              </div>
            )}

            {services.length > 0 && (
              <button onClick={() => setStep("service")} className="mt-3 text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                <ChevronLeft className="w-3 h-3" /> Назад
              </button>
            )}
          </div>
        )}

        {/* ── Step: Confirm ── */}
        {step === "confirm" && (
          <div>
            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm space-y-1.5">
              <div className="flex justify-between text-gray-600">
                <span>Услуга</span><span className="font-semibold">{service?.name ?? "Общ преглед"}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Дата</span>
                <span className="font-semibold">{date && `${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Час</span><span className="font-semibold">{slot}</span>
              </div>
              {service?.price && (
                <div className="flex justify-between text-gray-600 pt-1 border-t border-gray-200">
                  <span>Цена</span><span className="font-bold text-[#1083BD]">{service.price} лв.</span>
                </div>
              )}
            </div>

            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 flex items-center gap-1.5 mb-3">
              <PawPrint className="w-3.5 h-3.5" /> За любимеца
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Ime *</label>
                <input value={petName} onChange={e => { setPetName(e.target.value); setError("") }}
                  placeholder="Рекс, Мица..."
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD] text-gray-900 ${error && !petName.trim() ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
                {error && !petName.trim() && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Вид</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {SPECIES.map(s => (
                    <button key={s.v} onClick={() => setPetSpecies(s.v)}
                      className={`py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        petSpecies === s.v ? "bg-[#1083BD] text-white border-[#1083BD]" : "border-gray-200 text-gray-600 hover:border-[#1083BD]/40"
                      }`}>
                      {s.l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">Бележки</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                  placeholder="Симптоми, въпроси..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD] text-gray-900 resize-none" />
              </div>
            </div>

            {error && petName.trim() && (
              <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2 mt-2">{error}</p>
            )}

            <div className="flex gap-2 mt-4">
              <button onClick={() => setStep("date")}
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50">
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
  )
}
