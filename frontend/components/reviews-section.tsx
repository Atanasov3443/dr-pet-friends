"use client"

import { Star } from "lucide-react"

const reviews = [
  {
    name: "Мария Петрова",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces",
    rating: 5,
    text: "Невероятен екип от професионалисти! Кучето ми беше в най-добрите ръце. Благодаря от сърце!",
    pet: "Макс (Голдън Ретривър)",
    accent: "#1083BD",
  },
  {
    name: "Георги Иванов",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces",
    rating: 4,
    text: "Намерих специалист с добри отзиви за под 5 минути и записах час веднага. Котката е много по-добре.",
    pet: "Мици (Персийска котка)",
    accent: "#EF3988",
  },
  {
    name: "Елена Димитрова",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=faces",
    rating: 5,
    text: "Препоръчвам на всички! Намерих перфектен ветеринар с реален рейтинг и много внимателно отношение.",
    pet: "Рекс (Немска овчарка)",
    accent: "#10B83D",
  },
  {
    name: "Николай Тодоров",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=faces",
    rating: 4,
    text: "Намерих специалист за зайци — не очаквах да е толкова лесно. Зайчето ми получи отлична грижа.",
    pet: "Бъни (Заек)",
    accent: "#1083BD",
  },
  {
    name: "Анна Колева",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=faces",
    rating: 5,
    text: "Намерих перфектния ветеринар за моята котка само за минути. Платформата е страхотна!",
    pet: "Луна (Британска котка)",
    accent: "#EF3988",
  },
  {
    name: "Стефан Попов",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces",
    rating: 4,
    text: "Онлайн записването спести ми много обаждания. Ветеринарят беше страхотен с моя питбул.",
    pet: "Бруто (Питбул)",
    accent: "#1083BD",
  },
  {
    name: "Виктория Манева",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=faces",
    rating: 5,
    text: "Прегледът беше много задълбочен и ветеринарят обясни всичко подробно. Много доволна!",
    pet: "Снежко (Шпиц)",
    accent: "#10B83D",
  },
  {
    name: "Калоян Стоянов",
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop&crop=faces",
    rating: 5,
    text: "Намерих дежурен ветеринар в 2 часа нощта само за 5 минути. Платформата буквално спаси котката ми!",
    pet: "Мурко (Домашна котка)",
    accent: "#EF3988",
  },
  {
    name: "Диляна Цанева",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=faces",
    rating: 5,
    text: "Здравният дневник е невероятна функция. Всички ваксини на едно място — страхотно!",
    pet: "Пъфи (Персийска котка)",
    accent: "#1083BD",
  },
]

function ReviewCard({ name, avatar, rating, text, pet, accent }: typeof reviews[0]) {
  return (
    <div className="bg-white rounded-2xl p-6 w-72 shrink-0 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col gap-3"
      style={{ borderTop: `3px solid ${accent}` }}>
      <div className="flex items-center gap-3">
        <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover shrink-0" />
        <div className="min-w-0">
          <p className="font-bold text-sm text-gray-900 leading-tight truncate">{name}</p>
          <p className="text-xs text-gray-400 truncate">{pet}</p>
        </div>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
    </div>
  )
}

const duplicated = [...reviews, ...reviews]

export function ReviewsSection() {
  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Top diagonal from previous section */}
      <div className="absolute top-0 left-0 w-full leading-none pointer-events-none">
        <svg viewBox="0 0 1440 50" fill="#f9fafb" preserveAspectRatio="none" className="w-full h-12 block">
          <polygon points="0,0 1440,50 1440,0" />
        </svg>
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#1083BD]/10 border border-[#1083BD]/20 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#1083BD] animate-pulse" />
            <span className="text-[#1083BD] text-xs font-semibold uppercase tracking-widest">Отзиви</span>
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-[#191919] mb-4">
            Какво казват <span className="text-[#EF3988]">хората</span>
            <br />за нас?
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Истински отзиви от доволни собственици на домашни любимци
          </p>
        </div>
      </div>

      {/* Horizontal scroll marquee */}
      <div
        className="relative w-full"
        style={{
          maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
          overflow: "hidden",
        }}
      >
        <div className="flex gap-5 w-max animate-scroll-right hover:[animation-play-state:paused] py-4 px-5">
          {duplicated.map((r, i) => (
            <ReviewCard key={r.name + i} {...r} />
          ))}
        </div>
      </div>

      {/* Bottom diagonal to next section */}
      <div className="absolute bottom-0 left-0 w-full leading-none pointer-events-none">
        <svg viewBox="0 0 1440 50" fill="#f9fafb" preserveAspectRatio="none" className="w-full h-12 block">
          <polygon points="0,50 1440,0 1440,50" />
        </svg>
      </div>
    </section>
  )
}
