import { Resend } from "resend"

function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

function formatDate(date: Date) {
  return date.toLocaleDateString("bg-BG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
}
function formatTime(date: Date) {
  return date.toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" })
}

// Generate a unique Jitsi Meet room link
export function generateMeetLink(appointmentId: string): string {
  return `https://meet.jit.si/DrPetFriend-${appointmentId}`
}

type AppointmentEmailData = {
  ownerEmail:   string
  ownerName:    string
  vetEmail:     string
  vetName:      string
  date:         Date
  serviceName:  string
  petName:      string
  isOnline:     boolean
  meetLink?:    string
  appointmentId: string
}

export async function sendAppointmentEmails(data: AppointmentEmailData) {
  const resend = getResend()
  if (!resend) return

  const dateStr = formatDate(data.date)
  const timeStr = formatTime(data.date)
  const typeLabel = data.isOnline ? "🖥️ Онлайн консултация" : "🏥 Преглед в клиника"

  const meetSection = data.isOnline && data.meetLink ? `
    <div style="background:#EFF6FF;border:2px solid #1083BD;border-radius:12px;padding:20px;margin:16px 0;text-align:center">
      <p style="color:#1083BD;font-weight:700;margin:0 0 8px;font-size:15px">🎥 Линк за онлайн консултация</p>
      <a href="${data.meetLink}" style="display:inline-block;background:#1083BD;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px">
        Влез в стаята →
      </a>
      <p style="color:#6b7280;font-size:12px;margin:10px 0 0">Линкът е активен по времето на консултацията</p>
    </div>
  ` : ""

  const baseCard = (rows: string) => `
    <div style="background:white;border-radius:12px;padding:20px;margin:16px 0;border:1px solid #e5e7eb">
      <table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table>
    </div>
  `
  const row = (label: string, value: string, highlight = false) =>
    `<tr><td style="color:#9ca3af;padding:6px 0">${label}</td><td style="color:${highlight ? "#1083BD" : "#111827"};font-weight:${highlight ? "700" : "600"};text-align:right;font-size:${highlight ? "18px" : "14px"}">${value}</td></tr>`

  const sharedRows = [
    row("Тип", typeLabel),
    row("Специалист", data.vetName),
    row("Услуга", data.serviceName),
    row("Любимец", data.petName),
    row("Дата", dateStr),
    row("Час", timeStr, true),
  ].join("")

  // Email to owner
  resend.emails.send({
    from:    "Dr. Pet Friend <noreply@drpetfriends.bg>",
    to:      data.ownerEmail,
    subject: `✅ Запазен час — ${data.vetName} · ${timeStr} ${dateStr}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#f9fafb;padding:32px;border-radius:16px">
        <div style="background:#1083BD;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
          <h1 style="color:white;margin:0;font-size:22px">🐾 Dr. Pet Friend</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px">Часът е запазен успешно!</p>
        </div>
        <p style="color:#374151;font-size:16px">Здравей, <strong>${data.ownerName}</strong>!</p>
        ${baseCard(sharedRows)}
        ${meetSection}
        <p style="color:#6b7280;font-size:13px">При нужда от промяна, моля свържете се с клиниката директно.</p>
        <p style="color:#6b7280;font-size:13px;margin-top:24px">С уважение,<br><strong>Екипът на Dr. Pet Friend</strong></p>
      </div>
    `,
  }).catch(() => {})

  // Email to vet
  resend.emails.send({
    from:    "Dr. Pet Friend <noreply@drpetfriends.bg>",
    to:      data.vetEmail,
    subject: `📅 Нова резервация — ${data.petName} · ${timeStr} ${dateStr}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#f9fafb;padding:32px;border-radius:16px">
        <div style="background:#EF3988;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
          <h1 style="color:white;margin:0;font-size:22px">🐾 Dr. Pet Friend</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px">Имате нова резервация</p>
        </div>
        <p style="color:#374151;font-size:16px">Здравейте, <strong>д-р ${data.vetName}</strong>!</p>
        <p style="color:#374151;font-size:14px">Клиент е запазил час при вас:</p>
        ${baseCard(sharedRows)}
        ${meetSection}
        <p style="color:#6b7280;font-size:13px">Потвърдете или откажете часа от вашия <a href="https://dr-pet-friends.pages.dev/dashboard/appointments" style="color:#1083BD">dashboard</a>.</p>
        <p style="color:#6b7280;font-size:13px;margin-top:24px">С уважение,<br><strong>Екипът на Dr. Pet Friend</strong></p>
      </div>
    `,
  }).catch(() => {})
}

// Legacy export for backwards compatibility
export async function sendAppointmentConfirmation(data: {
  to: string; ownerName: string; vetName: string
  date: Date; serviceName: string; petName: string
}) {
  await sendAppointmentEmails({
    ownerEmail: data.to, ownerName: data.ownerName,
    vetEmail: "", vetName: data.vetName,
    date: data.date, serviceName: data.serviceName,
    petName: data.petName, isOnline: false, appointmentId: "",
  })
}
