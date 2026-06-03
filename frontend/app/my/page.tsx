"use client"

import { apiUrl } from "@/lib/api"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { CalendarDays, PawPrint, ArrowRight, Stethoscope, FileText, Search } from "lucide-react"
import Link from "next/link"

const MONTHS = ["Яну","Фев","Мар","Апр","Май","Юни","Юли","Авг","Сеп","Окт","Ное","Дек"]

const STATUS: Record<string, { label: string; dot: string; text: string }> = {
  PENDING:   { label: "Чакаща",     dot: "bg-yellow-400", text: "text-yellow-700" },
  CONFIRMED: { label: "Потвърдена", dot: "bg-green-400",  text: "text-green-700"  },
  CANCELLED: { label: "Отказана",   dot: "bg-red-400",    text: "text-red-600"    },
  COMPLETED: { label: "Завършена",  dot: "bg-gray-300",   text: "text-gray-500"   },
}

const SPECIES_EMOJI: Record<string, string> = { DOG:"🐶", CAT:"🐱", BIRD:"🦜", RABBIT:"🐰", EXOTIC:"🦎", OTHER:"🐾" }

const QUICK_LINKS = [
  { href: "/search",             icon: Search,      label: "Намери ветеринар",  color: "bg-[#EF3988]" },
  { href: "/my/appointments",    icon: CalendarDays, label: "Моите часове",     color: "bg-[#1083BD]" },
  { href: "/my/pets",            icon: PawPrint,     label: "Моите любимци",    color: "bg-[#10B83D]" },
  { href: "/my/medical-history", icon: FileText,     label: "Здравна история",  color: "bg-[#F97316]" },
]

export default function MyPage() {
  const { data: session } = useSession()
  const [appointments, setAppointments] = useState<any[]>([])
  const [pets,         setPets]         = useState<any[]>([])
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(apiUrl("/api/my/appointments?upcoming=true"), { credentials: "include" }).then(r => r.ok ? r.json() : []),
      fetch(apiUrl("/api/my/pets"), { credentials: "include" }).then(r => r.ok ? r.json() : []),
    ]).then(([appts, p]) => {
      setAppointments(Array.isArray(appts) ? appts : [])
      setPets(Array.isArray(p) ? p : [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const firstName = (session?.user as any)?.name?.split(" ")[0] ?? "там"
  const avatar    = (session?.user as any)?.image

  if (loading) return <div className="p-8 text-center text-gray-400">Зарежда...</div>

  return (
    <div className="p-6 md:p-8 max-w-3xl">

      {/* Hero greeting */}
      <div className="bg-gradient-to-br from-[#1083BD] to-[#0D67F7] rounded-3xl p-6 mb-6 flex items-center gap-4 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -right-4 -bottom-6 w-20 h-20 rounded-full bg-white/5" />
        {avatar ? (
          <img src={avatar} alt="" className="w-14 h-14 rounded-2xl object-cover shrink-0 border-2 border-white/30" />
        ) : (
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 text-2xl">🐾</div>
        )}
        <div className="relative z-10">
          <h1 className="text-white font-black text-xl">Здравей, {firstName}! 👋</h1>
          <p className="text-white/70 text-sm mt-0.5">
            {appointments.length > 0
              ? `Имаш ${appointments.length} предстоящ${appointments.length === 1 ? "" : "и"} час${appointments.length === 1 ? "" : "a"}`
              : "Добре дошъл в твоя здравен дневник"}
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {QUICK_LINKS.map(({ href, icon: Icon, label, color }) => (
          <Link key={href} href={href}
            className="flex flex-col items-center gap-2 bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{label}</span>
          </Link>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Предстоящи",  value: appointments.length,                                         color: "text-[#EF3988]" },
          { label: "Любимци",    value: pets.filter(p => p.name !== "Любимец").length,               color: "text-[#1083BD]" },
          { label: "Потвърдени", value: appointments.filter(a => a.status === "CONFIRMED").length,    color: "text-green-600"  },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
            <p className={`font-black text-2xl ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming appointments */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-5">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[#EF3988]" /> Предстоящи часове
          </h2>
          <Link href="/my/appointments" className="text-xs text-[#1083BD] hover:underline flex items-center gap-1 font-medium">
            Всички <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-10">
            <CalendarDays className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-gray-400 text-sm mb-3">Нямаш предстоящи часове</p>
            <Link href="/search" className="inline-flex items-center gap-1.5 bg-[#EF3988] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#d42f77] transition-colors">
              <Search className="w-3.5 h-3.5" /> Намери специалист
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {appointments.slice(0, 4).map((a: any) => {
              const d = new Date(a.date)
              const s = STATUS[a.status] ?? STATUS.PENDING
              return (
                <div key={a.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-[#EF3988]/10 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-[#EF3988] uppercase">{MONTHS[d.getMonth()]}</span>
                    <span className="text-base font-black text-[#EF3988] leading-tight">{d.getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{a.vet?.displayName}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {a.pet?.name !== "Любимец" ? `${a.pet?.name} · ` : ""}
                      {d.toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" })}
                      {a.service ? ` · ${a.service.name}` : ""}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-medium shrink-0 ${s.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} /> {s.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pets */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <PawPrint className="w-4 h-4 text-[#1083BD]" /> Моите любимци
          </h2>
          <Link href="/my/pets" className="text-xs text-[#1083BD] hover:underline flex items-center gap-1 font-medium">
            Управлявай <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {pets.filter(p => p.name !== "Любимец").length === 0 ? (
          <div className="text-center py-10">
            <PawPrint className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-gray-400 text-sm mb-3">Нямаш добавени любимци</p>
            <Link href="/my/pets" className="inline-flex items-center gap-1.5 bg-[#1083BD] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#0d6fa0] transition-colors">
              <PawPrint className="w-3.5 h-3.5" /> Добави любимец
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 p-5">
            {pets.filter(p => p.name !== "Любимец").map((p: any) => (
              <Link key={p.id} href="/my/pets"
                className="flex items-center gap-2.5 bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-[#1083BD]/30 rounded-2xl px-3.5 py-3 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-lg overflow-hidden shrink-0">
                  {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover" /> : (SPECIES_EMOJI[p.species] ?? "🐾")}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.breed || p.species}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
