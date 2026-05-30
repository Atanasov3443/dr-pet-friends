export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

async function getVetId() {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")
  const userId = (session.user as any).id
  const vet = await db.vet.findUnique({ where: { userId } })
  if (!vet) throw new Error("No vet profile")
  return vet.id
}

export async function GET(req: Request) {
  try {
    const vetId    = await getVetId()
    const { searchParams } = new URL(req.url)
    const upcoming = searchParams.get("upcoming") === "true"
    const limit    = Number(searchParams.get("limit")) || 100

    const appointments = await db.appointment.findMany({
      where: {
        vetId,
        ...(upcoming ? { date: { gte: new Date() }, status: { in: ["PENDING", "CONFIRMED"] } } : {}),
      },
      include: {
        owner:   { select: { name: true, email: true } },
        pet:     { select: { name: true, species: true, breed: true } },
        service: { select: { name: true, duration: true } },
      },
      orderBy: { date: "asc" },
      take: limit,
    })

    return NextResponse.json(appointments)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id, status } = await req.json()
    const appointment = await db.appointment.update({
      where: { id },
      data:  { status },
    })
    return NextResponse.json(appointment)
  } catch {
    return NextResponse.json({ error: "Грешка" }, { status: 500 })
  }
}
