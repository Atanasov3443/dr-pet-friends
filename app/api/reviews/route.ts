export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = (session.user as any).id
  const { vetId, rating, comment } = await req.json()

  if (!vetId || !rating) return NextResponse.json({ error: "Липсват полета" }, { status: 400 })
  if (rating < 1 || rating > 5) return NextResponse.json({ error: "Невалиден рейтинг" }, { status: 400 })

  // Prevent duplicate reviews from same user for same vet
  const existing = await db.review.findFirst({ where: { userId, vetId } })
  if (existing) {
    const updated = await db.review.update({
      where: { id: existing.id },
      data:  { rating, comment: comment || null },
    })
    await recalcVetRating(vetId)
    return NextResponse.json(updated)
  }

  const review = await db.review.create({
    data: { userId, vetId, rating, comment: comment || null },
  })

  await recalcVetRating(vetId)
  return NextResponse.json(review)
}

async function recalcVetRating(vetId: string) {
  const reviews = await db.review.findMany({
    where: { vetId, isVisible: true },
    select: { rating: true },
  })
  const count = reviews.length
  const avg   = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0
  await db.vet.update({
    where: { id: vetId },
    data:  { rating: Math.round(avg * 10) / 10, reviewCount: count },
  })
}
