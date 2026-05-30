import { Router, Request, Response } from "express"
import { db } from "../lib/db"

const router = Router()

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, clinicName, city, type, specialty, message } = req.body

    if (!name || !email) {
      res.status(400).json({ error: "Името и имейлът са задължителни" })
      return
    }

    const request = await db.profileRequest.create({
      data: { name, email, phone, clinicName, city, type: type ?? "VET", specialty, message },
    })

    res.status(201).json({ ok: true, id: request.id })
  } catch {
    res.status(500).json({ error: "Сървърна грешка" })
  }
})

export default router
