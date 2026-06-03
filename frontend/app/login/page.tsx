"use client"

import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { PawPrint, Stethoscope, Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"

const oauthErrors: Record<string, string> = {
  OAuthAccountNotLinked: "Акаунтът вече съществува с имейл и парола. Влез по този начин.",
  OAuthSignin:           "Грешка при Google вход. Опитай отново.",
  Callback:              "Грешка при вход. Опитай отново.",
}

type Role = "owner" | "vet" | null

export default function LoginPage() {
  const router   = useRouter()
  const params   = useSearchParams()
  const urlError = params.get("error") ?? ""
  const callback = params.get("callbackUrl") ?? ""

  const [role,     setRole]     = useState<Role>(null)
  const [loading,  setLoading]  = useState(false)
  const [showPwd,  setShowPwd]  = useState(false)
  const [error,    setError]    = useState(oauthErrors[urlError] ?? "")

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const form     = new FormData(e.currentTarget)
    const email    = form.get("email")    as string
    const password = form.get("password") as string

    const result = await signIn("credentials", { email, password, redirect: false })
    setLoading(false)

    if (result?.error) {
      setError("Грешен имейл или парола. Опитай отново.")
    } else {
      if (callback && callback !== "/") {
        router.push(callback)
      } else {
        const sess = await getSession()
        const r    = (sess?.user as any)?.role
        if      (r === "ADMIN")                          router.push("/admin")
        else if (r === "VET" || r === "CLINIC_ADMIN")    router.push("/dashboard")
        else                                             router.push("/my")
      }
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1083BD] relative overflow-hidden flex-col items-center justify-center p-12">
        <svg className="absolute -top-20 -right-20 w-80 h-80 opacity-20" viewBox="0 0 400 400" fill="white">
          <circle cx="300" cy="120" r="200" />
        </svg>
        <svg className="absolute -bottom-20 -left-20 w-80 h-80 opacity-10" viewBox="0 0 400 400" fill="white">
          <circle cx="100" cy="300" r="200" />
        </svg>
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-3 mb-8">
            <svg viewBox="0 0 100 100" fill="white" className="w-14 h-14">
              <circle cx="28" cy="22" r="12" /><circle cx="50" cy="14" r="12" /><circle cx="72" cy="22" r="12" />
              <ellipse cx="13" cy="43" rx="10" ry="13" transform="rotate(-20 13 43)" />
              <ellipse cx="87" cy="43" rx="10" ry="13" transform="rotate(20 87 43)" />
              <path d="M18 63 C8 83 20 99 36 99 C44 99 48 93 50 91 C52 93 56 99 64 99 C80 99 92 83 82 63 C74 47 62 41 50 41 C38 41 26 47 18 63Z" />
            </svg>
            <span className="font-display font-black text-white text-3xl">Dr. Pet Friend</span>
          </div>
          <p className="text-white/80 text-lg max-w-sm">
            {role === "vet"
              ? "Добре дошли! Управлявайте вашата практика и пациентите си."
              : role === "owner"
              ? "Добре дошли! Намерете най-добрата грижа за вашия любимец."
              : "Вашият домашен любимец е наш приятел!"}
          </p>
          <div className="mt-8 flex flex-col gap-3 text-left">
            {[
              { emoji: "🐾", text: "50 000+ собственици на любимци" },
              { emoji: "🏥", text: "Проверени ветеринари" },
              { emoji: "📅", text: "Онлайн резервации 24/7" },
            ].map(b => (
              <div key={b.text} className="flex items-center gap-3 bg-white/15 rounded-xl px-4 py-2.5">
                <span className="text-xl">{b.emoji}</span>
                <span className="text-white/90 text-sm font-medium">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Начална страница
          </Link>

          {/* Role selector */}
          {!role ? (
            <div>
              <h1 className="font-display font-black text-3xl text-gray-900 mb-2">Добре дошли!</h1>
              <p className="text-gray-500 mb-8">Изберете как влизате в платформата</p>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setRole("owner")}
                  className="group flex flex-col items-center gap-4 p-8 bg-white border-2 border-gray-100 rounded-2xl hover:border-[#EF3988] hover:shadow-lg transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-[#EF3988]/10 group-hover:bg-[#EF3988]/20 flex items-center justify-center transition-colors">
                    <PawPrint className="w-8 h-8 text-[#EF3988]" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-900 text-lg">Стопанин</p>
                    <p className="text-gray-400 text-xs mt-1">Управлявай часовете и любимците си</p>
                  </div>
                </button>

                <button onClick={() => setRole("vet")}
                  className="group flex flex-col items-center gap-4 p-8 bg-white border-2 border-gray-100 rounded-2xl hover:border-[#1083BD] hover:shadow-lg transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-[#1083BD]/10 group-hover:bg-[#1083BD]/20 flex items-center justify-center transition-colors">
                    <Stethoscope className="w-8 h-8 text-[#1083BD]" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-900 text-lg">Ветеринар</p>
                    <p className="text-gray-400 text-xs mt-1">Управлявай практиката си</p>
                  </div>
                </button>
              </div>

              <p className="text-center text-sm text-gray-400 mt-8">
                <Link href="/forgot-password" className="text-gray-400 hover:text-gray-600 text-xs">Забравена парола?</Link>
                {" · "}Нямаш акаунт?{" "}
                <Link href="/register" className="text-[#1083BD] font-semibold hover:underline">Регистрирай се</Link>
              </p>
              <p className="text-center text-sm text-gray-400 mt-2">
                Ветеринар без акаунт?{" "}
                <Link href="/apply" className="text-[#EF3988] font-semibold hover:underline">Кандидатствай тук</Link>
              </p>
            </div>
          ) : (
            <div>
              <button onClick={() => { setRole(null); setError("") }}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Назад
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === "vet" ? "bg-[#1083BD]/10" : "bg-[#EF3988]/10"}`}>
                  {role === "vet"
                    ? <Stethoscope className={`w-5 h-5 text-[#1083BD]`} />
                    : <PawPrint className={`w-5 h-5 text-[#EF3988]`} />
                  }
                </div>
                <div>
                  <h1 className="font-display font-black text-2xl text-gray-900">
                    {role === "vet" ? "Вход за ветеринари" : "Вход за стопани"}
                  </h1>
                  <p className="text-gray-400 text-sm">Въведете вашите данни</p>
                </div>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Имейл</label>
                  <input name="email" type="email" required autoComplete="email"
                    placeholder="email@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1083BD] focus:ring-2 focus:ring-[#1083BD]/10" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Парола</label>
                  <div className="relative">
                    <input name="password" type={showPwd ? "text" : "password"} required autoComplete="current-password"
                      placeholder="••••••••"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-[#1083BD] focus:ring-2 focus:ring-[#1083BD]/10" />
                    <button type="button" onClick={() => setShowPwd(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className={`w-full py-3 rounded-xl font-bold text-white text-sm transition-colors disabled:opacity-60 ${
                    role === "vet" ? "bg-[#1083BD] hover:bg-[#0d6fa0]" : "bg-[#EF3988] hover:bg-[#d42f77]"
                  }`}>
                  {loading ? "Влизане..." : "Влез"}
                </button>

                <button type="button"
                  onClick={() => signIn("google", { callbackUrl: callback || (role === "vet" ? "/dashboard" : "/my") })}
                  className="w-full py-3 rounded-xl font-semibold text-gray-700 text-sm bg-white border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Влез с Google
                </button>
              </form>

              <p className="text-center text-sm text-gray-400 mt-6">
                <Link href="/forgot-password" className="text-gray-400 hover:text-gray-600 text-xs">Забравена парола?</Link>
                {" · "}Нямаш акаунт?{" "}
                <Link href="/register" className="text-[#1083BD] font-semibold hover:underline">Регистрирай се</Link>
              </p>
              {role === "vet" && (
                <p className="text-center text-sm text-gray-400 mt-2">
                  Нямаш профил?{" "}
                  <Link href="/apply" className="text-[#EF3988] font-semibold hover:underline">Кандидатствай тук</Link>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
