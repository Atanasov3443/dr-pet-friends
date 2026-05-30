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

export async function GET() {
  try {
    const vetId    = await getVetId()
    const schedule = await db.schedule.findMany({ where: { vetId }, orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] })
    return NextResponse.json(schedule)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

export async function PUT(req: Request) {
  try {
    const vetId         = await getVetId()
    const { slots }     = await req.json()

    await db.schedule.deleteMany({ where: { vetId } })

    if (Array.isArray(slots) && slots.length > 0) {
      await db.schedule.createMany({
        data: slots.map((s: any) => ({
          vetId,
          dayOfWeek: Number(s.dayOfWeek),
          startTime: s.startTime,
          endTime:   s.endTime,
          isActive:  s.isActive ?? true,
        })),
      })
    }

    const schedule = await db.schedule.findMany({ where: { vetId }, orderBy: [{ dayOfWeek: "asc" }] })
    return NextResponse.json(schedule)
  } catch {
    return NextResponse.json({ error: "Грешка" }, { status: 500 })
  }
}
