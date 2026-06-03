import { Router, Response } from "express"
import { db } from "../../lib/db"
import { authenticate, AuthRequest } from "../../middleware/auth"

const router = Router()

async function resolveOwner(req: AuthRequest) {
  let user = await db.user.findUnique({ where: { id: req.user!.id } })
  if (!user) user = await db.user.findUnique({ where: { email: req.user!.email } })
  return user
}

// GET /api/my/vaccinations?petId=xxx
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const user = await resolveOwner(req)
  if (!user) { res.json([]); return }

  const { petId } = req.query
  if (!petId) { res.status(400).json({ error: "petId е задължително" }); return }

  const pet = await db.pet.findFirst({ where: { id: String(petId), ownerId: user.id } })
  if (!pet) { res.status(403).json({ error: "Нямате достъп" }); return }

  const vaccinations = await db.vaccination.findMany({
    where:   { petId: String(petId) },
    orderBy: { date: "desc" },
  })
  res.json(vaccinations)
})

// POST /api/my/vaccinations
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  const user = await resolveOwner(req)
  if (!user) { res.status(401).json({ error: "Не е намерен потребител" }); return }

  const { petId, name, date, nextDate, notes } = req.body
  if (!petId || !name || !date) {
    res.status(400).json({ error: "petId, name и date са задължителни" }); return
  }

  const pet = await db.pet.findFirst({ where: { id: petId, ownerId: user.id } })
  if (!pet) { res.status(403).json({ error: "Нямате достъп" }); return }

  const vaccination = await db.vaccination.create({
    data: {
      petId,
      name:     name.trim(),
      date:     new Date(date),
      nextDate: nextDate ? new Date(nextDate) : null,
      notes:    notes || null,
    },
  })
  res.json(vaccination)
})

// DELETE /api/my/vaccinations
router.delete("/", authenticate, async (req: AuthRequest, res: Response) => {
  const user = await resolveOwner(req)
  if (!user) { res.status(401).json({ error: "Не е намерен потребител" }); return }

  const { id } = req.body
  const vacc = await db.vaccination.findUnique({ where: { id }, include: { pet: true } })
  if (!vacc || vacc.pet.ownerId !== user.id) {
    res.status(403).json({ error: "Нямате достъп" }); return
  }

  await db.vaccination.delete({ where: { id } })
  res.json({ ok: true })
})

export default router
