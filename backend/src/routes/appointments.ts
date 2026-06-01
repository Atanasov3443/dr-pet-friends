import { Router, Response } from "express"
import { db } from "../lib/db"
import { authenticate, AuthRequest } from "../middleware/auth"
import { sendAppointmentEmails, generateMeetLink } from "../lib/email"

const router = Router()

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id
    const { vetId, serviceId, date, petName, petSpecies, notes, consultationType } = req.body

    if (!vetId || !date) {
      res.status(400).json({ error: "Липсват задължителни полета" })
      return
    }

    const isOnline = consultationType === "ONLINE"

    // Ensure the user exists in the database (auto-create if missing)
    await db.user.upsert({
      where:  { id: userId },
      update: {},
      create: {
        id:    userId,
        email: req.user!.email,
        name:  req.user!.name,
        role:  (req.user!.role as any) ?? "OWNER",
      },
    })

    let pet = await db.pet.findFirst({ where: { ownerId: userId, name: petName } })
    if (!pet) {
      pet = await db.pet.create({
        data: { ownerId: userId, name: petName || "Любимец", species: petSpecies || "DOG" },
      })
    }

    const service = serviceId ? await db.vetService.findUnique({ where: { id: serviceId } }) : null
    const vet     = await db.vet.findUnique({
      where: { id: vetId },
      include: { user: { select: { email: true } } },
    })

    const tempId   = `${vetId}-${Date.now()}`
    const meetLink = isOnline ? generateMeetLink(tempId) : null

    const appointment = await db.appointment.create({
      data: {
        ownerId:          userId,
        vetId,
        petId:            pet.id,
        serviceId:        serviceId || null,
        date:             new Date(date),
        notes:            notes || null,
        price:            service?.price ?? null,
        status:           "PENDING",
        consultationType: isOnline ? "ONLINE" : "IN_CLINIC",
        meetLink,
      },
    })

    const user = await db.user.findUnique({ where: { id: userId }, select: { name: true, email: true } })

    if (user?.email) {
      sendAppointmentEmails({
        ownerEmail:    user.email,
        ownerName:     user.name ?? "Потребител",
        vetEmail:      vet?.user?.email ?? "",
        vetName:       vet?.displayName ?? "Специалист",
        date:          new Date(date),
        serviceName:   service?.name ?? "Общ преглед",
        petName:       petName || "Любимец",
        isOnline,
        meetLink:      meetLink ?? undefined,
        appointmentId: appointment.id,
      }).catch(() => {})
    }

    res.json(appointment)
  } catch (err: any) {
    console.error("Appointment error:", err?.message ?? err)
    res.status(500).json({ error: "Грешка при запазване на час" })
  }
})

export default router
