import { 
  Stethoscope, 
  Syringe, 
  Scissors, 
  Heart, 
  Eye, 
  Bone, 
  Bug, 
  Pill 
} from "lucide-react"
import { Sticker } from "@/components/sticker"

const specialties = [
  { 
    icon: Stethoscope, 
    name: "Общ преглед", 
    color: "bg-[#1083BD]",
    textColor: "text-white"
  },
  { 
    icon: Syringe, 
    name: "Ваксинации", 
    color: "bg-[#DAF467]",
    textColor: "text-[#1083BD]"
  },
  { 
    icon: Scissors, 
    name: "Хирургия", 
    color: "bg-[#EF3988]",
    textColor: "text-white"
  },
  { 
    icon: Heart, 
    name: "Кардиология", 
    color: "bg-[#10B83D]",
    textColor: "text-white"
  },
  { 
    icon: Eye, 
    name: "Офталмология", 
    color: "bg-[#FF6B35]",
    textColor: "text-white"
  },
  { 
    icon: Bone, 
    name: "Ортопедия", 
    color: "bg-[#0D67F7]",
    textColor: "text-white"
  },
  { 
    icon: Bug, 
    name: "Дерматология", 
    color: "bg-[#EF3988]",
    textColor: "text-white"
  },
  { 
    icon: Pill, 
    name: "Терапия", 
    color: "bg-[#DAF467]",
    textColor: "text-[#1083BD]"
  },
]

export function SpecialtiesSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 hidden lg:block">
        <Sticker text="WOOF" color="orange" rotation={8} size="sm" />
      </div>
      <div className="absolute bottom-10 left-10 hidden lg:block">
        <Sticker text="PURRRR" color="pink" rotation={-5} size="sm" />
      </div>

      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-[#1083BD] mb-4">
            Популярни <span className="text-[#EF3988]">специалности</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Изберете от широка гама ветеринарни услуги за вашия любимец
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {specialties.map((specialty, index) => {
            const Icon = specialty.icon
            return (
              <div
                key={index}
                className={`
                  ${specialty.color} ${specialty.textColor}
                  rounded-2xl p-6 flex flex-col items-center text-center
                  transform transition-all duration-300
                  hover:scale-105 hover:shadow-xl cursor-pointer
                  group
                `}
              >
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8" />
                </div>
                <span className="font-semibold text-sm md:text-base">{specialty.name}</span>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <button className="text-[#1083BD] font-semibold hover:text-[#EF3988] transition-colors">
            Виж всички специалности →
          </button>
        </div>
      </div>
    </section>
  )
}
