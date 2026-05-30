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
    const users = await db.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true, image: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(users)
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin()
    const { id, role } = await req.json()
    const user = await db.user.update({ where: { id }, data: { role } })
    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: "Грешка" }, { status: 500 })
  }
}
