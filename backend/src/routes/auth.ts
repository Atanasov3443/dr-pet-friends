import { Router, Request, Response } from "express"
import { db } from "../lib/db"
import bcrypt from "bcryptjs"

const router = Router()

router.post("/ensure-user", async (req: Request, res: Response) => {
  const { email, name, image } = req.body ?? {}
  if (!email) { res.status(400).json({ error: "Missing email" }); return }

  try {
    let user = await db.user.findUnique({ where: { email } })
    if (!user) {
      user = await db.user.create({
        data: { email, name: name ?? null, image: image ?? null, role: "OWNER" },
      })
    } else if ((name && user.name !== name) || (image && user.image !== image)) {
      user = await db.user.update({
        where: { email },
        data: { name: name ?? user.name, image: image ?? user.image },
      })
    }
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, image: user.image })
  } catch {
    res.status(500).json({ error: "Server error" })
  }
})

router.post("/verify-credentials", async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {}

  if (!email || !password) {
    res.status(400).json({ error: "Missing credentials" })
    return
  }

  try {
    const user = await db.user.findUnique({ where: { email } })
    if (!user || !user.password) {
      res.status(401).json({ error: "Invalid credentials" })
      return
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" })
      return
    }

    res.json({
      id:    user.id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      image: user.image,
    })
  } catch {
    res.status(500).json({ error: "Server error" })
  }
})

export default router
