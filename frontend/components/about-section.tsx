"use client"

import { Sticker, PawSticker } from "@/components/sticker"
import { Check, Stethoscope, Shield, Heart } from "lucide-react"

const benefits = [
  {
    icon: Stethoscope,
    title: "200+ проверени специалисти",
    description: "Ветеринари, грумери и клиники с реални оценки от клиенти"
  },
  {
    icon: Shield,
    title: "Онлайн резервация 24/7",
    description: "Запазете час по всяко време — без телефонни обаждания"
  },
  {
    icon: Heart,
    title: "Здравен дневник за любимеца",
    description: "Пазете история на прегледи, ваксини и лечения на едно място"
  },
]

const stats = [
  { value: "10 000+", label: "Доволни клиенти" },
  { value: "98%", label: "Удовлетвореност" },
  { value: "200+", label: "Ветеринари" },
]

export function AboutSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full leading-none pointer-events-none z-10"><svg viewBox="0 0 1440 50" fill="#1083BD" preserveAspectRatio="none" className="w-full h-12 block"><polygon points="0,0 1440,50 1440,0" /></svg></div>
      {/* Background decorations */}
      <svg 
        className="absolute -top-20 -left-20 w-[400px] h-[400px] pointer-events-none"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="100" cy="200" r="200" fill="#1083BD" opacity="0.05" />
      </svg>

      {/* Sticker */}
      <div className="absolute bottom-32 left-[5%] hidden lg:block">
        <PawSticker color="lime" icon="bone" rotation={12} />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-[#EF3988] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <Sticker text="GOOOOOD DOGGY" color="green" rotation={5} size="sm" />
            </div>

            <h2 className="font-display font-bold text-4xl md:text-5xl text-[#1083BD] mb-6">
              Защо да изберете <span className="text-[#EF3988]">нашата</span> платформа
            </h2>

            <p className="text-gray-600 text-lg mb-8 max-w-lg">
              Dr. Pet Friend свързва собствениците на домашни любимци с най-добрите
              ветеринарни специалисти и грумери в България — бързо, лесно и надеждно.
            </p>

            {/* Benefits list */}
            <div className="space-y-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#1083BD]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#1083BD]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1083BD] mb-1">{benefit.title}</h4>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right - Images and stats */}
          <div className="relative">
            {/* Main image */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=500&h=600&fit=crop"
                alt="Ветеринар с любимец"
                className="rounded-3xl shadow-2xl w-full"
              />
              
              {/* Decorative sticker */}
              <div className="absolute -bottom-4 -left-4">
                <PawSticker color="green" icon="paw" rotation={-8} />
              </div>

              {/* Stats card overlay */}
              <div className="absolute bottom-5 right-5 bg-[#EF3988] rounded-2xl p-5 shadow-xl text-white max-w-[200px]">
                <h4 className="font-display font-bold text-lg mb-4">Постижения в числа</h4>
                <div className="space-y-3">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-display font-bold text-2xl text-[#DAF467]">{stat.value}</span>
                      <span className="text-white/80 text-sm">{stat.label}</span>
                    </div>
                  ))}
                </div>
                
                {/* Sticker decoration */}
                <div className="absolute -top-3 -right-3">
                  <Sticker text="PURRRR" color="lime" rotation={-10} size="sm" />
                </div>
              </div>
            </div>

            {/* Secondary floating image */}
            <div className="absolute top-10 -left-10 hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=150&h=150&fit=crop"
                alt="Куче"
                className="w-32 h-32 rounded-2xl shadow-lg object-cover border-4 border-white"
              />
              <div className="absolute -bottom-2 -right-2">
                <PawSticker color="pink" icon="bone" rotation={15} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
