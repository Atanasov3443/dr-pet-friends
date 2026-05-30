import { Router, Response } from "express"
import { db } from "../../lib/db"
import { authenticate, AuthRequest } from "../../middleware/auth"

const router = Router()

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const userId  = req.user!.id
  const upcoming = req.query.upcoming === "true"

  const where: any = { ownerId: userId }
  if (upcoming) {
    where.date   = { gte: new Date() }
    where.status = { in: ["PENDING", "CONFIRMED"] }
  }

  const appointments = await db.appointment.findMany({
    where,
    include: {
      vet:     { select: { displayName: true, specialty: true, image: true, clinic: { select: { name: true, city: true } } } },
      pet:     { select: { name: true, species: true } },
      service: { select: { name: true, price: true } },
    },
    orderBy: { date: upcoming ? "asc" : "desc" },
  })

  res.json(appointments)
})

export default router
