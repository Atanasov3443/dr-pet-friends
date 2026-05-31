import { Router, Response } from "express"
import { db } from "../../lib/db"
import { authenticate, AuthRequest } from "../../middleware/auth"

const router = Router()

// GET /api/my/medical-records?petId=xxx
// Owner reads full medical history for one of their pets
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user!.id
    const { petId } = req.query

    if (!petId) { res.status(400).json({ error: "petId е задължително" }); return }

    const pet = await db.pet.findUnique({ where: { id: String(petId) } })
    if (!pet || pet.ownerId !== ownerId) {
      res.status(403).json({ error: "Нямате достъп" }); return
    }

    const records = await db.medicalRecord.findMany({
      where: { petId: String(petId) },
      include: {
        vet:         { select: { displayName: true, specialty: true, image: true } },
        appointment: { select: { date: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    res.json(records)
  } catch {
    res.status(500).json({ error: "Грешка" })
  }
})

export default router
