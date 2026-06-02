"use client"

import { useState } from "react"
import Link from "next/link"
import { CalendarCheck, Clock, Star, Users, MapPin, Check } from "lucide-react"
import { ClinicsMapModal } from "@/components/clinics-map-modal"

export function EmergencyBanner() {
  const [mapOpen, setMapOpen] = useState(false)

  return (
    <>
      <ClinicsMapModal isOpen={mapOpen} onClose={() => setMapOpen(false)} />
      <section className="relative bg-gray-50 overflow-hidden">
        {/* Top diagonal */}
        <div className="absolute top-0 left-0 w-full leading-none pointer-events-none z-10">
          <svg viewBox="0 0 1440 60" fill="#fdf2f8" preserveAspectRatio="none" className="w-full h-16 block">
            <polygon points="0,0 1440,0 1440,60" />
          </svg>
        </div>

        <div className="container relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left — Image */}
            <div className="relative hidden lg:block order-1">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-[#1083BD]/10">
                <img
                  src="https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=600&h=700&fit=crop&crop=center"
                  alt="Ветеринар с котка"
                  className="w-full h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1083BD]/20 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -right-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm">4.9 / 5.0</p>
                  <p className="text-gray-400 text-xs">от 12 000+ отзива</p>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-[#1083BD]/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#1083BD]" />
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm">24/7 онлайн</p>
                  <p className="text-gray-400 text-xs">запазване на час</p>
                </div>
              </div>
            </div>

            {/* Right — Content */}
            <div className="order-2">
              <div className="inline-flex items-center gap-2 bg-[#1083BD]/10 border border-[#1083BD]/20 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#1083BD] animate-pulse" />
                <span className="text-[#1083BD] text-xs font-semibold uppercase tracking-widest">Без чакане по телефона</span>
              </div>

              <h2 className="font-display font-black text-4xl md:text-5xl text-[#191919] leading-tight mb-4">
                Запази час при<br />
                <span className="text-[#1083BD]">ветеринар онлайн</span>
              </h2>

              <p className="text-gray-500 text-lg mb-8 max-w-md leading-relaxed">
                Намери проверен специалист, избери дата и час — всичко за под 2 минути.
              </p>

              {/* Checkmarks */}
              <div className="space-y-3 mb-8">
                {[
                  "Над 200 проверени специалисти",
                  "Онлайн и на място консултации",
                  "Потвърждение веднага по имейл",
                ].map(text => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#1083BD] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-gray-600 text-sm font-medium">{text}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="flex gap-6 mb-8">
                {[
                  { num: "200+", label: "Специалисти" },
                  { num: "4.9★", label: "Средна оценка" },
                  { num: "2 мин", label: "За записване" },
                ].map(({ num, label }) => (
                  <div key={label}>
                    <p className="font-black text-2xl text-[#1083BD]">{num}</p>
                    <p className="text-gray-400 text-xs">{label}</p>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link href="/search"
                  className="flex items-center gap-2 bg-[#1083BD] hover:bg-[#0D67F7] text-white font-bold rounded-full px-8 h-13 py-3.5 text-base shadow-lg shadow-[#1083BD]/25 transition-all cursor-pointer hover:scale-105 active:scale-95">
                  <CalendarCheck className="w-5 h-5" /> Запази час сега
                </Link>
                <button onClick={() => setMapOpen(true)}
                  className="flex items-center gap-2 border-2 border-gray-200 hover:border-[#1083BD] text-gray-500 hover:text-[#1083BD] font-semibold rounded-full px-6 py-3.5 text-sm transition-all cursor-pointer bg-white">
                  <MapPin className="w-4 h-4" /> Намери на картата
                </button>
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
