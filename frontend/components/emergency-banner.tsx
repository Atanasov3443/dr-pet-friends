"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sticker } from "@/components/sticker"
import { CalendarCheck, Phone, Clock, MapPin, Star, ArrowRight, Users } from "lucide-react"
import { ClinicsMapModal } from "@/components/clinics-map-modal"

export function EmergencyBanner() {
  const [mapOpen, setMapOpen] = useState(false)

  return (
    <>
    <ClinicsMapModal isOpen={mapOpen} onClose={() => setMapOpen(false)} />
    <section className="relative py-24 bg-gray-50 overflow-hidden">
      {/* Top diagonal */}
      <div className="absolute top-0 left-0 w-full leading-none pointer-events-none z-10">
        <svg viewBox="0 0 1440 60" fill="#EF3988" preserveAspectRatio="none" className="w-full h-16 block">
          <polygon points="0,0 1440,0 1440,60" />
        </svg>
      </div>

      {/* Subtle glow blobs */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#EF3988] opacity-[0.06] blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#1083BD] opacity-[0.06] blur-[120px] pointer-events-none" />

      {/* Stickers */}
      <div className="absolute top-8 right-[8%] hidden md:block">
        <Sticker text="GOOOOOD DOGGY" color="lime" rotation={8} size="sm" />
      </div>

      <div className="container relative z-10">

        {/* Section label + Map button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-gray-400 text-xs font-semibold uppercase tracking-widest shadow-sm">
            Вашият любимец е наш приоритет
          </span>
          <button
            onClick={() => setMapOpen(true)}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-[#1083BD] text-xs font-semibold shadow-sm hover:bg-[#1083BD] hover:text-white hover:border-[#1083BD] transition-all"
          >
            <MapPin className="w-3.5 h-3.5" />
            Намери клиника на картата
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* ── Left card — Emergency ── */}
          <div className="relative rounded-3xl overflow-hidden group shadow-sm hover:shadow-lg transition-shadow">
            <div className="absolute inset-0 bg-white border border-gray-100 rounded-3xl" />
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EF3988] via-[#EF3988] to-[#EF3988]" />

            <div className="relative p-10 flex flex-col gap-7 h-full">
              {/* Badge */}
              <div className="flex items-center gap-2.5 w-fit">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF3988] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#EF3988]" />
                </span>
                <span className="text-[#EF3988] text-xs font-bold uppercase tracking-widest">Денонощно · 365 дни в годината</span>
              </div>

              {/* Heading */}
              <div>
                <h3 className="font-display font-black text-4xl md:text-5xl text-[#191919] leading-[1.05] mb-4">
                  Нужна е<br />
                  <span className="text-[#EF3988]">спешна помощ?</span>
                </h3>
                <p className="text-gray-400 text-base leading-relaxed max-w-sm">
                  Намерете дежурен ветеринар близо до вас в секунди — в момент, когато всяка минута има значение.
                </p>
              </div>

              {/* Features */}
              <div className="flex flex-col gap-2.5">
                {[
                  { icon: Clock,  text: "Отговор в рамките на минути" },
                  { icon: MapPin, text: "Намери най-близката клиника" },
                  { icon: Star,   text: "Само проверени специалисти" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-gray-500 text-sm">
                    <div className="w-7 h-7 rounded-lg bg-[#EF3988]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-[#EF3988]" />
                    </div>
                    {text}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-4 mt-auto">
                <Button
                  size="lg"
                  className="bg-[#EF3988] hover:bg-[#d42f77] text-white font-bold rounded-full px-8 h-12 shadow-lg shadow-[#EF3988]/20 gap-2 transition-all min-w-[240px] justify-center"
                >
                  <Phone className="w-4 h-4" />
                  Спешен ветеринар 24/7
                </Button>
                <span className="text-gray-400 text-sm">+359 888 123 456</span>
              </div>
            </div>
          </div>

          {/* ── Right card — Booking ── */}
          <div className="relative rounded-3xl overflow-hidden group shadow-sm hover:shadow-lg transition-shadow">
            <div className="absolute inset-0 bg-white border border-gray-100 rounded-3xl" />
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1083BD] via-[#1083BD] to-[#1083BD]" />

            <div className="relative p-10 flex flex-col gap-7 h-full">
              {/* Badge */}
              <div className="flex items-center gap-2.5 w-fit">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1083BD]" />
                <span className="text-[#1083BD] text-xs font-bold uppercase tracking-widest">Без чакане по телефона</span>
              </div>

              {/* Heading */}
              <div>
                <h3 className="font-display font-black text-4xl md:text-5xl text-[#191919] leading-[1.05] mb-4">
                  Запиши час<br />
                  <span className="text-[#1083BD]">онлайн</span>
                </h3>
                <p className="text-gray-400 text-base leading-relaxed max-w-sm">
                  Над 200 ветеринари и груминг салона — намери най-близкия и запази час за минути.
                </p>
              </div>

              {/* Stats */}
              <div className="flex flex-col gap-2.5 mt-6">
                {[
                  { icon: Users, num: "200+", label: "специалисти на платформата" },
                  { icon: Star,  num: "4.9★", label: "средна оценка от клиенти" },
                  { icon: Clock, num: "2мин", label: "средно за записване на час" },
                ].map(({ icon: Icon, num, label }) => (
                  <div key={label} className="flex items-center gap-3 text-gray-500 text-sm">
                    <div className="w-7 h-7 rounded-lg bg-[#1083BD]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-[#1083BD]" />
                    </div>
                    <span className="font-black text-[#1083BD]">{num}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-4 mt-auto">
                <Button
                  size="lg"
                  className="bg-[#1083BD] hover:bg-[#0D67F7] text-white font-bold rounded-full px-8 h-12 shadow-lg shadow-[#1083BD]/20 gap-2 transition-all min-w-[240px] justify-center"
                >
                  <CalendarCheck className="w-4 h-4" />
                  Запази час сега
                </Button>
                <span className="flex items-center gap-1 text-gray-400 text-sm">
                  Безплатно <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom diagonal */}
      <div className="absolute bottom-0 left-0 w-full leading-none pointer-events-none z-10">
        <svg viewBox="0 0 1440 50" fill="white" preserveAspectRatio="none" className="w-full h-12 block">
          <polygon points="0,50 1440,0 1440,50" />
        </svg>
      </div>
    </section>
    </>
  )
}
