import { Router, Response } from "express"
import { db } from "../../lib/db"
import { authenticate, requireRole, AuthRequest } from "../../middleware/auth"

const router = Router()

router.get("/", authenticate, requireRole("ADMIN"), async (_req: AuthRequest, res: Response) => {
  try {
    const users = await db.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true, image: true },
      orderBy: { createdAt: "desc" },
    })
    res.json(users)
  } catch {
    res.status(401).json({ error: "Unauthorized" })
  }
})

router.patch("/", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { id, role } = req.body
    const user = await db.user.update({ where: { id }, data: { role } })
    res.json(user)
  } catch {
    res.status(500).json({ error: "Грешка" })
  }
})

export default router
