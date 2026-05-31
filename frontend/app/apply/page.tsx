"use client"

import { apiUrl } from "@/lib/api"

import { useState, useRef } from "react"
import { Stethoscope, CheckCircle, Upload, FileText, AlertCircle, Users, CalendarCheck, Star, Shield } from "lucide-react"
import Link from "next/link"

const benefits = [
  { icon: Users,         label: "50 000+",     sub: "собственици на любимци" },
  { icon: CalendarCheck, label: "24/7",         sub: "онлайн резервации"      },
  { icon: Star,          label: "Рейтинг",      sub: "и реални отзиви"        },
  { icon: Shield,        label: "Безплатно",    sub: "без скрити такси"       },
]

export default function ApplyPage() {
  const [submitted,   setSubmitted]   = useState(false)
  const [uploading,   setUploading]   = useState(false)
  const [licenseUrl,  setLicenseUrl]  = useState("")
  const [licenseName, setLicenseName] = useState("")
  const [error,       setError]       = useState("")
  const [saving,      setSaving]      = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: "", email: "", phone: "", clinic: "", city: "", specialty: "", message: ""
  })

  const handleLicenseUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError("")
    const fd = new FormData()
    fd.append("image", file)
    try {
      const res  = await fetch(`/api/proxy/api/upload/image?folder=licenses`, { method: "POST", body: fd, credentials: "include" })
      const data = await res.json()
      if (data.url) { setLicenseUrl(data.url); setLicenseName(file.name) }
      else setError(data.error ?? "Upload failed")
    } catch {
      setError("Upload неуспешен")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) { setError("Моля попълнете задължителните полета"); return }
    setSaving(true)
    setError("")
    try {
      await fetch(apiUrl("/api/profile-request"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:       form.name,
          email:      form.email,
          phone:      form.phone,
          clinicName: form.clinic,
          city:       form.city,
          specialty:  form.specialty,
          message:    form.message,
          licenseUrl: licenseUrl || undefined,
          type:       "VET",
        }),
      })
      setSubmitted(true)
    } catch {
      setError("Грешка при изпращане")
    } finally {
      setSaving(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-sm border border-gray-100">
          <div className="w-20 h-20 rounded-full bg-[#10B83D]/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#10B83D]" />
          </div>
          <h2 className="font-display font-black text-2xl text-gray-900 mb-3">Заявката е изпратена!</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Ще се свържем с вас на <strong>{form.email}</strong> в рамките на 24 часа за да обясним условията на партньорство.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#1083BD] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#0d6fa0] transition-colors">
            ← Обратно към началната страница
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1083BD] text-white py-16">
        <div className="container max-w-4xl">
          <Link href="/" className="text-white/70 hover:text-white text-sm mb-6 inline-block">← Начална страница</Link>
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-1.5 mb-4">
            <Stethoscope className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold uppercase tracking-widest">За специалисти</span>
          </div>
          <h1 className="font-display font-black text-4xl md:text-5xl mb-3">Стани партньор</h1>
          <p className="text-white/80 text-lg max-w-xl">
            Заяви своя профил в Dr. Pet Friend и привличай нови клиенти всеки ден.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {benefits.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-2.5 bg-white/15 border border-white/20 rounded-xl px-3 py-2.5">
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
      </div>

      {/* Form */}
      <div className="container max-w-4xl py-12">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h2 className="font-display font-black text-xl text-gray-900 mb-6">Попълнете заявката</h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Вашето пълно ime <span className="text-red-400">*</span>
              </label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                placeholder="Д-р Мария Иванова"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1083BD]" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Имейл <span className="text-red-400">*</span>
              </label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required
                placeholder="doctor@clinic.bg"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1083BD]" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Телефон</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+359 88..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1083BD]" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Клиника / Практика</label>
              <input value={form.clinic} onChange={e => setForm(f => ({ ...f, clinic: e.target.value }))}
                placeholder="Вет клиника Здраве"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1083BD]" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Град</label>
              <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                placeholder="София"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1083BD]" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Специалност</label>
              <input value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))}
                placeholder="Обща практика, Хирургия, Дерматология..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#1083BD]" />
            </div>

            {/* License upload */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <FileText className="w-3 h-3" /> Лиценз / Диплома (по желание)
              </label>
              <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleLicenseUpload} />
              {licenseUrl ? (
                <div className="flex items-center gap-3 border border-green-200 bg-green-50 rounded-xl px-4 py-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="text-sm text-green-700 truncate flex-1">{licenseName}</span>
                  <button type="button" onClick={() => { setLicenseUrl(""); setLicenseName("") }}
                    className="text-xs text-gray-400 hover:text-red-500">Премахни</button>
                </div>
              ) : (
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-[#1083BD] rounded-xl py-6 text-sm text-gray-400 hover:text-[#1083BD] transition-colors disabled:opacity-60">
                  <Upload className="w-5 h-5" />
                  {uploading ? "Качва..." : "Качете снимка или PDF на лиценза/дипломата"}
                </button>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Допълнително съобщение</label>
              <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                rows={3} placeholder="Разкажете ни повече за вас и вашата практика..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#1083BD]" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 mt-4">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <button type="submit" disabled={saving}
            className="mt-6 w-full py-4 bg-[#EF3988] hover:bg-[#d42f77] disabled:opacity-60 text-white rounded-xl font-bold text-sm transition-colors">
            {saving ? "Изпраща..." : "Изпрати заявка за партньорство"}
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">Ще се свържем с вас до 24 часа.</p>
        </form>
      </div>
    </div>
  )
}
