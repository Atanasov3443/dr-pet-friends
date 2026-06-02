import { Router, Response, Request } from "express"
import Stripe from "stripe"
import { db } from "../lib/db"
import { authenticate, AuthRequest } from "../middleware/auth"

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured")
  return new Stripe(key)
}

const router = Router()

// POST /api/stripe/checkout
// Body: { appointmentId }
// Creates a Stripe Checkout session and returns the URL
router.post("/checkout", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      res.status(503).json({ error: "Payment service not configured" }); return
    }
    const stripe = getStripe()

    const { appointmentId } = req.body
    if (!appointmentId) { res.status(400).json({ error: "appointmentId е задължително" }); return }

    const appointment = await db.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        service: true,
        vet:     { select: { displayName: true } },
        pet:     { select: { name: true } },
      },
    })

    // Resolve actual DB user (handles session ID vs DB ID mismatch)
    let dbUser = await db.user.findUnique({ where: { id: req.user!.id } })
    if (!dbUser) dbUser = await db.user.findUnique({ where: { email: req.user!.email } })
    if (!dbUser) { res.status(404).json({ error: "Потребителят не е намерен" }); return }

    if (!appointment || appointment.ownerId !== dbUser.id) {
      res.status(404).json({ error: "Не е намерен" }); return
    }
    if (appointment.status === "CANCELLED") {
      res.status(400).json({ error: "Резервацията е отказана" }); return
    }

    const amount = appointment.price ?? appointment.service?.price ?? 0
    if (amount <= 0) { res.status(400).json({ error: "Невалидна сума" }); return }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode:                 "payment",
      line_items: [{
        quantity: 1,
        price_data: {
          currency:     "bgn",
          unit_amount:  Math.round(amount * 100),
          product_data: {
            name:        `${appointment.service?.name ?? "Преглед"} — ${appointment.vet.displayName}`,
            description: `${appointment.pet.name} · ${new Date(appointment.date).toLocaleDateString("bg-BG")}`,
          },
        },
      }],
      success_url: `${appUrl}/my/appointments?payment=success`,
      cancel_url:  `${appUrl}/my/appointments?payment=cancel`,
      metadata:    { appointmentId },
    })

    // Upsert Payment record
    await db.payment.upsert({
      where:  { appointmentId },
      create: { appointmentId, amount, stripeSessionId: session.id, status: "PENDING" },
      update: { stripeSessionId: session.id, status: "PENDING" },
    })

    res.json({ url: session.url })
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Грешка" })
  }
})

// POST /api/stripe/webhook — raw body required
router.post("/webhook", async (req: Request, res: Response) => {
  const sig    = req.headers["stripe-signature"] as string
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  if (!secret) { res.status(503).send("Not configured"); return }
  if (!process.env.STRIPE_SECRET_KEY) { res.status(503).send("Not configured"); return }
  const stripe = getStripe()

  let event: ReturnType<typeof stripe.webhooks.constructEvent>
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, secret)
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`); return
  }

  if (event.type === "checkout.session.completed") {
    const session       = event.data.object as { id: string; metadata?: Record<string, string>; payment_intent?: string }
    const appointmentId = session.metadata?.appointmentId
    if (appointmentId) {
      await db.payment.updateMany({
        where: { stripeSessionId: session.id },
        data:  { status: "PAID", stripePaymentId: session.payment_intent ?? null },
      })
      await db.appointment.update({
        where: { id: appointmentId },
        data:  { status: "CONFIRMED" },
      })
      const appointment = await db.appointment.findUnique({ where: { id: appointmentId } })
      if (appointment) {
        await db.notification.create({
          data: {
            userId: appointment.ownerId,
            type:   "PAYMENT_RECEIVED",
            title:  "Плащането е успешно!",
            body:   "Вашата резервация е потвърдена след успешно плащане.",
            data:   JSON.stringify({ appointmentId }),
          },
        })
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as { id: string }
    await db.payment.updateMany({
      where: { stripeSessionId: session.id },
      data:  { status: "FAILED" },
    })
  }

  res.json({ received: true })
})

export default router
