"use client"

import { apiUrl } from "@/lib/api"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/logo"
import { PawSticker, Sticker } from "@/components/sticker"
import { Eye, EyeOff, ArrowRight } from "lucide-react"

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z"/>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z"/>
  </svg>
)

export default function RegisterPage() {
  const router  = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const form     = new FormData(e.currentTarget)
    const name     = form.get("name")     as string
    const email    = form.get("email")    as string
    const password = form.get("password") as string
    const confirm  = form.get("confirm")  as string

    if (password !== confirm) {
      setError("Паролите не съвпадат.")
      setLoading(false)
      return
    }
    if (password.length < 8) {
      setError("Паролата трябва да е поне 8 символа.")
      setLoading(false)
      return
    }

    const res = await fetch(apiUrl("/api/register"), {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name, email, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? "Грешка при регистрация.")
      return
    }

    await signIn("credentials", { email, password, callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden bg-[#1083BD]">

      {/* Background blobs */}
      <svg className="absolute -top-20 -right-40 w-[500px] h-[500px] pointer-events-none opacity-15" viewBox="0 0 800 800" fill="none">
        <path d="M700 200C780 280 800 420 740 540C680 660 540 740 380 720C220 700 100 600 60 440C20 280 80 120 200 60C320 0 500 40 620 120C680 160 690 180 700 200Z" fill="white" />
      </svg>

      {/* Stickers */}
      <div className="absolute top-[10%] right-[3%] z-20 hidden xl:block">
        <PawSticker color="pink" icon="heart" rotation={-12} />
      </div>
      <div className="absolute bottom-[15%] left-[2%] z-20 hidden xl:block">
        <Sticker text="PURRRR" color="lime" rotation={8} size="md" />
      </div>

      {/* Left — image */}
      <section className="hidden md:flex flex-1 relative p-6 items-stretch z-10">
        <div className="relative w-full rounded-3xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=1000&fit=crop"
            alt="" className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1083BD]/80 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur border border-white/20 rounded-full px-4 py-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DAF467] animate-pulse" />
              <span className="text-white text-xs font-semibold">200+ ветеринари в България</span>
            </div>
            <p className="text-white font-black text-3xl leading-tight">
              Грижа за<br />вашия любимец,<br /><span className="text-[#DAF467]">на едно място.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Right — form */}
      <section className="flex-1 flex items-center justify-center p-8 md:p-12 relative z-10">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-10">

          <div className="mb-8">
            <Logo variant="light" size="md" />
          </div>

          <h1 className="font-display font-black text-4xl text-white leading-tight mb-2">
            Създай акаунт
          </h1>
          <p className="text-white/60 text-sm mb-8">
            Присъедини се и намери грижа за любимеца си
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wide block mb-1.5">Име</label>
              <div className="rounded-2xl border border-gray-200/20 bg-white/10 focus-within:border-white/40 transition-colors">
                <input name="name" type="text" placeholder="Вашето пълно име" required
                  className="w-full bg-transparent text-sm p-3.5 rounded-2xl focus:outline-none text-white placeholder:text-white/40" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wide block mb-1.5">Имейл адрес</label>
              <div className="rounded-2xl border border-gray-200/20 bg-white/10 focus-within:border-white/40 transition-colors">
                <input name="email" type="email" placeholder="вашият@имейл.com" required
                  className="w-full bg-transparent text-sm p-3.5 rounded-2xl focus:outline-none text-white placeholder:text-white/40" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wide block mb-1.5">Парола</label>
              <div className="rounded-2xl border border-gray-200/20 bg-white/10 focus-within:border-white/40 transition-colors">
                <div className="relative">
                  <input name="password" type={showPassword ? "text" : "password"} placeholder="Минимум 8 символа" required
                    className="w-full bg-transparent text-sm p-3.5 pr-12 rounded-2xl focus:outline-none text-white placeholder:text-white/40" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center">
                    {showPassword
                      ? <EyeOff className="w-4 h-4 text-white/50 hover:text-white" />
                      : <Eye    className="w-4 h-4 text-white/50 hover:text-white" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wide block mb-1.5">Потвърди паролата</label>
              <div className="rounded-2xl border border-gray-200/20 bg-white/10 focus-within:border-white/40 transition-colors">
                <input name="confirm" type="password" placeholder="Повтори паролата" required
                  className="w-full bg-transparent text-sm p-3.5 rounded-2xl focus:outline-none text-white placeholder:text-white/40" />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-2.5 text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full rounded-2xl bg-[#EF3988] hover:bg-[#d42f77] py-3.5 font-semibold text-white transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? "Регистрация..." : <><ArrowRight className="w-4 h-4" /> Създай акаунт</>}
            </button>
          </form>

          <div className="relative flex items-center justify-center my-5">
            <span className="w-full border-t border-white/20" />
            <span className="px-4 text-xs text-white/50 absolute whitespace-nowrap">или продължи с</span>
          </div>

          <button onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 border border-white/20 rounded-2xl py-3.5 hover:bg-white/10 transition-colors text-sm text-white font-medium">
            <GoogleIcon /> Продължи с Google
          </button>

          <p className="text-center text-xs text-white/50 mt-6">
            Вече имате акаунт?{" "}
            <button onClick={() => router.push("/login")} className="text-[#DAF467] hover:underline font-semibold">
              Влезте тук
            </button>
          </p>
        </div>
      </section>
    </div>
  )
}
