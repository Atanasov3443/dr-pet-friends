export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { sendAppointmentConfirmation } from "@/lib/email"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as any).id
  const { vetId, serviceId, date, petName, petSpecies, notes } = await req.json()

  if (!vetId || !date) return NextResponse.json({ error: "Липсват задължителни полета" }, { status: 400 })

  // Get or create pet
  let pet = await db.pet.findFirst({ where: { ownerId: userId, name: petName } })
  if (!pet) {
    pet = await db.pet.create({
      data: { ownerId: userId, name: petName || "Любимец", species: petSpecies || "DOG" },
    })
  }

  const service = serviceId ? await db.vetService.findUnique({ where: { id: serviceId } }) : null
  const vet = await db.vet.findUnique({ where: { id: vetId }, select: { displayName: true } })

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

  // Send confirmation email (fire-and-forget, don't block response)
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

  return NextResponse.json(appointment)
}
