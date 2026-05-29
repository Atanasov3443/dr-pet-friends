"use client"

import { Button } from "@/components/ui/button"
import { Sticker, PawSticker } from "@/components/sticker"
import { Check, TrendingUp, Calendar, Users } from "lucide-react"

const benefits = [
  { icon: Check, text: "Безплатна регистрация — без скрити такси" },
  { icon: TrendingUp, text: "Видимост пред 50 000+ собственици на любимци" },
  { icon: Calendar, text: "Онлайн управление на записи и работен график" },
  { icon: Users, text: "Реални оценки, които изграждат доверие" },
]

export function ContactRequestSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Top wave transition from white */}
      <div className="bg-white h-16 relative">
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 64"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0 64L1440 64L1440 20C1200 50 960 0 720 25C480 50 240 10 0 20L0 64Z"
            fill="#FF6B35"
          />
        </svg>
      </div>

      {/* Main section — orange background */}
      <div className="bg-[#FF6B35] py-24 relative">
        {/* Decorative blobs */}
        <svg
          className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-20"
          viewBox="0 0 500 500"
          fill="none"
        >
          <path
            d="M400 200C430 280 410 380 320 430C230 480 120 460 60 380C0 300 20 180 100 110C180 40 300 20 380 80C420 115 395 160 400 200Z"
            fill="#DAF467"
          />
        </svg>
        <svg
          className="absolute -bottom-10 -left-10 w-[350px] h-[350px] pointer-events-none opacity-20"
          viewBox="0 0 350 350"
          fill="none"
        >
          <circle cx="100" cy="250" r="180" fill="#EF3988" />
        </svg>

        {/* Stickers */}
        <div className="absolute top-10 right-[12%] hidden lg:block">
          <Sticker text="WOOF" color="lime" rotation={-10} size="lg" />
        </div>
        <div className="absolute bottom-16 left-[8%] hidden lg:block">
          <PawSticker color="green" icon="paw" rotation={12} />
        </div>
        <div className="absolute top-1/2 left-[4%] hidden xl:block">
          <Sticker text="PURRRR" color="pink" rotation={8} size="md" />
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — text content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 text-white rounded-full px-4 py-2 text-sm font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-[#DAF467] inline-block" />
                За ветеринари и клиники
              </div>

              <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                Регистрирайте{" "}
                <span className="text-[#DAF467] relative inline-block">
                  клиниката
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 220 16"
                    fill="none"
                  >
                    <path
                      d="M4 12C55 4 165 4 216 12"
                      stroke="#EF3988"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{" "}
                си безплатно
              </h2>

              <p className="text-white/90 text-lg mb-10 max-w-lg">
                Достигнете до хиляди нови клиенти, управлявайте записи онлайн
                и изградете доверена репутация с реални отзиви.
              </p>

              <ul className="space-y-4 mb-10">
                {benefits.map((b, i) => {
                  const Icon = b.icon
                  return (
                    <li key={i} className="flex items-center gap-3 text-white">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-[#DAF467]" />
                      </div>
                      <span className="text-white/90">{b.text}</span>
                    </li>
                  )
                })}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-[#EF3988] hover:bg-[#d92d75] text-white font-bold rounded-full px-8 h-14 text-base shadow-xl"
                >
                  Регистрирай клиника безплатно
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-[#FF6B35] rounded-full px-8 h-14 text-base font-semibold"
                >
                  Научи повече
                </Button>
              </div>
            </div>

            {/* Right — image with decorations */}
            <div className="relative hidden lg:flex items-center justify-center">
              {/* Lime blob behind image */}
              <svg
                className="absolute w-[420px] h-[420px] pointer-events-none"
                viewBox="0 0 420 420"
                fill="none"
              >
                <path
                  d="M370 210C380 280 340 360 250 390C160 420 70 380 30 300C-10 220 20 120 100 70C180 20 290 30 350 100C375 140 368 180 370 210Z"
                  fill="#DAF467"
                  opacity="0.35"
                />
              </svg>

              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1581888227599-779811939961?w=480&h=560&fit=crop&crop=faces"
                  alt="Ветеринар"
                  className="rounded-3xl shadow-2xl w-full max-w-sm object-cover"
                />
                {/* Overlay card */}
                <div className="absolute -bottom-6 -left-8 bg-white rounded-2xl p-5 shadow-xl max-w-[200px]">
                  <div className="text-[#FF6B35] font-display font-bold text-3xl">+340%</div>
                  <div className="text-gray-600 text-sm mt-1">ръст на записите след регистрация</div>
                </div>
                {/* Sticker on image */}
                <div className="absolute -top-4 -right-4">
                  <Sticker text="GOOOOOD DOGGY" color="green" rotation={10} size="md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
