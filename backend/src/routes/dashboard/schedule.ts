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
    const schedule = await db.schedule.findMany({
      where: { vetId },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    })
    res.json(schedule)
  } catch {
    res.json([])
  }
})

router.put("/", authenticate, requireRole("VET", "CLINIC_ADMIN", "ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const vetId       = await getVetId(req.user!.id)
    const { slots }   = req.body

    await db.schedule.deleteMany({ where: { vetId } })

    if (Array.isArray(slots) && slots.length > 0) {
      await db.schedule.createMany({
        data: slots.map((s: any) => ({
          vetId,
          dayOfWeek: Number(s.dayOfWeek),
          startTime: s.startTime,
          endTime:   s.endTime,
          isActive:  s.isActive ?? true,
        })),
      })
    }

    const schedule = await db.schedule.findMany({
      where: { vetId },
      orderBy: [{ dayOfWeek: "asc" }],
    })
    res.json(schedule)
  } catch {
    res.status(500).json({ error: "Грешка" })
  }
})

export default router
