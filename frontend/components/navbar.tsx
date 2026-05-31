"use client"

import Link from "next/link"
import { CalendarCheck, User, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Logo } from "@/components/logo"
export { Logo }

export function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const { data: session } = useSession()
  const role          = (session?.user as any)?.role as string | undefined
  const dashboardHref = role === "VET" || role === "CLINIC_ADMIN" || role === "ADMIN" ? "/dashboard" : "/my"

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-[#1083BD] shadow-lg shadow-[#1083BD]/20" : "bg-transparent"
    }`} style={{ borderBottom: "1px solid rgba(255,255,255,0.35)" }}>
      <div className="w-full px-4 md:px-8">
        <div className="grid grid-cols-3 items-center h-16">

          {/* Left — Намери специалист */}
          <div className="flex items-center">
            <Link href="/search"
              className="hidden md:inline-flex items-center gap-1.5 bg-[#EF3988] hover:bg-[#d92d75] text-white text-sm font-bold rounded-full px-5 py-2 transition-colors">
              <CalendarCheck className="w-4 h-4" /> Намери специалист
            </Link>
            {/* Mobile hamburger */}
            <button className="md:hidden p-2 text-white" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Center — Logo */}
          <div className="flex justify-center">
            <Logo variant="light" />
          </div>

          {/* Right — Вход / Профил */}
          <div className="flex justify-end">
            {session ? (
              <Link href={dashboardHref}
                className="hidden md:inline-flex items-center gap-1.5 border-2 border-white/50 hover:border-white hover:bg-white/10 text-white text-sm font-bold rounded-full px-4 py-1.5 transition-all">
                <User className="w-3.5 h-3.5" />
                {(session.user as any)?.name?.split(" ")[0] ?? "Профил"}
              </Link>
            ) : (
              <Link href="/login"
                className="hidden md:inline-flex items-center gap-1.5 border-2 border-white/50 hover:border-white hover:bg-white/10 text-white text-sm font-bold rounded-full px-5 py-1.5 transition-all">
                <User className="w-3.5 h-3.5" /> Вход
              </Link>
            )}
            {/* Mobile — just icon */}
            <Link href="/search" className="md:hidden p-2 text-white">
              <CalendarCheck className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <nav className="md:hidden bg-[#1083BD] border-t border-white/10 py-4 px-4 flex flex-col gap-1">
          <Link href="/search"
            className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-xl font-semibold transition-colors"
            onClick={() => setMobileOpen(false)}>
            🔍 Намери ветеринар
          </Link>
          <Link href="/search?emergency=true"
            className="block px-4 py-3 text-red-300 hover:text-red-200 hover:bg-white/10 rounded-xl font-semibold transition-colors"
            onClick={() => setMobileOpen(false)}>
            🚨 Спешни 24/7
          </Link>
          <div className="border-t border-white/10 mt-2 pt-2">
            {session ? (
              <Link href={dashboardHref}
                className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-xl font-semibold transition-colors"
                onClick={() => setMobileOpen(false)}>
                <span className="flex items-center gap-2"><User className="w-4 h-4" /> Моят профил</span>
              </Link>
            ) : (
              <Link href="/login"
                className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-xl font-semibold transition-colors"
                onClick={() => setMobileOpen(false)}>
                <span className="flex items-center gap-2"><User className="w-4 h-4" /> Вход</span>
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
