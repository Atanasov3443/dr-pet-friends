import { MapPin } from "lucide-react"
import { Sticker, PawSticker } from "@/components/sticker"

const cities = [
  { name: "София", count: 120 },
  { name: "Пловдив", count: 45 },
  { name: "Варна", count: 38 },
  { name: "Бургас", count: 28 },
  { name: "Русе", count: 22 },
  { name: "Стара Загора", count: 18 },
  { name: "Плевен", count: 15 },
  { name: "Благоевград", count: 12 },
  { name: "Велико Търново", count: 11 },
  { name: "Добрич", count: 9 },
  { name: "Шумен", count: 8 },
  { name: "Хасково", count: 7 },
]

export function CitiesSection() {
  return (
    <section className="py-20 bg-[#0D67F7] relative overflow-hidden">
      {/* Decorative elements */}
      <svg 
        className="absolute top-0 right-0 w-96 h-96 opacity-20"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="350" cy="50" r="200" fill="#1083BD" />
      </svg>
      <svg 
        className="absolute bottom-0 left-0 w-80 h-80 opacity-20"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="50" cy="350" r="180" fill="#DAF467" />
      </svg>

      {/* Stickers */}
      <div className="absolute top-12 right-[8%] hidden lg:block">
        <PawSticker color="lime" rotation={-15} withBone />
      </div>
      <div className="absolute bottom-12 left-[5%] hidden lg:block">
        <Sticker text="WOOF" color="orange" rotation={10} size="md" />
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            Градове с <span className="text-[#DAF467]">ветеринарни клиники</span>
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Открийте ветеринарни специалисти близо до вас
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {cities.map((city, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center
                hover:bg-white/20 transition-all duration-300 cursor-pointer
                hover:scale-105 group"
            >
              <div className="w-10 h-10 rounded-full bg-[#DAF467] mx-auto mb-3 flex items-center justify-center
                group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5 text-[#1083BD]" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{city.name}</h3>
              <span className="text-[#DAF467] text-xs">{city.count} клиники</span>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="text-white font-semibold hover:text-[#DAF467] transition-colors">
            Виж всички градове →
          </button>
        </div>
      </div>
    </section>
  )
}
