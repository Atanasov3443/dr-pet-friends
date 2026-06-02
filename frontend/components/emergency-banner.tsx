"use client"

import { useState } from "react"
import Link from "next/link"
import { CalendarCheck, Clock, Star, Users, ArrowRight, MapPin } from "lucide-react"
import { ClinicsMapModal } from "@/components/clinics-map-modal"

export function EmergencyBanner() {
  const [mapOpen, setMapOpen] = useState(false)

  return (
    <>
      <ClinicsMapModal isOpen={mapOpen} onClose={() => setMapOpen(false)} />
      <section className="relative py-20 bg-gray-50 overflow-hidden">
        {/* Top diagonal */}
        <div className="absolute top-0 left-0 w-full leading-none pointer-events-none z-10">
          <svg viewBox="0 0 1440 60" fill="#fdf2f8" preserveAspectRatio="none" className="w-full h-16 block">
            <polygon points="0,0 1440,0 1440,60" />
          </svg>
        </div>

        {/* Glow blobs */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#1083BD] opacity-[0.05] blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#EF3988] opacity-[0.05] blur-[120px] pointer-events-none" />

        <div className="container relative z-10 max-w-4xl">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#1083BD]/10 border border-[#1083BD]/20 rounded-full px-4 py-1.5 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#1083BD] animate-pulse" />
              <span className="text-[#1083BD] text-xs font-semibold uppercase tracking-widest">Запиши час онлайн</span>
            </div>
            <h2 className="font-display font-black text-4xl md:text-5xl text-[#191919] mb-3">
              Намери ветеринар и<br />
              <span className="text-[#1083BD]">запази час за минути</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Без чакане по телефона. Избери специалист, дата и час — всичко онлайн.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { icon: Users, num: "200+", label: "Специалисти" },
              { icon: Star,  num: "4.9★", label: "Средна оценка" },
              { icon: Clock, num: "2 мин", label: "За записване" },
            ].map(({ icon: Icon, num, label }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#1083BD]/10 flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-5 h-5 text-[#1083BD]" />
                </div>
                <p className="font-black text-2xl text-[#1083BD]">{num}</p>
                <p className="text-gray-400 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/search"
              className="flex items-center gap-2 bg-[#1083BD] hover:bg-[#0D67F7] text-white font-bold rounded-full px-10 h-14 text-lg shadow-lg shadow-[#1083BD]/25 transition-all cursor-pointer hover:scale-105 active:scale-95">
              <CalendarCheck className="w-5 h-5" /> Запази час сега
            </Link>
            <button onClick={() => setMapOpen(true)}
              className="flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-[#1083BD] text-gray-600 hover:text-[#1083BD] font-semibold rounded-full px-8 h-14 text-sm transition-all cursor-pointer">
              <MapPin className="w-4 h-4" /> Намери клиника на картата
            </button>
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
