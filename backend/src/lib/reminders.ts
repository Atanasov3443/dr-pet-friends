import { db } from "./db"
import { getResend, formatDate, formatTime, emailWrapper, appointmentCard, infoRow, ctaButton } from "./email"

export async function sendReminders() {
  const resend = getResend()
  if (!resend) return

  const now      = new Date()
  const in23h    = new Date(now.getTime() + 23 * 60 * 60 * 1000)
  const in25h    = new Date(now.getTime() + 25 * 60 * 60 * 1000)

  const appointments = await db.appointment.findMany({
    where: {
      date:         { gte: in23h, lte: in25h },
      status:       { in: ["PENDING", "CONFIRMED"] },
      reminderSent: false,
    },
    include: {
      owner:   { select: { name: true, email: true } },
      vet:     { select: { displayName: true, specialty: true, user: { select: { email: true } } } },
      pet:     { select: { name: true } },
      service: { select: { name: true } },
    },
  })

  for (const appt of appointments) {
    if (!appt.owner?.email) continue

    const dateStr   = formatDate(appt.date)
    const timeStr   = formatTime(appt.date)
    const isOnline  = appt.consultationType === "ONLINE"

    const rows = [
      infoRow("", "Специалист", appt.vet?.displayName ?? "—"),
      infoRow("", "Услуга",     appt.service?.name ?? "Преглед"),
      infoRow("", "Любимец",    appt.pet?.name ?? "—"),
      infoRow("", "Дата",       dateStr),
      infoRow("", "Час",        timeStr, true),
    ].join("")

    const meetSection = isOnline && appt.meetLink
      ? `<div style="background:#EFF6FF;border:2px solid #1083BD;border-radius:10px;padding:20px;margin:20px 0;text-align:center">
          <p style="color:#1e40af;font-weight:700;margin:0 0 12px;font-size:15px">Линк за онлайн консултация</p>
          <a href="${appt.meetLink}" style="display:inline-block;background:#1083BD;color:white;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px">Влез в срещата →</a>
        </div>`
      : ""

    const content = `
      <div style="margin-bottom:24px">
        <h2 style="color:#111827;font-size:22px;font-weight:900;margin:0 0 8px">Напомняне за предстоящ преглед</h2>
        <p style="color:#6b7280;font-size:14px;margin:0">Здравей, <strong style="color:#111827">${appt.owner.name ?? "потребителю"}</strong>! Имаш запазен час утре.</p>
      </div>
      ${appointmentCard(rows)}
      ${meetSection}
      <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:10px;padding:16px;margin:20px 0">
        <p style="color:#92400e;font-size:13px;margin:0">
          Ако не можете да присъствате, моля се свържете с клиниката предварително.
        </p>
      </div>
      ${ctaButton("Виж моите часове", "https://dr-pet-friends.pages.dev/my/appointments", "#EF3988")}
    `

    await resend.emails.send({
      from:    "Dr. Pet Friend <onboarding@resend.dev>",
      to:      appt.owner.email,
      subject: `Напомняне — ${appt.vet?.displayName} · ${timeStr}, ${dateStr}`,
      html:    emailWrapper(content, "#1083BD"),
    })

    // Also send reminder to vet
    const vetEmail = appt.vet?.user?.email
    if (vetEmail) {
      const vetRows = [
        infoRow("", "Клиент",   appt.owner.name ?? "—"),
        infoRow("", "Любимец",  appt.pet?.name ?? "—"),
        infoRow("", "Услуга",   appt.service?.name ?? "Преглед"),
        infoRow("", "Дата",     dateStr),
        infoRow("", "Час",      timeStr, true),
      ].join("")

      const vetContent = `
        <div style="margin-bottom:24px">
          <h2 style="color:#111827;font-size:22px;font-weight:900;margin:0 0 8px">Напомняне за предстоящ преглед</h2>
          <p style="color:#6b7280;font-size:14px;margin:0">Утре имате запазен час при вас:</p>
        </div>
        ${appointmentCard(vetRows)}
        ${meetSection}
        ${ctaButton("Отиди към Dashboard", "https://dr-pet-friends.pages.dev/dashboard/appointments", "#1083BD")}
      `
      resend.emails.send({
        from:    "Dr. Pet Friend <onboarding@resend.dev>",
        to:      vetEmail,
        subject: `Напомняне — ${appt.owner.name ?? "Клиент"} · ${timeStr}, ${dateStr}`,
        html:    emailWrapper(vetContent, "#EF3988"),
      }).catch(() => {})
    }

    await db.appointment.update({
      where: { id: appt.id },
      data:  { reminderSent: true },
    })

    console.log(`Reminder sent for appointment ${appt.id} to ${appt.owner.email}`)
  }
}
