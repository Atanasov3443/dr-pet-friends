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
    const content = await db.siteContent.findMany({ orderBy: { key: "asc" } })
    return NextResponse.json(content)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin()
    const { key, value } = await req.json()
    const entry = await db.siteContent.upsert({
      where:  { key },
      update: { value },
      create: { key, value },
    })
    return NextResponse.json(entry)
  } catch {
    return NextResponse.json({ error: "Грешка" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin()
    const { key } = await req.json()
    await db.siteContent.delete({ where: { key } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Грешка" }, { status: 500 })
  }
}
