"use client"

import { apiUrl } from "@/lib/api"
import { useEffect, useState, useMemo } from "react"
import { Save, Plus, Trash2, Clock, ChevronLeft, ChevronRight, XCircle } from "lucide-react"

const DAYS     = ["Понеделник","Вторник","Сряда","Четвъртък","Петък","Събота","Неделя"]
const DAYS_SHORT = ["Пн","Вт","Ср","Чт","Пт","Сб","Нд"]
const MONTHS   = ["Януари","Февруари","Март","Април","Май","Юни","Юли","Август","Септември","Октомври","Ноември","Декември"]
const HOURS    = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`)

type Slot        = { id?: string; dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }
type Unavailable = { id: string; date: string; reason: string | null }
type Appt = { id: string; date: string; status: string; owner: { name: string | null }; pet: { name: string } }

export default function SchedulePage() {
  const [slots,        setSlots]        = useState<Slot[]>([])
  const [appts,        setAppts]        = useState<Appt[]>([])
  const [unavailable,  setUnavailable]  = useState<Unavailable[]>([])
  const [unavailDate,  setUnavailDate]  = useState("")
  const [unavailReason,setUnavailReason]= useState("")
  const [loading,      setLoading]      = useState(true)
  const [saving,   setSaving]  = useState(false)
  const [saved,    setSaved]   = useState(false)
  const [calYear,  setCalYear]  = useState(new Date().getFullYear())
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [selDay,   setSelDay]   = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch(apiUrl("/api/dashboard/schedule"), { credentials: "include" }).then(r => r.json()),
      fetch(apiUrl("/api/dashboard/appointments"), { credentials: "include" }).then(r => r.json()),
      fetch(apiUrl("/api/dashboard/unavailability"), { credentials: "include" }).then(r => r.json()),
    ]).then(([sc, ap, un]) => {
      setSlots(Array.isArray(sc) ? sc : [])
      setAppts(Array.isArray(ap) ? ap : [])
      setUnavailable(Array.isArray(un) ? un : [])
      setLoading(false)
    })
  }, [])

  const addSlot    = (day: number) => setSlots(s => [...s, { dayOfWeek: day, startTime: "09:00", endTime: "18:00", isActive: true }])
  const removeSlot = (idx: number) => setSlots(s => s.filter((_, i) => i !== idx))
  const updateSlot = (idx: number, patch: Partial<Slot>) => setSlots(s => s.map((sl, i) => i === idx ? { ...sl, ...patch } : sl))

  const save = async () => {
    setSaving(true)
    const res = await fetch(apiUrl("/api/dashboard/schedule"), {
      credentials: "include", method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slots }),
    })
    setSaving(false)
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    else alert("Грешка при запазване. Опитайте отново.")
  }

  // Calendar helpers
  const activeWeekDays = useMemo(() => new Set(slots.filter(s => s.isActive).map(s => s.dayOfWeek)), [slots])

  const apptDays = useMemo(() => {
    const map: Record<string, Appt[]> = {}
    appts.forEach(a => {
      const key = new Date(a.date).toDateString()
      if (!map[key]) map[key] = []
      map[key].push(a)
    })
    return map
  }, [appts])

  const calCells = useMemo(() => {
    const first = new Date(calYear, calMonth, 1)
    const last  = new Date(calYear, calMonth + 1, 0)
    const pad   = (first.getDay() + 6) % 7
    const cells: (Date|null)[] = []
    for (let i = 0; i < pad; i++) cells.push(null)
    for (let d = 1; d <= last.getDate(); d++) cells.push(new Date(calYear, calMonth, d))
    return cells
  }, [calYear, calMonth])

  const today    = new Date(); today.setHours(0,0,0,0)
  const selAppts = selDay ? (apptDays[selDay] ?? []) : []

  if (loading) return <div className="p-8 text-center text-gray-400">Зарежда...</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">График</h1>
          <p className="text-gray-500 text-sm mt-1">Работни часове и резервации</p>
        </div>
        <button onClick={save} disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${saved ? "bg-green-500 text-white" : "bg-[#1083BD] hover:bg-[#0d6fa0] text-white"} disabled:opacity-60`}>
          <Save className="w-4 h-4" />
          {saving ? "Запазва..." : saved ? "✓ Запазено!" : "Запази графика"}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">

        {/* Monthly calendar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => { if (calMonth === 0) { setCalYear(y=>y-1); setCalMonth(11) } else setCalMonth(m=>m-1) }}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
            <span className="font-bold text-gray-900">{MONTHS[calMonth]} {calYear}</span>
            <button onClick={() => { if (calMonth === 11) { setCalYear(y=>y+1); setCalMonth(0) } else setCalMonth(m=>m+1) }}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {DAYS_SHORT.map(d => <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1">{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {calCells.map((d, i) => {
              if (!d) return <div key={i} />
              const weekDay    = (d.getDay() + 6) % 7
              const isActive   = activeWeekDays.has(weekDay)
              const key        = d.toDateString()
              const dayAppts   = apptDays[key] ?? []
              const isToday    = d.toDateString() === today.toDateString()
              const isSel      = selDay === key
              const isPast     = d < today
              const isUnavail  = unavailable.some(u => new Date(u.date).toDateString() === key)

              return (
                <button key={i}
                  disabled={isUnavail}
                  onClick={() => !isUnavail && setSelDay(isSel ? null : key)}
                  title={isUnavail ? (unavailable.find(u => new Date(u.date).toDateString() === key)?.reason ?? "Неработен ден") : undefined}
                  className={`relative h-10 w-full rounded-lg text-xs font-semibold transition-colors flex flex-col items-center justify-center gap-0.5
                    ${isUnavail ? "bg-red-50 text-red-300 cursor-not-allowed line-through"
                    : isSel ? "bg-[#1083BD] text-white"
                    : isToday ? "ring-2 ring-[#1083BD] text-[#1083BD]"
                    : isActive && !isPast ? "bg-blue-50 text-[#1083BD] hover:bg-blue-100"
                    : "text-gray-400"}`}>
                  <span>{d.getDate()}</span>
                  {dayAppts.length > 0 && !isUnavail && (
                    <span className={`w-1 h-1 rounded-full ${isSel ? "bg-white" : "bg-[#EF3988]"}`} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-gray-50 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-50 border border-blue-200" /> Работен</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-50 border border-red-200" /> Неработен</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#EF3988]" /> Резервации</span>
          </div>
        </div>

        {/* Day detail */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          {!selDay ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <Clock className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm text-gray-400">Избери ден от календара<br />за да видиш резервациите</p>
            </div>
          ) : (
            <>
              <h3 className="font-bold text-gray-900 mb-1">{new Date(selDay).toLocaleDateString("bg-BG", { weekday:"long", day:"numeric", month:"long" })}</h3>
              {selAppts.length === 0 ? (
                <p className="text-sm text-gray-400 py-4">Няма резервации за този ден</p>
              ) : (
                <div className="space-y-2 mt-3">
                  {selAppts.map(a => (
                    <div key={a.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
                      <div className="w-2 h-2 rounded-full bg-[#1083BD] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{a.owner?.name ?? "—"}</p>
                        <p className="text-xs text-gray-400">{a.pet?.name} · {new Date(a.date).toLocaleTimeString("bg-BG", { hour:"2-digit", minute:"2-digit" })}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        a.status === "CONFIRMED" ? "bg-green-50 text-green-700"
                        : a.status === "CANCELLED" ? "bg-red-50 text-red-600"
                        : "bg-yellow-50 text-yellow-700"}`}>
                        {a.status === "CONFIRMED" ? "Потвърдена" : a.status === "CANCELLED" ? "Отказана" : "Чакаща"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Unavailability — days off */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 max-w-3xl">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-400" /> Неработни дни (отпуск, болничен)
        </h3>
        <div className="flex gap-3 mb-4 flex-wrap">
          <input type="date" value={unavailDate} onChange={e => setUnavailDate(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1083BD]" />
          <input value={unavailReason} onChange={e => setUnavailReason(e.target.value)}
            placeholder="Причина (отпуск, болничен...)"
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#1083BD]" />
          <button onClick={async () => {
            if (!unavailDate) return
            const res = await fetch(apiUrl("/api/dashboard/unavailability"), {
              method: "POST", credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ date: unavailDate, reason: unavailReason }),
            })
            if (res.ok) {
              const d = await res.json()
              setUnavailable(u => [...u.filter(x => x.date.slice(0,10) !== unavailDate), d].sort((a,b) => a.date.localeCompare(b.date)))
              setUnavailDate(""); setUnavailReason("")
            }
          }} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold transition-colors">
            + Добави
          </button>
        </div>
        {unavailable.length === 0 ? (
          <p className="text-xs text-gray-400">Няма маркирани неработни дни</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {unavailable.map(u => (
              <div key={u.id} className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-1.5 text-xs">
                <span className="font-semibold text-red-700">{new Date(u.date).toLocaleDateString("bg-BG", { day:"numeric", month:"short" })}</span>
                {u.reason && <span className="text-red-500">{u.reason}</span>}
                <button onClick={async () => {
                  await fetch(apiUrl("/api/dashboard/unavailability"), {
                    method: "DELETE", credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ date: u.date }),
                  })
                  setUnavailable(prev => prev.filter(x => x.id !== u.id))
                }} className="text-red-400 hover:text-red-600 ml-1">×</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly schedule */}
      <div className="space-y-3 max-w-3xl">
        <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide text-gray-400">Седмичен график</h2>
        {DAYS.map((dayName, dayIdx) => {
          const daySlots = slots.map((sl, i) => ({ ...sl, _idx: i })).filter(sl => sl.dayOfWeek === dayIdx)
          return (
            <div key={dayName} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${daySlots.some(s => s.isActive) ? "bg-green-400" : "bg-gray-200"}`} />
                  <span className="font-semibold text-sm text-gray-900">{dayName}</span>
                  <span className="text-xs text-gray-400">{daySlots.length === 0 ? "почивен" : `${daySlots.length} смян${daySlots.length > 1 ? "и" : "а"}`}</span>
                </div>
                <button onClick={() => addSlot(dayIdx)} className="flex items-center gap-1 text-xs text-[#1083BD] hover:text-[#0d6fa0] font-medium">
                  <Plus className="w-3.5 h-3.5" /> Добави смяна
                </button>
              </div>
              {daySlots.length === 0 ? (
                <div className="px-5 py-4 text-sm text-gray-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Почивен ден — без резервации
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {daySlots.map(sl => (
                    <div key={sl._idx} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                      <label className="flex items-center gap-2 shrink-0">
                        <input type="checkbox" checked={sl.isActive} onChange={e => updateSlot(sl._idx, { isActive: e.target.checked })} className="w-4 h-4 accent-[#1083BD]" />
                        <span className="text-xs text-gray-500">Активна</span>
                      </label>
                      <div className="flex items-center gap-2 flex-1">
                        <select value={sl.startTime} onChange={e => updateSlot(sl._idx, { startTime: e.target.value })} className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#1083BD] bg-white">
                          {HOURS.map(h => <option key={h}>{h}</option>)}
                        </select>
                        <span className="text-gray-400 text-sm">—</span>
                        <select value={sl.endTime} onChange={e => updateSlot(sl._idx, { endTime: e.target.value })} className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#1083BD] bg-white">
                          {HOURS.map(h => <option key={h}>{h}</option>)}
                        </select>
                      </div>
                      <button onClick={() => removeSlot(sl._idx)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      <p className="text-xs text-gray-400 mt-4 max-w-3xl">* Може да добавиш няколко смени на един ден (напр. 09:00–13:00 и 15:00–18:00)</p>
    </div>
  )
}
