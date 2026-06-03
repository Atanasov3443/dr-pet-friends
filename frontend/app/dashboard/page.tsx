"use client"

import { apiUrl } from "@/lib/api"
import { useEffect, useState } from "react"
import { CalendarDays, Clock, Star, Users, ArrowRight, CheckCircle, XCircle, ChevronRight, FileText, BarChart2 } from "lucide-react"
import Link from "next/link"

type Appointment = {
  id: string; date: string; status: string
  owner: { name: string | null }
  pet:   { name: string; species: string }
  service: { name: string; price: number } | null
}

type VetProfile = {
  id: string; displayName: string; specialty: string; rating: number
  reviewCount: number; experience: number; isActive: boolean
}

const SPECIES_EMOJI: Record<string, string> = { DOG:"🐶", CAT:"🐱", BIRD:"🦜", RABBIT:"🐰", EXOTIC:"🦎", OTHER:"🐾" }

const STATUS: Record<string, { label: string; bg: string; text: string }> = {
  PENDING:   { label: "Чакаща",     bg: "bg-amber-100",  text: "text-amber-700"  },
  CONFIRMED: { label: "Потвърдена", bg: "bg-green-100",  text: "text-green-700"  },
  CANCELLED: { label: "Отказана",   bg: "bg-red-100",    text: "text-red-600"    },
  COMPLETED: { label: "Завършена",  bg: "bg-gray-100",   text: "text-gray-500"   },
}

const MONTHS_SHORT = ["Яну","Фев","Мар","Апр","Май","Юни","Юли","Авг","Сеп","Окт","Ное","Дек"]

