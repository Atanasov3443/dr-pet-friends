"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Stethoscope, Scissors, CheckCircle, Users, CalendarCheck, Star, Shield } from "lucide-react"
import { GlowCard } from "@/components/ui/spotlight-card"

const benefits = [
  { icon: Users,         label: "50 000+",     sub: "собственици на любимци" },
  { icon: CalendarCheck, label: "24/7",         sub: "онлайн резервации" },
  { icon: Star,          label: "Рейтинг",      sub: "и реални отзиви" },
  { icon: Shield,        label: "Безплатно",    sub: "без скрити такси" },
]

export function ForVetsSection() {
  const [type, setType] = useState<"vet" | "grooming">("vet")
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: "", clinic: "", city: "", phone: "", email: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch("/api/profile-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name:       form.name,
        email:      form.email,
        phone:      form.phone,
        clinicName: form.clinic,
        city:       form.city,
        type:       type === "vet" ? "VET" : "GROOMING",
      }),
    })
    setSubmitted(true)
  }

  return (
    <section className="relative bg-[#EF3988] overflow-hidden">

      {/* Decorative blobs */}
      <svg className="absolute -top-20 -right-40 w-[500px] h-[500px] pointer-events-none opacity-20" viewBox="0 0 500 500" fill="none">
        <circle cx="400" cy="150" r="280" fill="white" />
      </svg>
      <svg className="absolute -bottom-20 -left-20 w-[400px] h-[400px] pointer-events-none opacity-15" viewBox="0 0 400 400" fill="none">
        <circle cx="0" cy="400" r="240" fill="#d42f77" />
      </svg>

      {/* Top diagonal — pink from HowItWorks */}
      <div className="absolute top-0 left-0 w-full leading-none pointer-events-none z-20">
        <svg viewBox="0 0 1440 50" fill="white" preserveAspectRatio="none" className="w-full h-12 block">
          <polygon points="0,50 1440,0 0,0" />
        </svg>
      </div>


      <div className="container relative z-10 pt-16 pb-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — headline + benefit tiles */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-1.5 mb-4">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs font-semibold uppercase tracking-widest">За специалисти</span>
            </div>

            <h2 className="font-display font-black text-3xl md:text-4xl leading-[1.0] mb-2 text-white">
              Стани партньор<br />
              на <span className="text-white whitespace-nowrap opacity-90">Dr. Pet Friend</span>
            </h2>

            <p className="text-white/80 text-sm mb-4 max-w-md leading-relaxed">
              Присъедини се към най-голямата ветеринарна мрежа в България и привлечи нови клиенти всеки ден.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {benefits.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-2.5 bg-white/20 border border-white/20 rounded-xl px-3 py-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm leading-none">{label}</div>
                    <div className="text-white/70 text-xs mt-0.5">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form card */}
          <GlowCard customSize glowColor="purple" className="bg-white/10 backdrop-blur-md rounded-3xl p-4 w-full border border-white/20">
            {submitted ? (
              <div className="flex flex-col items-center text-center gap-4 py-12">
                <div className="w-16 h-16 rounded-full bg-[#10B83D] flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display font-black text-2xl text-[#191919]">Получихме заявката!</h3>
                <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                  Ще се свържем с вас до 24 часа за да обясним условията на партньорство.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-display font-black text-lg text-white mb-0.5">Заяви своя профил</h3>
                <p className="text-white/70 text-xs mb-3">Попълнете формата и ние ще се свържем с вас.</p>

                {/* Toggle */}
                <div className="flex bg-gray-100 rounded-full p-1 gap-1 mb-3">
                  <button
                    onClick={() => setType("vet")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all ${
                      type === "vet" ? "bg-[#1083BD] text-white shadow-md" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Stethoscope className="w-4 h-4" /> Ветеринар
                  </button>
                  <button
                    onClick={() => setType("grooming")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all ${
                      type === "grooming" ? "bg-[#EF3988] text-white shadow-md" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Scissors className="w-4 h-4" /> Груминг салон
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                  {(() => {
                    const inputCls = `h-8 rounded-xl border-gray-200 ${type === "vet" ? "focus-visible:ring-[#1083BD] focus-visible:border-[#1083BD]" : "focus-visible:ring-[#EF3988] focus-visible:border-[#EF3988]"}`
                    const labelCls = "text-xs font-semibold uppercase tracking-wide block mb-1"
                    const labelStyle = { color: "rgba(255,255,255,0.9)" }
                    return (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className={labelCls} style={labelStyle}>Вашето име</label>
                      <Input placeholder="Д-р Иванова" value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                        className={inputCls} />
                    </div>
                    <div className="col-span-2">
                      <label className={labelCls} style={labelStyle}>
                        {type === "vet" ? "Клиника / Практика" : "Название на салона"}
                      </label>
                      <Input placeholder={type === "vet" ? "Вет клиника Здраве" : "Груминг студио Пух"}
                        value={form.clinic} onChange={e => setForm(f => ({ ...f, clinic: e.target.value }))} required
                        className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls} style={labelStyle}>Град</label>
                      <Input placeholder="София" value={form.city}
                        onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required
                        className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls} style={labelStyle}>Телефон</label>
                      <Input placeholder="+359 88..." value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required
                        className={inputCls} />
                    </div>
                    <div className="col-span-2">
                      <label className={labelCls} style={labelStyle}>Имейл</label>
                      <Input type="email" placeholder="email@example.com" value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required
                        className={inputCls} />
                    </div>
                  </div>
                    )
                  })()}

                  <Button type="submit"
                    className="h-9 rounded-xl font-bold text-white bg-[#1083BD] hover:bg-[#0a6fa0]">
                    Изпрати заявка
                  </Button>
                  <p className="text-white/70 text-xs text-center">Ще се свържем с вас до 24 часа.</p>
                </form>
              </>
            )}
          </GlowCard>

        </div>
      </div>

      {/* Bottom diagonal — white to match ServicesSection */}
      <div className="w-full leading-none pointer-events-none">
        <svg viewBox="0 0 1440 50" fill="#1083BD" preserveAspectRatio="none" className="w-full h-12 block">
          <polygon points="0,0 1440,50 0,50" />
        </svg>
      </div>

    </section>
  )
}
