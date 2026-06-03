import { Router, Response } from "express"
import { db } from "../../lib/db"
import { authenticate, AuthRequest } from "../../middleware/auth"

const router = Router()

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  // Resolve actual DB user (handles session ID vs DB ID mismatch)
  let dbUser = await db.user.findUnique({ where: { id: req.user!.id } })
  if (!dbUser) dbUser = await db.user.findUnique({ where: { email: req.user!.email } })
  if (!dbUser) { res.json([]); return }

  const ownerId  = dbUser.id
  const upcoming = req.query.upcoming === "true"

  const where: any = { ownerId }
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
      payment: { select: { status: true } },
    },
    orderBy: { date: upcoming ? "asc" : "desc" },
  })



  res.json(appointments)
})

export default router
