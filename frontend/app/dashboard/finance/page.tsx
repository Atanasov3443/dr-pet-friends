"use client"

import { apiUrl } from "@/lib/api"

import { useEffect, useState } from "react"
import { TrendingUp, CalendarDays, CheckCircle2, XCircle, Clock, BarChart2 } from "lucide-react"

type Stats = {
  totalRevenue:   number
  totalCompleted: number
  totalAll:       number
  cancelled:      number
  pending:        number
  confirmed:      number
  revenueByDay:   Record<string, number>
  topServices:    { name: string; count: number; revenue: number }[]
  recentCompleted: {
    id: string; date: string; price: number | null
    pet:   { name: string; species: string }
    owner: { name: string | null }
    service: { name: string } | null
  }[]
}

const SPECIES_EMOJI: Record<string, string> = {
  DOG: "🐶", CAT: "🐱", BIRD: "🐦", RABBIT: "🐰", EXOTIC: "🦎", OTHER: "🐾"
}

const PERIODS = [
  { v: "month", l: "Този месец" },
  { v: "year",  l: "Тази година" },
  { v: "all",   l: "Всичко" },
]

export default function FinancePage() {
  const [stats,   setStats]   = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [period,  setPeriod]  = useState("month")

  useEffect(() => {
    setLoading(true)
    fetch(apiUrl(`/api/dashboard/stats?period=${period}`), { credentials: "include" })
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [period])

  // Build a simple bar chart from revenueByDay (last 14 days)
  const chartDays = stats ? (() => {
    const entries = Object.entries(stats.revenueByDay).sort((a, b) => a[0].localeCompare(b[0])).slice(-14)
    const max = Math.max(...entries.map(e => e[1]), 1)
    return entries.map(([day, rev]) => ({ day, rev, pct: rev / max }))
  })() : []

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Финанси</h1>
          <p className="text-gray-500 text-sm mt-1">Приходи и статистики</p>
        </div>
        <div className="flex gap-1 sm:ml-auto">
          {PERIODS.map(p => (
            <button key={p.v} onClick={() => setPeriod(p.v)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                period === p.v ? "bg-[#1083BD] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-[#1083BD]"
              }`}>
              {p.l}
            </button>
          ))}
        </div>
      </div>

      {loading || !stats ? (
        <div className="text-center py-16 text-gray-400">Зарежда...</div>
      ) : (
        <div className="space-y-6">

          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-[#10B83D]" />
                <span className="text-xs text-gray-400 font-medium">Приходи</span>
              </div>
              <p className="text-2xl font-black text-gray-900">{stats.totalRevenue.toFixed(0)} лв.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-[#1083BD]" />
                <span className="text-xs text-gray-400 font-medium">Завършени</span>
              </div>
              <p className="text-2xl font-black text-gray-900">{stats.totalCompleted}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span className="text-xs text-gray-400 font-medium">Предстоящи</span>
              </div>
              <p className="text-2xl font-black text-gray-900">{stats.pending + stats.confirmed}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-xs text-gray-400 font-medium">Отказани</span>
              </div>
              <p className="text-2xl font-black text-gray-900">{stats.cancelled}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Revenue chart */}
            {chartDays.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#1083BD]" /> Приходи по дни
                </h3>
                <div className="flex items-end gap-1 h-32">
                  {chartDays.map(({ day, rev, pct }) => (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div className="absolute bottom-full mb-1 hidden group-hover:flex bg-gray-800 text-white text-xs rounded px-1.5 py-0.5 whitespace-nowrap z-10">
                        {rev.toFixed(0)} лв.
                      </div>
                      <div
                        className="w-full rounded-t-md bg-[#1083BD] transition-all"
                        style={{ height: `${Math.max(pct * 100, 4)}%` }}
                      />
                      <span className="text-[9px] text-gray-400 rotate-45 origin-left translate-y-1 hidden sm:block">
                        {day.slice(5)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top services */}
            {stats.topServices.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Топ услуги</h3>
                <div className="space-y-3">
                  {stats.topServices.map((s, i) => (
                    <div key={s.name} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#1083BD]/10 text-[#1083BD] text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-gray-800 truncate">{s.name}</span>
                          <span className="text-xs text-gray-400 shrink-0">{s.count} пъти</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1 mt-1">
                          <div className="bg-[#1083BD] h-1 rounded-full"
                            style={{ width: `${(s.count / stats.topServices[0].count) * 100}%` }} />
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700 shrink-0">{s.revenue.toFixed(0)} лв.</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recent completed appointments */}
          {stats.recentCompleted.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#1083BD]" /> Последни прегледи
              </h3>
              <div className="space-y-3">
                {stats.recentCompleted.map(a => (
                  <div key={a.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <span className="text-xl">{SPECIES_EMOJI[a.pet.species] ?? "🐾"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{a.pet.name}</p>
                      <p className="text-xs text-gray-400">
                        {a.owner.name ?? "—"} · {a.service?.name ?? "Преглед"} ·{" "}
                        {new Date(a.date).toLocaleDateString("bg-BG")}
                      </p>
                    </div>
                    {a.price != null && (
                      <span className="text-sm font-bold text-[#10B83D] shrink-0">{a.price} лв.</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {stats.totalAll === 0 && (
            <div className="text-center py-12 text-gray-400">
              <BarChart2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Все още няма данни за избрания период</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
