import { Request, Response, NextFunction } from "express"
import { decode } from "@auth/core/jwt"

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    name: string | null
    role: string
  }
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.["authjs.session-token"] ?? req.cookies?.["__Secure-authjs.session-token"]

  if (!token) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  try {
    const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? ""
    const decoded = await decode({
      token,
      secret,
      salt: process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
    })

    if (!decoded?.id) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

    req.user = {
      id:    decoded.id as string,
      email: decoded.email as string,
      name:  decoded.name as string | null,
      role:  decoded.role as string ?? "OWNER",
    }
    next()
  } catch {
    res.status(401).json({ error: "Unauthorized" })
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: "Forbidden" })
      return
    }
    next()
  }
}
