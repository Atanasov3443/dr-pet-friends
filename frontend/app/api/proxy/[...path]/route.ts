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

  const res = await fetch(url, {
    method:  req.method,
    headers,
    body:    body ? body : undefined,
  })

  const resHeaders = new Headers()
  const resCt = res.headers.get("content-type")
  if (resCt) resHeaders.set("content-type", resCt)

  return new NextResponse(res.body, {
    status:  res.status,
    headers: resHeaders,
  })
}

export const GET    = handler
export const POST   = handler
export const PUT    = handler
export const PATCH  = handler
export const DELETE = handler
