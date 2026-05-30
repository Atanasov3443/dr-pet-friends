import { Router, Request, Response } from "express"
import { db } from "../lib/db"

const router = Router()

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params

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

    if (!vet) {
      res.status(404).json({ error: "Not found" })
      return
    }

    res.json(vet)
  } catch {
    res.status(500).json({ error: "Server error" })
  }
})

export default router
