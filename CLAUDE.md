# PetDoc — Ветеринарна платформа

> Аналог на superdoc.bg за домашни любимци. Playful дизайн вдъхновен от "Dr. Friend" (Tatiana Simonova).
> Референция за дизайн: вижте /docs/design-reference/ (скрийншоти от Dr. Friend проекта)

---

## АРХИТЕКТУРА

**Tech Stack**: Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui
**База данни**: PostgreSQL (Supabase) + Prisma ORM
**Auth**: NextAuth.js v5 — email + Google OAuth · роли: OWNER | VET | CLINIC_ADMIN
**Услуги**: Cloudinary (снимки) · Resend (emails) · Twilio (SMS) · Stripe (плащания) · Google Maps
**Deploy**: Vercel

### Структура
```
petdoc/
├── app/
│   ├── (public)/
│   │   ├── page.tsx              # Начална страница
│   │   ├── search/page.tsx       # Търсене + филтри
│   │   ├── vet/[id]/page.tsx     # Профил на лекар
│   │   └── emergency/page.tsx    # Спешни 24/7
│   ├── (auth)/login · register
│   ├── (dashboard)/
│   │   ├── owner/                # Записи, любимци, здравен дневник
│   │   └── vet/                  # График, записи, профил
│   └── api/
│       ├── auth/[...nextauth]/
│       ├── vets/ · appointments/ · pets/
├── components/
│   ├── ui/                       # shadcn базови
│   ├── layout/                   # Navbar, Footer
│   ├── home/                     # HeroSearch, SpecialtiesGrid, EmergencyBanner
│   ├── search/                   # SearchFilters, VetCard
│   ├── booking/                  # BookingModal, CalendarPicker, TimeSlotGrid
│   └── pet/                      # PetProfileCard, HealthTimeline
├── lib/
│   ├── db.ts · auth.ts · utils.ts · validations.ts
└── prisma/schema.prisma          # Вижте /docs/schema.md
```

---

## БАЗА ДАННИ

Пълна Prisma схема: вижте `/docs/schema.md`

**Основни модели**: User · Pet · Vet · Clinic · Appointment · Review · Schedule · Vaccination

**Ключови полета**:
- `Pet.species`: DOG | CAT | BIRD | RABBIT | EXOTIC | OTHER
- `Vet.isEmergency`: Boolean — 24/7 дежурни клиники
- `Vet.species[]`: Видове животни, с които работи лекарят
- `Appointment.status`: PENDING | CONFIRMED | CANCELLED | COMPLETED

---

## ДИЗАЙН СИСТЕМА

### Цветове (tailwind.config.ts)
```ts
primary: '#1083BD'   // Синьо — основен
accent:  '#EF3988'   // Розово — CTA, акценти
lime:    '#DAF467'   // Лайм — highlights, стикери
success: '#10B83D'   // Зелено — потвърждения
orange:  '#F97316'   // Оранжево — спешни, WOOF стикер
dark:    '#191919'   // Текст
muted:   '#535353'   // Secondary текст
```

### Типография
```ts
heading: ['Hagrid Text Var', 'Inter Tight', 'sans-serif']  // bold/extrabold
body:    ['Inter Tight', 'sans-serif']                      // regular/medium/semibold
```

### Компонентни правила
- Карти: `rounded-2xl shadow-sm border border-gray-100`
- Бутон Primary: `bg-accent text-white rounded-full px-6 py-3 font-semibold`
- Бутон Secondary: `bg-primary text-white rounded-full`
- Hero: full-width · заглавие 64px+ bold · снимка на животно
- Spacing grid: 4px base (8 · 16 · 24 · 32 · 48 · 64px)
- Анимации: Framer Motion · hover scale(1.02) · stagger на карти

### Задължителни playful елементи
- Floating стикери с rotation ±6deg: "WOOF 🐾" "PURRRR" "GOOOOD DOGGY"
- Wavy/blob SVG форми зад hero секциите (розово/синьо)
- Цветни paw print икони за специалности
- Emoji в заглавия на секции

---

## ФУНКЦИОНАЛНОСТИ

### MVP — Фаза 1 (приоритет)
1. Начална страница: hero търсачка + специалности grid + градове + emergency banner
2. Търсене: филтри (специалност · град · вид животно · рейтинг) + VetCard листинг
3. Профил на лекар: info · услуги · снимки · отзиви · booking бутон
4. Booking modal: 3 стъпки — услуга → дата/час → потвърждение + email
5. Auth: регистрация/логин (owner + vet) с Google OAuth
6. Owner dashboard: предстоящи записи · профил на любимец · история
7. Vet dashboard: дневен график · управление на записи · профил

### Подобрения спрямо superdoc.bg
- Филтър по вид животно (куче/котка/екзотично)
- Emergency banner — 24/7 дежурни клиники с карта
- Здравен дневник — ваксини, прегледи, напомняния
- Playful дизайн с bold цветове вместо corporate стил
- Профил на лекар с снимки с животни

---

## КОНВЕНЦИИ

- Компоненти: `PascalCase` · Functions: `camelCase` · Constants: `UPPER_SNAKE_CASE`
- API: REST `/api/v1/resource`
- Zod валидация на всички форми и API inputs
- Server Components по подразбиране — Client само при нужда (`"use client"`)
- Git: `feature/` · `fix/` · `chore/` · conventional commits
- UI текст: Български · Code/коментари: Английски · DB fields: Английски

---

## КОМАНДИ

```bash
# Setup
npx create-next-app@latest petdoc --typescript --tailwind --app
cd petdoc && npx shadcn-ui@latest init
npm install prisma @prisma/client next-auth @auth/prisma-adapter \
  framer-motion zod react-hook-form @hookform/resolvers \
  @uploadthing/react resend stripe

# DB
npx prisma init && npx prisma migrate dev --name init

# Dev
npm run dev
```

---

## ENV

```
DATABASE_URL · NEXTAUTH_SECRET · NEXTAUTH_URL
GOOGLE_CLIENT_ID · GOOGLE_CLIENT_SECRET
CLOUDINARY_CLOUD_NAME · CLOUDINARY_API_KEY · CLOUDINARY_API_SECRET
RESEND_API_KEY · STRIPE_SECRET_KEY · NEXT_PUBLIC_GOOGLE_MAPS_KEY
```
