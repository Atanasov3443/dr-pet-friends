import express from "express"
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
import adminVetsRouter       from "./routes/admin/vets"
import adminClinicsRouter    from "./routes/admin/clinics"
import adminUsersRouter      from "./routes/admin/users"
import adminRequestsRouter   from "./routes/admin/requests"
import adminContentRouter    from "./routes/admin/content"
import adminStatsRouter      from "./routes/admin/stats"
import registerRouter        from "./routes/register"
import authRouter            from "./routes/auth"
import contentRouter         from "./routes/content"

const app  = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({
  origin:      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

app.get("/health", (_req, res) => res.json({ ok: true }))

app.use("/api/vets",                 vetsRouter)
app.use("/api/search",               searchRouter)
app.use("/api/clinics",              clinicsRouter)
app.use("/api/appointments",         appointmentsRouter)
app.use("/api/reviews",              reviewsRouter)
app.use("/api/profile-request",      profileRequestRouter)
app.use("/api/my/appointments",      myAppointmentsRouter)
app.use("/api/my/pets",              myPetsRouter)
app.use("/api/dashboard/appointments", dashAppointmentsRouter)
app.use("/api/dashboard/profile",    dashProfileRouter)
app.use("/api/dashboard/schedule",   dashScheduleRouter)
app.use("/api/admin/vets",           adminVetsRouter)
app.use("/api/admin/clinics",        adminClinicsRouter)
app.use("/api/admin/users",          adminUsersRouter)
app.use("/api/admin/requests",       adminRequestsRouter)
app.use("/api/admin/content",        adminContentRouter)
app.use("/api/admin/stats",          adminStatsRouter)
app.use("/api/auth",                 authRouter)
app.use("/api/content",              contentRouter)
app.use("/api/register",             registerRouter)

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})

export default app
