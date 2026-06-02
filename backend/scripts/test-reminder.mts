import "dotenv/config"
import { db } from "../src/lib/db.js"
import { sendReminders } from "../src/lib/reminders.js"

// Create a test appointment 24 hours from now
const in24h = new Date(Date.now() + 24 * 60 * 60 * 1000)

// Find the admin user and first vet
const user = await db.user.findFirst({ where: { email: "ivaylo.atanasov3443@gmail.com" } })
const vet  = await db.vet.findFirst({ include: { services: true } })

if (!user || !vet) { console.error("No user or vet found"); process.exit(1) }

let pet = await db.pet.findFirst({ where: { ownerId: user.id } })
if (!pet) {
  pet = await db.pet.create({ data: { ownerId: user.id, name: "Рекс", species: "DOG" } })
}

// Create test appointment
const appt = await db.appointment.create({
  data: {
    ownerId:      user.id,
    vetId:        vet.id,
    petId:        pet.id,
    serviceId:    vet.services[0]?.id ?? null,
    date:         in24h,
    status:       "CONFIRMED",
    price:        vet.services[0]?.price ?? 60,
    reminderSent: false,
  }
})

console.log(`Created test appointment ${appt.id} for ${in24h.toLocaleString("bg-BG")}`)
console.log("Running sendReminders()...")

await sendReminders()

// Verify reminderSent was set
const updated = await db.appointment.findUnique({ where: { id: appt.id } })
console.log(`reminderSent = ${updated?.reminderSent}`)

if (updated?.reminderSent) {
  console.log("✅ Reminder email sent and marked successfully!")
} else {
  console.log("❌ Reminder was NOT sent")
}

// Cleanup
await db.appointment.delete({ where: { id: appt.id } })
console.log("Test appointment cleaned up.")

await db.$disconnect()
