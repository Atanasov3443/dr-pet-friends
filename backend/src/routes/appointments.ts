import { Router, Response } from "express"
import { db } from "../lib/db"
import { authenticate, AuthRequest } from "../middleware/auth"
import { sendAppointmentConfirmation } from "../lib/email"

const router = Router()

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id
  const { vetId, serviceId, date, petName, petSpecies, notes } = req.body

  if (!vetId || !date) {
    res.status(400).json({ error: "Липсват задължителни полета" })
    return
  }

  let pet = await db.pet.findFirst({ where: { ownerId: userId, name: petName } })
  if (!pet) {
    pet = await db.pet.create({
      data: { ownerId: userId, name: petName || "Любимец", species: petSpecies || "DOG" },
    })
  }

  const service = serviceId ? await db.vetService.findUnique({ where: { id: serviceId } }) : null
  const vet     = await db.vet.findUnique({ where: { id: vetId }, select: { displayName: true } })

  const appointment = await db.appointment.create({
    data: {
      ownerId:   userId,
      vetId,
      petId:     pet.id,
      serviceId: serviceId || null,
      date:      new Date(date),
      notes:     notes || null,
      price:     service?.price ?? null,
      status:    "PENDING",
    },
  })

  const user = await db.user.findUnique({ where: { id: userId }, select: { name: true, email: true } })
  if (user?.email) {
    sendAppointmentConfirmation({
      to:          user.email,
      ownerName:   user.name ?? "Потребител",
      vetName:     vet?.displayName ?? "Специалист",
      date:        new Date(date),
      serviceName: service?.name ?? "Общ преглед",
      petName:     petName || "Любимец",
    }).catch(() => {})
  }

  res.json(appointment)
})

export default router
