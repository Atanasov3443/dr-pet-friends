"use client"

import { Search, Calendar, Heart } from "lucide-react"
import { Sticker } from "@/components/sticker"
import { GlowCard } from "@/components/ui/spotlight-card"

const BG = "#EF3988"

const steps = [
  {
    num: "01",
    icon: Search,
    title: "Търсете",
    description: "Намерете ветеринар или груминг салон по специалност, град или вид животно",
    color: "bg-[#1083BD]",
  },
  {
    num: "02",
    icon: Calendar,
    title: "Резервирайте",
    description: "Изберете удобен ден и час директно от профила, без телефонни обаждания",
    color: "bg-[#DAF467]",
    textDark: true,
  },
  {
    num: "03",
    icon: Heart,
    title: "Грижа",
    description: "Вашият любимец получава най-добрата грижа от проверен специалист",
    color: "bg-[#F97316]",
  },
]

export function HowItWorksSection() {
  return (
    <section className="pt-0 pb-0 overflow-hidden relative" style={{ background: BG }}>

      {/* Subtle background texture — fewer hearts, more subtle */}
      {[
        { top: "10%", left: "4%",  size: 70,  rot: -20, op: 0.08 },
        { top: "20%", left: "82%", size: 90,  rot: -8,  op: 0.07 },
        { top: "55%", left: "12%", size: 55,  rot: 30,  op: 0.07 },
        { top: "70%", left: "70%", size: 75,  rot: -22, op: 0.07 },
        { top: "85%", left: "40%", size: 45,  rot: 15,  op: 0.06 },
      ].map((h, i) => (
        <svg
          key={i}
          className="absolute pointer-events-none text-white"
          style={{ top: h.top, left: h.left, width: h.size, opacity: h.op, transform: `rotate(${h.rot}deg)` }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      ))}

      {/* Diagonal top */}
      <div className="w-full leading-none pointer-events-none">
        <svg viewBox="0 0 1440 50" fill={BG} preserveAspectRatio="none" className="w-full h-12 block">
          <polygon points="0,0 1440,50 1440,0" />
        </svg>
      </div>

      <div className="container py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: Image */}
          <GlowCard customSize glowColor="purple" className="h-[480px] order-2 lg:order-1 overflow-hidden p-0">
            <img
              src="https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=600&h=480&fit=crop"
              alt="Ветеринар преглежда куче"
              className="w-full h-full object-cover rounded-2xl"
              style={{ objectPosition: "center 20%" }}
            />
          </GlowCard>

          {/* RIGHT: Text + steps */}
          <div className="order-1 lg:order-2">
            {/* Overline */}
            <div className="inline-flex items-center border border-white/30 rounded-full px-3 py-1 mb-4">
              <span className="text-white/80 text-xs font-semibold uppercase tracking-widest">Как работи</span>
            </div>

            {/* Heading */}
            <div className="flex flex-wrap items-end gap-x-3 gap-y-1 mb-10">
              <h2 className="font-display font-black text-4xl md:text-5xl text-white leading-[0.95] tracking-tight">
                Три стъпки до
                <br />
                здравия любимец
              </h2>
              <div className="mb-1">
                <Sticker text="WOOF" color="orange" rotation={-6} size="md" />
              </div>
            </div>

            {/* Bold numbered steps */}
            <div className="space-y-0">
              {steps.map((step, idx) => {
                const isLast = idx === steps.length - 1
                return (
                  <div
                    key={step.num}
                    className={`flex items-start gap-10 py-6 ${!isLast ? "border-b border-white/15" : ""}`}
                  >
                    {/* Big number */}
                    <span className="font-black text-7xl leading-none text-white/15 select-none shrink-0 w-20 text-right">
                      {step.num}
                    </span>
                    {/* Text */}
                    <div className="pt-1">
                      <h3 className="font-display font-bold text-xl text-white mb-1">{step.title}</h3>
                      <p className="text-white/65 text-sm leading-relaxed max-w-xs">{step.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>


      {/* Animal illustration */}
      <img
        src="/animal-illustration.svg"
        alt="" aria-hidden
        className="absolute bottom-0 right-0 w-72 pointer-events-none select-none hidden lg:block"
        style={{ filter: "brightness(0) invert(1)", opacity: 0.15 }}
      />

      {/* Diagonal bottom */}
      <div className="w-full leading-none pointer-events-none">
        <svg viewBox="0 0 1440 50" fill="#f9fafb" preserveAspectRatio="none" className="w-full h-12 block">
          <polygon points="1440,0 0,50 1440,50" />
        </svg>
      </div>

    </section>
  )
}
