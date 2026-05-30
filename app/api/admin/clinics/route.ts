export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

async function requireAdmin() {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") throw new Error("Unauthorized")
}

export async function GET() {
  try {
    await requireAdmin()
    const clinics = await db.clinic.findMany({ orderBy: { name: "asc" } })
    return NextResponse.json(clinics)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try { await requireAdmin() } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  const body = await req.json()
  if (!body.name || !body.city || !body.address) {
    return NextResponse.json({ error: "Задължителни полета липсват" }, { status: 400 })
  }
  const clinic = await db.clinic.create({
    data: {
      name:        body.name,
      type:        body.type ?? "VET",
      address:     body.address,
      city:        body.city,
      phone:       body.phone || null,
      description: body.description || null,
      hours:       body.hours || null,
      isEmergency: body.isEmergency ?? false,
      isActive:    body.isActive ?? true,
      rating:      Number(body.rating) || 0,
      lat:         body.lat ? Number(body.lat) : null,
      lng:         body.lng ? Number(body.lng) : null,
    },
  })
  return NextResponse.json(clinic)
}

export async function PATCH(req: Request) {
  try { await requireAdmin() } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  const body = await req.json()
  const { id, ...data } = body
  if (!id) return NextResponse.json({ error: "ID е задължително" }, { status: 400 })
  const clinic = await db.clinic.update({
    where: { id },
    data: {
      name:        data.name,
      type:        data.type,
      address:     data.address,
      city:        data.city,
      phone:       data.phone || null,
      description: data.description || null,
      hours:       data.hours || null,
      isEmergency: data.isEmergency,
      isActive:    data.isActive,
      rating:      Number(data.rating) || 0,
      lat:         data.lat ? Number(data.lat) : null,
      lng:         data.lng ? Number(data.lng) : null,
    },
  })
  return NextResponse.json(clinic)
}

export async function DELETE(req: Request) {
  try { await requireAdmin() } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: "ID е задължително" }, { status: 400 })
  await db.clinic.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
