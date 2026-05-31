import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db      = new PrismaClient({ adapter } as any)

const users = await db.user.findMany({ select: { id: true, email: true, name: true, role: true } })
console.log("Users:")
users.forEach(u => console.log(` ${u.email} — ${u.role}`))

await db.$disconnect()
