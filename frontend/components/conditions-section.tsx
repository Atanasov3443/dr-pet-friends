"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sticker } from "@/components/sticker"

const conditions = [
  {
    name: "Дихателни проблеми",
    description: "Кашлица, задух, хъркане, хронични инфекции на дихателната система.",
  },
  {
    name: "Дентална и устна грижа",
    description: "Зъбен камък, венечно заболяване, проблеми с дъвченето, зъбни болки.",
  },
  {
    name: "Рани и наранявания",
    description: "Порязвания, ухапвания, изгаряния, следоперативна грижа за рани.",
  },
  {
    name: "Промени в апетит и тегло",
    description: "Загуба на апетит, наддаване или отслабване без причина, прекомерна жажда.",
  },
  {
    name: "Кожни и ушни проблеми",
    description: "Сърбеж, обриви, косопад, ушни инфекции, алергични реакции.",
  },
  {
    name: "Хронични заболявания",
    description: "Диабет, бъбречна недостатъчност, сърдечни заболявания, артрит.",
  },
  {
    name: "Оценка на качеството на живот",
    description: "Палиативни грижи, управление на болката, консултации за хронично болни животни.",
  },
  {
    name: "Бучки и новообразувания",
    description: "Нови израстъци по кожата, подутини, лимфни възли — ранна диагностика.",
  },
  {
    name: "Алергии и непоносимост",
    description: "Хранителни алергии, реакции към среда, сезонни алергии.",
  },
  {
    name: "Опорно-двигателни проблеми",
    description: "Куцане, болки в ставите, дисплазия, проблеми с гръбначния стълб.",
  },
  {
    name: "Репродуктивно здраве",
    description: "Бременност, стерилизация, хормонални нарушения, млечна жлеза.",
  },
  {
    name: "Поведенчески проблеми",
    description: "Агресия, тревожност, разрушително поведение, проблеми с тренировката.",
  },
]

export function ConditionsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <svg
        className="absolute top-0 left-0 w-72 h-72 pointer-events-none"
        viewBox="0 0 300 300" fill="none"
      >
        <circle cx="50" cy="50" r="180" fill="#1083BD" opacity="0.05" />
      </svg>

      <div className="container relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#EF3988] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <Sticker text="GOOOOOD DOGGY" color="green" rotation={-3} size="sm" />
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-[#1083BD] mb-4">
              Запазете час за <span className="text-[#EF3988]">всяка нужда</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl">
              Нашите специалисти могат да помогнат при широк спектър от здравни теми за вашия любимец.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button className="bg-[#EF3988] hover:bg-[#d92d75] text-white rounded-full px-8 font-semibold">
              Търси специалист
            </Button>
          </div>
        </div>

        {/* Conditions grid — two columns, accordion style */}
        <div className="grid md:grid-cols-2 gap-3">
          {conditions.map((condition, index) => (
            <div
              key={index}
              className={`
                rounded-2xl border-2 overflow-hidden transition-all duration-200 cursor-pointer
                ${openIndex === index
                  ? "border-[#1083BD] bg-white shadow-md"
                  : "border-gray-200 bg-white hover:border-[#1083BD]/40"
                }
              `}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex items-center justify-between px-5 py-4">
                <span className={`font-semibold ${openIndex === index ? "text-[#1083BD]" : "text-gray-800"}`}>
                  {condition.name}
                </span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180 text-[#EF3988]" : "text-gray-400"
                  }`}
                />
              </div>
              {openIndex === index && (
                <div className="px-5 pb-4">
                  <p className="text-gray-600 text-sm leading-relaxed">{condition.description}</p>
                  <button className="mt-3 text-[#EF3988] text-sm font-semibold hover:underline">
                    Намери специалист →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
