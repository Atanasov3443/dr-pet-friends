import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import Stripe from "stripe"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db      = new PrismaClient({ adapter } as any)
const stripe  = new Stripe(process.env.STRIPE_SECRET_KEY!)

const payments = await db.payment.findMany({ where: { status: "PENDING" } })
console.log(`Checking ${payments.length} pending payments...`)

for (const p of payments) {
  if (!p.stripeSessionId) { console.log(`Skip ${p.id} - no session`); continue }

  const session = await stripe.checkout.sessions.retrieve(p.stripeSessionId)
  console.log(`Session ${p.stripeSessionId.slice(0,25)} → payment_status: ${session.payment_status}`)

  if (session.payment_status === "paid") {
    await db.payment.update({
      where: { id: p.id },
      data: { status: "PAID", stripePaymentId: session.payment_intent as string }
    })
    await db.appointment.update({
      where: { id: p.appointmentId },
      data: { status: "CONFIRMED" }
    })
    console.log(`✅ Updated appointment ${p.appointmentId} → CONFIRMED + PAID`)
  } else {
    console.log(`⏳ Not paid yet (${session.payment_status})`)
  }
}

await db.$disconnect()
