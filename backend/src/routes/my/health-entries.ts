import { Router, Response } from "express"
import { db } from "../../lib/db"
import { authenticate, AuthRequest } from "../../middleware/auth"

const router = Router()

async function resolveOwner(req: AuthRequest) {
  let user = await db.user.findUnique({ where: { id: req.user!.id } })
  if (!user) user = await db.user.findUnique({ where: { email: req.user!.email } })
  return user
}

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const user = await resolveOwner(req)
  if (!user) { res.json([]); return }
  const { petId } = req.query
  if (!petId) { res.status(400).json({ error: "petId е задължително" }); return }
  const pet = await db.pet.findFirst({ where: { id: String(petId), ownerId: user.id } })
  if (!pet) { res.status(403).json({ error: "Нямате достъп" }); return }
  const entries = await db.petHealthEntry.findMany({
    where: { petId: String(petId) }, orderBy: { date: "desc" },
  })
  res.json(entries)
})

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  const user = await resolveOwner(req)
  if (!user) { res.status(401).json({ error: "Не е намерен потребител" }); return }
  const { petId, type, date, title, data, notes, nextDate } = req.body
  if (!petId || !type || !date || !title) {
    res.status(400).json({ error: "Задължителни полета липсват" }); return
  }
  const pet = await db.pet.findFirst({ where: { id: petId, ownerId: user.id } })
  if (!pet) { res.status(403).json({ error: "Нямате достъп" }); return }
  const entry = await db.petHealthEntry.create({
    data: { petId, type, date: new Date(date), title: title.trim(), data: data || null, notes: notes || null, nextDate: nextDate || null },
  })
  res.json(entry)
})

router.delete("/", authenticate, async (req: AuthRequest, res: Response) => {
  const user = await resolveOwner(req)
  if (!user) { res.status(401).json({ error: "Не е намерен потребител" }); return }
  const { id } = req.body
  const entry = await db.petHealthEntry.findUnique({ where: { id }, include: { pet: true } })
  if (!entry || entry.pet.ownerId !== user.id) { res.status(403).json({ error: "Нямате достъп" }); return }
  await db.petHealthEntry.delete({ where: { id } })
  res.json({ ok: true })
})

export default router
