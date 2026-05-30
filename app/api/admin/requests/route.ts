import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

async function requireAdmin() {
  const session = await auth()
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized")
  }
}

export async function GET() {
  try {
    await requireAdmin()
    const requests = await db.profileRequest.findMany({ orderBy: { createdAt: "desc" } })
    return NextResponse.json(requests)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin()
    const data = await req.json()
    const request = await db.profileRequest.create({ data })
    return NextResponse.json(request, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin()
    const { id, status } = await req.json()
    const session = await auth()
    const updated = await db.profileRequest.update({
      where: { id },
      data: { status, reviewedById: (session!.user as any).id, reviewedAt: new Date() },
    })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}
