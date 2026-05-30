import { Router, Response } from "express"
import { db } from "../../lib/db"
import { authenticate, requireRole, AuthRequest } from "../../middleware/auth"

const router = Router()

router.get("/", authenticate, requireRole("ADMIN"), async (_req: AuthRequest, res: Response) => {
  try {
    const requests = await db.profileRequest.findMany({ orderBy: { createdAt: "desc" } })
    res.json(requests)
  } catch {
    res.status(401).json({ error: "Unauthorized" })
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
    res.json(updated)
  } catch {
    res.status(500).json({ error: "Error" })
  }
})

export default router
