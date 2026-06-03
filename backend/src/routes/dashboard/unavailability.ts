import { Router, Response } from "express"
import { db } from "../../lib/db"
import { authenticate, requireRole, AuthRequest } from "../../middleware/auth"

const router = Router()

async function getVetId(userId: string) {
  const vet = await db.vet.findUnique({ where: { userId } })
  if (!vet) throw new Error("No vet profile")
  return vet.id
}

router.get("/", authenticate, requireRole("VET","CLINIC_ADMIN","ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const vetId = await getVetId(req.user!.id)
    const entries = await db.vetUnavailability.findMany({
      where: { vetId, date: { gte: new Date() } },
      orderBy: { date: "asc" },
    })
    res.json(entries)
  } catch { res.json([]) }
})

router.post("/", authenticate, requireRole("VET","CLINIC_ADMIN","ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const vetId = await getVetId(req.user!.id)
    const { date, reason } = req.body
    if (!date) { res.status(400).json({ error: "date е задължително" }); return }

    const entry = await db.vetUnavailability.upsert({
      where:  { vetId_date: { vetId, date: new Date(date) } },
      update: { reason: reason || null },
      create: { vetId, date: new Date(date), reason: reason || null },
    })
    res.json(entry)
  } catch (e: any) { res.status(500).json({ error: e?.message }) }
})

router.delete("/", authenticate, requireRole("VET","CLINIC_ADMIN","ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const vetId = await getVetId(req.user!.id)
    const { date } = req.body
    await db.vetUnavailability.deleteMany({ where: { vetId, date: new Date(date) } })
    res.json({ ok: true })
  } catch { res.status(500).json({ error: "Грешка" }) }
})

export default router
