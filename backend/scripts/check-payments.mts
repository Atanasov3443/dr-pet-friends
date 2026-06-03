import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db      = new PrismaClient({ adapter } as any)

const payments = await db.payment.findMany({
  include: { appointment: { include: { vet: { select: { displayName: true } } } } }
})
console.log("=== PAYMENTS ===", payments.length)
for (const p of payments) {
  console.log(`${p.status} | ${p.amount} лв. | ${p.appointment.vet.displayName} | session: ${p.stripeSessionId?.slice(0,20)}...`)
}

const appts = await db.appointment.findMany({
  where: { price: { not: null } },
  select: { id: true, status: true, price: true, payment: { select: { status: true } }, vet: { select: { displayName: true } } },
  orderBy: { createdAt: "desc" },
  take: 10
})
console.log("\n=== APPOINTMENTS WITH PRICE ===")
for (const a of appts) {
  console.log(`Appt ${a.status} | ${a.price} лв. | ${a.vet.displayName} | payment: ${a.payment?.status ?? "НЕ ИМА"}`)
}

await db.$disconnect()
