"use client"

import { apiUrl } from "@/lib/api"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { CalendarDays, Clock, Star, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

type Appointment = {
  id: string; date: string; status: string
  owner: { name: string | null }
  pet:   { name: string; species: string }
  service: { name: string } | null
}

type VetProfile = {
  id: string; displayName: string; specialty: string; rating: number
  reviewCount: number; experience: number; isActive: boolean
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [profile, setProfile]           = useState<VetProfile | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(apiUrl("/api/dashboard/profile"), { credentials: "include" }).then(r => r.json()),
      fetch(apiUrl("/api/dashboard/appointments?upcoming=true&limit=5"), { credentials: "include" }).then(r => r.json()),
    ]).then(([prof, appts]) => {
      setProfile(prof.vet ?? null)
      setAppointments(Array.isArray(appts) ? appts : [])
      setLoading(false)
    })
  }, [])

  const statusLabel: Record<string, { label: string; color: string }> = {
    PENDING:   { label: "Чакаща",     color: "bg-yellow-50 text-yellow-700" },
    CONFIRMED: { label: "Потвърдена", color: "bg-green-50 text-green-700"   },
    CANCELLED: { label: "Отказана",   color: "bg-red-50 text-red-700"       },
    COMPLETED: { label: "Завършена",  color: "bg-gray-100 text-gray-600"    },
  }

  if (loading) return <div className="p-8 text-center text-gray-400">Зарежда...</div>

  if (!profile) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#1083BD]/10 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-[#1083BD]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Профилът не е настроен</h2>
          <p className="text-gray-500 text-sm mb-6">Попълни профила си, за да можеш да приемаш резервации.</p>
          <Link href="/dashboard/profile"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1083BD] text-white rounded-xl text-sm font-medium hover:bg-[#0d6fa0] transition-colors">
            Попълни профила <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Здравей, {profile.displayName} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">{profile.specialty}</p>
        </div>
        {profile.id && (
          <Link href={`/vet/${profile.id}`} target="_blank"
            className="flex items-center gap-1.5 text-sm text-[#1083BD] hover:underline bg-[#1083BD]/5 px-3 py-1.5 rounded-lg border border-[#1083BD]/20">
            <ArrowRight className="w-3.5 h-3.5" /> Виж публичния профил
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Рейтинг",    value: profile.rating.toFixed(1), icon: Star,        color: "bg-yellow-50 text-yellow-600" },
          { label: "Отзиви",     value: profile.reviewCount,       icon: Users,       color: "bg-blue-50 text-[#1083BD]"   },
          { label: "Опит (год)", value: profile.experience,        icon: Clock,       color: "bg-purple-50 text-purple-600"},
          { label: "Статус",     value: profile.isActive ? "Активен" : "Неактивен", icon: CalendarDays, color: profile.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Предстоящи резервации</h2>
          <Link href="/dashboard/appointments"
            className="text-sm text-[#1083BD] hover:underline flex items-center gap-1">
            Всички <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {appointments.length === 0 ? (
          <p className="text-gray-400 text-sm">Няма предстоящи резервации.</p>
        ) : (
          <div className="space-y-3">
            {appointments.map(a => {
              const s = statusLabel[a.status] ?? statusLabel.PENDING
              return (
                <div key={a.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-10 h-10 rounded-xl bg-[#1083BD]/10 flex items-center justify-center shrink-0">
                    <CalendarDays className="w-5 h-5 text-[#1083BD]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {a.owner.name ?? "Собственик"} — {a.pet.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(a.date).toLocaleDateString("bg-BG", { weekday: "long", day: "numeric", month: "long" })}
                      {" · "}
                      {new Date(a.date).toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" })}
                      {a.service && ` · ${a.service.name}`}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.color}`}>
                    {s.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
