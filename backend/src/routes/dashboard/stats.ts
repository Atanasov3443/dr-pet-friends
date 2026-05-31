import { Router, Response } from "express"
import { db } from "../../lib/db"
import { authenticate, requireRole, AuthRequest } from "../../middleware/auth"

const router = Router()

async function getVetId(userId: string) {
  const vet = await db.vet.findUnique({ where: { userId } })
  if (!vet) throw new Error("No vet profile")
  return vet.id
}

// GET /api/dashboard/stats?period=month|year|all
router.get("/", authenticate, requireRole("VET", "CLINIC_ADMIN", "ADMIN"), async (req: AuthRequest, res: Response) => {
  try {
    const vetId  = await getVetId(req.user!.id)
    const period = String(req.query.period ?? "month")

    const now   = new Date()
    let dateFrom: Date | undefined

    if (period === "month") {
      dateFrom = new Date(now.getFullYear(), now.getMonth(), 1)
    } else if (period === "year") {
      dateFrom = new Date(now.getFullYear(), 0, 1)
    }

    const whereBase = {
      vetId,
      status: "COMPLETED" as const,
      ...(dateFrom ? { date: { gte: dateFrom } } : {}),
    }

    const [completedAppointments, allAppointments, recentRecords] = await Promise.all([
      db.appointment.findMany({
        where: whereBase,
        select: { id: true, price: true, date: true, service: { select: { name: true } } },
        orderBy: { date: "desc" },
      }),
      db.appointment.findMany({
        where: { vetId, ...(dateFrom ? { date: { gte: dateFrom } } : {}) },
        select: { status: true },
      }),
      db.appointment.findMany({
        where: whereBase,
        include: {
          pet:   { select: { name: true, species: true } },
          owner: { select: { name: true } },
        },
        orderBy: { date: "desc" },
        take: 5,
      }),
    ])

    const totalRevenue   = completedAppointments.reduce((s, a) => s + (a.price ?? 0), 0)
    const totalCompleted = completedAppointments.length
    const totalAll       = allAppointments.length
    const cancelled      = allAppointments.filter(a => a.status === "CANCELLED").length
    const pending        = allAppointments.filter(a => a.status === "PENDING").length
    const confirmed      = allAppointments.filter(a => a.status === "CONFIRMED").length

    // Revenue by day (last 30 days)
    const revenueByDay: Record<string, number> = {}
    completedAppointments.forEach(a => {
      const day = a.date.toISOString().slice(0, 10)
      revenueByDay[day] = (revenueByDay[day] ?? 0) + (a.price ?? 0)
    })

    // Top services
    const serviceCount: Record<string, { count: number; revenue: number }> = {}
    completedAppointments.forEach(a => {
      const name = a.service?.name ?? "Без услуга"
      if (!serviceCount[name]) serviceCount[name] = { count: 0, revenue: 0 }
      serviceCount[name].count++
      serviceCount[name].revenue += a.price ?? 0
    })
    const topServices = Object.entries(serviceCount)
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    res.json({
      totalRevenue,
      totalCompleted,
      totalAll,
      cancelled,
      pending,
      confirmed,
      revenueByDay,
      topServices,
      recentCompleted: recentRecords,
    })
  } catch {
    res.status(500).json({ error: "Грешка" })
  }
})

export default router
