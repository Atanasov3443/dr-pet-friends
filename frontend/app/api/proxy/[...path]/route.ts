export const runtime = "edge"

import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

async function handler(req: NextRequest) {
  const path   = req.nextUrl.pathname.replace("/api/proxy", "")
  const search = req.nextUrl.search
  const url    = `${API_URL}${path}${search}`

  const headers = new Headers()
  const cookie  = req.headers.get("cookie")
  if (cookie) headers.set("cookie", cookie)
  const ct = req.headers.get("content-type")
  if (ct) headers.set("content-type", ct)

  const hasBody = req.method !== "GET" && req.method !== "HEAD"
  const body    = hasBody ? await req.arrayBuffer() : undefined

  // Retry up to 3 times with increasing delays (handles Render cold start ~30s)
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      await new Promise(r => setTimeout(r, attempt * 5000)) // 5s, 10s between retries
    }
    try {
      const res = await fetch(url, {
        method:  req.method,
        headers,
        body:    body ? body : undefined,
        signal:  AbortSignal.timeout(35000), // 35s — enough for cold start
      })

      const resHeaders = new Headers()
      const resCt = res.headers.get("content-type")
      if (resCt) resHeaders.set("content-type", resCt)
      const setCookie = res.headers.get("set-cookie")
      if (setCookie) resHeaders.set("set-cookie", setCookie)

      return new NextResponse(res.body, { status: res.status, headers: resHeaders })
    } catch {
      if (attempt === 2) {
        return NextResponse.json(
          { error: "Сървърът не отговори. Опитай след 30 секунди." },
          { status: 503 }
        )
      }
    }
  }

  return NextResponse.json({ error: "Грешка" }, { status: 500 })
}

export const GET    = handler
export const POST   = handler
export const PUT    = handler
export const PATCH  = handler
export const DELETE = handler
