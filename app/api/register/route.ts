import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Всички полета са задължителни." }, { status: 400 })
    }

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Вече съществува акаунт с този имейл." }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)

    await db.user.create({
      data: { name, email, password: hashed },
    })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Сървърна грешка. Опитай по-късно." }, { status: 500 })
  }
}
