import { Router, Response } from "express"
import { db } from "../../lib/db"
import { authenticate, requireRole, AuthRequest } from "../../middleware/auth"
import { getResend, emailWrapper, ctaButton } from "../../lib/email"
import bcrypt from "bcryptjs"

const router = Router()

router.get("/", authenticate, requireRole("ADMIN"), async (_req: AuthRequest, res: Response) => {
  try {
    const requests = await db.profileRequest.findMany({ orderBy: { createdAt: "desc" } })
    res.json(requests)
  } catch {
    res.status(500).json({ error: "Error" })
  }
})

router.post("/", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const request = await db.profileRequest.create({ data: req.body })
    res.status(201).json(request)
  } catch {
    res.status(500).json({ error: "Error" })
  }
})

router.patch("/", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { id, status } = req.body
    const updated = await db.profileRequest.update({
      where: { id },
      data:  { status, reviewedById: req.user!.id, reviewedAt: new Date() },
    })

    // On APPROVED — auto-create vet account and send welcome email
    if (status === "APPROVED") {
      const request = await db.profileRequest.findUnique({ where: { id } })
      if (request?.email) {
        await createVetAccount(request)
      }
    }

    res.json(updated)
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Error" })
  }
})

async function createVetAccount(request: {
  name: string; email: string; phone: string | null
  clinicName: string | null; city: string | null; specialty: string | null
}) {
  try {
    // Check if user already exists
    let user = await db.user.findUnique({ where: { email: request.email } })

    const tempPassword = Math.random().toString(36).slice(-10) + "A1!"

    if (!user) {
      user = await db.user.create({
        data: {
          email:    request.email,
          name:     request.name,
          password: await bcrypt.hash(tempPassword, 12),
          role:     "VET",
        }
      })
    } else {
      await db.user.update({ where: { id: user.id }, data: { role: "VET" } })
    }

    // Create vet profile if not exists
    const existingVet = await db.vet.findUnique({ where: { userId: user.id } })
    if (!existingVet) {
      await db.vet.create({
        data: {
          userId:      user.id,
          displayName: request.name,
          specialty:   request.specialty ?? "Обща практика",
          isActive:    true,
        }
      })
    }

    // Send welcome email
    const resend = getResend()
    if (!resend) return

    const isNewUser = !await db.user.findFirst({ where: { email: request.email, password: { not: null } } })
    const loginUrl = "https://dr-pet-friends.pages.dev/login"

    const content = `
      <h2 style="color:#111827;font-size:20px;font-weight:900;margin:0 0 8px">🎉 Добре дошли в Dr. Pet Friend!</h2>
      <p style="color:#6b7280;font-size:14px;margin:0 0 16px">
        Вашата заявка за партньорство беше одобрена! Вече имате достъп до ветеринарния dashboard.
      </p>
      <div style="background:#f9fafb;border-radius:12px;padding:16px;margin:16px 0">
        <p style="color:#374151;font-size:14px;margin:0 0 8px"><strong>Имейл:</strong> ${request.email}</p>
        ${isNewUser ? `<p style="color:#374151;font-size:14px;margin:0"><strong>Временна парола:</strong> ${tempPassword}</p>
        <p style="color:#EF3988;font-size:12px;margin:8px 0 0">⚠️ Сменете паролата след първото влизане!</p>` : ""}
      </div>
      ${ctaButton("Влез в Dashboard", loginUrl, "#1083BD")}
    `

    resend.emails.send({
      from:    "Dr. Pet Friend <onboarding@resend.dev>",
      to:      request.email,
      subject: "Заявката е одобрена — Добре дошли в Dr. Pet Friend!",
      html:    emailWrapper(content, "#1083BD"),
    }).catch(() => {})
  } catch (e: any) {
    console.error("createVetAccount error:", e?.message)
  }
}

export default router
