import { Sticker } from "@/components/sticker"

const media = [
  { name: "БТВ Новини", style: "font-black italic" },
  { name: "NOVA TV", style: "font-black tracking-wider" },
  { name: "Dir.bg", style: "font-bold" },
  { name: "Actualno", style: "font-semibold tracking-tight" },
  { name: "Dnes.bg", style: "font-black" },
  { name: "Bloomberg BG", style: "font-bold tracking-wide" },
]

export function PressSection() {
  return (
    <section className="py-10 bg-white border-b border-gray-100 relative overflow-hidden">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Label */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <div className="w-1 h-8 rounded-full bg-[#EF3988]" />
            <span className="text-gray-400 text-sm font-medium whitespace-nowrap uppercase tracking-widest">
              Представен в
            </span>
          </div>

          {/* Logos */}
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-10 gap-y-3 flex-1">
            {media.map((m, i) => (
              <span
                key={i}
                className={`text-gray-300 hover:text-gray-400 transition-colors text-lg ${m.style} cursor-default select-none`}
              >
                {m.name}
              </span>
            ))}
          </div>

          {/* Rating badge */}
          <div className="flex-shrink-0 flex items-center gap-3 bg-[#DAF467] rounded-2xl px-5 py-2">
            <div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-[#1083BD] text-sm">★</span>
                ))}
              </div>
              <span className="text-[#1083BD] font-bold text-sm">4.9 / 5</span>
            </div>
            <div className="text-[#1083BD] text-xs font-medium leading-tight max-w-[80px]">
              Средна оценка от потребители
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
