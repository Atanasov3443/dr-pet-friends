import "dotenv/config"
import express from "express"
import cron from "node-cron"
import { sendReminders } from "./lib/reminders"
import cookieParser from "cookie-parser"
import cors from "cors"

import vetsRouter            from "./routes/vets"
import searchRouter          from "./routes/search"
import clinicsRouter         from "./routes/clinics"
import appointmentsRouter    from "./routes/appointments"
import reviewsRouter         from "./routes/reviews"
import profileRequestRouter  from "./routes/profile-request"
import myAppointmentsRouter  from "./routes/my/appointments"
import myPetsRouter          from "./routes/my/pets"
import dashAppointmentsRouter from "./routes/dashboard/appointments"
import dashProfileRouter     from "./routes/dashboard/profile"
import dashScheduleRouter    from "./routes/dashboard/schedule"
import dashMedicalRouter     from "./routes/dashboard/medical-records"
import dashStatsRouter       from "./routes/dashboard/stats"
import dashPatientsRouter      from "./routes/dashboard/patients"
import dashUnavailabilityRouter from "./routes/dashboard/unavailability"
import myMedicalRouter       from "./routes/my/medical-records"
import myProfileRouter       from "./routes/my/profile"
import myVaccinationsRouter  from "./routes/my/vaccinations"
import myHealthEntriesRouter from "./routes/my/health-entries"
import myCancelRouter        from "./routes/my/cancel"
import myWaitlistRouter      from "./routes/my/waitlist"
import uploadRouter          from "./routes/upload"
import stripeRouter          from "./routes/stripe"
import adminVetsRouter       from "./routes/admin/vets"
import adminClinicsRouter    from "./routes/admin/clinics"
import adminUsersRouter      from "./routes/admin/users"
import adminRequestsRouter   from "./routes/admin/requests"
import adminContentRouter    from "./routes/admin/content"
import adminStatsRouter      from "./routes/admin/stats"
import adminSeedRouter       from "./routes/admin/seed"
import registerRouter        from "./routes/register"
import authRouter            from "./routes/auth"
import authPasswordRouter    from "./routes/auth-password"
import contentRouter         from "./routes/content"

const app  = express()
const PORT = process.env.PORT ?? 3001

const allowedOrigins = [
  "https://dr-pet-friends.pages.dev",
  process.env.NEXT_PUBLIC_APP_URL,
  "http://localhost:3000",
].filter(Boolean) as string[]

app.use(cors({
  origin:      (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin)),
  credentials: true,
}))
// Raw body required for Stripe webhook signature verification
app.use("/api/stripe/webhook", express.raw({ type: "application/json" }))
app.use(express.json())
app.use(cookieParser())

app.get("/health", (_req, res) => res.json({ ok: true, ts: Date.now() }))
app.get("/ping",   (_req, res) => res.json({ pong: true }))

app.use("/api/vets",                 vetsRouter)
app.use("/api/search",               searchRouter)
app.use("/api/clinics",              clinicsRouter)
app.use("/api/appointments",         appointmentsRouter)
app.use("/api/reviews",              reviewsRouter)
app.use("/api/profile-request",      profileRequestRouter)
app.use("/api/my/appointments",      myAppointmentsRouter)
app.use("/api/my/pets",              myPetsRouter)
app.use("/api/my/medical-records",   myMedicalRouter)
app.use("/api/my/profile",           myProfileRouter)
app.use("/api/my/vaccinations",      myVaccinationsRouter)
app.use("/api/my/health-entries",    myHealthEntriesRouter)
app.use("/api/my/cancel",            myCancelRouter)
app.use("/api/my/waitlist",          myWaitlistRouter)
app.use("/api/upload",               uploadRouter)
app.use("/api/stripe",               stripeRouter)
app.use("/api/dashboard/appointments",    dashAppointmentsRouter)
app.use("/api/dashboard/profile",        dashProfileRouter)
app.use("/api/dashboard/schedule",       dashScheduleRouter)
app.use("/api/dashboard/medical-records", dashMedicalRouter)
app.use("/api/dashboard/stats",           dashStatsRouter)
app.use("/api/dashboard/patients",        dashPatientsRouter)
app.use("/api/dashboard/unavailability",  dashUnavailabilityRouter)
app.use("/api/admin/vets",           adminVetsRouter)
app.use("/api/admin/clinics",        adminClinicsRouter)
app.use("/api/admin/users",          adminUsersRouter)
app.use("/api/admin/requests",       adminRequestsRouter)
app.use("/api/admin/content",        adminContentRouter)
app.use("/api/admin/stats",          adminStatsRouter)
app.use("/api/admin/seed",           adminSeedRouter)
app.use("/api/auth",                 authRouter)
app.use("/api/auth",                 authPasswordRouter)
app.use("/api/content",              contentRouter)
app.use("/api/register",             registerRouter)

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})

// Run every hour — send reminders for appointments in the next 24h
cron.schedule("0 * * * *", async () => {
  console.log("Running appointment reminder check...")
  await sendReminders().catch(err => console.error("Reminder error:", err))
})

export default app
