export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as any).id
  const pets = await db.pet.findMany({
    where: { ownerId: userId },
    include: { vaccinations: { orderBy: { date: "desc" }, take: 3 } },
    orderBy: { createdAt: "asc" },
  })
  return NextResponse.json(pets)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as any).id
  const { name, species, gender, breed, birthDate, weight, notes } = await req.json()

  if (!name?.trim()) return NextResponse.json({ error: "Името е задължително" }, { status: 400 })

  const pet = await db.pet.create({
    data: {
      ownerId: userId,
      name:      name.trim(),
      species:   species   || "DOG",
      gender:    gender    || null,
      breed:     breed     || null,
      birthDate: birthDate ? new Date(birthDate) : null,
      weight:    weight    ? parseFloat(weight)  : null,
      notes:     notes     || null,
    },
  })
  return NextResponse.json(pet)
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as any).id
  const { id, name, species, gender, breed, birthDate, weight, notes } = await req.json()

  if (!name?.trim()) return NextResponse.json({ error: "Името е задължително" }, { status: 400 })

  const pet = await db.pet.findFirst({ where: { id, ownerId: userId } })
  if (!pet) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const updated = await db.pet.update({
    where: { id },
    data: {
      name:      name.trim(),
      species:   species   || "DOG",
      gender:    gender    || null,
      breed:     breed     || null,
      birthDate: birthDate ? new Date(birthDate) : null,
      weight:    weight    ? parseFloat(weight)  : null,
      notes:     notes     || null,
    },
  })
  return NextResponse.json(updated)
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as any).id
  const { id } = await req.json()

  const pet = await db.pet.findFirst({ where: { id, ownerId: userId } })
  if (!pet) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await db.pet.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
