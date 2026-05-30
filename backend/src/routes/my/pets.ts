import { Router, Response } from "express"
import { db } from "../../lib/db"
import { authenticate, AuthRequest } from "../../middleware/auth"

const router = Router()

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id
  const pets = await db.pet.findMany({
    where: { ownerId: userId },
    include: { vaccinations: { orderBy: { date: "desc" }, take: 3 } },
    orderBy: { createdAt: "asc" },
  })
  res.json(pets)
})

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id
  const { name, species, gender, breed, birthDate, weight, notes } = req.body

  if (!name?.trim()) { res.status(400).json({ error: "Името е задължително" }); return }

  try {
    const pet = await db.pet.create({
      data: {
        ownerId:   userId,
        name:      name.trim(),
        species:   species   || "DOG",
        gender:    gender    || null,
        breed:     breed     || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        weight:    weight    ? parseFloat(weight)  : null,
        notes:     notes     || null,
      },
    })
    res.json(pet)
  } catch (e: any) {
    res.status(500).json({ error: "Грешка при записване: " + (e?.message ?? "неизвестна") })
  }
})

router.patch("/", authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id
  const { id, name, species, gender, breed, birthDate, weight, notes } = req.body

  if (!name?.trim()) { res.status(400).json({ error: "Името е задължително" }); return }

  const pet = await db.pet.findFirst({ where: { id, ownerId: userId } })
  if (!pet) { res.status(404).json({ error: "Not found" }); return }

  try {
    const updated = await db.pet.update({
      where: { id },
      data: {
        name:      name.trim(),
        species:   species   || "DOG",
        gender:    gender    || null,
        breed:     breed     || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        weight:    weight    ? parseFloat(weight)  : null,
        notes:     notes     || null,
      },
    })
    res.json(updated)
  } catch (e: any) {
    res.status(500).json({ error: "Грешка при обновяване: " + (e?.message ?? "неизвестна") })
  }
})

router.delete("/", authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id
  const { id } = req.body

  const pet = await db.pet.findFirst({ where: { id, ownerId: userId } })
  if (!pet) { res.status(404).json({ error: "Not found" }); return }

  await db.pet.delete({ where: { id } })
  res.json({ ok: true })
})

export default router
