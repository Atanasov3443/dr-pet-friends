"use client"

import { useEffect, useState } from "react"
import { CalendarDays, Star, X, CreditCard, Clock, Video, Stethoscope, CheckCircle } from "lucide-react"
import Link from "next/link"
import { apiUrl } from "@/lib/api"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const MONTHS_BG = ["Яну","Фев","Мар","Апр","Май","Юни","Юли","Авг","Сеп","Окт","Ное","Дек"]
const DAYS_BG   = ["Нед","Пон","Вт","Ср","Чет","Пет","Съб"]

const STATUS: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  PENDING:   { label: "Чакаща",     bg: "bg-yellow-50",  text: "text-yellow-700", dot: "bg-yellow-400" },
  CONFIRMED: { label: "Потвърдена", bg: "bg-green-50",   text: "text-green-700",  dot: "bg-green-400"  },
  CANCELLED: { label: "Отказана",   bg: "bg-red-50",     text: "text-red-600",    dot: "bg-red-400"    },
  COMPLETED: { label: "Завършена",  bg: "bg-gray-100",   text: "text-gray-600",   dot: "bg-gray-400"   },
}

const SPECIES_EMOJI: Record<string, string> = {
  DOG: "🐶", CAT: "🐱", BIRD: "🦜", RABBIT: "🐰", EXOTIC: "🦎", OTHER: "🐾"
}

