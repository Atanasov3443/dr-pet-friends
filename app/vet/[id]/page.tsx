import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MapPin, Phone, Star, Clock, Stethoscope, Shield, CalendarCheck, ChevronLeft } from "lucide-react"
import Link from "next/link"

const DAYS = ["Неделя", "Понеделник", "Вторник", "Сряда", "Четвъртък", "Петък", "Събота"]

export default async function VetProfilePage({ params }: { params: { id: string } }) {
  const vet = await db.vet.findUnique({
    where: { id: params.id },
    include: {
      clinic:   true,
      services: { orderBy: { price: "asc" } },
      schedule: { orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }], where: { isActive: true } },
      reviews:  { include: { user: { select: { name: true, image: true } } }, orderBy: { createdAt: "desc" }, take: 5 },
      user:     { select: { name: true, email: true } },
    },
  })

  if (!vet) notFound()

  const scheduleByDay = vet.schedule.reduce((acc, s) => {
    if (!acc[s.dayOfWeek]) acc[s.dayOfWeek] = []
    acc[s.dayOfWeek].push(s)
    return acc
  }, {} as Record<number, typeof vet.schedule>)

  const todayDay  = new Date().getDay()
  const isOpenToday = !!scheduleByDay[todayDay]?.length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20">
        {/* Hero */}
        <div className="bg-white border-b border-gray-100">
          <div className="container max-w-5xl mx-auto px-4 py-8">
            <Link href="/search" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Обратно към търсене
            </Link>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <img
                src={vet.image ?? "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop"}
                alt={vet.displayName}
                className="w-28 h-28 rounded-2xl object-cover border border-gray-100 shrink-0" />

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h1 className="text-3xl font-black text-gray-900">{vet.displayName}</h1>
                    <p className="text-[#1083BD] font-semibold text-lg mt-0.5">{vet.specialty}</p>
                  </div>
                  <div className="flex gap-2">
                    {vet.isEmergency && (
                      <span className="flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-full text-sm font-semibold">
                        <Shield className="w-4 h-4" /> 24/7 Спешен
                      </span>
                    )}
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                      isOpenToday ? "bg-green-50 text-green-700 border border-green-100" : "bg-gray-100 text-gray-500"
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${isOpenToday ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
                      {isOpenToday ? "Отворен днес" : "Затворен днес"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-gray-900">{vet.rating.toFixed(1)}</span>
                    <span>({vet.reviewCount} отзива)</span>
                  </div>
                  {vet.experience > 0 && (
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {vet.experience} г. опит</span>
                  )}
                  {vet.clinic && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {vet.clinic.city}
                      {vet.clinic.name && ` · ${vet.clinic.name}`}
                    </span>
                  )}
                  {vet.phone && (
                    <a href={`tel:${vet.phone}`} className="flex items-center gap-1 text-[#1083BD] hover:underline">
                      <Phone className="w-4 h-4" /> {vet.phone}
                    </a>
                  )}
                </div>

                {vet.bio && (
                  <p className="mt-4 text-gray-600 text-sm leading-relaxed max-w-2xl">{vet.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Services */}
              {vet.services.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-[#1083BD]" /> Услуги
                  </h2>
                  <div className="space-y-3">
                    {vet.services.map(s => (
                      <div key={s.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{s.name}</p>
                          <p className="text-xs text-gray-400">{s.duration} минути</p>
                        </div>
                        <span className="font-bold text-[#1083BD]">{s.price} лв.</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {vet.reviews.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" /> Отзиви
                  </h2>
                  <div className="space-y-4">
                    {vet.reviews.map(r => (
                      <div key={r.id} className="flex gap-3">
                        {r.user.image ? (
                          <img src={r.user.image} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-xs font-bold text-gray-400">
                            {(r.user.name ?? "?")[0].toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-900">{r.user.name ?? "Анонимен"}</span>
                            <div className="flex">
                              {[1,2,3,4,5].map(i => (
                                <Star key={i} className={`w-3 h-3 ${i <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                              ))}
                            </div>
                          </div>
                          {r.comment && <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Book CTA */}
              <div className="bg-[#1083BD] rounded-2xl p-5 text-white">
                <h3 className="font-bold text-lg mb-1">Запази час</h3>
                <p className="text-white/70 text-sm mb-4">Онлайн резервация без телефон</p>
                <button className="w-full py-3 bg-white text-[#1083BD] rounded-xl font-bold text-sm hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
                  <CalendarCheck className="w-4 h-4" /> Избери дата и час
                </button>
              </div>

              {/* Schedule */}
              {vet.schedule.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-[#1083BD]" /> Работно време
                  </h3>
                  <div className="space-y-2">
                    {[1,2,3,4,5,6,0].map(day => {
                      const slots    = scheduleByDay[day]
                      const isToday  = day === todayDay
                      return (
                        <div key={day} className={`flex items-center justify-between text-sm py-1.5 px-2 rounded-lg ${isToday ? "bg-[#1083BD]/5" : ""}`}>
                          <span className={`font-medium ${isToday ? "text-[#1083BD]" : "text-gray-600"}`}>
                            {DAYS[day]}
                          </span>
                          {slots?.length ? (
                            <span className="text-gray-700 text-xs">
                              {slots.map(s => `${s.startTime}–${s.endTime}`).join(", ")}
                            </span>
                          ) : (
                            <span className="text-gray-300 text-xs">Почивен</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Clinic info */}
              {vet.clinic && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm">Клиника</h3>
                  <p className="font-semibold text-sm text-gray-900">{vet.clinic.name}</p>
                  {vet.clinic.address && <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{vet.clinic.address}</p>}
                  {vet.clinic.city    && <p className="text-xs text-gray-500 mt-0.5">{vet.clinic.city}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
