export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

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

  return NextResponse.json(appointment)
}
