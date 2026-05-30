export const CONTENT_DEFAULTS: Record<string, string> = {
  // Hero slides
  "hero.slide.1.image":       "/Untitled%20design%20(1).png",
  "hero.slide.1.subtitle":    "Вашият домашен любимец е наш приятел!",
  "hero.slide.1.description": "Грижа, на която можете да се доверите. Намерете най-добрите ветеринарни специалисти.",
  "hero.slide.2.image":       "/4.png",
  "hero.slide.2.subtitle":    "Груминг салони с реални отзиви",
  "hero.slide.2.description": "Изберете най-добрия груминг салон за вашия любимец за секунди.",
  "hero.slide.3.image":       "/6.png",
  "hero.slide.3.subtitle":    "Грижа за всички домашни любимци",
  "hero.slide.3.description": "Намерете специалист за куче, котка, зайче или екзотично животно.",
  "hero.slide.4.image":       "/veterinarian-taking-care-pet.jpg",
  "hero.slide.4.subtitle":    "Специалисти, на които можете да се доверите",
  "hero.slide.4.description": "Проверени ветеринари с реални отзиви от хиляди доволни домашни любимци.",

  // For Vets
  "forvets.badge":       "За специалисти",
  "forvets.title":       "Стани партньор на Dr. Pet Friend",
  "forvets.subtitle":    "Присъедини се към най-голямата ветеринарна мрежа в България и привлечи нови клиенти всеки ден.",
  "forvets.stat.1.value": "50 000+",
  "forvets.stat.1.label": "собственици на любимци",
  "forvets.stat.2.value": "24/7",
  "forvets.stat.2.label": "онлайн резервации",
  "forvets.stat.3.value": "Рейтинг",
  "forvets.stat.3.label": "и реални отзиви",
  "forvets.stat.4.value": "Безплатно",
  "forvets.stat.4.label": "без скрити такси",

  // Emergency
  "emergency.label":          "Вашият любимец е наш приоритет",
  "emergency.card1.title":    "Спешна помощ 24/7",
  "emergency.card1.text":     "Денонощна помощ за вашия любимец. Не чакайте — действайте веднага.",
  "emergency.card2.title":    "Намери клиника",
  "emergency.card2.text":     "Над 200 ветеринарни клиники в цяла България с реални отзиви и оценки.",

  // FAQ
  "faq.title":    "Чести въпроси",
  "faq.subtitle": "Отговори на най-популярните въпроси от собственици на домашни любимци",

  // How it works
  "howitworks.badge":    "Как работи",
  "howitworks.title":    "Намери ветеринар за 3 стъпки",
  "howitworks.subtitle": "Лесно, бързо и безплатно",
  "howitworks.step.1.title": "Търси",
  "howitworks.step.1.text":  "Въведи специалност или симптом и избери град",
  "howitworks.step.2.title": "Избери",
  "howitworks.step.2.text":  "Разгледай профилите, отзивите и свободните часове",
  "howitworks.step.3.title": "Запази час",
  "howitworks.step.3.text":  "Онлайн резервация без телефонни обаждания",

  // Footer
  "footer.tagline": "Грижа за домашните любимци, на едно място.",
  "footer.email":   "hello@drpetfriend.bg",
  "footer.phone":   "+359 2 123 4567",
  "footer.address": "гр. София, България",

  // Meta
  "site.name":        "Dr. Pet Friends",
  "site.description": "Платформа за намиране на ветеринари и груминг салони в България",
}

export type SiteContent = Record<string, string>

export async function getContent(): Promise<SiteContent> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
  try {
    const res = await fetch(`${API_URL}/api/content`, { cache: "no-store" })
    if (!res.ok) return { ...CONTENT_DEFAULTS }
    const rows: { key: string; value: string }[] = await res.json()
    const dbMap = Object.fromEntries(rows.map(r => [r.key, r.value]))
    return { ...CONTENT_DEFAULTS, ...dbMap }
  } catch {
    return { ...CONTENT_DEFAULTS }
  }
}

export function c(content: SiteContent, key: string): string {
  return content[key] ?? CONTENT_DEFAULTS[key] ?? ""
}
