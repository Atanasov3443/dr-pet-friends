import { Router, Response } from "express"
import { db } from "../../lib/db"
import { authenticate, AuthRequest } from "../../middleware/auth"
import { getResend, emailWrapper, ctaButton } from "../../lib/email"

const router = Router()

async function resolveOwner(req: AuthRequest) {
  let user = await db.user.findUnique({ where: { id: req.user!.id } })
  if (!user) user = await db.user.findUnique({ where: { email: req.user!.email } })
  return user
}

// POST /api/my/cancel — cancel appointment with auto-refund if > 24h
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await resolveOwner(req)
    if (!user) { res.status(401).json({ error: "Не е намерен потребител" }); return }

    const { appointmentId } = req.body
    if (!appointmentId) { res.status(400).json({ error: "appointmentId е задължително" }); return }

    const appointment = await db.appointment.findUnique({
      where:   { id: appointmentId },
      include: { payment: true, vet: { select: { displayName: true } }, service: { select: { name: true } } },
    })

    if (!appointment || appointment.ownerId !== user.id) {
      res.status(404).json({ error: "Не е намерен" }); return
    }

    if (appointment.status === "CANCELLED") {
      res.status(400).json({ error: "Резервацията вече е отказана" }); return
    }

    if (appointment.status === "COMPLETED") {
      res.status(400).json({ error: "Не може да откажете завършен преглед" }); return
    }

    // Check 24h rule
    const hoursUntil = (new Date(appointment.date).getTime() - Date.now()) / 3600000
    const canRefund  = hoursUntil > 24

    let refunded = false

    // Auto-refund via Stripe if paid and > 24h
    if (canRefund && appointment.payment?.status === "PAID" && appointment.payment.stripePaymentId) {
      try {
        if (process.env.STRIPE_SECRET_KEY) {
          const Stripe = (await import("stripe")).default
          const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
          await stripe.refunds.create({ payment_intent: appointment.payment.stripePaymentId })
          await db.payment.update({ where: { appointmentId }, data: { status: "REFUNDED" } })
          refunded = true
        }
      } catch (e: any) {
        console.error("Refund error:", e?.message)
      }
    }

    // Cancel appointment
    await db.appointment.update({ where: { id: appointmentId }, data: { status: "CANCELLED" } })

    // Notify waitlist
    await notifyWaitlist(appointment.vetId, appointment.date, appointment.ownerId)

    // Send cancellation email
    const resend = getResend()
    if (resend && user.email) {
      const refundMsg = refunded
        ? `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px;margin:16px 0"><p style="color:#166534;font-size:13px;margin:0">✅ Сумата от <strong>${appointment.payment?.amount ?? appointment.price} лв.</strong> ще бъде възстановена на картата ви в рамките на 3-5 работни дни.</p></div>`
        : hoursUntil <= 24
        ? `<div style="background:#fef3c7;border:1px solid #fde68a;border-radius:10px;padding:16px;margin:16px 0"><p style="color:#92400e;font-size:13px;margin:0">⚠️ Отказът е направен по-малко от 24 часа преди прегледа. Съгласно политиката ни, средствата не се възстановяват.</p></div>`
        : ""

      const content = `
        <h2 style="color:#111827;font-size:20px;font-weight:900;margin:0 0 8px">Резервацията е отказана</h2>
        <p style="color:#6b7280;font-size:14px">Вашата резервация при <strong>${appointment.vet?.displayName}</strong> е отказана успешно.</p>
        ${refundMsg}
        ${ctaButton("Запази нов час", "https://dr-pet-friends.pages.dev/search", "#1083BD")}
      `
      resend.emails.send({
        from: "Dr. Pet Friend <onboarding@resend.dev>",
        to: user.email,
        subject: "Резервацията е отказана",
        html: emailWrapper(content, "#EF3988"),
      }).catch(() => {})
    }

    res.json({ ok: true, refunded, hoursUntil: Math.round(hoursUntil) })
  } catch (err: any) {
    console.error("Cancel error:", err?.message)
    res.status(500).json({ error: "Грешка при отказ" })
  }
})

async function notifyWaitlist(vetId: string, date: Date, excludeUserId: string) {
  // Find waitlist entries for this vet on this day (±1 hour)
  const from = new Date(date.getTime() - 30 * 60000)
  const to   = new Date(date.getTime() + 30 * 60000)

  const entries = await db.waitlistEntry.findMany({
    where:   { vetId, date: { gte: from, lte: to }, notified: false, confirmed: false },
    include: { user: { select: { name: true, email: true } }, vet: { select: { displayName: true } } },
    orderBy: { position: "asc" },
    take:    3,
  })

  if (entries.length === 0) return

  const resend = getResend()
  if (!resend) return

  for (const entry of entries) {
    if (!entry.user.email || entry.userId === excludeUserId) continue

    const dateStr = date.toLocaleDateString("bg-BG", { weekday:"long", day:"numeric", month:"long" })
    const timeStr = date.toLocaleTimeString("bg-BG", { hour:"2-digit", minute:"2-digit" })

    const content = `
      <h2 style="color:#111827;font-size:20px;font-weight:900;margin:0 0 8px">🎉 Освободи се час!</h2>
      <p style="color:#6b7280;font-size:14px;margin:0 0 16px">
        Имате шанс! Освободи се час при <strong>${entry.vet.displayName}</strong> на <strong>${dateStr} в ${timeStr}</strong>.
        Вие сте №${entry.position} в опашката. Запазете час веднага — първият потвърдил получава слота!
      </p>
      ${ctaButton("Запази часа сега", "https://dr-pet-friends.pages.dev/search", "#10B83D")}
      <p style="color:#9ca3af;font-size:12px;text-align:center">Ако не запазите в следващите 2 часа, часът ще бъде предложен на следващия в опашката.</p>
    `

    resend.emails.send({
      from:    "Dr. Pet Friend <onboarding@resend.dev>",
      to:      entry.user.email,
      subject: `Освободи се час при ${entry.vet.displayName} — ${timeStr} ${dateStr}`,
      html:    emailWrapper(content, "#10B83D"),
    }).catch(() => {})

    await db.waitlistEntry.update({ where: { id: entry.id }, data: { notified: true } })
  }
}

export default router
