"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Menu, X, ChevronDown, Stethoscope, Scissors, MapPin, Phone,
  Clock, Star, ArrowRight, Syringe, Eye, Activity, Shield,
  Heart, Zap, Bone, Sparkles, Bath, CalendarCheck, AlertTriangle,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Logo } from "@/components/logo"
export { Logo }

// ─── Data ────────────────────────────────────────────────────────────────────

const vetSpecialties = [
  { name: "Обща медицина",  icon: Stethoscope, color: "#1083BD", price: "от 40лв",  href: "/specialnosti/obsha-medicina" },
  { name: "Хирургия",       icon: Activity,    color: "#EF3988", price: "от 150лв", href: "/specialnosti/hirurgiya" },
  { name: "Ваксинации",     icon: Syringe,     color: "#10B83D", price: "от 25лв",  href: "/specialnosti/vaksinacii" },
  { name: "Офталмология",   icon: Eye,         color: "#FF6B35", price: "от 50лв",  href: "/specialnosti/oftalmologia" },
  { name: "Дерматология",   icon: Shield,      color: "#EF3988", price: "от 60лв",  href: "/specialnosti/dermatologia" },
  { name: "Кардиология",    icon: Heart,       color: "#1083BD", price: "от 90лв",  href: "/specialnosti/kardiologia" },
  { name: "Ортопедия",      icon: Bone,        color: "#FF6B35", price: "от 120лв", href: "/specialnosti/ortopedia" },
  { name: "Неврология",     icon: Zap,         color: "#10B83D", price: "от 100лв", href: "/specialnosti/nevrologia" },
]

const groomingServices = [
  { name: "Пълен груминг",  icon: Scissors,   color: "#EF3988", price: "от 40лв" },
  { name: "Баня & Сешоар",  icon: Bath,       color: "#1083BD", price: "от 25лв" },
  { name: "Подстригване",   icon: Scissors,   color: "#10B83D", price: "от 30лв" },
  { name: "SPA третиране",  icon: Sparkles,   color: "#FF6B35", price: "от 55лв" },
  { name: "Зъбна хигиена",  icon: Shield,     color: "#1083BD", price: "от 20лв" },
  { name: "Нокти & Уши",   icon: Star,       color: "#EF3988", price: "от 15лв" },
]

const cities = [
  { name: "София",         count: "120+", href: "/veterinari/sofia" },
  { name: "Пловдив",      count: "45+",  href: "/veterinari/plovdiv" },
  { name: "Варна",        count: "38+",  href: "/veterinari/varna" },
  { name: "Бургас",       count: "22+",  href: "/veterinari/burgas" },
  { name: "Стара Загора", count: "15+",  href: "/veterinari/stara-zagora" },
  { name: "Русе",         count: "12+",  href: "/veterinari/ruse" },
]

type MenuKey = "specialnosti" | "veterinari" | "kliniki" | "grooming"

const navItems: { label: string; menu?: MenuKey; href?: string; highlight?: boolean }[] = [
  { label: "Специалности", menu: "specialnosti" },
  { label: "Ветеринари",   menu: "veterinari" },
  { label: "Клиники",      menu: "kliniki" },
  { label: "Груминг",      menu: "grooming" },
  { label: "Спешни 24/7",  href: "/speshni", highlight: true },
]

// ─── Mega panels ─────────────────────────────────────────────────────────────

function PanelSpecialities() {
  return (
    <div className="grid grid-cols-3 gap-0 max-w-5xl mx-auto">
      {/* Col 1-2: Specialty grid */}
      <div className="col-span-2 p-8 border-r border-gray-100">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">Специалности</p>
        <div className="grid grid-cols-2 gap-2">
          {vetSpecialties.map((s) => {
            const Icon = s.icon
            return (
              <Link key={s.name} href={s.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: s.color + "18" }}>
                  <Icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#191919] group-hover:text-[#1083BD] leading-tight">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.price}</p>
                </div>
              </Link>
            )
          })}
        </div>
        <Link href="/specialnosti"
          className="inline-flex items-center gap-1.5 mt-5 text-[#1083BD] text-sm font-semibold hover:gap-2.5 transition-all">
          Виж всички специалности <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Col 3: Promo */}
      <div className="p-8 flex flex-col gap-5">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Популярно</p>
        <div className="rounded-2xl bg-gradient-to-br from-[#1083BD] to-[#0D67F7] p-5 text-white flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <CalendarCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-black text-base leading-tight">Запиши час онлайн</p>
            <p className="text-white/70 text-xs mt-1 leading-relaxed">Без чакане по телефона — избери специалист и резервирай за минути.</p>
          </div>
          <Link href="/zapis"
            className="inline-flex items-center gap-1.5 bg-white text-[#1083BD] text-xs font-bold px-4 py-2 rounded-full w-fit hover:bg-[#DAF467] transition-colors">
            Запази сега <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="rounded-2xl border border-gray-100 p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-bold text-[#191919]">4.9 средна оценка</span>
          </div>
          <p className="text-xs text-gray-400">от над 12 000 отзива на клиенти</p>
        </div>
      </div>
    </div>
  )
}

