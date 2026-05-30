import { Router, Response } from "express"
import { db } from "../../lib/db"
import { authenticate, requireRole, AuthRequest } from "../../middleware/auth"

const router = Router()

router.get("/", authenticate, requireRole("ADMIN"), async (_req: AuthRequest, res: Response) => {
  try {
    const [totalUsers, totalVets, pendingRequests, totalAppointments, recentRequests] = await Promise.all([
      db.user.count(),
      db.vet.count(),
      db.profileRequest.count({ where: { status: "PENDING" } }),
      db.appointment.count(),
      db.profileRequest.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ])

    res.json({ totalUsers, totalVets, pendingRequests, totalAppointments, recentRequests })
  } catch {
    res.status(500).json({ error: "Server error" })
  }
})

export default router