export default function DashboardPage() {
  const [profile,      setProfile]      = useState<VetProfile | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(apiUrl("/api/dashboard/profile"), { credentials: "include" }).then(r => r.json()).catch(() => ({})),
      fetch(apiUrl("/api/dashboard/appointments?upcoming=true&limit=10"), { credentials: "include" }).then(r => r.json()).catch(() => []),
    ]).then(([prof, appts]) => {
      setProfile(prof.vet ?? null)
      setAppointments(Array.isArray(appts) ? appts : [])
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[300px]">
      <div className="text-center text-gray-400">
        <div className="w-8 h-8 border-2 border-[#1083BD] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Зарежда...
      </div>
    </div>
  )

  if (!profile) return (
    <div className="p-8 flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#1083BD]/10 flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-[#1083BD]" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Профилът не е настроен</h2>
        <p className="text-gray-500 text-sm mb-6">Попълни профила си, за да можеш да приемаш резервации.</p>
        <Link href="/dashboard/profile" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1083BD] text-white rounded-xl text-sm font-medium hover:bg-[#0d6fa0] transition-colors">
          Попълни профила <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )

  const today     = new Date(); today.setHours(0,0,0,0)
  const tomorrow  = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1)
  const todayAppts    = appointments.filter(a => { const d = new Date(a.date); d.setHours(0,0,0,0); return d.getTime() === today.getTime() })
  const tomorrowAppts = appointments.filter(a => { const d = new Date(a.date); d.setHours(0,0,0,0); return d.getTime() === tomorrow.getTime() })
  const pending   = appointments.filter(a => a.status === "PENDING").length

  return (
    <div className="p-6 md:p-8 max-w-4xl space-y-6">

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#1083BD] to-[#0D67F7] rounded-3xl p-6 overflow-hidden">
        <div className="absolute right-0 top-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-white/70 text-sm mb-1">Добре дошъл,</p>
            <h1 className="text-white font-black text-2xl">{profile.displayName}</h1>
            <p className="text-white/70 text-sm mt-1">{profile.specialty}</p>
          </div>
          <Link href={`/vet/${profile.id}`} target="_blank"
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors border border-white/20">
            Публичен профил <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Stats in hero */}
        <div className="relative grid grid-cols-4 gap-3 mt-5">
          {[
            { label: "Рейтинг",    value: profile.rating.toFixed(1) + "★" },
            { label: "Отзиви",     value: profile.reviewCount },
            { label: "Опит",       value: profile.experience + " г." },
            { label: "Статус",     value: profile.isActive ? "Активен" : "Неактивен" },
          ].map(s => (
            <div key={s.label} className="bg-white/10 rounded-2xl p-3 text-center backdrop-blur-sm">
              <p className="text-white font-black text-lg">{s.value}</p>
              <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Днес",       value: todayAppts.length,    color: "text-[#1083BD]",  bg: "bg-blue-50",   href: "/dashboard/appointments" },
          { label: "Утре",       value: tomorrowAppts.length, color: "text-purple-600", bg: "bg-purple-50", href: "/dashboard/appointments" },
          { label: "Чакащи",     value: pending,              color: "text-amber-600",  bg: "bg-amber-50",  href: "/dashboard/appointments" },
          { label: "Предстоящи", value: appointments.length,  color: "text-green-600",  bg: "bg-green-50",  href: "/dashboard/appointments" },
        ].map(s => (
          <Link key={s.label} href={s.href}
            className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:shadow-md transition-shadow">
            <p className={`font-black text-2xl ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Pending appointments alert */}
      {pending > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-amber-800 text-sm">Имате {pending} чакащ{pending === 1 ? "а" : "и"} резервацi{pending === 1 ? "я" : "и"}</p>
            <p className="text-amber-700 text-xs">Потвърдете или откажете своевременно</p>
          </div>
          <Link href="/dashboard/appointments" className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:underline shrink-0">
            Прегледай <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Today's schedule */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1083BD]/10 flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-[#1083BD]" />
            </div>
            Предстоящи резервации
          </h2>
          <Link href="/dashboard/appointments" className="flex items-center gap-1 text-xs font-semibold text-[#1083BD] hover:underline">
            Всички <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12 px-6">
            <CalendarDays className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm mb-4">Нямате предстоящи резервации</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {appointments.slice(0, 5).map((a, idx) => {
              const d = new Date(a.date)
              const s = STATUS[a.status] ?? STATUS.PENDING
              const isToday = d.setHours(0,0,0,0) === today.getTime()
              return (
                <div key={a.id} className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors ${idx === 0 && isToday ? "bg-blue-50/20" : ""}`}>
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 ${isToday ? "bg-[#1083BD] text-white" : "bg-gray-50"}`}>
                    <span className={`text-[9px] font-bold uppercase ${isToday ? "text-white/70" : "text-gray-400"}`}>{MONTHS_SHORT[d.getMonth()]}</span>
                    <span className={`text-base font-black leading-tight ${isToday ? "text-white" : "text-gray-800"}`}>{new Date(a.date).getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">{a.owner.name ?? "Собственик"}</p>
                      {isToday && idx === 0 && <span className="text-[10px] font-bold bg-blue-100 text-[#1083BD] px-1.5 py-0.5 rounded-full">Днес</span>}
                    </div>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <span>{SPECIES_EMOJI[a.pet?.species] ?? "🐾"} {a.pet?.name}</span>
                      <span>·</span>
                      <span>{new Date(a.date).toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" })}</span>
                      {a.service && <><span>·</span><span>{a.service.name}</span></>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>{s.label}</span>
                    {a.status === "PENDING" && (
                      <Link href="/dashboard/appointments" className="w-7 h-7 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center transition-colors" title="Потвърди">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { href: "/dashboard/medical-records", icon: FileText,     label: "Медицински записи", bg: "bg-purple-500" },
          { href: "/dashboard/finance",         icon: BarChart2,    label: "Финанси",           bg: "bg-green-500"  },
          { href: "/dashboard/schedule",        icon: CalendarDays, label: "График",            bg: "bg-[#F97316]"  },
        ].map(({ href, icon: Icon, label, bg }) => (
          <Link key={href} href={href}
            className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col items-center gap-2.5 hover:shadow-md transition-shadow text-center">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-600">{label}</span>
          </Link>
        ))}
      </div>

    </div>
  )
}
