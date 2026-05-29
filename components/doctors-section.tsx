"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Star, CalendarCheck, Scissors, Stethoscope } from "lucide-react"
import { GlowCard } from "@/components/ui/spotlight-card"
import SphereImageGrid, { ImageData } from "@/components/ui/img-sphere"

const vetServices = [
  { name: "Офталмология",       price: "от 50лв",  image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop",      bgColor: "bg-[#DAF467]",  textColor: "text-[#1083BD]" },
  { name: "Дентална грижа",     price: "от 80лв",  image: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=300&h=300&fit=crop",      bgColor: "bg-white",      textColor: "text-[#1083BD]", hasBorder: true },
  { name: "Дерматология",       price: "от 60лв",  image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&h=300&fit=crop",      bgColor: "bg-[#1083BD]",  textColor: "text-white" },
  { name: "Терапия",            price: "от 45лв",  image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=300&h=300&fit=crop",          bgColor: "bg-[#10B83D]",  textColor: "text-white" },
  { name: "Хирургия",           price: "от 150лв", image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&h=300&fit=crop",          bgColor: "bg-[#FF6B35]",  textColor: "text-white" },
  { name: "Рентген",            price: "от 70лв",  image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=300&h=300&fit=crop",       bgColor: "bg-[#EF3988]",  textColor: "text-white" },
  { name: "Кардиология",        price: "от 90лв",  image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=300&h=300&fit=crop",       bgColor: "bg-[#1083BD]",  textColor: "text-white" },
  { name: "Ваксинация",         price: "от 25лв",  image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=300&h=300&fit=crop",       bgColor: "bg-[#DAF467]",  textColor: "text-[#1083BD]" },
  { name: "Ортопедия",          price: "от 120лв", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop",       bgColor: "bg-white",      textColor: "text-[#1083BD]", hasBorder: true },
  { name: "Неврология",         price: "от 100лв", image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=300&h=300&fit=crop",       bgColor: "bg-[#EF3988]",  textColor: "text-white" },
]

const groomingServices = [
  { name: "Пълен груминг",      price: "от 40лв",  image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=300&h=300&fit=crop",       bgColor: "bg-[#EF3988]",  textColor: "text-white" },
  { name: "Баня & Сешоар",      price: "от 25лв",  image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&h=300&fit=crop",          bgColor: "bg-[#DAF467]",  textColor: "text-[#1083BD]" },
  { name: "Подстригване",       price: "от 30лв",  image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&h=300&fit=crop",       bgColor: "bg-[#1083BD]",  textColor: "text-white" },
  { name: "Нокти & Уши",        price: "от 15лв",  image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop",       bgColor: "bg-[#10B83D]",  textColor: "text-white" },
  { name: "SPA третиране",      price: "от 55лв",  image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=300&h=300&fit=crop",          bgColor: "bg-[#FF6B35]",  textColor: "text-white" },
  { name: "Зъбна хигиена",      price: "от 20лв",  image: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=300&h=300&fit=crop",       bgColor: "bg-white",      textColor: "text-[#1083BD]", hasBorder: true },
  { name: "Стайлинг",           price: "от 45лв",  image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=300&h=300&fit=crop",       bgColor: "bg-[#1083BD]",  textColor: "text-white" },
  { name: "Боядисване",         price: "от 60лв",  image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=300&h=300&fit=crop",       bgColor: "bg-[#EF3988]",  textColor: "text-white" },
  { name: "Котешки груминг",    price: "от 35лв",  image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=300&h=300&fit=crop",       bgColor: "bg-[#DAF467]",  textColor: "text-[#1083BD]" },
  { name: "Медицински груминг", price: "от 50лв",  image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop",       bgColor: "bg-white",      textColor: "text-[#1083BD]", hasBorder: true },
]

const specialists = [
  // Ветеринари
  {
    name: "Д-р Мария Иванова",
    specialty: "Хирургия",
    experience: "15 години опит",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=380&fit=crop&crop=faces",
    rating: 4.9,
    type: "vet" as const,
  },
  {
    name: "Д-р Петър Георгиев",
    specialty: "Кардиология",
    experience: "12 години опит",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=380&fit=crop&crop=faces",
    rating: 4.8,
    type: "vet" as const,
  },
  {
    name: "Д-р Елена Димитрова",
    specialty: "Дерматология",
    experience: "10 години опит",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=380&fit=crop&crop=faces",
    rating: 4.9,
    type: "vet" as const,
  },
  {
    name: "Д-р Николай Стоянов",
    specialty: "Офталмология",
    experience: "8 години опит",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=380&fit=crop&crop=faces",
    rating: 4.7,
    type: "vet" as const,
  },
  {
    name: "Д-р Анна Колева",
    specialty: "Ортопедия",
    experience: "11 години опит",
    image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=300&h=380&fit=crop&crop=faces",
    rating: 4.9,
    type: "vet" as const,
  },
  {
    name: "Д-р Георги Тодоров",
    specialty: "Терапия",
    experience: "9 години опит",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=380&fit=crop&crop=faces",
    rating: 4.8,
    type: "vet" as const,
  },
  {
    name: "Д-р Ивета Маринова",
    specialty: "Неврология",
    experience: "13 години опит",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=380&fit=crop&crop=faces",
    rating: 4.8,
    type: "vet" as const,
  },
  {
    name: "Д-р Красимир Ангелов",
    specialty: "Ваксинации",
    experience: "7 години опит",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=380&fit=crop&crop=faces",
    rating: 4.7,
    type: "vet" as const,
  },
  {
    name: "Д-р Силвия Нейкова",
    specialty: "Дентална грижа",
    experience: "9 години опит",
    image: "https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=300&h=380&fit=crop&crop=faces",
    rating: 4.9,
    type: "vet" as const,
  },
  {
    name: "Д-р Любомир Петков",
    specialty: "Рентген",
    experience: "11 години опит",
    image: "https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=300&h=380&fit=crop&crop=faces",
    rating: 4.6,
    type: "vet" as const,
  },
  // Груминг
  {
    name: "Виктория Петрова",
    specialty: "Кучешки груминг",
    experience: "8 години опит",
    image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=300&h=380&fit=crop&crop=faces",
    rating: 4.9,
    type: "grooming" as const,
  },
  {
    name: "Александра Христова",
    specialty: "Котешки груминг",
    experience: "6 години опит",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=300&h=380&fit=crop&crop=faces",
    rating: 4.8,
    type: "grooming" as const,
  },
  {
    name: "Симон Илиев",
    specialty: "SPA & Релакс",
    experience: "5 години опит",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=380&fit=crop&crop=faces",
    rating: 4.7,
    type: "grooming" as const,
  },
  {
    name: "Надежда Вълева",
    specialty: "Медицински груминг",
    experience: "9 години опит",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=380&fit=crop&crop=faces",
    rating: 4.9,
    type: "grooming" as const,
  },
  {
    name: "Калина Стефанова",
    specialty: "Стайлинг & Боядисване",
    experience: "7 години опит",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=380&fit=crop&crop=faces",
    rating: 4.8,
    type: "grooming" as const,
  },
  {
    name: "Борис Димитров",
    specialty: "Хигиена & Баня",
    experience: "4 години опит",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=380&fit=crop&crop=faces",
    rating: 4.6,
    type: "grooming" as const,
  },
  {
    name: "Теодора Янева",
    specialty: "SPA & Ароматерапия",
    experience: "6 години опит",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=380&fit=crop&crop=faces",
    rating: 4.8,
    type: "grooming" as const,
  },
  {
    name: "Мартина Събева",
    specialty: "Подстригване",
    experience: "5 години опит",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=380&fit=crop&crop=faces",
    rating: 4.7,
    type: "grooming" as const,
  },
  {
    name: "Румен Василев",
    specialty: "Стайлинг",
    experience: "8 години опит",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=380&fit=crop&crop=faces",
    rating: 4.9,
    type: "grooming" as const,
  },
  {
    name: "Десислава Тончева",
    specialty: "Нокти & Уши",
    experience: "3 години опит",
    image: "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=300&h=380&fit=crop&crop=faces",
    rating: 4.7,
    type: "grooming" as const,
  },
]

export function DoctorsSection() {
  const [tab, setTab] = useState<"vet" | "grooming">("vet")

  return (
    <section className="relative overflow-hidden bg-gray-50">
      {/* Decorative illustration */}
      <img
        src="/animal-illustration-4.svg"
        alt="" aria-hidden
        className="absolute bottom-52 right-0 w-80 pointer-events-none select-none hidden lg:block"
        style={{
          opacity: 0.06,
          filter: "invert(38%) sepia(77%) saturate(500%) hue-rotate(164deg) brightness(90%)",
        }}
      />

      {/* ── UNIFIED SECTION ── */}
      <div className="py-16">
        <div className="container">

          <div className="grid lg:grid-cols-2 gap-4 items-center">

            {/* ── Left ── */}
            <div className="flex flex-col gap-6">

              <div>
                <div className="inline-flex items-center gap-2 bg-[#1083BD]/10 border border-[#1083BD]/25 rounded-full px-4 py-1.5 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#1083BD] animate-pulse" />
                  <span className="text-[#1083BD] text-xs font-semibold uppercase tracking-widest">Открийте специалисти за вашия любимец</span>
                </div>
                <h2 className="font-display font-black text-4xl md:text-5xl text-[#191919] leading-tight mb-3">
                  Открийте нашите
                  <br />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={tab}
                      className={`inline-block ${tab === "vet" ? "text-[#1083BD]" : "text-[#EF3988]"}`}
                      initial={{ y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -12, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {tab === "vet" ? "Ветеринари" : "Грумъри"}
                    </motion.span>
                  </AnimatePresence>
                </h2>
                <p className="text-gray-500 text-base leading-relaxed max-w-sm">
                  {tab === "vet"
                    ? "Проверени специалисти с реални отзиви, онлайн записи и прозрачни цени — всичко на едно място."
                    : "Намерете най-добрия груминг салон за вашия любимец — с реални снимки, отзиви и онлайн записи."}
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                {(tab === "vet"
                  ? [["200+", "Ветеринари"], ["4.9★", "Средна оценка"], ["15+", "Специалности"]]
                  : [["80+", "Груминг салона"], ["4.8★", "Средна оценка"], ["10+", "Вида услуги"]]
                ).map(([num, label]) => (
                  <div key={label}>
                    <p className={`font-black text-2xl leading-none ${tab === "vet" ? "text-[#1083BD]" : "text-[#EF3988]"}`}>{num}</p>
                    <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">{label}</p>
                  </div>
                ))}
              </div>

              {/* Tab switcher */}
              <div className="flex bg-gray-100 rounded-2xl p-1.5 gap-1.5 w-fit">
                <button onClick={() => setTab("vet")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "vet" ? "bg-[#1083BD] text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}>
                  <Stethoscope className="w-4 h-4" /> Ветеринари
                </button>
                <button onClick={() => setTab("grooming")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "grooming" ? "bg-[#EF3988] text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}>
                  <Scissors className="w-4 h-4" /> Груминг
                </button>
              </div>

              <div className="flex items-center gap-3">
                <Button className={`text-white rounded-full px-8 font-bold h-11 shadow-lg transition-all hover:scale-[1.02] ${tab === "vet" ? "bg-[#1083BD] hover:bg-[#0D67F7]" : "bg-[#EF3988] hover:bg-[#d42f77]"}`}>
                  {tab === "vet" ? "Виж всички ветеринари" : "Виж всички салони"}
                </Button>
              </div>

            </div>

            {/* ── Right — sphere ── */}
            <div className="relative flex flex-col items-center">
              {/* Glow behind sphere */}
              <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 pointer-events-none ${tab === "vet" ? "bg-[#1083BD]" : "bg-[#EF3988]"}`} />
              <SphereImageGrid
                images={[...specialists.filter(p => p.type === tab), ...specialists.filter(p => p.type === tab)].map((p, i) => ({
                  id: `specialist-${i}`,
                  src: p.image,
                  alt: p.name,
                  title: p.name,
                  description: `${p.specialty} · ${p.experience}`,
                  label: p.type === "vet" ? p.specialty : "Грумър",
                  labelColor: p.type === "vet" ? "#1083BD" : "#EF3988",
                }) as ImageData)}
                containerSize={700}
                sphereRadius={300}
                autoRotate={true}
                autoRotateSpeed={0.25}
                dragSensitivity={0.7}
                baseImageScale={0.14}
                momentumDecay={0.96}
              />
              <p className="text-gray-400 text-xs mt-2 flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 border border-gray-400 rounded-full flex items-center justify-center text-[8px]">↔</span>
                Завъртете за да разгледате всички специалисти
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* ── SERVICES MARQUEE ── */}
      <div className="mt-4 pb-16">
        <div className="container mb-8">
<h3 className="font-display font-black text-3xl md:text-4xl text-[#191919] leading-tight">
            Всички услуги{" "}
            <span className="text-[#EF3988]">на едно място</span>
          </h3>
        </div>

        <div
          className="relative w-full overflow-hidden flex flex-col gap-3"
          style={{
            maskImage: "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
          }}
        >
          {/* Row 1 — vet, scrolls left */}
          <div className="flex gap-3 w-max py-1 px-4" style={{ animation: "scroll-right 35s linear infinite" }}>
            {[...vetServices, ...vetServices].map((s, i) => (
              <div key={`v-${i}`} className="shrink-0 flex items-center gap-2.5 bg-white border border-gray-100 rounded-2xl px-4 py-2.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
                <div className="w-7 h-7 rounded-lg bg-[#1083BD]/10 flex items-center justify-center shrink-0">
                  <span className="text-[#1083BD]">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                  </span>
                </div>
                <span className="text-[#191919] font-semibold text-sm whitespace-nowrap">{s.name}</span>
                <span className="text-[10px] font-bold text-[#1083BD] bg-[#1083BD]/8 px-2 py-0.5 rounded-full whitespace-nowrap">Ветеринар</span>
              </div>
            ))}
          </div>

          {/* Row 2 — grooming, scrolls right */}
          <div className="flex gap-3 w-max py-1 px-4" style={{
            animation: "scroll-left 30s linear infinite",
          }}>
            {[...groomingServices, ...groomingServices].map((s, i) => (
              <div key={`g-${i}`} className="shrink-0 flex items-center gap-2.5 bg-white border border-gray-100 rounded-2xl px-4 py-2.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                <div className="w-7 h-7 rounded-lg bg-[#EF3988]/10 flex items-center justify-center shrink-0">
                  <span className="text-[#EF3988]">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 3L3 9l9 13 9-13-3-6H6z"/></svg>
                  </span>
                </div>
                <span className="text-[#191919] font-semibold text-sm whitespace-nowrap">{s.name}</span>
                <span className="text-[10px] font-bold text-[#EF3988] bg-[#EF3988]/8 px-2 py-0.5 rounded-full whitespace-nowrap">Груминг</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}
