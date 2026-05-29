"use client"

import { useState, useEffect, useRef } from "react"
import { Search, MapPin, PawPrint } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sticker } from "@/components/sticker"

const photos = [
  {
    cols: "col-span-5",
    src: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=700&h=400&fit=crop&crop=top",
    alt: "Куче",
    sound: "WOOF!",
    soundColor: "orange" as const,
    rotation: -8,
  },
  {
    cols: "col-span-3",
    src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop",
    alt: "Котка",
    sound: "MEOW!",
    soundColor: "pink" as const,
    rotation: 6,
  },
  {
    cols: "col-span-4",
    src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&h=300&fit=crop",
    alt: "Кучета",
    sound: "WOOF WOOF!",
    soundColor: "blue" as const,
    rotation: -5,
  },
  {
    cols: "col-span-3",
    src: "https://images.unsplash.com/photo-1518796745738-41048802f99a?w=400&h=300&fit=crop",
    alt: "Зайче",
    sound: "HOP HOP!",
    soundColor: "green" as const,
    rotation: 7,
  },
  {
    cols: "col-span-2",
    src: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=300&h=300&fit=crop",
    alt: "Хамстер",
    sound: "SQUEAK!",
    soundColor: "pink" as const,
    rotation: -6,
  },
]

function SearchForm() {
  const [searchType, setSearchType] = useState<"vet" | "grooming">("vet")

  return (
    <div className="w-full">
      {/* Toggle */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setSearchType("vet")}
          className={`flex-1 py-2.5 px-4 rounded-full font-semibold text-sm transition-all ${
            searchType === "vet"
              ? "bg-white text-[#1083BD] shadow-lg"
              : "bg-white/15 text-white hover:bg-white/25"
          }`}
        >
          🐾 Търси ветеринар
        </button>
        <button
          onClick={() => setSearchType("grooming")}
          className={`flex-1 py-2.5 px-4 rounded-full font-semibold text-sm transition-all ${
            searchType === "grooming"
              ? "bg-white text-[#EF3988] shadow-lg"
              : "bg-white/15 text-white hover:bg-white/25"
          }`}
        >
          ✂️ Груминг салон
        </button>
      </div>

      {/* Inputs + button */}
      <div className="bg-white rounded-2xl p-3 shadow-2xl">
        <div className="grid md:grid-cols-3 gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1083BD] w-4 h-4" />
            <Input
              placeholder={searchType === "vet" ? "Специалност" : "Вид груминг"}
              className="pl-9 border-gray-100 rounded-xl h-11 text-sm text-gray-700 bg-gray-50"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1083BD] w-4 h-4" />
            <Input placeholder="Град" className="pl-9 border-gray-100 rounded-xl h-11 text-sm text-gray-700 bg-gray-50" />
          </div>
          <div className="relative">
            <PawPrint className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1083BD] w-4 h-4" />
            <Input placeholder="Животно" className="pl-9 border-gray-100 rounded-xl h-11 text-sm text-gray-700 bg-gray-50" />
          </div>
        </div>
        <Button className="w-full mt-2 bg-[#EF3988] hover:bg-[#d42f77] text-white font-semibold rounded-xl h-11 text-sm">
          {searchType === "vet" ? "Търси ветеринар" : "Търси груминг салон"}
        </Button>
      </div>
    </div>
  )
}

export function WelcomeSection() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="bg-white py-24 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full leading-none pointer-events-none z-0"><svg viewBox="0 0 1440 50" fill="white" preserveAspectRatio="none" className="w-full h-12 block"><polygon points="0,50 1440,0 0,0" /></svg></div>

      {/* Decorative blue bones */}
      {[
        { top: "4%",   left: "1%",   size: 120, rot: -30,  op: 0.10 },
        { top: "8%",   left: "12%",  size: 60,  rot:  15,  op: 0.07 },
        { top: "2%",   left: "28%",  size: 80,  rot:  70,  op: 0.08 },
        { top: "2%",   right: "4%",  size: 100, rot:  20,  op: 0.10 },
        { top: "10%",  right: "16%", size: 56,  rot: -45,  op: 0.07 },
        { top: "32%",  left: "0%",   size: 72,  rot:  55,  op: 0.08 },
        { top: "48%",  left: "3%",   size: 96,  rot: -20,  op: 0.07 },
        { top: "38%",  right: "1%",  size: 80,  rot:  40,  op: 0.09 },
        { top: "55%",  right: "10%", size: 52,  rot: -65,  op: 0.06 },
        { bottom: "15%", left: "6%",   size: 90, rot:  80,  op: 0.09 },
        { bottom: "8%",  left: "22%",  size: 64, rot: -10,  op: 0.07 },
        { bottom: "4%",  left: "42%",  size: 76, rot:  35,  op: 0.08 },
        { bottom: "10%", right: "10%", size: 100,rot: -25,  op: 0.10 },
        { bottom: "2%",  right: "2%",  size: 64, rot:  60,  op: 0.07 },
        { top: "22%",  left: "18%",  size: 50,  rot: -55,  op: 0.06 },
        { top: "68%",  left: "32%",  size: 60,  rot:  45,  op: 0.07 },
      ].map((b, i) => (
        <svg
          key={i}
          className="absolute pointer-events-none text-[#1083BD]"
          style={{
            top: b.top, bottom: b.bottom,
            left: b.left, right: b.right,
            width: b.size, height: b.size,
            opacity: b.op,
            transform: `rotate(${b.rot}deg)`,
          }}
          viewBox="0 0 100 100" fill="currentColor"
        >
          <rect x="44" y="19" width="12" height="62" rx="6"/>
          <circle cx="37" cy="25" r="14"/><circle cx="63" cy="25" r="14"/>
          <circle cx="37" cy="75" r="14"/><circle cx="63" cy="75" r="14"/>
        </svg>
      ))}

      <div className="container relative z-10">
        <div className="grid grid-cols-12 grid-rows-2 gap-4 h-[560px]">

          {/* Blue card — search form slides in */}
          <div
            ref={cardRef}
            className="col-span-7 row-span-1 bg-[#1083BD] rounded-3xl px-10 py-8 flex flex-col justify-center relative overflow-hidden"
          >
            <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(80px)",
                transition: visible
                  ? "opacity 0.5s ease-out, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)"
                  : "none",
              }}
            >
              <SearchForm />
            </div>
          </div>

          {/* Photo cards */}
          {photos.map((photo) => (
            <div
              key={photo.alt}
              className={`group ${photo.cols} row-span-1 rounded-3xl overflow-hidden relative cursor-pointer`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out">
                  <Sticker text={photo.sound} color={photo.soundColor} rotation={photo.rotation} size="lg" />
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full leading-none pointer-events-none z-0"><svg viewBox="0 0 1440 50" fill="#EF3988" preserveAspectRatio="none" className="w-full h-12 block"><polygon points="0,0 1440,50 0,50" /></svg></div>
    </section>
  )
}
