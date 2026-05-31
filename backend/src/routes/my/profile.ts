import { Router, Response } from "express"
import { db } from "../../lib/db"
import { authenticate, AuthRequest } from "../../middleware/auth"
import bcrypt from "bcryptjs"

const router = Router()

// GET /api/my/profile — fetch current user profile
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await db.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, email: true, phone: true, image: true, role: true, createdAt: true },
    })
    if (!user) { res.status(404).json({ error: "Не е намерен" }); return }
    res.json(user)
  } catch {
    res.status(500).json({ error: "Грешка" })
  }
})

// PATCH /api/my/profile — update name, phone, image
router.patch("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, image, currentPassword, newPassword } = req.body

    const user = await db.user.findUnique({ where: { id: req.user!.id } })
    if (!user) { res.status(404).json({ error: "Не е намерен" }); return }

    const updateData: Record<string, unknown> = {}

    if (name  != null) updateData.name  = String(name).trim()  || null
    if (phone != null) updateData.phone = String(phone).trim() || null
    if (image != null) updateData.image = String(image).trim() || null

    if (newPassword) {
      if (!currentPassword) { res.status(400).json({ error: "Въведете текущата парола" }); return }
      if (!user.password)   { res.status(400).json({ error: "Акаунтът е свързан чрез Google" }); return }
      const valid = await bcrypt.compare(currentPassword, user.password)
      if (!valid) { res.status(400).json({ error: "Грешна текуща парола" }); return }
      if (String(newPassword).length < 6) { res.status(400).json({ error: "Паролата трябва да е поне 6 знака" }); return }
      updateData.password = await bcrypt.hash(String(newPassword), 10)
    }

    const updated = await db.user.update({
      where: { id: req.user!.id },
      data: updateData,
      select: { id: true, name: true, email: true, phone: true, image: true, role: true },
    })

    res.json(updated)
  } catch {
    res.status(500).json({ error: "Грешка" })
  }
})

export default router
