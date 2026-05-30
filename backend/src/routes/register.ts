import { Router, Request, Response } from "express"
import { db } from "../lib/db"
import bcrypt from "bcryptjs"

const router = Router()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    if (!email || !password || !name) {
      res.status(400).json({ error: "Всички полета са задължителни." })
      return
    }
    if (typeof email !== "string" || !EMAIL_RE.test(email)) {
      res.status(400).json({ error: "Невалиден имейл адрес." })
      return
    }
    if (typeof password !== "string" || password.length < 8) {
      res.status(400).json({ error: "Паролата трябва да е поне 8 символа." })
      return
    }
    if (typeof name !== "string" || name.trim().length < 2 || name.length > 100) {
      res.status(400).json({ error: "Името трябва да е между 2 и 100 символа." })
      return
    }

    const existing = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (existing) {
      res.status(409).json({ error: "Вече съществува акаунт с този имейл." })
      return
    }

    const hashed = await bcrypt.hash(password, 12)
    await db.user.create({
      data: { name: name.trim(), email: email.toLowerCase().trim(), password: hashed },
    })

    res.status(201).json({ ok: true })
  } catch {
    res.status(500).json({ error: "Сървърна грешка. Опитай по-късно." })
  }
})

export default router
