"use client"

import { Sticker } from "@/components/sticker"

export function ThanksSection() {
  return (
    <section className="relative bg-[#1083BD] overflow-hidden" style={{ minHeight: "90vh" }}>

      {/* Giant "Благодарим" background text */}
      <div
        className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          className="font-display font-black text-white whitespace-nowrap leading-none"
          style={{
            fontSize: "clamp(70px, 14vw, 200px)",
            letterSpacing: "-0.03em",
            marginLeft: "-0.5vw",
          }}
        >
          Благодарим
        </span>
      </div>

      {/* Lighter blue wavy blobs — bottom corners (like reference) */}
      <svg
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{ width: "42%", maxWidth: 500 }}
        viewBox="0 0 480 320"
        fill="none"
        preserveAspectRatio="xMinYMax meet"
      >
        <path
          d="M0 320
             C 0 320, 60 240, 130 210
             C 200 180, 280 220, 330 180
             C 380 140, 380 70, 480 40
             L 480 320 Z"
          fill="#41B3FF"
          opacity="0.45"
        />
      </svg>
      <svg
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{ width: "42%", maxWidth: 500 }}
        viewBox="0 0 480 320"
        fill="none"
        preserveAspectRatio="xMaxYMax meet"
      >
        <path
          d="M480 320
             C 480 320, 420 240, 350 210
             C 280 180, 200 220, 150 180
             C 100 140, 100 70, 0 40
             L 0 320 Z"
          fill="#41B3FF"
          opacity="0.45"
        />
      </svg>

      {/* Vet + puppy image — tall, centered, in front of text */}
      <div
        className="absolute inset-0 flex items-end justify-center pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <img
          src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=540&h=700&fit=crop&crop=top"
          alt="Ветеринар с кученце"
          className="object-cover object-top w-auto"
          style={{ height: "85vh", maxWidth: 540 }}
        />
      </div>

      {/* Stickers */}

      {/* GOOOOD DOGGY green circle — top left */}
      <div
        className="absolute hidden md:flex items-center justify-center rounded-full shadow-xl"
        style={{
          width: 84,
          height: 84,
          backgroundColor: "#10B83D",
          top: "10%",
          left: "8%",
          transform: "rotate(-10deg)",
          zIndex: 20,
        }}
      >
        <span className="font-bold text-[#DAF467] text-[9px] leading-tight text-center uppercase tracking-wide px-2 select-none">
          GOOOOOD DOGGY
        </span>
      </div>

      {/* WOOF orange — top center-left */}
      <div className="absolute hidden md:block" style={{ top: "16%", left: "28%", zIndex: 20 }}>
        <Sticker text="WOOF" color="orange" rotation={8} size="xl" />
      </div>

      {/* WW sticker — top right */}
      <div
        className="absolute hidden md:flex items-center justify-center rounded-full shadow-xl"
        style={{
          width: 72,
          height: 72,
          backgroundColor: "#DAF467",
          top: "12%",
          right: "10%",
          transform: "rotate(-6deg)",
          zIndex: 20,
        }}
      >
        <span className="font-bold text-[#EF3988] text-lg leading-tight text-center select-none">WW</span>
      </div>

      {/* WOOF orange — bottom right of image */}
      <div className="absolute hidden lg:block" style={{ bottom: "30%", right: "9%", zIndex: 20 }}>
        <Sticker text="WOOF" color="orange" rotation={-8} size="lg" />
      </div>

      {/* Bottom tagline */}
      <div className="absolute bottom-6 left-0 right-0 text-center" style={{ zIndex: 20 }}>
        <p className="text-white/80 text-base font-medium tracking-wide">
          Ветеринарна платформа Dr. Pet Friend
        </p>
        <p className="text-white/50 text-sm mt-1">
          Вашият домашен любимец е наш приятел!
        </p>
      </div>

      {/* Height spacer */}
      <div style={{ height: "90vh" }} />
    </section>
  )
}
