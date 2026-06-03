"use client"

import { apiUrl } from "@/lib/api"
import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react"

function ResetPasswordForm() {
  const params  = useSearchParams()
  const router  = useRouter()
  const token   = params.get("token") ?? ""

  const [password,  setPassword]  = useState("")
  const [confirm,   setConfirm]   = useState("")
  const [showPwd,   setShowPwd]   = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [done,      setDone]      = useState(false)
  const [error,     setError]     = useState("")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError("Паролите не съвпадат"); return }
    if (password.length < 8)  { setError("Паролата трябва да е поне 8 символа"); return }
    setLoading(true); setError("")
    try {
      const res  = await fetch(apiUrl("/api/auth/reset-password"), {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (res.ok) setDone(true)
      else setError(data.error ?? "Грешка при нулиране")
    } catch { setError("Сървърна грешка. Опитайте отново.") }
    finally { setLoading(false) }
  }

  if (!token) return (
    <div className="text-center py-4">
      <p className="text-red-600 mb-4">Невалиден линк за нулиране.</p>
      <Link href="/forgot-password" className="text-[#1083BD] font-semibold text-sm hover:underline">Поискай нов линк</Link>
    </div>
  )

  return done ? (
    <div className="text-center py-4">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="font-black text-xl text-gray-900 mb-2">Паролата е нулирана!</h2>
      <p className="text-gray-500 text-sm mb-6">Можете да влезете с новата си парола.</p>
      <button onClick={() => router.push("/login")}
        className="px-6 py-2.5 bg-[#1083BD] text-white rounded-xl font-bold text-sm hover:bg-[#0d6fa0] transition-colors">
        Влез в акаунта
      </button>
    </div>
  ) : (
    <>
      <div className="w-12 h-12 rounded-2xl bg-[#1083BD]/10 flex items-center justify-center mb-5">
        <Lock className="w-6 h-6 text-[#1083BD]" />
      </div>
      <h1 className="font-black text-2xl text-gray-900 mb-2">Нова парола</h1>
      <p className="text-gray-500 text-sm mb-6">Въведете новата си парола (минимум 8 символа).</p>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Нова парола</label>
          <div className="relative">
            <input type={showPwd ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-[#1083BD]" />
            <button type="button" onClick={() => setShowPwd(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Потвърди паролата</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
            placeholder="••••••••"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1083BD]" />
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 rounded-xl px-3 py-2">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full py-3 bg-[#1083BD] hover:bg-[#0d6fa0] text-white rounded-xl font-bold text-sm disabled:opacity-60 transition-colors">
          {loading ? "Запазва..." : "Запази новата парола"}
        </button>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#1083BD] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <Suspense fallback={<div className="text-center py-8 text-gray-400">Зарежда...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
