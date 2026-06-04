import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db      = new PrismaClient({ adapter } as any)

// Remove grooming clinics (not relevant to vet-only platform)
const deleted = await db.clinic.deleteMany({ where: { type: "GROOMING" } })
console.log("Removed grooming clinics:", deleted.count)

await db.$disconnect()
