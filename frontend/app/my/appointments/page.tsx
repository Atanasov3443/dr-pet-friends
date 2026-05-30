"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarDays, Star, X } from "lucide-react"
import Link from "next/link"
import { EventManager, type Event as CalEvent } from "@/components/ui/event-manager"
import { apiUrl } from "@/lib/api"

const MONTHS = ["Яну","Фев","Мар","Апр","Май","Юни","Юли","Авг","Сеп","Окт","Ное","Дек"]

const statusLabel: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Чакаща",     color: "bg-yellow-50 text-yellow-700 border-yellow-100" },
  CONFIRMED: { label: "Потвърдена", color: "bg-green-50 text-green-700 border-green-100"   },
  CANCELLED: { label: "Отказана",   color: "bg-red-50 text-red-700 border-red-100"         },
  COMPLETED: { label: "Завършена",  color: "bg-gray-100 text-gray-600 border-gray-200"     },
}

function ReviewModal({ vetId, vetName, onClose, onSaved }: { vetId: string; vetName: string; onClose: () => void; onSaved: () => void }) {
  const [rating, setRating]   = useState(5)
  const [comment, setComment] = useState("")
  const [saving, setSaving]   = useState(false)
  const [hover, setHover]     = useState(0)

  const submit = async () => {
    setSaving(true)
    await fetch(apiUrl("/api/reviews"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ vetId, rating, comment }),
    })
    setSaving(false)
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
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
        <textarea
          value={comment} onChange={e => setComment(e.target.value)}
          placeholder="Споделете опита си (по желание)..."
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1083BD] mb-4"
        />
        <button onClick={submit} disabled={saving}
          className="w-full py-2.5 bg-[#1083BD] text-white rounded-xl text-sm font-bold disabled:opacity-50">
          {saving ? "Изпраща..." : "Изпрати отзив"}
        </button>
      </div>
    </div>
  )
}

export default function MyAppointmentsPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading]           = useState(true)
  const [tab, setTab]                   = useState<"upcoming" | "past">("upcoming")
  const [reviewTarget, setReviewTarget] = useState<{ vetId: string; vetName: string } | null>(null)
  const [reviewed, setReviewed]         = useState<Set<string>>(new Set())

  const load = () => {
    setLoading(true)
    fetch(apiUrl("/api/my/appointments"), { credentials: "include" }).then(r => r.json()).then(data => {
      setAppointments(Array.isArray(data) ? data : [])
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  const now = new Date()
  const upcoming = appointments.filter(a => new Date(a.date) >= now && a.status !== "CANCELLED")
  const past     = appointments.filter(a => new Date(a.date) < now  || a.status === "CANCELLED")
  const list = tab === "upcoming" ? upcoming : past

  const statusColor: Record<string, string> = {
    PENDING: "orange", CONFIRMED: "green", CANCELLED: "red", COMPLETED: "blue",
  }

  const calendarEvents: CalEvent[] = appointments.map((a: any) => {
    const start = new Date(a.date)
    const end   = new Date(start.getTime() + 60 * 60 * 1000)
    return {
      id:          a.id,
      title:       a.vet?.displayName ?? "Час",
      description: a.pet?.name ? `🐾 ${a.pet.name}${a.service ? " · " + a.service.name : ""}` : undefined,
      startTime:   start,
      endTime:     end,
      color:       statusColor[a.status] ?? "blue",
      category:    a.vet?.specialty,
    }
  })

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Моите часове</h1>

      {/* Calendar view */}
      <div className="mb-8">
        <EventManager
          events={calendarEvents}
          defaultView="month"
          categories={["Ветеринар", "Грийминг"]}
          availableTags={[]}
          onDateClick={(date) => {
            const iso = date.toISOString().slice(0, 10)
            router.push(`/search?date=${iso}`)
          }}
        />
      </div>

      <h2 className="text-lg font-bold text-gray-900 mb-4">Списък</h2>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-full p-1 gap-1 w-fit mb-6">
        {(["upcoming","past"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${tab === t ? "bg-white shadow text-gray-900" : "text-gray-500"}`}>
            {t === "upcoming" ? `Предстоящи (${upcoming.length})` : `Минали (${past.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Зарежда...</div>
      ) : list.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <CalendarDays className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">Нямаш {tab === "upcoming" ? "предстоящи" : "минали"} часове</p>
          {tab === "upcoming" && (
            <Link href="/search" className="mt-3 inline-block text-sm text-[#1083BD] hover:underline">
              Намери специалист →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((a: any) => {
            const d = new Date(a.date)
            const s = statusLabel[a.status] ?? statusLabel.PENDING
            const canReview = a.status === "COMPLETED" && !reviewed.has(a.vetId)
            return (
              <div key={a.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#EF3988]/10 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-[#EF3988]">{MONTHS[d.getMonth()]}</span>
                    <span className="text-lg font-black text-[#EF3988] leading-tight">{d.getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="font-semibold text-gray-900">{a.vet.displayName}</p>
                        <p className="text-xs text-gray-400">{a.vet.specialty}</p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${s.color}`}>{s.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                      <span>🐾 {a.pet.name}</span>
                      <span>🕐 {d.toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" })}</span>
                      {a.service && <span>💊 {a.service.name}</span>}
                      {a.service?.price && <span className="text-[#1083BD] font-semibold">💰 {a.service.price} лв.</span>}
                    </div>
                  </div>
                </div>
                {canReview && (
                  <button
                    onClick={() => setReviewTarget({ vetId: a.vetId, vetName: a.vet.displayName })}
                    className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-yellow-600 hover:text-yellow-700 bg-yellow-50 px-3 py-1.5 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> Остави отзив
                  </button>
                )}
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
