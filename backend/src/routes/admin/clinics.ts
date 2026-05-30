import { Router, Response } from "express"
import { db } from "../../lib/db"
import { authenticate, requireRole, AuthRequest } from "../../middleware/auth"

const router = Router()

router.get("/", authenticate, requireRole("ADMIN"), async (_req: AuthRequest, res: Response) => {
  try {
    const clinics = await db.clinic.findMany({ orderBy: { name: "asc" } })
    res.json(clinics)
  } catch {
    res.status(401).json({ error: "Unauthorized" })
  }
})

router.post("/", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res: Response) => {
  const body = req.body
  if (!body.name || !body.city || !body.address) {
    res.status(400).json({ error: "Задължителни полета липсват" })
    return
  }
  const clinic = await db.clinic.create({
    data: {
      name:        body.name,
      type:        body.type ?? "VET",
      address:     body.address,
      city:        body.city,
      phone:       body.phone || null,
      description: body.description || null,
      hours:       body.hours || null,
      isEmergency: body.isEmergency ?? false,
      isActive:    body.isActive ?? true,
      rating:      Number(body.rating) || 0,
      lat:         body.lat ? Number(body.lat) : null,
      lng:         body.lng ? Number(body.lng) : null,
    },
  })
  res.json(clinic)
})

router.patch("/", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res: Response) => {
  const { id, ...data } = req.body
  if (!id) { res.status(400).json({ error: "ID е задължително" }); return }
  const clinic = await db.clinic.update({
    where: { id },
    data: {
      name:        data.name,
      type:        data.type,
      address:     data.address,
      city:        data.city,
      phone:       data.phone || null,
      description: data.description || null,
      hours:       data.hours || null,
      isEmergency: data.isEmergency,
      isActive:    data.isActive,
      rating:      Number(data.rating) || 0,
      lat:         data.lat ? Number(data.lat) : null,
      lng:         data.lng ? Number(data.lng) : null,
    },
  })
  res.json(clinic)
})

router.delete("/", authenticate, requireRole("ADMIN"), async (req: AuthRequest, res: Response) => {
  const { id } = req.body
  if (!id) { res.status(400).json({ error: "ID е задължително" }); return }
  await db.clinic.delete({ where: { id } })
  res.json({ ok: true })
})

export default router
