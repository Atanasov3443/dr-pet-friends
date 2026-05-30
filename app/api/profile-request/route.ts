import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { name, email, phone, clinicName, city, type, specialty, message } = await req.json()

    if (!name || !email) {
      return NextResponse.json({ error: "Името и имейлът са задължителни" }, { status: 400 })
    }

    const request = await db.profileRequest.create({
      data: { name, email, phone, clinicName, city, type: type ?? "VET", specialty, message },
    })

    return NextResponse.json({ ok: true, id: request.id }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Сървърна грешка" }, { status: 500 })
  }
}
