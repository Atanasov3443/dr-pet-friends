import { Router, Request, Response } from "express"
import { db } from "../lib/db"
import { getResend, emailWrapper, ctaButton } from "../lib/email"
import bcrypt from "bcryptjs"

const router = Router()

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    if (!email) { res.status(400).json({ error: "Имейлът е задължителен" }); return }

    const user = await db.user.findUnique({ where: { email: email.toLowerCase() } })

    // Always return success (don't reveal if email exists)
    res.json({ ok: true })

    if (!user) return

    // Delete old tokens
    await db.passwordResetToken.deleteMany({ where: { email: email.toLowerCase() } })

    // Create new token (expires in 1 hour)
    const token = await db.passwordResetToken.create({
      data: {
        email:   email.toLowerCase(),
        expires: new Date(Date.now() + 60 * 60 * 1000),
      }
    })

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://dr-pet-friends.pages.dev"}/reset-password?token=${token.token}`

    const resend = getResend()
    if (!resend) return

    const content = `
      <h2 style="color:#111827;font-size:20px;font-weight:900;margin:0 0 8px">Нулиране на парола</h2>
      <p style="color:#6b7280;font-size:14px;margin:0 0 20px">
        Получихме заявка за нулиране на паролата за акаунта с имейл <strong>${email}</strong>.
        Ако не сте направили тази заявка, можете да игнорирате този имейл.
      </p>
      ${ctaButton("Нулирай паролата", resetUrl, "#1083BD")}
      <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:16px">Линкът е валиден 1 час.</p>
    `

    resend.emails.send({
      from:    "Dr. Pet Friend <onboarding@resend.dev>",
      to:      email,
      subject: "Нулиране на парола — Dr. Pet Friend",
      html:    emailWrapper(content, "#1083BD"),
    }).catch(() => {})
  } catch {
    res.json({ ok: true })
  }
})

// POST /api/auth/reset-password
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body
    if (!token || !password) { res.status(400).json({ error: "Токенът и паролата са задължителни" }); return }
    if (password.length < 8) { res.status(400).json({ error: "Паролата трябва да е поне 8 символа" }); return }

    const record = await db.passwordResetToken.findUnique({ where: { token } })
    if (!record || record.used || record.expires < new Date()) {
      res.status(400).json({ error: "Невалиден или изтекъл токен" }); return
    }

    const hashed = await bcrypt.hash(password, 12)
    await db.user.update({ where: { email: record.email }, data: { password: hashed } })
    await db.passwordResetToken.update({ where: { id: record.id }, data: { used: true } })

    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: "Грешка при нулиране" })
  }
})

export default router
