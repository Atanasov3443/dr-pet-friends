export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

async function requireAdmin() {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") throw new Error("Unauthorized")
}

export async function GET() {
  try {
    await requireAdmin()
    const vets = await db.vet.findMany({
      include: { user: { select: { email: true, name: true } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(vets)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const { email, password, displayName, specialty, bio, image, phone, experience, isActive, isEmergency } = await req.json()

    if (!email || !password || !displayName || !specialty) {
      return NextResponse.json({ error: "Задължителни полета липсват" }, { status: 400 })
    }

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Имейлът вече съществува" }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)
    const user   = await db.user.create({
      data: { email, name: displayName, password: hashed, role: "VET" },
    })

    const vet = await db.vet.create({
      data: { userId: user.id, displayName, specialty, bio, image, phone, experience: experience ?? 0, isActive: isActive ?? true, isEmergency: isEmergency ?? false },
      include: { user: { select: { email: true, name: true } } },
    })

    return NextResponse.json(vet, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Грешка при създаване" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin()
    const { id, displayName, specialty, bio, image, phone, experience, isActive, isEmergency } = await req.json()
    const vet = await db.vet.update({
      where: { id },
      data: { displayName, specialty, bio, image, phone, experience, isActive, isEmergency },
      include: { user: { select: { email: true, name: true } } },
    })
    return NextResponse.json(vet)
  } catch {
    return NextResponse.json({ error: "Грешка" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin()
    const { id } = await req.json()
    const vet = await db.vet.findUnique({ where: { id } })
    if (!vet) return NextResponse.json({ error: "Не е намерен" }, { status: 404 })
    await db.vet.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Грешка" }, { status: 500 })
  }
}
