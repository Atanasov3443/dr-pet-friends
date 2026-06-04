import { Router, Request, Response } from "express"
import { db } from "../lib/db"
import { cacheGet, cacheSet, TTL } from "../lib/cache"

const router = Router()

router.get("/", async (req: Request, res: Response) => {
  const q         = (req.query.q        as string) ?? ""
  const city      = (req.query.city     as string) ?? ""
  const type      = (req.query.type     as string) ?? ""
  const specialty = (req.query.specialty as string) ?? ""

  // Cache key based on query params
  const cacheKey = `search:${q}:${city}:${specialty}:${type}`
  const cached   = await cacheGet(cacheKey)
  if (cached) { res.json(cached); return }

  try {
    const vets = await db.vet.findMany({
      where: {
        isActive: true,
        ...(q ? {
          OR: [
            { displayName: { contains: q, mode: "insensitive" } },
            { specialty:   { contains: q, mode: "insensitive" } },
            { bio:         { contains: q, mode: "insensitive" } },
          ],
        } : {}),
        ...(specialty ? { specialty: { contains: specialty, mode: "insensitive" } } : {}),
        ...(city ? { clinic: { city: { contains: city, mode: "insensitive" } } } : {}),
        ...(type === "grooming" ? { clinic: { type: "GROOMING" } } : {}),
        ...(type === "vet" ? { OR: [{ clinic: null }, { clinic: { type: "VET" } }] } : {}),
      },
      include: {
        clinic:   { select: { name: true, city: true, address: true, type: true } },
        services: { select: { id: true, name: true, price: true, duration: true }, take: 3 },
        schedule: { select: { dayOfWeek: true, startTime: true, endTime: true, isActive: true } },
        _count:   { select: { reviews: true, appointments: true } },
      },
      orderBy: [{ rating: "desc" }, { reviewCount: "desc" }],
      take: 50,
    })
    await cacheSet(cacheKey, vets, TTL.SEARCH)
    res.json(vets)
  } catch {
    res.json([])
  }
})

export default router
