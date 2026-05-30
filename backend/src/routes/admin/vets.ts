import { Router, Response } from "express"
import { db } from "../../lib/db"
import { authenticate, requireRole, AuthRequest } from "../../middleware/auth"
import bcrypt from "bcryptjs"

const router = Router()

router.get("/", authenticate, requireRole("ADMIN"), async (_req: AuthRequest, res: Response) => {
  try {
    const vets = await db.vet.findMany({
      include: { user: { select: { email: true, name: true } } },
      orderBy: { createdAt: "desc" },
    })
    res.json(vets)
  } catch {
    res.status(401).json({ error: "Unauthorized" })
  }
})

router.post("/", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, displayName, specialty, bio, image, phone, experience, isActive, isEmergency } = req.body

    if (!email || !password || !displayName || !specialty) {
      res.status(400).json({ error: "Задължителни полета липсват" })
      return
    }

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      res.status(409).json({ error: "Имейлът вече съществува" })
      return
    }

    const hashed = await bcrypt.hash(password, 12)
    const user   = await db.user.create({
      data: { email, name: displayName, password: hashed, role: "VET" },
    })

    const vet = await db.vet.create({
      data: { userId: user.id, displayName, specialty, bio, image, phone, experience: experience ?? 0, isActive: isActive ?? true, isEmergency: isEmergency ?? false },
      include: { user: { select: { email: true, name: true } } },
    })

    res.status(201).json(vet)
  } catch {
    res.status(500).json({ error: "Грешка при създаване" })
  }
})

router.patch("/", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { id, displayName, specialty, bio, image, phone, experience, isActive, isEmergency } = req.body
    const vet = await db.vet.update({
      where: { id },
      data: { displayName, specialty, bio, image, phone, experience, isActive, isEmergency },
      include: { user: { select: { email: true, name: true } } },
    })
    res.json(vet)
  } catch {
    res.status(500).json({ error: "Грешка" })
  }
})

router.delete("/", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.body
    const vet = await db.vet.findUnique({ where: { id } })
    if (!vet) { res.status(404).json({ error: "Не е намерен" }); return }
    await db.vet.delete({ where: { id } })
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: "Грешка" })
  }
})

export default router
