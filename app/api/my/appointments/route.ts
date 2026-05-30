export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as any).id
  const { searchParams } = new URL(req.url)
  const upcoming = searchParams.get("upcoming") === "true"

  const where: any = { ownerId: userId }
  if (upcoming) {
    where.date = { gte: new Date() }
    where.status = { in: ["PENDING", "CONFIRMED"] }
  }

  const appointments = await db.appointment.findMany({
    where,
    include: {
      vet:     { select: { displayName: true, specialty: true, image: true, clinic: { select: { name: true, city: true } } } },
      pet:     { select: { name: true, species: true } },
      service: { select: { name: true, price: true } },
    },
    orderBy: { date: upcoming ? "asc" : "desc" },
  })

  return NextResponse.json(appointments)
}
