import { Router, Response } from "express"
import { db } from "../../lib/db"
import { authenticate, requireRole, AuthRequest } from "../../middleware/auth"

const router = Router()

router.get("/", authenticate, requireRole("VET", "CLINIC_ADMIN", "ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const vet = await db.vet.findUnique({ where: { userId: req.user!.id } })
    res.json({ vet })
  } catch {
    res.status(401).json({ error: "Unauthorized" })
  }
})

router.put("/", authenticate, requireRole("VET", "CLINIC_ADMIN", "ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { displayName, specialty, bio, image, phone, experience, isActive, isEmergency } = req.body

    const existing = await db.vet.findUnique({ where: { userId: req.user!.id } })
    if (!existing) {
      res.status(403).json({ error: "Профилът трябва да се създаде от администратор" })
      return
    }

    const vet = await db.vet.update({
      where: { userId: req.user!.id },
      data:  { displayName, specialty, bio, image, phone, experience: Number(experience) || 0, isActive, isEmergency },
    })

    res.json({ vet })
  } catch {
    res.status(500).json({ error: "Грешка" })
  }
})

export default router
