"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { CalendarDays, PawPrint, ArrowRight, Clock } from "lucide-react"
import Link from "next/link"

const MONTHS = ["Яну","Фев","Мар","Апр","Май","Юни","Юли","Авг","Сеп","Окт","Ное","Дек"]

const statusLabel: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Чакаща",     color: "bg-yellow-50 text-yellow-700" },
  CONFIRMED: { label: "Потвърдена", color: "bg-green-50 text-green-700"  },
  CANCELLED: { label: "Отказана",   color: "bg-red-50 text-red-700"      },
  COMPLETED: { label: "Завършена",  color: "bg-gray-100 text-gray-600"   },
}

export default function MyPage() {
  const { data: session } = useSession()
  const [appointments, setAppointments] = useState<any[]>([])
  const [pets, setPets]                 = useState<any[]>([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/my/appointments?upcoming=true").then(r => r.json()),
      fetch("/api/my/pets").then(r => r.json()),
    ]).then(([appts, p]) => {
      setAppointments(Array.isArray(appts) ? appts : [])
      setPets(Array.isArray(p) ? p : [])
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="p-8 text-center text-gray-400">Зарежда...</div>

  const name = (session?.user as any)?.name ?? "там"

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Здравей, {name} 👋</h1>
        <p className="text-gray-400 text-sm mt-1">Управлявай своите часове и любимци</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-[#EF3988]/10 flex items-center justify-center mb-3">
            <CalendarDays className="w-5 h-5 text-[#EF3988]" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
          <p className="text-sm text-gray-500">Предстоящи часа</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-[#1083BD]/10 flex items-center justify-center mb-3">
            <PawPrint className="w-5 h-5 text-[#1083BD]" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{pets.length}</p>
          <p className="text-sm text-gray-500">Любимци</p>
        </div>
      </div>

      {/* Upcoming appointments */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Предстоящи часове</h2>
          <Link href="/my/appointments" className="text-sm text-[#1083BD] hover:underline flex items-center gap-1">
            Всички <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <CalendarDays className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Нямаш предстоящи часове</p>
            <Link href="/search" className="mt-3 inline-block text-sm text-[#1083BD] hover:underline">
              Намери специалист →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.slice(0, 5).map((a: any) => {
              const d = new Date(a.date)
              const s = statusLabel[a.status] ?? statusLabel.PENDING
              return (
                <div key={a.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-12 h-12 rounded-xl bg-[#EF3988]/10 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-[#EF3988]">{MONTHS[d.getMonth()]}</span>
                    <span className="text-lg font-black text-[#EF3988] leading-tight">{d.getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{a.vet.displayName}</p>
                    <p className="text-xs text-gray-400">
                      {a.pet.name} · {d.toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" })}
                      {a.service && ` · ${a.service.name}`}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${s.color}`}>{s.label}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pets */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Моите любимци</h2>
          <Link href="/my/pets" className="text-sm text-[#1083BD] hover:underline flex items-center gap-1">
            Управлявай <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pets.length === 0 ? (
          <div className="text-center py-8">
            <PawPrint className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Нямаш добавени любимци</p>
            <Link href="/my/pets" className="mt-3 inline-block text-sm text-[#1083BD] hover:underline">
              Добави любимец →
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {pets.map((p: any) => (
              <div key={p.id} className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 py-2.5">
                <span className="text-xl">{speciesEmoji(p.species)}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-400">{speciesLabel(p.species)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function speciesEmoji(s: string) {
  return { DOG:"🐕", CAT:"🐈", BIRD:"🦜", RABBIT:"🐇", EXOTIC:"🦎", OTHER:"🐾" }[s] ?? "🐾"
}
function speciesLabel(s: string) {
  return { DOG:"Куче", CAT:"Котка", BIRD:"Птица", RABBIT:"Заек", EXOTIC:"Екзотично", OTHER:"Друго" }[s] ?? s
}
