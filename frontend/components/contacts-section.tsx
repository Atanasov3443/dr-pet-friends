"use client"

import { Sticker } from "@/components/sticker"
import { Phone, Mail } from "lucide-react"

export function ContactsSection() {
  return (
    <section className="relative bg-[#1083BD] overflow-hidden" style={{ minHeight: "100vh" }}>

      {/* Giant "Контакти" text — SVG so it fills exactly full width */}
      <div
        className="absolute left-0 right-0 pointer-events-none select-none overflow-hidden"
        style={{ top: "8%", zIndex: 1 }}
        aria-hidden="true"
      >
        <svg
          width="100%"
          viewBox="0 0 1000 190"
          preserveAspectRatio="xMidYMid meet"
          overflow="visible"
        >
          <text
            x="0"
            y="175"
            fontFamily="'Inter Tight', sans-serif"
            fontWeight="900"
            fontSize="185"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fill="white"
          >
            Контакти
          </text>
        </svg>
      </div>

      {/* Lime snake shape */}
      <svg
        className="absolute pointer-events-none"
        style={{ bottom: "2%", left: "50%", transform: "translateX(-50%)", width: "105%", height: "52%", zIndex: 2 }}
        viewBox="0 0 1200 520"
        fill="none"
        preserveAspectRatio="xMidYMax meet"
      >
        <path
          d="M -80 520
             C 20 430, 130 330, 240 305
             C 350 280, 440 350, 500 300
             C 560 250, 545 150, 640 108
             C 735 66, 845 130, 895 230
             C 945 330, 905 420, 975 460
             C 1010 480, 1085 455, 1280 400"
          stroke="#DAF467"
          strokeWidth="125"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* Woman + dog image — mix-blend-mode: multiply makes white bg disappear */}
      <div
        className="absolute inset-0 flex items-end justify-center pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <img
          src="/contacts-person.png"
          alt="Жена с куче"
          className="object-contain object-bottom w-auto"
          style={{
            height: "90vh",
            maxWidth: "580px",
            mixBlendMode: "multiply",
          }}
        />
      </div>

      {/* WOOF sticker — top left */}
      <div
        className="absolute hidden md:block"
        style={{ top: "9%", left: "4%", zIndex: 20 }}
      >
        <Sticker text="WOOF" color="orange" rotation={-10} size="xl" />
      </div>

      {/* WW circle sticker — left, middle */}
      <div
        className="absolute hidden md:flex items-center justify-center rounded-full shadow-2xl"
        style={{
          width: 78,
          height: 78,
          backgroundColor: "#5B2FA6",
          bottom: "33%",
          left: "13%",
          transform: "rotate(14deg)",
          zIndex: 20,
        }}
      >
        <div className="flex flex-col items-center gap-0.5">
          {/* Small bone/paw icon */}
          <svg width="26" height="18" viewBox="0 0 26 18" fill="none">
            <path
              d="M2 9 C2 5 5 3 8 5 L18 13 C21 15 24 13 24 9 C24 5 21 3 18 5"
              stroke="#DAF467"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="4" cy="4" r="2.5" fill="#DAF467" />
            <circle cx="22" cy="14" r="2.5" fill="#DAF467" />
          </svg>
          <span className="text-[#DAF467] font-black text-xs leading-none select-none">
            WW
          </span>
        </div>
      </div>

      {/* GOOOOD DOGGY circle — right side */}
      <div
        className="absolute hidden md:flex items-center justify-center rounded-full shadow-2xl"
        style={{
          width: 78,
          height: 78,
          backgroundColor: "#EF3988",
          bottom: "43%",
          right: "11%",
          transform: "rotate(-7deg)",
          zIndex: 20,
        }}
      >
        <span
          className="font-black text-white text-center leading-tight select-none uppercase"
          style={{ fontSize: 9, letterSpacing: "0.04em", padding: "0 8px" }}
        >
          GOOOOOD<br />DOGGY
        </span>
      </div>

      {/* Contact info — bottom left */}
      <div
        className="absolute hidden lg:flex flex-col gap-3"
        style={{ bottom: "9%", left: "5%", zIndex: 20 }}
      >
        <a
          href="tel:+359888123456"
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
        >
          <Phone className="w-4 h-4" />
          +359 888 123 456
        </a>
        <a
          href="mailto:info@drpetfriends.bg"
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
        >
          <Mail className="w-4 h-4" />
          info@drpetfriends.bg
        </a>
      </div>

      {/* Tagline bottom center */}
      <div
        className="absolute bottom-4 left-0 right-0 text-center"
        style={{ zIndex: 20 }}
      >
        <p className="text-white/45 text-xs tracking-widest uppercase">
          Care you can trust &nbsp;·&nbsp; Your pet is our friend
        </p>
      </div>

      {/* Section height */}
      <div style={{ height: "100vh" }} />
    </section>
  )
}
