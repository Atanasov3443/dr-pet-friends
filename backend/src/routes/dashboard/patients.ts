import { Router, Response } from "express"
import { db } from "../../lib/db"
import { authenticate, requireRole, AuthRequest } from "../../middleware/auth"

const router = Router()

async function getVetId(userId: string) {
  const vet = await db.vet.findUnique({ where: { userId } })
  if (!vet) throw new Error("No vet profile")
  return vet.id
}

// GET /api/dashboard/patients — all unique pets that booked with this vet
router.get("/", authenticate, requireRole("VET", "CLINIC_ADMIN", "ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const vetId = await getVetId(req.user!.id)

    const appointments = await db.appointment.findMany({
      where: { vetId },
      include: {
        pet:   { include: { vaccinations: { orderBy: { date: "desc" }, take: 3 }, medicalRecords: { orderBy: { createdAt: "desc" }, take: 1 } } },
        owner: { select: { name: true, email: true, phone: true } },
      },
      orderBy: { date: "desc" },
    })

    // Group by pet — keep most recent appointment per pet
    const seen = new Map<string, any>()
    for (const a of appointments) {
      if (!seen.has(a.petId)) {
        seen.set(a.petId, {
          pet:          a.pet,
          owner:        a.owner,
          lastVisit:    a.date,
          totalVisits:  0,
          lastDiagnosis: a.pet.medicalRecords[0]?.diagnosis ?? null,
        })
      }
      seen.get(a.petId).totalVisits++
    }

    res.json([...seen.values()])
  } catch {
    res.json([])
  }
})

// GET /api/dashboard/patients/:petId — full history for one patient
router.get("/:petId", authenticate, requireRole("VET", "CLINIC_ADMIN", "ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const vetId = await getVetId(req.user!.id)
    const petId = String(req.params.petId)

    const pet = await db.pet.findUnique({
      where: { id: petId },
      include: {
        owner: { select: { name: true, email: true, phone: true } },
        vaccinations: { orderBy: { date: "desc" } },
        medicalRecords: {
          where: { vetId },
          include: { appointment: { select: { date: true } } },
          orderBy: { createdAt: "desc" },
        },
        appointments: {
          where: { vetId },
          include: { service: { select: { name: true } } },
          orderBy: { date: "desc" },
          take: 20,
        },
      },
    })

    res.json(pet)
  } catch {
    res.status(404).json({ error: "Не е намерен" })
  }
})

export default router
