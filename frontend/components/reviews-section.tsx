"use client"

import { Sticker, PawSticker } from "@/components/sticker"
import { Star } from "lucide-react"

const reviews = [
  {
    name: "Мария Петрова",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces",
    rating: 5,
    text: "Невероятен екип от професионалисти! Кучето ми беше в най-добрите ръце. Благодаря от сърце!",
    pet: "Макс (Голдън Ретривър)",
    bg: "bg-[#1083BD]",
    fg: "text-white",
  },
  {
    name: "Георги Иванов",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces",
    rating: 4,
    text: "Намерих специалист с добри отзиви за под 5 минути и записах час веднага. Котката е много по-добре.",
    pet: "Мици (Персийска котка)",
    bg: "bg-white",
    fg: "text-[#191919]",
  },
  {
    name: "Елена Димитрова",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=faces",
    rating: 5,
    text: "Препоръчвам на всички! Намерих перфектен ветеринар с реален рейтинг и много внимателно отношение.",
    pet: "Рекс (Немска овчарка)",
    bg: "bg-[#10B83D]",
    fg: "text-white",
  },
  {
    name: "Николай Тодоров",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=faces",
    rating: 4,
    text: "Намерих специалист за зайци — не очаквах да е толкова лесно. Зайчето ми получи отлична грижа.",
    pet: "Бъни (Заек)",
    bg: "bg-[#DAF467]",
    fg: "text-[#1083BD]",
  },
  {
    name: "Анна Колева",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=faces",
    rating: 5,
    text: "Намерих перфектния ветеринар за моята котка само за минути. Платформата е страхотна!",
    pet: "Луна (Британска котка)",
    bg: "bg-[#FF6B35]",
    fg: "text-white",
  },
  {
    name: "Стефан Попов",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces",
    rating: 4,
    text: "Онлайн записването спести ми много обаждания. Ветеринарят беше страхотен с моя питбул.",
    pet: "Бруто (Питбул)",
    bg: "bg-[#1083BD]",
    fg: "text-white",
  },
  {
    name: "Виктория Манева",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=faces",
    rating: 5,
    text: "Груминг салонът беше невероятен! Шпицът ми изглежда като от витрина.",
    pet: "Снежко (Шпиц)",
    bg: "bg-white",
    fg: "text-[#191919]",
  },
  {
    name: "Калоян Стоянов",
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop&crop=faces",
    rating: 4,
    text: "Намерих дежурен ветеринар в 2 часа нощта само за 5 минути. Платформата буквално спаси котката ми!",
    pet: "Мурко (Домашна котка)",
    bg: "bg-[#10B83D]",
    fg: "text-white",
  },
  {
    name: "Диляна Цанева",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=faces",
    rating: 5,
    text: "Здравният дневник е невероятна функция. Всички ваксини на едно място — страхотно!",
    pet: "Пъфи (Персийска котка)",
    bg: "bg-[#DAF467]",
    fg: "text-[#1083BD]",
  },
]

interface ReviewCardProps {
  name: string
  avatar: string
  rating: number
  text: string
  pet: string
  bg: string
  fg: string
}

function ReviewCard({ name, avatar, rating, text, pet, bg, fg }: ReviewCardProps) {
  return (
    <div className={`${bg} ${fg} rounded-2xl p-6 w-72 h-56 shrink-0 shadow-lg flex flex-col transition-all duration-300 hover:scale-[1.04] hover:-translate-y-2 hover:shadow-2xl cursor-pointer z-0 hover:z-10`}>
      <div className="flex items-center gap-2.5 mb-3">
        <img
          src={avatar}
          alt={name}
          className="w-11 h-11 rounded-full object-cover border-2 border-white/30 shrink-0"
        />
        <div className="min-w-0">
          <p className="font-bold text-sm leading-tight truncate">{name}</p>
          <p className="text-xs opacity-70 truncate">{pet}</p>
        </div>
      </div>

      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      <p className="text-sm leading-relaxed opacity-90">{text}</p>
    </div>
  )
}

const duplicated = [...reviews, ...reviews]

export function ReviewsSection() {
  return (
    <section className="pt-12 pb-0 bg-[#EF3988] relative overflow-hidden">
      {/* Top diagonal divider */}
      <div className="absolute top-0 left-0 w-full leading-none pointer-events-none z-10">
        <svg viewBox="0 0 1440 50" fill="#EF3988" preserveAspectRatio="none" className="w-full h-12 block">
          <polygon points="0,0 1440,50 1440,0" />
        </svg>
      </div>

      {/* Decorative blobs */}
      <svg className="absolute -top-20 -left-20 w-[400px] h-[400px] pointer-events-none" viewBox="0 0 400 400" fill="none">
        <path d="M300 150C340 200 350 280 300 340C250 400 150 420 80 380C10 340 -20 250 20 170C60 90 150 50 230 70C280 85 295 120 300 150Z" fill="#1083BD" opacity="0.25" />
      </svg>
      <svg className="absolute -bottom-20 -right-20 w-[300px] h-[300px] pointer-events-none" viewBox="0 0 300 300" fill="none">
        <path d="M250 150C260 200 220 260 150 270C80 280 20 230 10 160C0 90 50 30 120 20C190 10 240 60 250 130C255 145 255 150 250 150Z" fill="#DAF467" opacity="0.4" />
      </svg>

      {/* Stickers */}
      <div className="absolute top-20 right-[10%] hidden lg:block">
        <Sticker text="WOOF" color="orange" rotation={-8} size="lg" />
      </div>
      <div className="absolute bottom-20 left-[8%] hidden lg:block">
        <PawSticker color="lime" icon="paw" rotation={15} />
      </div>
      <div className="absolute top-1/2 left-[5%] hidden xl:block">
        <PawSticker color="green" icon="bone" rotation={-10} />
      </div>

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
              <svg className="w-6 h-6 text-[#EF3988]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-4">
            Какво казват <span className="text-[#DAF467]">хората</span>
            <br />за нас?
          </h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Прочетете истински отзиви от доволни собственици на домашни любимци
          </p>
        </div>

      </div>

      {/* Horizontal auto-slider — full width */}
      <div
        className="relative w-full mt-2 mb-0"
        style={{
          maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
          overflow: "hidden",
        }}
      >
        <div className="flex gap-5 w-max animate-scroll-right hover:[animation-play-state:paused] py-16" style={{ paddingLeft: "1.25rem" }}>
          {duplicated.map((r, i) => (
            <ReviewCard key={r.name + i} {...r} />
          ))}
        </div>
      </div>


      {/* Bottom diagonal divider */}
      <div className="absolute bottom-0 left-0 w-full leading-none pointer-events-none z-10">
        <svg viewBox="0 0 1440 50" fill="#EF3988" preserveAspectRatio="none" className="w-full h-12 block">
          <polygon points="0,0 1440,50 0,50" />
        </svg>
      </div>
    </section>
  )
}
