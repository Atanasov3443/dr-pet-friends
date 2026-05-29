"use client"

import React, { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Logo } from "@/components/logo"
import { Sticker, PawSticker } from "@/components/sticker"
import { GlowCard } from "@/components/ui/spotlight-card"

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
  </svg>
)

export interface Testimonial {
  avatarSrc: string
  name: string
  handle: string
  text: string
}

interface SignInPageProps {
  heroImageSrc?: string
  testimonials?: Testimonial[]
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void
  onGoogleSignIn?: () => void
  onResetPassword?: () => void
  onCreateAccount?: () => void
}

const GlassInput = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-gray-200 bg-gray-50 transition-colors focus-within:border-[#1083BD]/60 focus-within:bg-[#1083BD]/5">
    {children}
  </div>
)

export function SignInPage({
  heroImageSrc,
  testimonials = [],
  onSignIn,
  onGoogleSignIn,
  onResetPassword,
  onCreateAccount,
}: SignInPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden bg-[#EF3988]">

      {/* Background blobs — same as hero */}
      <svg className="absolute -top-20 -right-40 w-[600px] h-[600px] pointer-events-none opacity-20" viewBox="0 0 800 800" fill="none">
        <path d="M700 200C780 280 800 420 740 540C680 660 540 740 380 720C220 700 100 600 60 440C20 280 80 120 200 60C320 0 500 40 620 120C680 160 690 180 700 200Z" fill="white" />
      </svg>
      <svg className="absolute -bottom-40 -left-40 w-[500px] h-[500px] pointer-events-none opacity-20" viewBox="0 0 600 600" fill="none">
        <path d="M500 300C520 400 460 500 350 530C240 560 130 500 80 400C30 300 60 180 160 100C260 20 400 40 480 140C520 190 500 250 500 300Z" fill="#d42f77" />
      </svg>

      {/* Floating stickers */}
      <div className="absolute top-[12%] left-[3%] z-20 hidden xl:block">
        <PawSticker color="blue" icon="heart" rotation={15} />
      </div>
      <div className="absolute bottom-[20%] left-[2%] z-20 hidden xl:block">
        <PawSticker color="lime" icon="bone" rotation={-10} />
      </div>
      <div className="absolute top-[8%] right-[3%] z-20 hidden xl:block">
        <Sticker text="WOOF" color="orange" rotation={8} size="md" />
      </div>

      {/* Left — form card */}
      <section className="flex-1 flex items-center justify-center p-8 md:p-12 relative z-10">
        <GlowCard customSize glowColor="purple" className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-10">

          <div className="mb-8 flex items-center justify-between">
            <Logo variant="light" size="md" />
            <span className={`bg-[#DAF467] text-[#191919] font-black text-sm px-4 py-2 rounded-2xl shadow-lg rotate-[-3deg] select-none tracking-wide transition-all duration-300 ${emailFocused ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}`}>
              WOOF! 🐾
            </span>
          </div>

          <h1 className="sign-in-element sign-in-d100 font-display font-black text-4xl text-white leading-tight mb-2">
            Добре дошли!
          </h1>
          <p className="sign-in-element sign-in-d200 text-white/60 text-sm mb-8">
            Влезте в акаунта си и намерете грижа за вашия любимец
          </p>

          <form className="space-y-4" onSubmit={onSignIn}>
            <div className="sign-in-element sign-in-d300">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wide block mb-1.5">Имейл адрес</label>
              <GlassInput>
                <input name="email" type="email" placeholder="вашият@имейл.com"
                  className="w-full bg-transparent text-sm p-3.5 rounded-2xl focus:outline-none text-white placeholder:text-white/40"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)} />
              </GlassInput>
            </div>

            <div className="sign-in-element sign-in-d400">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wide block mb-1.5">Парола</label>
              <GlassInput>
                <div className="relative">
                  <input name="password" type={showPassword ? "text" : "password"} placeholder="Вашата парола"
                    className="w-full bg-transparent text-sm p-3.5 pr-12 rounded-2xl focus:outline-none text-white placeholder:text-white/40" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center">
                    {showPassword
                      ? <EyeOff className="w-4 h-4 text-white/50 hover:text-white transition-colors" />
                      : <Eye className="w-4 h-4 text-white/50 hover:text-white transition-colors" />}
                  </button>
                </div>
              </GlassInput>
            </div>

            <div className="sign-in-element sign-in-d500 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="rememberMe" className="w-4 h-4 rounded accent-[#DAF467]" />
                <span className="text-white/70 text-xs">Запомни ме</span>
              </label>
              <button type="button" onClick={onResetPassword}
                className="text-[#DAF467] text-xs hover:underline transition-colors">
                Забравена парола?
              </button>
            </div>

            <button type="submit"
              className="sign-in-element sign-in-d600 w-full rounded-2xl bg-[#1083BD] hover:bg-[#0a6fa0] py-3.5 font-semibold text-white transition-colors text-sm">
              Влез в акаунта
            </button>
          </form>

          <div className="sign-in-element sign-in-d700 relative flex items-center justify-center my-5">
            <span className="w-full border-t border-white/20" />
            <span className="px-4 text-xs text-white/50 bg-transparent absolute whitespace-nowrap">или продължи с</span>
          </div>

          <button onClick={onGoogleSignIn}
            className="sign-in-element sign-in-d800 w-full flex items-center justify-center gap-3 border border-white/20 rounded-2xl py-3.5 hover:bg-white/10 transition-colors text-sm text-white font-medium">
            <GoogleIcon />
            Продължи с Google
          </button>

          <p className="sign-in-element sign-in-d900 text-center text-xs text-white/50 mt-6">
            Нямате акаунт?{" "}
            <button onClick={onCreateAccount} className="text-[#DAF467] hover:underline font-semibold transition-colors">
              Регистрирайте се
            </button>
          </p>
        </GlowCard>
      </section>

      {/* Right — hero image */}
      {heroImageSrc && (
        <section className="hidden md:flex flex-1 relative p-6 items-end z-10">
          <div className="sign-in-slide-right sign-in-d300 absolute inset-6">
          <GlowCard customSize glowColor="blue" className="w-full h-full rounded-3xl overflow-hidden p-0">
            <div className="absolute inset-0 bg-cover bg-center rounded-3xl" style={{ backgroundImage: `url(${heroImageSrc})` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1083BD]/80 via-[#1083BD]/10 to-transparent" />


            {/* Badge */}
            <div className="absolute top-6 left-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur border border-white/20 rounded-full px-4 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DAF467] animate-pulse" />
              <span className="text-white text-xs font-semibold tracking-wide">Ветеринарна платформа №1</span>
            </div>

            {/* Trust badges */}
            <div className="absolute top-6 right-6 flex flex-col gap-2">
              {[
                { emoji: "🆓", text: "Безплатно" },
                { emoji: "❤️", text: "За всеки любимец" },
                { emoji: "📅", text: "24/7 онлайн" },
              ].map(b => (
                <span key={b.text} className="flex items-center gap-1.5 bg-white/15 backdrop-blur border border-white/15 rounded-full px-3 py-1 text-white/90 text-xs font-medium">
                  {b.emoji} {b.text}
                </span>
              ))}
            </div>

            {/* Sticker on image */}
            <div className="absolute top-1/3 -left-3">
              <PawSticker color="green" icon="bone" rotation={10} />
            </div>

            {/* Testimonials */}
            {testimonials.length > 0 && (
              <div className="relative z-10 p-6 flex gap-3 flex-wrap">
                {testimonials.slice(0, 2).map((t, i) => (
                  <div key={i} className={`sign-in-testimonial sign-in-d${1000 + i * 200} flex items-start gap-3 rounded-2xl p-4 flex-1 min-w-[200px] shadow-lg ${i === 0 ? "bg-[#1083BD] border border-[#0a6fa0]" : "bg-[#EF3988] border border-[#d42f77]"}`}>
                    <img src={t.avatarSrc} className="h-9 w-9 object-cover rounded-xl shrink-0" alt={t.name} />
                    <div className="text-sm leading-snug">
                      <p className="font-semibold text-white text-xs">{t.name}</p>
                      <p className="text-white/60 text-xs">{t.handle}</p>
                      <p className="mt-1 text-white text-xs">{t.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </GlowCard>
          </div>
        </section>
      )}

    </div>
  )
}
