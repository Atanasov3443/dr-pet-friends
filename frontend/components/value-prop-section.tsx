import { Sticker, PawSticker } from "@/components/sticker"
import { Search, Clock, BookOpen } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Намери правилния специалист",
    description: "Разглеждай профили на ветеринари и грумери, четете реални отзиви от собственици на любимци и избери специалиста, на когото се доверяваш.",
    bg: "bg-[#DAF467]",
    iconColor: "text-[#1083BD]",
    textColor: "text-[#1083BD]",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=200&fit=crop&crop=faces",
  },
  {
    icon: Clock,
    title: "Достъп до грижа 24/7",
    description: "Резервирай час по всяко време — без телефонни обаждания. Потвърждение по имейл и SMS веднага. Спешни клиники достъпни денонощно.",
    bg: "bg-[#EF3988]",
    iconColor: "text-white",
    textColor: "text-white",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=200&fit=crop&crop=faces",
  },
  {
    icon: BookOpen,
    title: "Здравен дневник на любимеца",
    description: "Пази пълна история на прегледи, ваксини и лечения на едно място. Получавай напомняния за предстоящи ваксини и профилактични прегледи.",
    bg: "bg-[#1083BD]",
    iconColor: "text-[#DAF467]",
    textColor: "text-white",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=200&fit=crop&crop=faces",
  },
]

export function ValuePropSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <svg
        className="absolute -top-20 -right-20 w-80 h-80 pointer-events-none"
        viewBox="0 0 300 300" fill="none"
      >
        <circle cx="200" cy="100" r="180" fill="#DAF467" opacity="0.12" />
      </svg>

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sticker text="WOOF" color="orange" rotation={-5} size="sm" />
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl lg:text-6xl text-[#1083BD] leading-tight mb-6">
            Само <span className="text-[#EF3988]">Dr. Pet Friend</span> ти дава
            <br />свободата да избереш
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Хиляди проверени ветеринари, грумери и клиники — всички на едно място.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <div
                key={i}
                className={`${f.bg} rounded-3xl overflow-hidden group hover:scale-[1.02] transition-transform duration-300 cursor-pointer`}
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={f.image}
                    alt={f.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className={`absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${f.iconColor}`} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className={`font-display font-bold text-xl mb-3 ${f.textColor}`}>
                    {f.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${f.textColor} opacity-85`}>
                    {f.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
