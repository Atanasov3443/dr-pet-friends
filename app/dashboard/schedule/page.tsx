"use client"

import { useEffect, useState } from "react"
import { Save, Plus, Trash2, Clock } from "lucide-react"

const DAYS = ["Понеделник", "Вторник", "Сряда", "Четвъртък", "Петък", "Събота", "Неделя"]
const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`)

type Slot = { id?: string; dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }

export default function SchedulePage() {
  const [slots, setSlots]   = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  useEffect(() => {
    fetch("/api/dashboard/schedule")
      .then(r => r.json())
      .then(data => {
        setSlots(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  const addSlot = (day: number) => {
    setSlots(s => [...s, { dayOfWeek: day, startTime: "09:00", endTime: "18:00", isActive: true }])
  }

  const removeSlot = (idx: number) => {
    setSlots(s => s.filter((_, i) => i !== idx))
  }

  const updateSlot = (idx: number, patch: Partial<Slot>) => {
    setSlots(s => s.map((sl, i) => i === idx ? { ...sl, ...patch } : sl))
  }

  const save = async () => {
    setSaving(true)
    await fetch("/api/dashboard/schedule", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slots }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return <div className="p-8 text-center text-gray-400">Зарежда...</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">График</h1>
          <p className="text-gray-500 text-sm mt-1">Работни часове по дни от седмицата</p>
        </div>
        <button onClick={save} disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            saved ? "bg-green-500 text-white" : "bg-[#1083BD] hover:bg-[#0d6fa0] text-white"
          } disabled:opacity-60`}>
          <Save className="w-4 h-4" />
          {saving ? "Запазва..." : saved ? "✓ Запазено!" : "Запази графика"}
        </button>
      </div>

      <div className="space-y-4 max-w-3xl">
        {DAYS.map((dayName, dayIdx) => {
          const daySlots = slots.map((sl, i) => ({ ...sl, _idx: i })).filter(sl => sl.dayOfWeek === dayIdx)

          return (
            <div key={dayName} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${daySlots.some(s => s.isActive) ? "bg-green-400" : "bg-gray-200"}`} />
                  <span className="font-semibold text-sm text-gray-900">{dayName}</span>
                  <span className="text-xs text-gray-400">
                    {daySlots.length === 0 ? "почивен" : `${daySlots.length} смян${daySlots.length > 1 ? "и" : "а"}`}
                  </span>
                </div>
                <button onClick={() => addSlot(dayIdx)}
                  className="flex items-center gap-1 text-xs text-[#1083BD] hover:text-[#0d6fa0] font-medium">
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
                        <input type="checkbox" checked={sl.isActive}
                          onChange={e => updateSlot(sl._idx, { isActive: e.target.checked })}
                          className="w-4 h-4 accent-[#1083BD]" />
                        <span className="text-xs text-gray-500">Активна</span>
                      </label>

                      <div className="flex items-center gap-2 flex-1">
                        <select value={sl.startTime}
                          onChange={e => updateSlot(sl._idx, { startTime: e.target.value })}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#1083BD] bg-white">
                          {HOURS.map(h => <option key={h}>{h}</option>)}
                        </select>
                        <span className="text-gray-400 text-sm">—</span>
                        <select value={sl.endTime}
                          onChange={e => updateSlot(sl._idx, { endTime: e.target.value })}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-[#1083BD] bg-white">
                          {HOURS.map(h => <option key={h}>{h}</option>)}
                        </select>
                      </div>

                      <button onClick={() => removeSlot(sl._idx)}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors shrink-0">
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

      <p className="text-xs text-gray-400 mt-4 max-w-3xl">
        * Може да добавиш няколко смени на един ден (напр. 09:00–13:00 и 15:00–18:00)
      </p>
    </div>
  )
}
