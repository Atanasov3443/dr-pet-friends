import { Router, Request, Response } from "express"
import { db } from "../lib/db"
import { cacheGet, cacheSet, TTL } from "../lib/cache"

const router = Router()

// GET /api/vets — list all active vets (for sitemap)
router.get("/", async (_req: Request, res: Response) => {
  const cacheKey = "vets:all"
  const cached   = await cacheGet(cacheKey)
  if (cached) { res.json(cached); return }

  try {
    const vets = await db.vet.findMany({
      where:   { isActive: true },
      select:  { id: true, displayName: true, specialty: true, updatedAt: true },
      orderBy: { rating: "desc" },
    })
    await cacheSet(cacheKey, vets, TTL.VETS)
    res.json(vets)
  } catch { res.json([]) }
})

router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params

  const cacheKey = `vet:${id}`
  const cached   = await cacheGet(cacheKey)
  if (cached) { res.json(cached); return }

  try {
    const vet = await db.vet.findUnique({
      where: { id },
      include: {
        clinic:   true,
        services: { orderBy: { price: "asc" } },
        schedule: { orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }], where: { isActive: true } },
        reviews:  { include: { user: { select: { name: true, image: true } } }, orderBy: { createdAt: "desc" }, take: 5 },
        user:     { select: { name: true, email: true } },
      },
    })

    if (!vet) { res.status(404).json({ error: "Not found" }); return }

    await cacheSet(cacheKey, vet, TTL.VET)
    res.json(vet)
  } catch {
    res.status(500).json({ error: "Server error" })
  }
})

export default router
