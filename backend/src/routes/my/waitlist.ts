import { Router, Response } from "express"
import { db } from "../../lib/db"
import { authenticate, AuthRequest } from "../../middleware/auth"

const router = Router()

async function resolveOwner(req: AuthRequest) {
  let user = await db.user.findUnique({ where: { id: req.user!.id } })
  if (!user) user = await db.user.findUnique({ where: { email: req.user!.email } })
  return user
}

// POST /api/my/waitlist — join waitlist for a slot
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await resolveOwner(req)
    if (!user) { res.status(401).json({ error: "Не е намерен потребител" }); return }

    const { vetId, date } = req.body
    if (!vetId || !date) { res.status(400).json({ error: "vetId и date са задължителни" }); return }

    const slotDate = new Date(date)

    // Check max 3 in waitlist
    const count = await db.waitlistEntry.count({
      where: { vetId, date: { gte: new Date(slotDate.getTime() - 30*60000), lte: new Date(slotDate.getTime() + 30*60000) } }
    })

    if (count >= 3) { res.status(400).json({ error: "Опашката за този час е пълна (макс. 3)" }); return }

    // Check not already in waitlist
    const existing = await db.waitlistEntry.findFirst({ where: { vetId, userId: user.id } })
    if (existing) { res.status(400).json({ error: "Вече сте в опашката" }); return }

    const entry = await db.waitlistEntry.create({
      data: { vetId, userId: user.id, date: slotDate, position: count + 1 }
    })

    res.json({ ok: true, position: count + 1, id: entry.id })
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Грешка" })
  }
})

// GET /api/my/waitlist — my waitlist entries
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await resolveOwner(req)
    if (!user) { res.json([]); return }

    const entries = await db.waitlistEntry.findMany({
      where:   { userId: user.id, confirmed: false },
      include: { vet: { select: { displayName: true, specialty: true } } },
      orderBy: { createdAt: "desc" },
    })
    res.json(entries)
  } catch {
    res.json([])
  }
})

// DELETE /api/my/waitlist/:id — leave waitlist
router.delete("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await resolveOwner(req)
    if (!user) { res.status(401).json({ error: "Не е намерен потребител" }); return }

    const entry = await db.waitlistEntry.findFirst({ where: { id: String(req.params.id), userId: user.id } })
    if (!entry) { res.status(404).json({ error: "Не е намерен" }); return }

    await db.waitlistEntry.delete({ where: { id: entry.id } })
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: "Грешка" })
  }
})

export default router
