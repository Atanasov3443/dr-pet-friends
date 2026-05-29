"use client"

import { Button } from "@/components/ui/button"
import { Sticker, PawSticker } from "@/components/sticker"

export function CtaSection() {
  return (
    <section className="relative bg-[#1083BD] overflow-hidden min-h-[600px] flex items-center">
      <div className="absolute top-0 left-0 w-full leading-none pointer-events-none z-10"><svg viewBox="0 0 1440 50" fill="white" preserveAspectRatio="none" className="w-full h-12 block"><polygon points="0,0 1440,50 1440,0" /></svg></div>
      {/* Giant background text — decorative, behind everything */}
      <div
        className="absolute inset-0 flex items-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          className="font-display font-black text-white leading-none whitespace-nowrap"
          style={{ fontSize: "clamp(100px, 18vw, 220px)", opacity: 0.12, marginLeft: "-2%" }}
        >
          Запази час
        </span>
      </div>

      {/* Lime wavy blob — left side */}
      <svg
        className="absolute left-0 bottom-0 w-[480px] h-[480px] pointer-events-none"
        viewBox="0 0 480 480"
        fill="none"
      >
        <path
          d="M0 480L0 200C40 160 100 120 160 140C220 160 260 240 300 260C340 280 400 240 440 200C460 180 470 160 480 140L480 480Z"
          fill="#DAF467"
          opacity="0.9"
        />
      </svg>

      {/* Pink blob — top right corner */}
      <svg
        className="absolute -top-20 -right-20 w-[400px] h-[400px] pointer-events-none"
        viewBox="0 0 400 400"
        fill="none"
      >
        <path
          d="M350 150C390 220 380 330 300 380C220 430 110 410 60 340C10 270 30 160 100 100C170 40 280 30 340 90C360 115 348 138 350 150Z"
          fill="#EF3988"
          opacity="0.6"
        />
      </svg>

      {/* Stickers */}
      <div className="absolute top-12 left-[12%] hidden lg:block z-20">
        <Sticker text="WOOF" color="orange" rotation={-8} size="xl" />
      </div>
      <div className="absolute top-20 right-[30%] hidden lg:block z-20">
        <PawSticker color="green" icon="paw" rotation={12} size="lg" />
      </div>
      <div className="absolute bottom-16 left-[38%] hidden lg:block z-20">
        <Sticker text="GOOOOOD DOGGY" color="green" rotation={5} size="lg" />
      </div>
      <div className="absolute bottom-24 right-[10%] hidden xl:block z-20">
        <Sticker text="WOOF" color="orange" rotation={-12} size="lg" />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[600px] py-16">
          {/* Left — animal photo breaking out of section */}
          <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">
            {/* Lime circle behind photo */}
            <div
              className="absolute rounded-full bg-[#DAF467] opacity-50"
              style={{ width: 380, height: 380, bottom: -40, left: -20 }}
            />
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=480&h=580&fit=crop&crop=top"
              alt="Щастливо куче"
              className="relative z-10 w-72 md:w-96 object-cover"
              style={{ borderRadius: "40% 40% 50% 50% / 30% 30% 70% 70%" }}
            />
          </div>

          {/* Right — text + CTA */}
          <div className="text-center lg:text-left order-1 lg:order-2">
            <p className="text-white/70 text-lg font-medium mb-3 tracking-wide uppercase text-sm">
              Грижата, на която се доверявате
            </p>

            <h2 className="font-display font-black text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
              Вашият домашен
              <br />
              любимец е <span className="text-[#DAF467]">наш приятел!</span>
            </h2>

            <p className="text-white/80 text-xl mb-10 max-w-md mx-auto lg:mx-0">
              Намерете ветеринар, groomer или клиника до вас и запазете час за минути.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-[#EF3988] hover:bg-[#d92d75] text-white font-bold rounded-full px-10 h-14 text-base shadow-2xl"
              >
                Търси ветеринар
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/60 text-white hover:bg-white/10 rounded-full px-10 h-14 text-base font-semibold"
              >
                Разгледай услугите
              </Button>
            </div>

            {/* Small stats */}
            <div className="flex gap-8 mt-10 justify-center lg:justify-start">
              <div>
                <div className="font-display font-bold text-3xl text-[#DAF467]">200+</div>
                <div className="text-white/70 text-sm">Специалисти</div>
              </div>
              <div className="w-px bg-white/20" />
              <div>
                <div className="font-display font-bold text-3xl text-[#DAF467]">10 000+</div>
                <div className="text-white/70 text-sm">Доволни клиенти</div>
              </div>
              <div className="w-px bg-white/20" />
              <div>
                <div className="font-display font-bold text-3xl text-[#DAF467]">50+</div>
                <div className="text-white/70 text-sm">Града</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
