export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

async function getVetSession() {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")
  const role = (session.user as any).role
  if (role !== "VET" && role !== "CLINIC_ADMIN" && role !== "ADMIN") throw new Error("Forbidden")
  return session
}

export async function GET() {
  try {
    const session = await getVetSession()
    const userId  = (session.user as any).id
    const vet     = await db.vet.findUnique({ where: { userId } })
    return NextResponse.json({ vet })
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getVetSession()
    const userId  = (session.user as any).id
    const { displayName, specialty, bio, image, phone, experience, isActive, isEmergency } = await req.json()

    const existing = await db.vet.findUnique({ where: { userId } })
    if (!existing) return NextResponse.json({ error: "Профилът трябва да се създаде от администратор" }, { status: 403 })

    const data = { displayName, specialty, bio, image, phone, experience: Number(experience) || 0, isActive, isEmergency }
    const vet = await db.vet.update({ where: { userId }, data })

    return NextResponse.json({ vet })
  } catch {
    return NextResponse.json({ error: "Грешка" }, { status: 500 })
  }
}
