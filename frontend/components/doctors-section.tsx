"use client"

import { Button } from "@/components/ui/button"
import { Star, CalendarCheck, Stethoscope } from "lucide-react"
import { GlowCard } from "@/components/ui/spotlight-card"
import SphereImageGrid, { ImageData } from "@/components/ui/img-sphere"
import Link from "next/link"



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
]

export function DoctorsSection() {

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
                  <span className="text-[#1083BD]">Ветеринари</span>
                </h2>
                <p className="text-gray-500 text-base leading-relaxed max-w-sm">
                  Проверени специалисти с реални отзиви, онлайн записи и прозрачни цени — всичко на едно място.
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                {[["200+", "Ветеринари"], ["4.9★", "Средна оценка"], ["15+", "Специалности"]].map(([num, label]) => (
                  <div key={label}>
                    <p className="font-black text-2xl leading-none text-[#1083BD]">{num}</p>
                    <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest">{label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <Link href="/search">
                  <Button className="bg-[#1083BD] hover:bg-[#0D67F7] text-white rounded-full px-8 font-bold h-11 shadow-lg transition-all hover:scale-[1.02]">
                    Виж всички ветеринари
                  </Button>
                </Link>
              </div>

            </div>

            {/* ── Right — sphere ── */}
            <div className="relative flex flex-col items-center">
              {/* Glow behind sphere */}
              <div className="absolute inset-0 rounded-full blur-3xl opacity-20 pointer-events-none bg-[#1083BD]" />
              <SphereImageGrid
                images={[...specialists, ...specialists].map((p, i) => ({
                  id: `specialist-${i}`,
                  src: p.image,
                  alt: p.name,
                  title: p.name,
                  description: `${p.specialty} · ${p.experience}`,
                  label: p.specialty,
                  labelColor: "#1083BD",
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


    </section>
  )
}
