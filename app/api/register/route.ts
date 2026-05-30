export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Всички полета са задължителни." }, { status: 400 })
    }
    if (typeof email !== "string" || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Невалиден имейл адрес." }, { status: 400 })
    }
    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json({ error: "Паролата трябва да е поне 8 символа." }, { status: 400 })
    }
    if (typeof name !== "string" || name.trim().length < 2 || name.length > 100) {
      return NextResponse.json({ error: "Името трябва да е между 2 и 100 символа." }, { status: 400 })
    }

    const existing = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (existing) {
      return NextResponse.json({ error: "Вече съществува акаунт с този имейл." }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)

    await db.user.create({
      data: { name: name.trim(), email: email.toLowerCase().trim(), password: hashed },
    })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Сървърна грешка. Опитай по-късно." }, { status: 500 })
  }
}
