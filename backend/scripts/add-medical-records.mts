import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db      = new PrismaClient({ adapter } as any)

// Find completed or confirmed appointments
const appts = await db.appointment.findMany({
  where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
  include: { vet: true, pet: true },
  take: 3
})

console.log(`Found ${appts.length} appointments to add records for`)

for (const a of appts) {
  const existing = await db.medicalRecord.findUnique({ where: { appointmentId: a.id } })
  if (existing) { console.log(`Skip ${a.id} - already has record`); continue }

  await db.medicalRecord.create({
    data: {
      appointmentId: a.id,
      petId: a.petId,
      vetId: a.vetId,
      diagnosis: "Общ преглед — здравословно животно. Не се наблюдават отклонения.",
      treatment: "Профилактична ваксинация проведена.",
      medications: "Vitamins Complex 1 табл. дневно — 14 дни",
      notes: "Препоръчва се следващ преглед след 6 месеца.",
      weight: a.pet.weight ?? 4.5,
      temperature: 38.5,
      nextVisit: new Date(Date.now() + 6 * 30 * 24 * 3600 * 1000),
    }
  })
  await db.appointment.update({ where: { id: a.id }, data: { status: "COMPLETED" } })
  console.log(`✅ Added record for appointment ${a.id} (${a.pet.name})`)
}

await db.$disconnect()
