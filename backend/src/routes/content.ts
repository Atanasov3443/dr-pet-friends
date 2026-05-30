import { Router, Request, Response } from "express"
import { db } from "../lib/db"

const router = Router()

router.get("/", async (_req: Request, res: Response) => {
  try {
    const rows = await db.siteContent.findMany()
    res.json(rows)
  } catch {
    res.json([])
  }
})

export default router
