import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const db = new PrismaClient({ adapter } as any)

async function main() {
  const email = "ivaylo.atanasov3443@gmail.com"

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    await db.user.update({
      where: { email },
      data:  { role: "ADMIN" },
    })
    console.log("✓ Потребителят е обновен като ADMIN")
    return
  }

  const password = await bcrypt.hash("Admin1234!", 12)
  await db.user.create({
    data: {
      name:     "Ivaylo",
      email,
      password,
      role:     "ADMIN",
    },
  })

  console.log("✓ ADMIN акаунт създаден:")
  console.log("  Email:   ", email)
  console.log("  Парола:   Admin1234!  ← смени след първи вход!")
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
