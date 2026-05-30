import { Router, Response } from "express"
import { db } from "../../lib/db"
import { authenticate, requireRole, AuthRequest } from "../../middleware/auth"

const router = Router()

router.get("/", authenticate, requireRole("ADMIN"), async (_req: AuthRequest, res: Response) => {
  try {
    const content = await db.siteContent.findMany({ orderBy: { key: "asc" } })
    res.json(content)
  } catch {
    res.status(401).json({ error: "Unauthorized" })
  }
})

router.put("/", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { key, value } = req.body
    const entry = await db.siteContent.upsert({
      where:  { key },
      update: { value },
      create: { key, value },
    })
    res.json(entry)
  } catch {
    res.status(500).json({ error: "Грешка" })
  }
})

router.delete("/", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const { key } = req.body
    await db.siteContent.delete({ where: { key } })
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: "Грешка" })
  }
})

export default router
