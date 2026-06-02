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
  const pets = await db.pet.findMany({
    where: { ownerId: user.id },
    include: { vaccinations: { orderBy: { date: "desc" }, take: 3 } },
    orderBy: { createdAt: "asc" },
  })
  res.json(pets)
})

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  const user = await resolveOwner(req)
  if (!user) { res.status(401).json({ error: "Не е намерен потребител" }); return }

  const { name, species, gender, breed, birthDate, weight, notes, image } = req.body
  if (!name?.trim()) { res.status(400).json({ error: "Името е задължително" }); return }

  try {
    const pet = await db.pet.create({
      data: {
        ownerId:   user.id,
        name:      name.trim(),
        species:   species   || "OTHER",
        gender:    gender    || null,
        breed:     breed     || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        weight:    weight    ? parseFloat(weight)  : null,
        notes:     notes     || null,
        image:     image     || null,
      },
    })
    res.json(pet)
  } catch (e: any) {
    res.status(500).json({ error: "Грешка при записване: " + (e?.message ?? "неизвестна") })
  }
})

router.patch("/", authenticate, async (req: AuthRequest, res: Response) => {
  const user = await resolveOwner(req)
  if (!user) { res.status(401).json({ error: "Не е намерен потребител" }); return }

  const { id, name, species, gender, breed, birthDate, weight, notes, image } = req.body
  if (!name?.trim()) { res.status(400).json({ error: "Името е задължително" }); return }

  const pet = await db.pet.findFirst({ where: { id, ownerId: user.id } })
  if (!pet) { res.status(404).json({ error: "Not found" }); return }

  try {
    const updated = await db.pet.update({
      where: { id },
      data: {
        name:      name.trim(),
        species:   species   || "OTHER",
        gender:    gender    || null,
        breed:     breed     || null,
        birthDate: birthDate ? new Date(birthDate) : null,
        weight:    weight    ? parseFloat(weight)  : null,
        notes:     notes     || null,
        image:     image     !== undefined ? (image || null) : pet.image,
      },
    })
    res.json(updated)
  } catch (e: any) {
    res.status(500).json({ error: "Грешка при обновяване: " + (e?.message ?? "неизвестна") })
  }
})

router.delete("/", authenticate, async (req: AuthRequest, res: Response) => {
  const user = await resolveOwner(req)
  if (!user) { res.status(401).json({ error: "Не е намерен потребител" }); return }

  const { id } = req.body
  const pet = await db.pet.findFirst({ where: { id, ownerId: user.id } })
  if (!pet) { res.status(404).json({ error: "Not found" }); return }

  await db.pet.delete({ where: { id } })
  res.json({ ok: true })
})

export default router
