"use client"

import { Sticker, PawSticker } from "@/components/sticker"

const tips = [
  {
    title: "Как да храните кучето си правилно",
    category: "Хранене",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
    bgColor: "bg-[#DAF467]",
    textColor: "text-[#1083BD]",
  },
  {
    title: "5 признака, че котката ви има нужда от ветеринар",
    category: "Здраве",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop",
    bgColor: "bg-[#EF3988]",
    textColor: "text-white",
  },
  {
    title: "Грижа за козината през зимата",
    category: "Грижа",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop",
    bgColor: "bg-white",
    textColor: "text-[#1083BD]",
  },
  {
    title: "Ваксинационен календар за кученца",
    category: "Ваксини",
    image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=300&fit=crop",
    bgColor: "bg-[#10B83D]",
    textColor: "text-white",
  },
]

export function TipsSection() {
  return (
    <section className="py-24 bg-[#1083BD] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full leading-none pointer-events-none z-10"><svg viewBox="0 0 1440 50" fill="#EF3988" preserveAspectRatio="none" className="w-full h-12 block"><polygon points="0,50 1440,0 0,0" /></svg></div>
      {/* Background decorative elements */}
      <svg 
        className="absolute -top-20 -left-20 w-[400px] h-[400px] pointer-events-none"
        viewBox="0 0 400 400"
        fill="none"
      >
        <circle cx="100" cy="200" r="200" fill="#0D67F7" opacity="0.3" />
      </svg>

      {/* Stickers */}
      <div className="absolute top-20 right-[10%] hidden lg:block">
        <Sticker text="WOOF" color="orange" rotation={-5} size="lg" />
      </div>
      <div className="absolute bottom-32 left-[8%] hidden lg:block z-20">
        <PawSticker color="orange" icon="bone" rotation={12} />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <svg className="w-6 h-6 text-[#1083BD]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-white">
            Полезни съвети <span className="text-[#DAF467]">за собственици</span>
          </h2>
        </div>

        {/* Tips grid - card style like reference */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tips.map((tip, index) => (
            <div 
              key={index}
              className={`
                ${tip.bgColor} ${tip.textColor}
                rounded-3xl overflow-hidden
                transform transition-all duration-300
                hover:scale-105 hover:shadow-xl cursor-pointer
                group
              `}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={tip.image}
                  alt={tip.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Category badge */}
                <span className="absolute top-4 left-4 bg-white/90 text-[#1083BD] px-3 py-1 rounded-full text-xs font-semibold">
                  {tip.category}
                </span>
                
                {/* Sticker decoration on some cards */}
                {index === 0 && (
                  <div className="absolute bottom-2 right-2">
                    <Sticker text="WOOF" color="orange" rotation={8} size="sm" />
                  </div>
                )}
                {index === 2 && (
                  <div className="absolute bottom-2 left-2">
                    <PawSticker color="pink" icon="heart" rotation={-5} />
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-lg leading-tight mb-3">
                  {tip.title}
                </h3>
                <button className="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity">
                  Прочети още →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-12">
          <button className="text-white font-semibold hover:text-[#DAF467] transition-colors text-lg">
            Виж всички съвети →
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full leading-none pointer-events-none z-10"><svg viewBox="0 0 1440 50" fill="white" preserveAspectRatio="none" className="w-full h-12 block"><polygon points="0,50 1440,0 1440,50" /></svg></div>
    </section>
  )
}
