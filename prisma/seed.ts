import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db = new PrismaClient({ adapter } as any)

async function main() {
  // ─── Admin user ───────────────────────────────────────────────────────────
  const adminEmail = "ivaylo.atanasov3443@gmail.com"
  const existing = await db.user.findUnique({ where: { email: adminEmail } })
  if (existing) {
    await db.user.update({ where: { email: adminEmail }, data: { role: "ADMIN" } })
    console.log("✓ Admin обновен")
  } else {
    const pw = await bcrypt.hash("Admin1234!", 12)
    await db.user.create({ data: { name: "Ivaylo", email: adminEmail, password: pw, role: "ADMIN" } })
    console.log("✓ Admin създаден")
  }

  // ─── Clinics ──────────────────────────────────────────────────────────────
  const clinicDefs = [
    { id: "clinic-1", name: "Ветеринарна клиника Аниме", type: "VET" as const, city: "София", address: "бул. Витоша 45", phone: "+359 2 987 6543", isEmergency: true,  lat: 42.6977, lng: 23.3219, description: "Модерна клиника с 24/7 спешна помощ и пълно диагностично оборудване." },
    { id: "clinic-2", name: "Зоо Клиник Люлин",          type: "VET" as const, city: "София", address: "ж.к. Люлин, бл. 312", phone: "+359 2 876 5432", isEmergency: false, lat: 42.7200, lng: 23.2580, description: "Клиника за домашни и екзотични животни в западната част на София." },
    { id: "clinic-3", name: "Вет Център Младост",         type: "VET" as const, city: "София", address: "бул. Александър Малинов 91", phone: "+359 2 765 4321", isEmergency: false, lat: 42.6500, lng: 23.3800, description: "Специализирана клиника за кучета и котки. Дентална стоматология и ортопедия." },
    { id: "clinic-4", name: "Happy Paws Груминг",          type: "GROOMING" as const, city: "София", address: "ул. Шипченски проход 63", phone: "+359 88 765 4321", isEmergency: false, lat: 42.6800, lng: 23.3500, description: "Професионален груминг салон за всички породи. Пране, подстригване, SPA." },
    { id: "clinic-5", name: "Пловдивска Вет Клиника",     type: "VET" as const, city: "Пловдив", address: "бул. Марица 22", phone: "+359 32 654 3210", isEmergency: true,  lat: 42.1354, lng: 24.7453, description: "Водещата ветеринарна клиника в Пловдив с над 15 години опит." },
    { id: "clinic-6", name: "Варна Вет Хаус",              type: "VET" as const, city: "Варна", address: "бул. Цар Освободител 14", phone: "+359 52 543 2109", isEmergency: false, lat: 43.2141, lng: 27.9147, description: "Ветеринарна клиника на морето — кучета, котки и екзотични животни." },
  ]
  for (const c of clinicDefs) {
    await db.clinic.upsert({ where: { id: c.id }, update: {}, create: { ...c, isActive: true } })
  }
  console.log(`✓ ${clinicDefs.length} клиники`)

  // ─── Vet users ────────────────────────────────────────────────────────────
  const pw = await bcrypt.hash("vet1234", 10)

  const vetDefs = [
    {
      uid: "user-vet-1", email: "dr.ivanova@vetclinic.bg", name: "Д-р Мария Иванова",
      vet: { id: "vet-1", displayName: "Д-р Мария Иванова", specialty: "Малки животни", bio: "Ветеринарен лекар с 12 г. опит. Специализирана в хирургия и вътрешни болести.", experience: 12, rating: 4.9, reviewCount: 87, isEmergency: true, clinicId: "clinic-1", lat: 42.6977, lng: 23.3219, image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop" },
      services: [{ name: "Общ преглед", price: 40, duration: 30 }, { name: "Ваксинация", price: 35, duration: 20 }, { name: "Дентален преглед", price: 60, duration: 45 }, { name: "Ехография", price: 80, duration: 30 }],
    },
    {
      uid: "user-vet-2", email: "dr.petrov@vetclinic.bg", name: "Д-р Георги Петров",
      vet: { id: "vet-2", displayName: "Д-р Георги Петров", specialty: "Хирургия и ортопедия", bio: "Специалист по ортопедична хирургия. Над 500 успешни операции.", experience: 18, rating: 4.8, reviewCount: 124, isEmergency: false, clinicId: "clinic-3", lat: 42.6500, lng: 23.3800, image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop" },
      services: [{ name: "Хирургичен преглед", price: 70, duration: 45 }, { name: "Стерилизация (котка)", price: 280, duration: 90 }, { name: "Стерилизация (куче)", price: 350, duration: 120 }, { name: "Ортопедична консултация", price: 90, duration: 60 }],
    },
    {
      uid: "user-vet-3", email: "dr.todorova@vetclinic.bg", name: "Д-р Елена Тодорова",
      vet: { id: "vet-3", displayName: "Д-р Елена Тодорова", specialty: "Екзотични животни", bio: "Специалист по екзотични животни — зайци, птици, влечуги, гризачи.", experience: 8, rating: 4.7, reviewCount: 56, isEmergency: false, clinicId: "clinic-2", lat: 42.7200, lng: 23.2580, image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop" },
      services: [{ name: "Преглед на екзотично животно", price: 55, duration: 40 }, { name: "Ваксинация (заек)", price: 45, duration: 20 }, { name: "Консултация за хранене", price: 40, duration: 30 }],
    },
    {
      uid: "user-vet-4", email: "dr.nikolov@vetclinic.bg", name: "Д-р Стоян Николов",
      vet: { id: "vet-4", displayName: "Д-р Стоян Николов", specialty: "Дерматология и алергии", bio: "Специалист по кожни заболявания и алергии. Модерни диагностични методи.", experience: 10, rating: 4.6, reviewCount: 43, isEmergency: false, clinicId: "clinic-5", lat: 42.1354, lng: 24.7453, image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop" },
      services: [{ name: "Дерматологичен преглед", price: 65, duration: 45 }, { name: "Алергичен тест", price: 120, duration: 60 }, { name: "Общ преглед", price: 45, duration: 30 }],
    },
    {
      uid: "user-vet-5", email: "dr.angelova@vetclinic.bg", name: "Д-р Анна Ангелова",
      vet: { id: "vet-5", displayName: "Д-р Анна Ангелова", specialty: "Кардиология", bio: "Кардиолог за домашни любимци. ЕКГ, ехокардиография и лечение.", experience: 14, rating: 4.9, reviewCount: 92, isEmergency: false, clinicId: "clinic-6", lat: 43.2141, lng: 27.9147, image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop" },
      services: [{ name: "Кардиологичен преглед", price: 90, duration: 60 }, { name: "ЕКГ", price: 60, duration: 30 }, { name: "Ехокардиография", price: 110, duration: 45 }],
    },
  ]

  for (const { uid, email, name, vet, services } of vetDefs) {
    const user = await db.user.upsert({ where: { email }, update: {}, create: { id: uid, email, name, password: pw, role: "VET" } })
    await db.vet.upsert({ where: { id: vet.id }, update: {}, create: { ...vet, isActive: true, userId: user.id } })
    await db.vetService.deleteMany({ where: { vetId: vet.id } })
    await db.vetService.createMany({ data: services.map(s => ({ ...s, vetId: vet.id })) })
    await db.schedule.deleteMany({ where: { vetId: vet.id } })
    await db.schedule.createMany({
      data: [1,2,3,4,5].map(d => ({ vetId: vet.id, dayOfWeek: d, startTime: "09:00", endTime: "17:00", isActive: true }))
        .concat([{ vetId: vet.id, dayOfWeek: 6, startTime: "09:00", endTime: "13:00", isActive: true }]),
    })
    console.log(`  ✓ ${name}`)
  }

  // ─── Sample reviews ───────────────────────────────────────────────────────
  const ownerEmail = "owner.demo@drpetfriends.bg"
  const owner = await db.user.upsert({
    where:  { email: ownerEmail },
    update: {},
    create: { id: "user-owner-demo", email: ownerEmail, name: "Мария Стоянова", password: pw, role: "OWNER" },
  })

  const reviewDefs = [
    { id: "rev-1", vetId: "vet-1", rating: 5, comment: "Д-р Иванова е изключително внимателна. Котката ми се чувства добре!" },
    { id: "rev-2", vetId: "vet-2", rating: 5, comment: "Страхотен хирург! Операцията мина перфектно." },
    { id: "rev-3", vetId: "vet-3", rating: 4, comment: "Много добра с екзотичните животни. Препоръчвам!" },
    { id: "rev-4", vetId: "vet-4", rating: 5, comment: "Намери алергията на кучето ми след месеци на безуспешно лечение." },
    { id: "rev-5", vetId: "vet-5", rating: 5, comment: "Спаси живота на котката ми. Безкрайно благодарна!" },
  ]
  for (const r of reviewDefs) {
    await db.review.upsert({ where: { id: r.id }, update: {}, create: { ...r, userId: owner.id } })
  }

  console.log("✅ Seed завършен успешно!")
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
