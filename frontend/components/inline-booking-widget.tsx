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
  // Backend stores dayOfWeek as Monday=0..Sunday=6; JS getDay() returns Sunday=0..Saturday=6
  const toMondayFirst = (d: Date) => (d.getDay() + 6) % 7
  const daySchedule = date ? schedule.filter(s => s.isActive && s.dayOfWeek === toMondayFirst(date)) : []
  const slots       = useMemo(() => daySchedule.flatMap(s => genSlots(s.startTime, s.endTime, duration)), [date, duration])

  function isAvailable(d: Date) { return d > today && activeDays.has(toMondayFirst(d)) }
  function prevMonth() { if (calMonth === 0) { setCalYear(y => y-1); setCalMonth(11) } else setCalMonth(m => m-1) }
  function nextMonth() { if (calMonth === 11) { setCalYear(y => y+1); setCalMonth(0) } else setCalMonth(m => m+1) }

  const confirmAndPay = async () => {
    if (!service) { setError("Избери услуга"); return }
    if (!date || !slot) { setError("Избери дата и час"); return }
    setSaving(true); setError("")
    const [h, m] = slot.split(":").map(Number)
    const dt = new Date(date); dt.setHours(h, m, 0, 0)
    try {
      // 1. Create appointment
      const res = await fetch(apiUrl("/api/appointments"), {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vetId, serviceId: service?.id, date: dt.toISOString(), petName: "Любимец", petSpecies, notes, consultationType: consultType }),
      })
      if (res.status === 401) { router.push("/login"); return }
      if (!res.ok) { const d = await res.json().catch(() => ({})); setError(d.error ?? "Грешка при запазване."); return }

      const appt = await res.json()

      // 2. For ONLINE → Stripe payment. For IN_CLINIC → done (pay at vet)
      if (consultType === "ONLINE") {
        const payRes  = await fetch(apiUrl("/api/stripe/checkout"), {
          method: "POST", credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ appointmentId: appt.id }),
        })
        const payData = await payRes.json()

        if (payData.url) {
          window.location.href = payData.url
        } else {
          setError(payData.error ?? "Грешка при плащане. Опитайте отново.")
        }
      } else {
        // In-clinic: show done screen (already CONFIRMED)
        setAppointmentId(appt.id)
        setAppointmentPrice(null) // no online payment needed
        setStep("done")
      }
    } catch { setError("Сървърна грешка.") }
    finally { setSaving(false) }
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
          {consultType === "IN_CLINIC" && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-xs text-blue-700 font-medium">
              💳 Плащането се извършва на място при ветеринара.
            </div>
          )}
          <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2 text-xs text-yellow-700">
            📬 Ако не виждате имейла, проверете папка <strong>Спам / Junk</strong>.
          </div>
        </div>
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
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">Бележки — симптоми, въпроси</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Опишете симптомите или въпросите си..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1083BD] resize-none" />
          </div>

          {error && <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>}

          <button onClick={confirmAndPay} disabled={saving}
            className="w-full py-3.5 bg-[#10B83D] hover:bg-[#0da033] text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60 transition-colors">
            {saving ? "Запазва..." : consultType === "ONLINE"
              ? `💳 Плати и запази${service?.price ? ` · ${service.price} лв.` : ""}`
              : `✓ Запази час${service?.price ? ` · ${service.price} лв. (на място)` : ""}`}
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
        <div className="flex gap-3 mt-1">
          <button onClick={() => setConsultType("IN_CLINIC")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              consultType === "IN_CLINIC"
                ? "bg-white text-[#1083BD] shadow-md"
                : "bg-white/15 text-white/80 hover:bg-white/25 border border-white/20"
            }`}>
            <MapPin className="w-4 h-4" /> На място
          </button>
          <button onClick={() => setConsultType("ONLINE")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              consultType === "ONLINE"
                ? "bg-white text-[#EF3988] shadow-md"
                : "bg-white/15 text-white/80 hover:bg-white/25 border border-white/20"
            }`}>
            <Video className="w-4 h-4" /> Онлайн
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Service selector */}
        {services.length > 0 && (
          <div className={`mb-5 rounded-2xl p-4 border-2 transition-all ${!service ? "border-[#EF3988] bg-pink-50/40" : "border-gray-100 bg-white"}`}>
            <p className="text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-1.5 ${!service ? 'text-[#EF3988]' : 'text-gray-400'}">
              <Stethoscope className={`w-3.5 h-3.5 ${!service ? "text-[#EF3988]" : "text-gray-400"}`} />
              <span className={!service ? "text-[#EF3988]" : "text-gray-400"}>
                {!service ? "👆 Изберете услуга за да продължите" : "✓ Избрана услуга"}
              </span>
            </p>
            <div className="grid grid-cols-1 gap-2">
              {services.map(s => (
                <button key={s.id} onClick={() => setService(s)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                    service?.id === s.id
                      ? "bg-[#1083BD] text-white border-[#1083BD] shadow-sm"
                      : "border-gray-200 text-gray-700 hover:border-[#1083BD] hover:bg-blue-50/50"
                  }`}>
                  <span>{s.name}</span>
                  <span className={service?.id === s.id ? "text-white/80" : "text-[#1083BD] font-bold"}>{s.price} лв.</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Calendar + Slots side by side */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Calendar — 3/5 */}
          <div className="md:col-span-3">
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
                    className={`h-11 w-full rounded-xl text-sm font-semibold transition-colors
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

          {/* Time slots — 2/5 */}
          <div className="md:col-span-2 flex flex-col">
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
                      <button key={s} onClick={() => { setSlot(s); setStep("confirm") }}
                        className="py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:border-[#1083BD] hover:bg-[#1083BD] hover:text-white transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
