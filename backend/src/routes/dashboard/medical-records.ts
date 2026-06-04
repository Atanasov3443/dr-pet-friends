import { Router, Response } from "express"
import { db } from "../../lib/db"
import { authenticate, requireRole, AuthRequest } from "../../middleware/auth"

const router = Router()

async function getVetId(userId: string) {
  const vet = await db.vet.findUnique({ where: { userId } })
  if (!vet) throw new Error("No vet profile")
  return vet.id
}

// GET /api/dashboard/medical-records?appointmentId=xxx
// Vet fetches a specific record (or null if not yet created)
router.get("/", authenticate, requireRole("VET", "CLINIC_ADMIN", "ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const vetId = await getVetId(req.user!.id)
    const { appointmentId } = req.query

    if (appointmentId) {
      const appointment = await db.appointment.findUnique({ where: { id: String(appointmentId) } })
      if (!appointment || appointment.vetId !== vetId) {
        res.status(404).json({ error: "Не е намерен" }); return
      }
      const record = await db.medicalRecord.findUnique({
        where: { appointmentId: String(appointmentId) },
        include: { pet: { select: { name: true, species: true, breed: true } } },
      })
      res.json(record ?? null)
      return
    }

    // List all records for this vet
    const records = await db.medicalRecord.findMany({
      where: { vetId },
      include: {
        pet:         { select: { name: true, species: true, breed: true } },
        appointment: { select: { date: true, status: true, owner: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    })
    res.json(records)
  } catch {
    res.status(500).json({ error: "Грешка" })
  }
})

// POST /api/dashboard/medical-records
// Vet creates or updates a medical record for a completed appointment
router.post("/", authenticate, requireRole("VET", "CLINIC_ADMIN", "ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const vetId = await getVetId(req.user!.id)
    const { appointmentId, diagnosis, treatment, medications, notes, weight, temperature, nextVisit } = req.body

    if (!appointmentId) { res.status(400).json({ error: "appointmentId е задължително" }); return }

    const appointment = await db.appointment.findUnique({ where: { id: appointmentId } })
    if (!appointment || appointment.vetId !== vetId) {
      res.status(404).json({ error: "Не е намерен" }); return
    }

    const data = {
      petId: appointment.petId,
      vetId,
      diagnosis:   diagnosis   ?? null,
      treatment:   treatment   ?? null,
      medications: medications ?? null,
      notes:       notes       ?? null,
      weight:      weight      != null ? Number(weight)      : null,
      temperature: temperature != null ? Number(temperature) : null,
      nextVisit:   nextVisit   ? new Date(nextVisit) : null,
    }

    const record = await db.medicalRecord.upsert({
      where:  { appointmentId },
      create: { appointmentId, ...data },
      update: data,
    })

    // Auto-mark appointment as COMPLETED when a record is saved
    if (appointment.status !== "COMPLETED") {
      await db.appointment.update({ where: { id: appointmentId }, data: { status: "COMPLETED" } })
    }

    res.json(record)
  } catch {
    res.status(500).json({ error: "Грешка" })
  }
})

// POST /api/dashboard/medical-records/standalone
// Vet creates a record without an appointment (walk-in patient)
router.post("/standalone", authenticate, requireRole("VET", "CLINIC_ADMIN", "ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const vetId = await getVetId(req.user!.id)
    const { petName, petSpecies, ownerName, ownerEmail, ownerPhone, diagnosis, treatment, medications, notes, weight, temperature, nextVisit, date } = req.body

    if (!petName) { res.status(400).json({ error: "Името на пациента е задължително" }); return }

    // Find or create owner — prefer by email if provided
    let owner = ownerEmail
      ? await db.user.findUnique({ where: { email: ownerEmail } })
      : await db.user.findFirst({ where: { name: ownerName || "Пациент" } })

    if (!owner) {
      owner = await db.user.create({
        data: {
          email: ownerEmail || `patient_${Date.now()}@drpetfriend.internal`,
          name:  ownerName || "Пациент",
          phone: ownerPhone || null,
          role:  "OWNER",
        }
      })
    } else if (ownerPhone && !owner.phone) {
      // Update phone if missing
      await db.user.update({ where: { id: owner.id }, data: { phone: ownerPhone } })
    }

    // Create pet
    const pet = await db.pet.create({
      data: { ownerId: owner.id, name: petName, species: petSpecies || "OTHER" }
    })

    // Create stub appointment
    const vet = await db.vet.findUnique({ where: { id: vetId } })
    const appointment = await db.appointment.create({
      data: {
        ownerId: owner.id, vetId, petId: pet.id,
        date:    date ? new Date(date) : new Date(),
        status:  "COMPLETED",
      }
    })

    // Create medical record
    const record = await db.medicalRecord.create({
      data: {
        appointmentId: appointment.id,
        petId: pet.id, vetId,
        diagnosis:   diagnosis   ?? null,
        treatment:   treatment   ?? null,
        medications: medications ?? null,
        notes:       notes       ?? null,
        weight:      weight      != null ? Number(weight)      : null,
        temperature: temperature != null ? Number(temperature) : null,
        nextVisit:   nextVisit   ? new Date(nextVisit) : null,
      }
    })

    res.json(record)
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Грешка" })
  }
})

export default router