function PanelVeternari() {
  return (
    <div className="grid grid-cols-3 gap-0 max-w-5xl mx-auto">
      {/* Col 1: By city */}
      <div className="p-8 border-r border-gray-100">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">По град</p>
        <div className="flex flex-col gap-1">
          {cities.map((c) => (
            <Link key={c.name} href={c.href}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#1083BD] shrink-0" />
                <span className="text-sm font-semibold text-[#191919] group-hover:text-[#1083BD]">{c.name}</span>
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{c.count}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Col 2: By specialty */}
      <div className="p-8 border-r border-gray-100">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">По специалност</p>
        <div className="flex flex-col gap-1">
          {vetSpecialties.slice(0, 6).map((s) => {
            const Icon = s.icon
            return (
              <Link key={s.name} href={s.href}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: s.color }} />
                <span className="text-sm font-semibold text-[#191919] group-hover:text-[#1083BD]">{s.name}</span>
              </Link>
            )
          })}
        </div>
        <Link href="/veterinari"
          className="inline-flex items-center gap-1.5 mt-4 text-[#1083BD] text-sm font-semibold hover:gap-2.5 transition-all">
          Всички ветеринари <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Col 3: Featured */}
      <div className="p-8 flex flex-col gap-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Топ специалист</p>
        <div className="rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=200&fit=crop&crop=faces"
            alt="Д-р Мария Иванова" className="w-full h-28 object-cover object-top"
          />
          <div className="p-4">
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-[#191919]">4.9</span>
              <span className="text-xs text-gray-400">· Хирургия</span>
            </div>
            <p className="font-bold text-sm text-[#191919]">Д-р Мария Иванова</p>
            <p className="text-xs text-gray-400 mb-3">15 години опит · София</p>
            <Link href="/veterinari/maria-ivanova"
              className="inline-flex items-center gap-1.5 bg-[#1083BD] text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-[#0D67F7] transition-colors">
              Запази час <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function PanelKliniki() {
  return (
    <div className="grid grid-cols-3 gap-0 max-w-5xl mx-auto">
      {/* Col 1: Emergency */}
      <div className="p-8 border-r border-gray-100">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          <p className="text-xs font-bold uppercase tracking-widest text-red-400">Спешни 24/7</p>
        </div>
        <div className="flex flex-col gap-2">
          {["Вет Клиника Св. Франциск", "Спешна Вет Помощ", "АнималКеър Варна"].map((name) => (
            <Link key={name} href="/speshni"
              className="flex items-start gap-2.5 p-3 rounded-xl hover:bg-red-50 transition-colors group">
              <div className="w-2 h-2 rounded-full bg-red-400 shrink-0 mt-1.5" />
              <div>
                <p className="text-sm font-semibold text-[#191919] group-hover:text-red-500 leading-tight">{name}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" /> 24/7 · Отворено
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4 p-3 bg-red-50 rounded-xl">
          <p className="text-xs text-red-500 font-bold flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" /> 0888 123 456
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Денонощна гореща линия</p>
        </div>
      </div>

      {/* Col 2: Standard clinics */}
      <div className="p-8 border-r border-gray-100">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">Стандартни клиники</p>
        <div className="flex flex-col gap-1">
          {cities.map((c) => (
            <Link key={c.name} href={`/kliniki/${c.name.toLowerCase()}`}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#1083BD] shrink-0" />
                <span className="text-sm font-semibold text-[#191919] group-hover:text-[#1083BD]">{c.name}</span>
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{c.count}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Col 3: Map CTA */}
      <div className="p-8 flex flex-col gap-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Карта на клиниките</p>
        <Link href="/karta" className="block relative rounded-2xl overflow-hidden group hover:shadow-lg transition-shadow">
          <img
            src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=400&h=180&fit=crop"
            alt="Карта" className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 bg-[#1083BD]/60 flex flex-col items-center justify-center gap-2">
            <MapPin className="w-6 h-6 text-white" />
            <span className="text-white font-bold text-sm">Отвори картата</span>
          </div>
        </Link>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-3 rounded-xl bg-gray-50">
            <p className="font-black text-lg text-[#1083BD]">200+</p>
            <p className="text-xs text-gray-400">клиники</p>
          </div>
          <div className="p-3 rounded-xl bg-gray-50">
            <p className="font-black text-lg text-[#EF3988]">12+</p>
            <p className="text-xs text-gray-400">спешни 24/7</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function PanelGrooming() {
  return (
    <div className="grid grid-cols-3 gap-0 max-w-5xl mx-auto">
      {/* Col 1-2: Services */}
      <div className="col-span-2 p-8 border-r border-gray-100">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">Груминг услуги</p>
        <div className="grid grid-cols-2 gap-2">
          {groomingServices.map((s) => {
            const Icon = s.icon
            return (
              <Link key={s.name} href="/grooming"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: s.color + "18" }}>
                  <Icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#191919] group-hover:text-[#EF3988] leading-tight">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.price}</p>
                </div>
              </Link>
            )
          })}
        </div>
        <Link href="/grooming"
          className="inline-flex items-center gap-1.5 mt-5 text-[#EF3988] text-sm font-semibold hover:gap-2.5 transition-all">
          Виж всички салони <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Col 3: Featured */}
      <div className="p-8 flex flex-col gap-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Топ салон</p>
        <div className="rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
          <img
            src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=160&fit=crop"
            alt="Пухкаво студио" className="w-full h-24 object-cover"
          />
          <div className="p-4">
            <div className="flex items-center gap-1 mb-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-[#191919]">4.9</span>
              <span className="text-xs text-gray-400">· Пълен груминг</span>
            </div>
            <p className="font-bold text-sm text-[#191919]">Пухкаво студио</p>
            <p className="text-xs text-gray-400 mb-3">ул. Раковски 22 · София</p>
            <Link href="/grooming/puhkavo-studio"
              className="inline-flex items-center gap-1.5 bg-[#EF3988] text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-[#d42f77] transition-colors">
              Запази час <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-[#EF3988]/8 border border-[#EF3988]/15">
          <p className="text-xs font-bold text-[#EF3988] mb-1">80+ салона в България</p>
          <p className="text-xs text-gray-500">Намери най-близкия до теб</p>
        </div>
      </div>
    </div>
  )
}

const panels: Record<MenuKey, React.ReactNode> = {
  specialnosti: <PanelSpecialities />,
  veterinari:   <PanelVeternari />,
  kliniki:      <PanelKliniki />,
  grooming:     <PanelGrooming />,
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const openMenu  = (key: MenuKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveMenu(key)
  }
  const closeMenu = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120)
  }
  const keepOpen  = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#1083BD] shadow-lg shadow-[#1083BD]/20" : "bg-transparent"
        }`}
      >
        <div className="w-full px-4 md:px-8">
          <div className="flex items-center justify-between h-16">

            <Logo variant="light" />

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5" onMouseLeave={closeMenu}>
              {navItems.map((item) => (
                item.menu ? (
                  <button
                    key={item.label}
                    onMouseEnter={() => openMenu(item.menu!)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                      activeMenu === item.menu
                        ? "bg-white/15 text-white"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === item.menu ? "rotate-180" : ""}`} />
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className={`px-3 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                      item.highlight
                        ? "text-red-300 hover:text-red-200 hover:bg-white/10 flex items-center gap-1.5"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {item.highlight && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />}
                    {item.label}
                  </Link>
                )
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login"
                className="inline-flex items-center justify-center border-2 border-white/50 hover:border-white hover:bg-white/10 text-white text-sm font-bold rounded-full px-5 py-1.5 transition-all">
                Вход
              </Link>
              <Button className="bg-[#EF3988] hover:bg-[#d92d75] text-white font-semibold rounded-full px-5 gap-1.5 text-sm">
                <CalendarCheck className="w-4 h-4" /> Намери специалист
              </Button>
            </div>

            {/* Mobile toggle */}
            <button className="md:hidden p-2 text-white" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden bg-[#1083BD] border-t border-white/10 py-4 px-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href ?? "#"}
                className="block px-4 py-3 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-colors font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 px-1">
              <Button className="w-full bg-[#EF3988] hover:bg-[#d92d75] text-white font-semibold rounded-full">
                <CalendarCheck className="w-4 h-4 mr-1.5" /> Намери специалист
              </Button>
              <Link href="/login"
                className="w-full text-center py-2.5 text-white/80 font-semibold text-sm"
                onClick={() => setMobileOpen(false)}>
                Вход в профила
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* Mega menu panel — rendered outside header so it can be full-width */}
      {activeMenu && (
        <div
          className="fixed top-16 left-0 right-0 z-40 bg-white shadow-2xl border-b border-gray-100"
          style={{
            animation: "megaFadeIn 0.18s ease-out both",
          }}
          onMouseEnter={keepOpen}
          onMouseLeave={closeMenu}
        >
          <div className="container py-2">
            {panels[activeMenu]}
          </div>

          {/* Bottom accent line */}
          <div className="h-0.5 bg-gradient-to-r from-[#1083BD] via-[#EF3988] to-[#DAF467]" />
        </div>
      )}

      {/* Backdrop */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[2px]"
          style={{ top: "64px", animation: "megaFadeIn 0.18s ease-out both" }}
          onMouseEnter={closeMenu}
        />
      )}

      <style>{`
        @keyframes megaFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
