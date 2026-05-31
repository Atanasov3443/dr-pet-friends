"use client"

import { useEffect, useState } from "react"
import { Search, MapPin, X } from "lucide-react"
import Link from "next/link"

export function StickySearchButtons() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [city, setCity] = useState("")

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 1200)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const show = visible && !dismissed

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-2
        transition-all duration-500 ease-out
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"}
      `}
    >
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/15 to-transparent pointer-events-none -z-10" />

      <div className="ml-auto w-fit">
        <div className="bg-white/97 backdrop-blur-md rounded-2xl shadow-[0_-4px_30px_rgba(0,0,0,0.12)] border border-gray-100 p-2.5">

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#1083BD]">
              🐾 Намери ветеринар
            </span>

            <div className="w-px h-8 bg-gray-200 shrink-0 mx-0.5" />

            <div className="w-40 relative shrink-0">
              <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Град"
                className="w-full pl-7 pr-2 py-2 text-xs rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-gray-300 focus:bg-white text-gray-700 placeholder:text-gray-400 transition-colors"
              />
            </div>

            <Link
              href={`/search${city ? `?city=${encodeURIComponent(city)}` : ""}`}
              className="shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1083BD] hover:bg-[#0d6fa0] text-white font-bold text-xs transition-all whitespace-nowrap shadow-sm hover:shadow-md hover:scale-[1.02]"
            >
              <Search className="w-3.5 h-3.5" /> Търси
            </Link>

            <button
              onClick={() => setDismissed(true)}
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <div className="flex gap-1.5 mb-2">
              <span className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-[#1083BD] text-white">
                🐾 Намери ветеринар
              </span>
              <button
                onClick={() => setDismissed(true)}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex gap-1.5">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Град"
                  className="w-full pl-8 pr-2 py-2.5 text-sm rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-gray-300 text-gray-700 placeholder:text-gray-400"
                />
              </div>
              <Link
                href={`/search${city ? `?city=${encodeURIComponent(city)}` : ""}`}
                className="shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1083BD] hover:bg-[#0d6fa0] text-white font-bold text-sm"
              >
                <Search className="w-4 h-4" /> Търси
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
