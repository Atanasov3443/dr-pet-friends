"use client"

import { apiUrl } from "@/lib/api"
import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("")
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState("")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError("")
    try {
      await fetch(apiUrl("/api/auth/forgot-password"), {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      setSent(true)
    } catch { setError("Сървърна грешка. Опитайте отново.") }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#1083BD] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/login" className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Назад към вход
        </Link>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="font-black text-xl text-gray-900 mb-2">Имейлът е изпратен!</h2>
              <p className="text-gray-500 text-sm mb-6">
                Изпратихме линк за нулиране на паролата до <strong>{email}</strong>.
                Проверете и папка Спам/Junk.
              </p>
              <Link href="/login" className="text-[#1083BD] font-semibold text-sm hover:underline">
                Върни се към вход →
              </Link>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-[#1083BD]/10 flex items-center justify-center mb-5">
                <Mail className="w-6 h-6 text-[#1083BD]" />
              </div>
              <h1 className="font-black text-2xl text-gray-900 mb-2">Забравена парола</h1>
              <p className="text-gray-500 text-sm mb-6">
                Въведете имейла си и ще ви изпратим линк за нулиране на паролата.
              </p>

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Имейл</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="email@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1083BD]" />
                </div>

                {error && <p className="text-red-600 text-sm bg-red-50 rounded-xl px-3 py-2">{error}</p>}

                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-[#1083BD] hover:bg-[#0d6fa0] text-white rounded-xl font-bold text-sm disabled:opacity-60 transition-colors">
                  {loading ? "Изпраща..." : "Изпрати линк за нулиране"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
