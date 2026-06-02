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

export function generateMeetLink(appointmentId: string): string {
  return `https://meet.jit.si/DrPetFriend-${appointmentId}`
}

// ─── Shared layout ──────────────────────────────────────────────────────────

function emailWrapper(content: string, accentColor = "#1083BD") {
  return `<!DOCTYPE html>
<html lang="bg">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Dr. Pet Friend</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">

        <!-- Header -->
        <tr><td style="background:${accentColor};border-radius:16px 16px 0 0;padding:32px;text-align:center">
              <div style="color:white;font-size:24px;font-weight:900;letter-spacing:-0.5px">Dr. Pet Friend</div>
          <div style="color:rgba(255,255,255,0.75);font-size:13px;margin-top:4px">Вашият домашен любимец е наш приятел</div>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:white;padding:32px;border-radius:0 0 16px 16px;border:1px solid #e5e7eb;border-top:none">
          ${content}

          <!-- Footer -->
          <div style="border-top:1px solid #f3f4f6;margin-top:32px;padding-top:24px;text-align:center">
            <p style="color:#9ca3af;font-size:12px;margin:0">© 2026 Dr. Pet Friend · България</p>
            <p style="color:#9ca3af;font-size:12px;margin:4px 0 0">
              <a href="https://dr-pet-friends.pages.dev" style="color:${accentColor};text-decoration:none">dr-pet-friends.pages.dev</a>
            </p>
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`
}

function infoRow(icon: string, label: string, value: string, highlight = false) {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #f9fafb;width:50%">
      <span style="color:#9ca3af;font-size:13px">${icon} ${label}</span>
    </td>
    <td style="padding:10px 0;border-bottom:1px solid #f9fafb;text-align:right">
      <span style="color:${highlight ? "#1083BD" : "#111827"};font-weight:700;font-size:${highlight ? "18px" : "14px"}">${value}</span>
    </td>
  </tr>`
}

function ctaButton(text: string, href: string, color = "#1083BD") {
  return `<div style="text-align:center;margin:24px 0">
    <a href="${href}" style="display:inline-block;background:${color};color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.2px">${text}</a>
  </div>`
}

function meetBox(meetLink: string) {
  return `<div style="background:linear-gradient(135deg,#EFF6FF,#DBEAFE);border:2px solid #1083BD;border-radius:12px;padding:24px;margin:20px 0;text-align:center">
    <div style="font-size:28px;margin-bottom:8px">🎥</div>
    <p style="color:#1e40af;font-weight:700;margin:0 0 4px;font-size:16px">Линк за онлайн консултация</p>
    <p style="color:#6b7280;font-size:13px;margin:0 0 16px">Отворете линка в деня на срещата</p>
    <a href="${meetLink}" style="display:inline-block;background:#1083BD;color:white;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px">
      Влез в срещата →
    </a>
    <p style="color:#9ca3af;font-size:11px;margin:12px 0 0">Работи директно в браузъра, без инсталация</p>
  </div>`
}

function appointmentCard(rows: string) {
  return `<div style="background:#f9fafb;border-radius:12px;padding:4px 16px;margin:20px 0;border:1px solid #f3f4f6">
    <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
  </div>`
}

// ─── Email Templates ─────────────────────────────────────────────────────────

type AppointmentEmailData = {
  ownerEmail:    string
  ownerName:     string
  vetEmail:      string
  vetName:       string
  date:          Date
  serviceName:   string
  petName:       string
  isOnline:      boolean
  meetLink?:     string
  appointmentId: string
}

export async function sendAppointmentEmails(data: AppointmentEmailData) {
  const resend = getResend()
  if (!resend) return

  const dateStr    = formatDate(data.date)
  const timeStr    = formatTime(data.date)
  const typeLabel  = data.isOnline ? "Онлайн консултация" : "Преглед в клиника"
  const typeEmoji  = data.isOnline ? "🖥️" : "🏥"

  const rows = [
    infoRow("", "Тип", typeLabel),
    infoRow("", "Специалист", data.vetName),
    infoRow("", "Услуга", data.serviceName),
    infoRow("", "Любимец", data.petName),
    infoRow("", "Дата", dateStr),
    infoRow("", "Час", timeStr, true),
  ].join("")

  const card    = appointmentCard(rows)
  const meetBtn = data.isOnline && data.meetLink ? meetBox(data.meetLink) : ""

  // ── Email to owner ──────────────────────────────────────────────────
  const ownerContent = `
    <div style="margin-bottom:24px">
      <h2 style="color:#111827;font-size:22px;font-weight:900;margin:0 0 8px">Часът е запазен успешно</h2>
      <p style="color:#6b7280;font-size:14px;margin:0">Здравей, <strong style="color:#111827">${data.ownerName}</strong>! Вашата резервация е потвърдена.</p>
    </div>

    ${card}
    ${meetBtn}

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px;margin:20px 0">
      <p style="color:#166534;font-size:13px;margin:0">
        Ще получите напомняне преди прегледа. При нужда от промяна, свържете се с клиниката директно.
      </p>
    </div>

    ${ctaButton("Виж моите часове", "https://dr-pet-friends.pages.dev/my/appointments", "#EF3988")}
  `

  resend.emails.send({
    from:    "Dr. Pet Friend <onboarding@resend.dev>",
    to:      data.ownerEmail,
    subject: `Запазен час — ${data.vetName} · ${timeStr}, ${dateStr}`,
    html:    emailWrapper(ownerContent, "#1083BD"),
  }).catch(() => {})

  // ── Email to vet ─────────────────────────────────────────────────────
  if (!data.vetEmail) return

  const vetContent = `
    <div style="margin-bottom:24px">
      <h2 style="color:#111827;font-size:22px;font-weight:900;margin:0 0 8px">Нова резервация</h2>
      <p style="color:#6b7280;font-size:14px;margin:0">Здравейте, <strong style="color:#111827">д-р ${data.vetName}</strong>! Клиент е запазил час при вас.</p>
    </div>

    ${card}
    ${meetBtn}

    <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:10px;padding:16px;margin:20px 0">
      <p style="color:#92400e;font-size:13px;margin:0">
        Моля потвърдете или откажете часа от вашия dashboard своевременно.
      </p>
    </div>

    ${ctaButton("Отиди към Dashboard", "https://dr-pet-friends.pages.dev/dashboard/appointments", "#1083BD")}
  `

  resend.emails.send({
    from:    "Dr. Pet Friend <onboarding@resend.dev>",
    to:      data.vetEmail,
    subject: `Нова резервация — ${data.petName} · ${timeStr}, ${dateStr}`,
    html:    emailWrapper(vetContent, "#EF3988"),
  }).catch(() => {})
}

// Legacy export
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
