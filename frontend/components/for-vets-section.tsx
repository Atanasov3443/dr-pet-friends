"use client"

import { Stethoscope, Users, CalendarCheck, Star, Shield, ArrowRight, FileText } from "lucide-react"
import { GlowCard } from "@/components/ui/spotlight-card"
import Link from "next/link"

const benefits = [
  { icon: Users,         label: "50 000+",     sub: "собственици на любимци" },
  { icon: CalendarCheck, label: "24/7",         sub: "онлайн резервации" },
  { icon: Star,          label: "Рейтинг",      sub: "и реални отзиви" },
  { icon: Shield,        label: "Безплатно",    sub: "без скрити такси" },
]

export function ForVetsSection() {

  return (
    <section className="relative bg-[#EF3988] overflow-hidden">

      {/* Decorative blobs */}
      <svg className="absolute -top-20 -right-40 w-[500px] h-[500px] pointer-events-none opacity-20" viewBox="0 0 500 500" fill="none">
        <circle cx="400" cy="150" r="280" fill="white" />
      </svg>
      <svg className="absolute -bottom-20 -left-20 w-[400px] h-[400px] pointer-events-none opacity-15" viewBox="0 0 400 400" fill="none">
        <circle cx="0" cy="400" r="240" fill="#d42f77" />
      </svg>




      <div className="absolute top-0 left-0 w-full leading-none pointer-events-none z-20">
        <svg viewBox="0 0 1440 60" fill="#fdf2f8" preserveAspectRatio="none" className="w-full h-16 block">
          <polygon points="0,0 1440,0 1440,60 0,60" />
        </svg>
      </div>

      <div className="container relative z-10 pt-16 pb-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — headline + benefit tiles */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-1.5 mb-4">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs font-semibold uppercase tracking-widest">За специалисти</span>
            </div>

            <h2 className="font-display font-black text-3xl md:text-4xl leading-[1.0] mb-2 text-white">
              Стани партньор<br />
              на <span className="text-white whitespace-nowrap opacity-90">Dr. Pet Friend</span>
            </h2>

            <p className="text-white/80 text-sm mb-4 max-w-md leading-relaxed">
              Присъедини се към най-голямата ветеринарна мрежа в България и привлечи нови клиенти всеки ден.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {benefits.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-2.5 bg-white/20 border border-white/20 rounded-xl px-3 py-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm leading-none">{label}</div>
                    <div className="text-white/70 text-xs mt-0.5">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — CTA card */}
          <GlowCard customSize glowColor="purple" className="bg-white/10 backdrop-blur-md rounded-3xl p-8 w-full border border-white/20 flex flex-col items-center justify-center text-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>

            <div>
              <h3 className="font-display font-black text-2xl text-white mb-2">Заяви своя профил</h3>
              <p className="text-white/70 text-sm leading-relaxed max-w-xs mx-auto">
                Попълни пълната форма с вашите данни, специалност и снимка на лиценза. Ще се свържем с вас до 24 часа.
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full max-w-xs">
              <Link href="/apply"
                className="flex items-center justify-center gap-2 w-full py-4 bg-white hover:bg-gray-50 text-[#EF3988] font-black rounded-2xl text-base transition-all hover:scale-105 active:scale-95 shadow-lg">
                <Stethoscope className="w-5 h-5" />
                Кандидатствай сега
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-white/50 text-xs">Безплатно · без скрити такси · отговор до 24ч</p>
            </div>
          </GlowCard>

        </div>
      </div>

      {/* Bottom diagonal — white to match ServicesSection */}
      <div className="w-full leading-none pointer-events-none">
        <svg viewBox="0 0 1440 50" fill="#1083BD" preserveAspectRatio="none" className="w-full h-12 block">
          <polygon points="1440,0 1440,50 0,50" />
        </svg>
      </div>

    </section>
  )
}
