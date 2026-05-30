import { Router, Request, Response } from "express"
import { db } from "../lib/db"

const router = Router()

router.get("/", async (req: Request, res: Response) => {
  const q         = (req.query.q        as string) ?? ""
  const city      = (req.query.city     as string) ?? ""
  const type      = (req.query.type     as string) ?? ""
  const specialty = (req.query.specialty as string) ?? ""

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
    res.json(vets)
  } catch {
    res.json([])
  }
})

export default router
