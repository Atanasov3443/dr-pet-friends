"use client"

import { apiUrl } from "@/lib/api"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { CalendarDays, PawPrint, ArrowRight, Search, FileText, Clock, ChevronRight } from "lucide-react"
import Link from "next/link"

const MONTHS = ["Яну","Фев","Мар","Апр","Май","Юни","Юли","Авг","Сеп","Окт","Ное","Дек"]
const DAYS   = ["Нед","Пон","Вт","Ср","Чет","Пет","Съб"]

const STATUS: Record<string, { label: string; bg: string; text: string }> = {
  PENDING:   { label: "Чакаща",     bg: "bg-amber-100",  text: "text-amber-700"  },
  CONFIRMED: { label: "Потвърдена", bg: "bg-green-100",  text: "text-green-700"  },
  CANCELLED: { label: "Отказана",   bg: "bg-red-100",    text: "text-red-600"    },
  COMPLETED: { label: "Завършена",  bg: "bg-gray-100",   text: "text-gray-500"   },
}

const SPECIES_EMOJI: Record<string, string> = { DOG:"🐶", CAT:"🐱", BIRD:"🦜", RABBIT:"🐰", EXOTIC:"🦎", OTHER:"🐾" }

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
  const realPets  = pets.filter(p => p.name !== "Любимец")
  const nextAppt  = appointments[0]

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[300px]">
      <div className="text-center text-gray-400">
        <div className="w-8 h-8 border-2 border-[#1083BD] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Зарежда...
      </div>
    </div>
  )

  return (
    <div className="p-6 md:p-8 max-w-3xl space-y-5">

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#1083BD] via-[#0f6fb0] to-[#0D67F7] rounded-3xl p-6 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute right-0 top-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute right-10 bottom-0 w-24 h-24 rounded-full bg-white/5 translate-y-1/2" />

        <div className="relative flex items-center gap-4">
          {avatar ? (
            <img src={avatar} alt="" className="w-14 h-14 rounded-2xl object-cover shrink-0 ring-2 ring-white/30" />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 text-2xl font-black text-white">
              {firstName[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-white font-black text-xl leading-tight">Здравей, {firstName}! 👋</h1>
            <p className="text-white/70 text-sm mt-0.5">
              {nextAppt
                ? `Следващ час: ${DAYS[new Date(nextAppt.date).getDay()]}, ${new Date(nextAppt.date).getDate()} ${MONTHS[new Date(nextAppt.date).getMonth()]} · ${new Date(nextAppt.date).toLocaleTimeString("bg-BG", { hour:"2-digit", minute:"2-digit" })}`
                : "Добре дошъл в твоя здравен дневник"}
            </p>
          </div>
        </div>

        {/* Stats inside hero */}
        <div className="relative grid grid-cols-3 gap-3 mt-5">
          {[
            { label: "Предстоящи часа", value: appointments.length },
            { label: "Любимци",         value: realPets.length },
            { label: "Потвърдени",      value: appointments.filter(a => a.status === "CONFIRMED").length },
          ].map(s => (
            <div key={s.label} className="bg-white/10 rounded-2xl p-3 text-center backdrop-blur-sm">
              <p className="text-white font-black text-2xl">{s.value}</p>
              <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: "/search",             icon: Search,       label: "Намери ветеринар",  bg: "bg-[#EF3988]", glow: "shadow-[#EF3988]/20" },
          { href: "/my/appointments",    icon: CalendarDays, label: "Моите часове",      bg: "bg-[#1083BD]", glow: "shadow-[#1083BD]/20" },
          { href: "/my/pets",            icon: PawPrint,     label: "Моите любимци",     bg: "bg-[#10B83D]", glow: "shadow-[#10B83D]/20" },
          { href: "/my/medical-history", icon: FileText,     label: "Здравна история",   bg: "bg-[#F97316]", glow: "shadow-[#F97316]/20" },
        ].map(({ href, icon: Icon, label, bg, glow }) => (
          <Link key={href} href={href}
            className={`group bg-white rounded-2xl border border-gray-100 p-4 flex flex-col items-center gap-2.5 hover:shadow-lg ${glow} hover:-translate-y-0.5 transition-all duration-200`}>
            <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shadow-sm`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-semibold text-gray-600 text-center leading-tight group-hover:text-gray-900 transition-colors">{label}</span>
          </Link>
        ))}
      </div>

      {/* Upcoming appointments */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1083BD]/10 flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-[#1083BD]" />
            </div>
            Предстоящи часове
          </h2>
          <Link href="/my/appointments" className="flex items-center gap-1 text-xs font-semibold text-[#1083BD] hover:underline">
            Всички <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
              <CalendarDays className="w-8 h-8 text-gray-200" />
            </div>
            <p className="text-gray-400 text-sm mb-4">Нямаш предстоящи часове</p>
            <Link href="/search"
              className="inline-flex items-center gap-2 bg-[#1083BD] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#0d6fa0] transition-colors shadow-sm">
              <Search className="w-4 h-4" /> Намери ветеринар
            </Link>
          </div>
        ) : (
          <div>
            {appointments.slice(0, 4).map((a: any, idx: number) => {
              const d = new Date(a.date)
              const s = STATUS[a.status] ?? STATUS.PENDING
              const isNext = idx === 0
              return (
                <Link key={a.id} href="/my/appointments"
                  className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50/80 transition-colors border-t border-gray-50 first:border-0 ${isNext ? "bg-blue-50/30" : ""}`}>
                  {/* Date badge */}
                  <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 ${isNext ? "bg-[#1083BD] text-white" : "bg-gray-50"}`}>
                    <span className={`text-[10px] font-bold uppercase ${isNext ? "text-white/70" : "text-gray-400"}`}>{MONTHS[d.getMonth()]}</span>
                    <span className={`text-lg font-black leading-tight ${isNext ? "text-white" : "text-gray-800"}`}>{d.getDate()}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900 truncate">{a.vet?.displayName}</p>
                      {isNext && <span className="text-[10px] font-bold text-[#1083BD] bg-blue-50 px-2 py-0.5 rounded-full shrink-0">Следващ</span>}
                    </div>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {d.toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" })}
                      {a.pet?.name && a.pet.name !== "Любимец" ? ` · ${a.pet.name}` : ""}
                      {a.service ? ` · ${a.service.name}` : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>{s.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Pets */}
      {realPets.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#10B83D]/10 flex items-center justify-center">
                <PawPrint className="w-4 h-4 text-[#10B83D]" />
              </div>
              Моите любимци
            </h2>
            <Link href="/my/pets" className="flex items-center gap-1 text-xs font-semibold text-[#1083BD] hover:underline">
              Управлявай <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="px-6 pb-5 flex flex-wrap gap-3">
            {realPets.map((p: any) => (
              <Link key={p.id} href="/my/pets"
                className="flex items-center gap-3 bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-[#1083BD]/20 rounded-2xl px-4 py-3 transition-all">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl overflow-hidden shadow-sm shrink-0">
                  {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover rounded-xl" /> : (SPECIES_EMOJI[p.species] ?? "🐾")}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.breed || "Домашен любимец"}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