function ReviewModal({ vetId, vetName, onClose, onSaved }: { vetId: string; vetName: string; onClose: () => void; onSaved: () => void }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [saving, setSaving] = useState(false)
  const [hover, setHover] = useState(0)

  const submit = async () => {
    setSaving(true)
    await fetch(apiUrl("/api/reviews"), {
      method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ vetId, rating, comment }),
    })
    setSaving(false); onSaved(); onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Остави отзив</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">{vetName}</p>
        <div className="flex gap-1 mb-4">
          {[1,2,3,4,5].map(i => (
            <button key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)} onClick={() => setRating(i)}>
              <Star className={`w-8 h-8 transition-colors ${i <= (hover || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
            </button>
          ))}
        </div>
        <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Споделете опита си..."
          rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD] mb-4" />
        <button onClick={submit} disabled={saving}
          className="w-full py-2.5 bg-[#1083BD] text-white rounded-xl text-sm font-bold disabled:opacity-50">
          {saving ? "Изпраща..." : "Изпрати отзив"}
        </button>
      </div>
    </div>
  )
}

function MyAppointmentsPageInner() {
  const searchParams  = useSearchParams()
  const paymentStatus = searchParams.get("payment")
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading]           = useState(true)
  const [tab, setTab]                   = useState<"upcoming" | "past">("upcoming")
  const [reviewTarget, setReviewTarget] = useState<{ vetId: string; vetName: string } | null>(null)
  const [reviewed, setReviewed]         = useState<Set<string>>(new Set())
  const [paying, setPaying]             = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    fetch(apiUrl("/api/my/appointments"), { credentials: "include" })
      .then(r => r.ok ? r.json() : [])
      .then(data => setAppointments(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const startPayment = async (appointmentId: string) => {
    setPaying(appointmentId)
    try {
      const res  = await fetch(apiUrl("/api/stripe/checkout"), {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally { setPaying(null) }
  }

  useEffect(() => { load() }, [])

  const now           = new Date()
  const upcoming      = appointments.filter(a => new Date(a.date) >= now && a.status !== "CANCELLED")
  const past          = appointments.filter(a => new Date(a.date) < now  || a.status === "CANCELLED")
  const [calYear,  setCalYear]  = useState(now.getFullYear())
  const [calMonth, setCalMonth] = useState(now.getMonth())
  const [selDay,   setSelDay]   = useState<string | null>(null)

  const apptDays = new Set(appointments.map(a => new Date(a.date).toDateString()))

  const calCells = (() => {
    const first   = new Date(calYear, calMonth, 1)
    const last    = new Date(calYear, calMonth + 1, 0)
    const pad     = (first.getDay() + 6) % 7
    const cells: (Date|null)[] = []
    for (let i = 0; i < pad; i++) cells.push(null)
    for (let d = 1; d <= last.getDate(); d++) cells.push(new Date(calYear, calMonth, d))
    return cells
  })()

  const baseList  = tab === "upcoming" ? upcoming : past
  const list      = selDay ? baseList.filter(a => new Date(a.date).toDateString() === selDay) : baseList

  const MONTHS_FULL = ["Януари","Февруари","Март","Април","Май","Юни","Юли","Август","Септември","Октомври","Ноември","Декември"]
  const DAYS_SHORT  = ["Пн","Вт","Ср","Чт","Пт","Сб","Нд"]

  return (
    <div className="p-6 md:p-8 max-w-3xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Моите часове</h1>
          <p className="text-gray-400 text-sm mt-0.5">Всички ваши резервации</p>
        </div>
        <Link href="/search"
          className="flex items-center gap-2 bg-[#EF3988] hover:bg-[#d42f77] text-white text-sm font-bold rounded-full px-5 py-2.5 transition-colors">
          <CalendarDays className="w-4 h-4" /> Запази нов час
        </Link>
      </div>

      {/* Payment success banner */}
      {paymentStatus === "success" && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex gap-3 items-start">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-green-800 text-sm">Плащането е успешно! Часът е потвърден.</p>
            <p className="text-green-700 text-xs mt-1">
              Ще получите имейл с потвърждение.{" "}
              <span className="font-medium">Ако не го виждате, проверете папка Спам / Junk.</span>
            </p>
          </div>
        </div>
      )}

      {/* Mini Calendar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => { if (calMonth === 0) { setCalYear(y=>y-1); setCalMonth(11) } else setCalMonth(m=>m-1) }}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">‹</button>
          <span className="font-bold text-gray-900 text-sm">{MONTHS_FULL[calMonth]} {calYear}</span>
          <button onClick={() => { if (calMonth === 11) { setCalYear(y=>y+1); setCalMonth(0) } else setCalMonth(m=>m+1) }}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">›</button>
        </div>
        <div className="grid grid-cols-7 mb-1">
          {DAYS_SHORT.map(d => <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {calCells.map((d, i) => {
            if (!d) return <div key={i} />
            const key      = d.toDateString()
            const hasAppt  = apptDays.has(key)
            const isToday  = key === now.toDateString()
            const isSel    = selDay === key
            return (
              <button key={i} onClick={() => setSelDay(isSel ? null : key)}
                className={`relative h-9 w-full rounded-lg text-xs font-semibold transition-colors
                  ${isSel ? "bg-[#EF3988] text-white" : isToday ? "bg-[#1083BD]/10 text-[#1083BD]" : "hover:bg-gray-50 text-gray-700"}`}>
                {d.getDate()}
                {hasAppt && !isSel && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#EF3988]" />
                )}
              </button>
            )
          })}
        </div>
        {selDay && (
          <button onClick={() => setSelDay(null)} className="mt-3 text-xs text-gray-400 hover:text-gray-600 w-full text-center">
            × Изчисти избора
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Предстоящи", value: upcoming.length, color: "text-[#1083BD]" },
          { label: "Завършени",  value: appointments.filter(a => a.status === "COMPLETED").length, color: "text-green-600" },
          { label: "Отказани",   value: appointments.filter(a => a.status === "CANCELLED").length, color: "text-red-400" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <p className={`font-black text-2xl ${s.color}`}>{s.value}</p>
            <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-full p-1 gap-1 w-fit mb-6">
        {(["upcoming","past"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${tab === t ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
            {t === "upcoming" ? `Предстоящи (${upcoming.length})` : `Минали (${past.length})`}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <CalendarDays className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">Нямаш {tab === "upcoming" ? "предстоящи" : "минали"} часове</p>
          {tab === "upcoming" && (
            <Link href="/search" className="mt-3 inline-block text-sm text-[#EF3988] font-semibold hover:underline">
              Намери специалист →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((a: any) => {
            const d         = new Date(a.date)
            const s         = STATUS[a.status] ?? STATUS.PENDING
            const canReview  = a.status === "COMPLETED" && !reviewed.has(a.vetId)
            const canPay     = (a.status === "PENDING" || a.status === "CONFIRMED") && (a.price ?? a.service?.price)
            const isOnline   = a.consultationType === "ONLINE"
            const canJoin    = isOnline && a.status === "CONFIRMED" && a.meetLink

            return (
              <div key={a.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex gap-4">

                    {/* Date block */}
                    <div className="w-14 h-14 rounded-xl bg-[#EF3988]/10 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-[#EF3988] uppercase">{MONTHS_BG[d.getMonth()]}</span>
                      <span className="text-xl font-black text-[#EF3988] leading-tight">{d.getDate()}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-gray-900">{a.vet?.displayName}</p>
                            {isOnline && (
                              <span className="flex items-center gap-1 text-xs bg-blue-50 text-[#1083BD] px-2 py-0.5 rounded-full font-medium">
                                <Video className="w-3 h-3" /> Онлайн
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">{a.vet?.specialty}</p>
                        </div>
                        <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${s.bg} ${s.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {DAYS_BG[d.getDay()]} · {d.toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {a.pet && (
                          <span className="flex items-center gap-1">
                            {SPECIES_EMOJI[a.pet.species] ?? "🐾"} {a.pet.name}
                          </span>
                        )}
                        {a.service && (
                          <span className="flex items-center gap-1">
                            <Stethoscope className="w-3 h-3" /> {a.service.name}
                          </span>
                        )}
                        {(a.price ?? a.service?.price) && (
                          <span className="font-semibold text-[#1083BD]">{a.price ?? a.service?.price} лв.</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {(canPay || canReview || canJoin) && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-50">
                      {canJoin && (
                        <a href={a.meetLink} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#1083BD] hover:bg-[#0d6fa0] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer">
                          <Video className="w-3.5 h-3.5" /> Влез в онлайн срещата
                        </a>
                      )}
                      {canPay && (
                        <button onClick={() => startPayment(a.id)} disabled={paying === a.id}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#10B83D] hover:bg-[#0da033] disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer">
                          <CreditCard className="w-3.5 h-3.5" />
                          {paying === a.id ? "Зарежда..." : `Плати ${a.price ?? a.service?.price} лв.`}
                        </button>
                      )}
                      {canReview && (
                        <button onClick={() => setReviewTarget({ vetId: a.vetId, vetName: a.vet?.displayName })}
                          className="flex items-center gap-1.5 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-xl text-xs font-bold transition-colors hover:bg-yellow-100 cursor-pointer">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> Остави отзив
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {reviewTarget && (
        <ReviewModal
          vetId={reviewTarget.vetId}
          vetName={reviewTarget.vetName}
          onClose={() => setReviewTarget(null)}
          onSaved={() => setReviewed(prev => new Set([...prev, reviewTarget!.vetId]))}
        />
      )}
    </div>
  )
}

export default function MyAppointmentsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-400">Зарежда...</div>}>
      <MyAppointmentsPageInner />
    </Suspense>
  )
}
