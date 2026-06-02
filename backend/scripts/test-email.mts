import "dotenv/config"
import { sendAppointmentEmails } from "../src/lib/email.js"

const testDate = new Date()
testDate.setDate(testDate.getDate() + 2)
testDate.setHours(10, 30, 0, 0)

// Email to owner (blue)
await sendAppointmentEmails({
  ownerEmail:    "ivaylo.atanasov3443@gmail.com",
  ownerName:     "Ивайло Атанасов",
  vetEmail:      "ivaylo.atanasov3443@gmail.com",
  vetName:       "Мария Иванова",
  date:          testDate,
  serviceName:   "Кардиологичен преглед",
  petName:       "Рекс",
  isOnline:      false,
  appointmentId: "test-123",
})

console.log("✅ Изпратени 2 имейла (клиент + ветеринар) до ivaylo.atanasov3443@gmail.com")
