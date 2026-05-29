"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Sticker, PawSticker } from "@/components/sticker"
import { GlowCard } from "@/components/ui/spotlight-card"

const faqs = [
  {
    question: "Безплатно ли е използването на платформата?",
    answer: "Да! За собствениците на домашни любимци платформата е напълно безплатна. Търсете, сравнявайте и резервирайте часове без никакви такси."
  },
  {
    question: "Как работи онлайн резервацията?",
    answer: "Намерете специалист чрез търсачката, изберете услуга и удобен час от наличния график. Потвърждение ще получите веднага по имейл или SMS."
  },
  {
    question: "Мога ли да намеря спешен ветеринар нощем?",
    answer: "Да! Платформата показва кои клиники работят 24/7. В секцията 'Спешни случаи' ще намерите дежурните ветеринари близо до вас."
  },
  {
    question: "Какви видове услуги може да резервирам?",
    answer: "Ветеринарни прегледи, груминг, ваксинации, дентална грижа, хирургия и много повече — за кучета, котки, зайци, птици и екзотични животни."
  },
  {
    question: "Мога ли да оценя ветеринара след посещение?",
    answer: "Да! След всяко посещение ще получите покана да оставите оценка. Реалните отзиви от потребители помагат на останалите да изберат правилния специалист."
  },
  {
    question: "Как да регистрирам своята клиника или практика?",
    answer: "Кликнете 'Регистрирай клиника' в горното меню или се свържете с нас. Регистрацията е безплатна и ще получите пълен достъп до системата за управление на записи."
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <svg 
        className="absolute -top-20 -right-20 w-[300px] h-[300px] pointer-events-none"
        viewBox="0 0 300 300"
        fill="none"
      >
        <circle cx="200" cy="100" r="150" fill="#DAF467" opacity="0.3" />
      </svg>
      
      {/* Sticker */}
      <div className="absolute bottom-20 left-[10%] hidden lg:block">
        <PawSticker color="pink" icon="paw" rotation={-12} />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 rounded-full bg-[#EF3988] flex items-center justify-center">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-[#1083BD]">
            Често задавани <span className="text-[#EF3988]">въпроси</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* FAQ accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className={`
                  border-2 rounded-2xl overflow-hidden transition-all duration-300
                  ${openIndex === index 
                    ? 'border-[#1083BD] bg-[#1083BD]/5' 
                    : 'border-gray-200 hover:border-[#1083BD]/50'
                  }
                `}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className={`font-semibold ${openIndex === index ? 'text-[#1083BD]' : 'text-gray-800'}`}>
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180 text-[#EF3988]' : 'text-gray-400'
                    }`}
                  />
                </button>
                
                {openIndex === index && (
                  <div className="px-5 pb-5">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Image side */}
          <div className="relative hidden lg:block">
            <div className="sticky top-24">
              <div className="relative">
                <GlowCard customSize glowColor="blue" className="w-full p-0">
                  <img
                    src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=600&fit=crop"
                    alt="Куче"
                    className="w-full rounded-2xl block"
                  />
                </GlowCard>
                
                {/* Decorative stickers */}
                <div className="absolute -top-4 -left-4">
                  <Sticker text="WOOF" color="pink" rotation={-8} size="lg" />
                </div>
                <div className="absolute -bottom-4 -right-4">
                  <PawSticker color="green" rotation={12} withBone />
                </div>
                
                {/* Stats card */}
                <div className="absolute bottom-8 left-8 bg-white rounded-2xl p-4 shadow-xl">
                  <div className="text-[#EF3988] font-display font-bold text-3xl">98%</div>
                  <div className="text-gray-600 text-sm">Удовлетвореност</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full leading-none pointer-events-none z-10"><svg viewBox="0 0 1440 50" fill="white" preserveAspectRatio="none" className="w-full h-12 block"><polygon points="0,50 1440,0 1440,50" /></svg></div>
    </section>
  )
}
