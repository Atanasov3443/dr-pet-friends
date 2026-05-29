"use client"

import { useEffect, useState } from "react"
import { Search, MapPin, X } from "lucide-react"

export function StickySearchButtons() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [type, setType] = useState<"vet" | "grooming">("vet")

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
      {/* Page-bottom shadow vignette */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/15 to-transparent pointer-events-none -z-10" />

      <div className="ml-auto w-fit">
        {/* Main card */}
        <div className="bg-white/97 backdrop-blur-md rounded-2xl shadow-[0_-4px_30px_rgba(0,0,0,0.12)] border border-gray-100 p-2.5">

          {/* — Desktop layout — */}
          <div className="hidden md:flex items-center gap-2">

            {/* Tab pills */}
            <div className="flex gap-1 shrink-0 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setType("vet")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  type === "vet" ? "bg-[#1083BD] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                🐾 Ветеринар
              </button>
              <button
                onClick={() => setType("grooming")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  type === "grooming" ? "bg-[#EF3988] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                ✂️ Груминг
              </button>
            </div>

            <div className="w-px h-8 bg-gray-200 shrink-0 mx-0.5" />

            {/* Input */}
            <div className="w-40 relative shrink-0">
              <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <input
                placeholder="Град"
                className="w-full pl-7 pr-2 py-2 text-xs rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-gray-300 focus:bg-white text-gray-700 placeholder:text-gray-400 transition-colors"
              />
            </div>

            {/* Search CTA */}
            <button
              className={`shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white font-bold text-xs transition-all whitespace-nowrap shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-100 ${
                type === "vet" ? "bg-[#1083BD] hover:bg-[#0d6fa0]" : "bg-[#EF3988] hover:bg-[#d42f77]"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Търси
            </button>

            {/* Dismiss */}
            <button
              onClick={() => setDismissed(true)}
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* — Mobile layout — */}
          <div className="md:hidden">
            <div className="flex gap-1.5 mb-2">
              <button
                onClick={() => setType("vet")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  type === "vet" ? "bg-[#1083BD] text-white shadow-sm" : "bg-gray-100 text-gray-500"
                }`}
              >
                🐾 Ветеринар
              </button>
              <button
                onClick={() => setType("grooming")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  type === "grooming" ? "bg-[#EF3988] text-white shadow-sm" : "bg-gray-100 text-gray-500"
                }`}
              >
                ✂️ Груминг
              </button>
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
                  placeholder="Град"
                  className="w-full pl-8 pr-2 py-2.5 text-sm rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-gray-300 text-gray-700 placeholder:text-gray-400"
                />
              </div>
              <button
                className={`shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white font-bold text-sm transition-all ${
                  type === "vet" ? "bg-[#1083BD] hover:bg-[#0d6fa0]" : "bg-[#EF3988] hover:bg-[#d42f77]"
                }`}
              >
                <Search className="w-4 h-4" />
                Търси
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
