import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendAppointmentConfirmation({
  to,
  ownerName,
  vetName,
  date,
  serviceName,
  petName,
}: {
  to: string
  ownerName: string
  vetName: string
  date: Date
  serviceName: string
  petName: string
}) {
  if (!process.env.RESEND_API_KEY) return

  const dateStr = date.toLocaleDateString("bg-BG", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })
  const timeStr = date.toLocaleTimeString("bg-BG", { hour: "2-digit", minute: "2-digit" })

  await resend.emails.send({
    from:    "Dr. Pet Friends <noreply@drpetfriends.bg>",
    to,
    subject: `Потвърждение за час — ${dateStr} ${timeStr}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#f9fafb;padding:32px;border-radius:16px">
        <div style="background:#1083BD;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
          <h1 style="color:white;margin:0;font-size:22px">🐾 Dr. Pet Friends</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px">Потвърждение за резервация</p>
        </div>
        <p style="color:#374151;font-size:16px">Здравей, <strong>${ownerName}</strong>!</p>
        <p style="color:#374151;font-size:14px">Твоят час е запазен успешно. Ето детайлите:</p>
        <div style="background:white;border-radius:12px;padding:20px;margin:16px 0;border:1px solid #e5e7eb">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="color:#9ca3af;padding:6px 0">Специалист</td><td style="color:#111827;font-weight:600;text-align:right">${vetName}</td></tr>
            <tr><td style="color:#9ca3af;padding:6px 0">Услуга</td><td style="color:#111827;font-weight:600;text-align:right">${serviceName}</td></tr>
            <tr><td style="color:#9ca3af;padding:6px 0">Любимец</td><td style="color:#111827;font-weight:600;text-align:right">${petName}</td></tr>
            <tr><td style="color:#9ca3af;padding:6px 0">Дата</td><td style="color:#111827;font-weight:600;text-align:right">${dateStr}</td></tr>
            <tr><td style="color:#9ca3af;padding:6px 0">Час</td><td style="color:#1083BD;font-weight:700;text-align:right;font-size:18px">${timeStr}</td></tr>
          </table>
        </div>
        <p style="color:#6b7280;font-size:13px">При нужда от промяна, моля свържете се с клиниката директно.</p>
        <p style="color:#6b7280;font-size:13px;margin-top:24px">С уважение,<br><strong>Екипът на Dr. Pet Friends</strong></p>
      </div>
    `,
  })
}
