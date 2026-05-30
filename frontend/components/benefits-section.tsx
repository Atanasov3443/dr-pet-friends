import { Sticker, PawSticker } from "@/components/sticker"
import { HeartHandshake, ShoppingBag, ShieldCheck } from "lucide-react"

const benefits = [
  {
    icon: HeartHandshake,
    title: "Насоки и подкрепа",
    description: "Ще работим с вас, за да разберем здравните нужди на любимеца ви и ще предоставим ясни насоки за следващите стъпки — от диагноза до лечение.",
    accent: "#DAF467",
    iconBg: "bg-[#DAF467]",
    iconColor: "text-[#1083BD]",
  },
  {
    icon: ShoppingBag,
    title: "Препоръки за продукти",
    description: "Специалистите в нашата мрежа могат да препоръчат подходящи продукти за грижа — храна, добавки, козметика — съобразени с нуждите на вашия любимец.",
    accent: "#EF3988",
    iconBg: "bg-[#EF3988]",
    iconColor: "text-white",
  },
  {
    icon: ShieldCheck,
    title: "Спокойствие на духа",
    description: "С достъп до проверени специалисти 24/7 и реални отзиви от хиляди собственици, можете да сте сигурни, че любимецът ви е в добри ръце.",
    accent: "#10B83D",
    iconBg: "bg-[#10B83D]",
    iconColor: "text-white",
  },
]

export function BenefitsSection() {
  return (
    <section className="py-24 bg-[#191919] relative overflow-hidden">
      {/* Decorative blobs */}
      <svg
        className="absolute -top-20 -left-20 w-96 h-96 pointer-events-none"
        viewBox="0 0 400 400" fill="none"
      >
        <path
          d="M350 200C360 270 310 350 220 370C130 390 40 340 20 250C0 160 60 70 150 50C240 30 310 80 350 160C360 180 355 195 350 200Z"
          fill="#1083BD" opacity="0.15"
        />
      </svg>
      <svg
        className="absolute -bottom-20 -right-20 w-80 h-80 pointer-events-none"
        viewBox="0 0 300 300" fill="none"
      >
        <circle cx="200" cy="200" r="180" fill="#EF3988" opacity="0.08" />
      </svg>

      {/* Stickers */}
      <div className="absolute top-10 right-[8%] hidden lg:block">
        <Sticker text="WOOF" color="orange" rotation={-8} size="md" />
      </div>
      <div className="absolute bottom-10 left-[6%] hidden lg:block">
        <PawSticker color="lime" icon="bone" rotation={12} />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            Полагайте добра грижа за <span className="text-[#DAF467]">вашия любимец</span>
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            С помощта на Dr. Pet Friend вашият любимец ще получи вниманието, което заслужава.
          </p>
        </div>

        {/* Benefits 3-column */}
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((b, i) => {
            const Icon = b.icon
            return (
              <div key={i} className="flex flex-col items-start">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${b.iconBg} flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon className={`w-7 h-7 ${b.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="font-display font-bold text-xl text-white mb-3">
                  {b.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {b.description}
                </p>

                {/* Colored underline accent */}
                <div
                  className="mt-6 h-1 w-12 rounded-full"
                  style={{ backgroundColor: b.accent }}
                />
              </div>
            )
          })}
        </div>

        {/* Bottom stat bar */}
        <div className="mt-20 pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "10 000+", label: "Доволни клиенти" },
            { value: "200+",    label: "Проверени специалисти" },
            { value: "97%",     label: "Удовлетвореност" },
            { value: "20+",     label: "Вида животни" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="font-display font-black text-4xl text-[#DAF467] mb-1">{stat.value}</div>
              <div className="text-white/50 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
