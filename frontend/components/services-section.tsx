"use client"

import { useState } from "react"
import { Stethoscope, Scissors } from "lucide-react"

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

export function ServicesSection() {
  const [tab, setTab] = useState<"vet" | "grooming">("vet")
  const services = tab === "vet" ? vetServices : groomingServices

  return (
    <section className="bg-white pt-16 pb-4 overflow-hidden">
      <div className="container">

        {/* Clean section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-[#1083BD] text-xs font-bold uppercase tracking-widest mb-3">Платформа</p>
            <h2 className="font-display font-black text-4xl md:text-5xl text-[#191919] leading-tight">
              Всички услуги
              <br />
              <span className="text-[#EF3988]">на едно място</span>
            </h2>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-gray-100 rounded-full p-1 gap-1 shrink-0">
            <button
              onClick={() => setTab("vet")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                tab === "vet" ? "bg-[#1083BD] text-white shadow-md" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              Ветеринарни
            </button>
            <button
              onClick={() => setTab("grooming")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                tab === "grooming" ? "bg-[#EF3988] text-white shadow-md" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Scissors className="w-4 h-4" />
              Груминг
            </button>
          </div>
        </div>

      </div>

      {/* Full-width marquee */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          maskImage: "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)",
        }}
      >
        <div
          className="flex gap-4 w-max animate-scroll-right hover:[animation-play-state:paused] py-6 px-4"
          style={{ animationDuration: "40s" }}
        >
          {[...services, ...services].map((service, index) => (
            <div
              key={`${tab}-${index}`}
              className={`
                ${service.bgColor} ${service.textColor}
                ${service.hasBorder ? "border-2 border-[#1083BD]/15" : ""}
                rounded-2xl p-4 flex flex-col shrink-0 w-52
                hover:scale-[1.04] hover:-translate-y-1.5 hover:shadow-xl
                cursor-pointer transition-all duration-300 group
              `}
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-white/20 mb-3">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h4 className="font-bold text-sm">{service.name}</h4>
              <p className="text-[11px] mt-0.5 opacity-70">{service.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
