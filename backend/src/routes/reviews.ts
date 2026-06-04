import { Router, Response } from "express"
import { db } from "../lib/db"
import { authenticate, AuthRequest } from "../middleware/auth"
import { cacheDel } from "../lib/cache"

const router = Router()

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  // Resolve actual DB user
  let user = await db.user.findUnique({ where: { id: req.user!.id } })
  if (!user) user = await db.user.findUnique({ where: { email: req.user!.email } })
  if (!user) { res.status(401).json({ error: "Не е намерен потребител" }); return }
  const userId = user.id

  const { vetId, rating, comment } = req.body

  if (!vetId || !rating) { res.status(400).json({ error: "Липсват полета" }); return }
  if (rating < 1 || rating > 5) { res.status(400).json({ error: "Невалиден рейтинг" }); return }

  const existing = await db.review.findFirst({ where: { userId, vetId } })
  if (existing) {
    const updated = await db.review.update({
      where: { id: existing.id },
      data:  { rating, comment: comment || null },
    })
    await recalcVetRating(vetId)
    res.json(updated)
    return
  }

  const review = await db.review.create({
    data: { userId, vetId, rating, comment: comment || null },
  })
  await recalcVetRating(vetId)
  await cacheDel(`vet:${vetId}`)  // Invalidate vet cache after review
  await cacheDel(`search:`)       // Invalidate search cache
  res.json(review)
})

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

export default router
