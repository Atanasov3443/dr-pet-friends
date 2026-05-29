"use client"

import { Calendar, FileHeart, Bell, AlertCircle } from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Намери специалист",
    description: "Търсете по специалност, град или вид любимец. Реални отзиви и свободни часове в реално време.",
    accent: "#1083BD",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop&auto=format&q=80",
    step: "01",
  },
  {
    icon: FileHeart,
    title: "Запази час онлайн",
    description: "Без телефонни обаждания. Изберете ден и час директно от профила — потвърждение веднага.",
    accent: "#EF3988",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop&auto=format&q=80",
    step: "02",
  },
  {
    icon: Bell,
    title: "Умни напомняния",
    description: "Автоматични известия за ваксини и прегледи. Цялата здравна история на едно място.",
    accent: "#10B83D",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop&auto=format&q=80",
    step: "03",
  },
  {
    icon: AlertCircle,
    title: "Спешна помощ 24/7",
    description: "Намерете дежурна клиника в секунди. Карта с работещи ветеринари по всяко време.",
    accent: "#FF6B35",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop&auto=format&q=80",
    step: "04",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-[#FFF7ED] overflow-hidden py-16 relative">
      {/* Decorative blobs */}
      <svg className="absolute -top-20 -right-20 w-80 h-80 opacity-20 pointer-events-none" viewBox="0 0 400 400" fill="none">
        <circle cx="300" cy="100" r="220" fill="#FF6B35" />
      </svg>
      <svg className="absolute -bottom-10 -left-10 w-60 h-60 opacity-15 pointer-events-none" viewBox="0 0 300 300" fill="none">
        <circle cx="0" cy="300" r="180" fill="#EF3988" />
      </svg>

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/80 border border-orange-100 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
            <span className="text-[#FF6B35] text-xs font-bold uppercase tracking-widest">Как работи</span>
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-[#191919] leading-tight">
            Четири стъпки до<br />
            <span className="text-[#FF6B35]">здравия любимец</span>
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.step}
                className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
                style={{ background: feature.accent }}
              >
                {/* Big step number watermark */}
                <span
                  className="absolute -right-4 -top-6 font-black text-[120px] leading-none select-none pointer-events-none opacity-10 text-white"
                >
                  {feature.step}
                </span>

                <div className="flex gap-0 h-full">
                  {/* Text */}
                  <div className="flex-1 p-6 flex flex-col justify-between z-10">
                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-display font-black text-2xl text-white mb-2">{feature.title}</h3>
                      <p className="text-white/80 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                    <div className="mt-4">
                      <span className="inline-flex items-center gap-1 text-white/60 text-xs font-bold uppercase tracking-widest">
                        Стъпка {feature.step}
                      </span>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="w-36 shrink-0 relative overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-current to-transparent opacity-60" style={{ color: feature.accent }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
