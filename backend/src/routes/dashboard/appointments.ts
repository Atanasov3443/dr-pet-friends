import { Router, Response } from "express"
import { db } from "../../lib/db"
import { authenticate, requireRole, AuthRequest } from "../../middleware/auth"

const router = Router()

async function getVetId(userId: string) {
  const vet = await db.vet.findUnique({ where: { userId } })
  if (!vet) throw new Error("No vet profile")
  return vet.id
}

router.get("/", authenticate, requireRole("VET", "CLINIC_ADMIN", "ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const vetId    = await getVetId(req.user!.id)
    const upcoming = req.query.upcoming === "true"
    const limit    = Math.min(Number(req.query.limit) || 50, 200)

    const appointments = await db.appointment.findMany({
      where: {
        vetId,
        ...(upcoming ? { date: { gte: new Date() }, status: { in: ["PENDING", "CONFIRMED"] } } : {}),
      },
      include: {
        owner:   { select: { name: true, email: true } },
        pet:     { select: { name: true, species: true, breed: true } },
        service: { select: { name: true, duration: true } },
      },
      orderBy: { date: "asc" },
      take: limit,
    })

    res.json(appointments)
  } catch {
    res.json([])
  }
})

router.patch("/", authenticate, requireRole("VET", "CLINIC_ADMIN", "ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const vet = await db.vet.findUnique({ where: { userId: req.user!.id } })
    if (!vet) { res.status(403).json({ error: "Няма vet профил" }); return }

    const { id, status } = req.body
    const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: "Невалиден статус" })
      return
    }

    const existing = await db.appointment.findUnique({ where: { id } })
    if (!existing || existing.vetId !== vet.id) {
      res.status(404).json({ error: "Не е намерен" })
      return
    }

    const appointment = await db.appointment.update({ where: { id }, data: { status } })
    res.json(appointment)
  } catch {
    res.status(500).json({ error: "Грешка" })
  }
})

export default router
