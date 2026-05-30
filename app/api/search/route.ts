import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q        = searchParams.get("q")        ?? ""
  const city     = searchParams.get("city")     ?? ""
  const type     = searchParams.get("type")     ?? ""
  const specialty = searchParams.get("specialty") ?? ""

  try {
    const vets = await db.vet.findMany({
      where: {
        isActive: true,
        ...(q ? {
          OR: [
            { displayName: { contains: q, mode: "insensitive" } },
            { specialty:   { contains: q, mode: "insensitive" } },
            { bio:         { contains: q, mode: "insensitive" } },
          ],
        } : {}),
        ...(specialty ? { specialty: { contains: specialty, mode: "insensitive" } } : {}),
        ...(city ? { clinic: { city: { contains: city, mode: "insensitive" } } } : {}),
        ...(type === "grooming" ? { clinic: { type: "GROOMING" } } : {}),
        ...(type === "vet" ? {
          OR: [{ clinic: null }, { clinic: { type: "VET" } }]
        } : {}),
      },
      include: {
        clinic:   { select: { name: true, city: true, address: true, type: true } },
        services: { select: { id: true, name: true, price: true, duration: true }, take: 3 },
        schedule: { select: { dayOfWeek: true, startTime: true, endTime: true, isActive: true } },
        _count:   { select: { reviews: true, appointments: true } },
      },
      orderBy: [{ rating: "desc" }, { reviewCount: "desc" }],
      take: 50,
    })

    return NextResponse.json(vets)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
