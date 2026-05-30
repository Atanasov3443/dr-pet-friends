"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Search, MapPin, Star, Clock, Phone, SlidersHorizontal, X, ChevronRight, Stethoscope, Scissors, List, Map } from "lucide-react"
import Link from "next/link"

type Vet = {
  id: string; displayName: string; specialty: string; bio: string | null
  image: string | null; phone: string | null; experience: number
  rating: number; reviewCount: number; isEmergency: boolean
  clinic: { name: string; city: string; address: string; type: string } | null
  services: { id: string; name: string; price: number; duration: number }[]
  schedule: { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }[]
}

const SPECIALTIES = ["Обща практика", "Хирургия", "Кардиология", "Дерматология", "Неврология", "Ортопедия", "Офталмология", "Онкология", "Груминг"]
const CITIES      = ["София", "Пловдив", "Варна", "Бургас", "Русе", "Стара Загора", "Плевен", "Велико Търново"]
const DAYS        = ["Пон", "Вт", "Ср", "Чет", "Пет", "Съб", "Нед"]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  )
}

function VetCard({ vet }: { vet: Vet }) {
  const isGrooming = vet.clinic?.type === "GROOMING"
  const todaySlots = vet.schedule.filter(s => s.isActive && s.dayOfWeek === new Date().getDay())

  return (
    <Link href={`/vet/${vet.id}`}
      className="group bg-white rounded-2xl border border-gray-100 hover:border-[#1083BD]/30 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col">
      <div className="p-5 flex gap-4 flex-1">
        <div className="shrink-0">
          <img
            src={vet.image ?? "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=120&h=120&fit=crop"}
            alt={vet.displayName}
            className="w-16 h-16 rounded-xl object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-[#1083BD] transition-colors">
                {vet.displayName}
              </h3>
              <p className="text-sm text-[#1083BD] font-medium">{vet.specialty}</p>
            </div>
            {vet.isEmergency && (
              <span className="shrink-0 text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full font-medium">
                24/7
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            <StarRating rating={vet.rating} />
            <span className="text-xs text-gray-500">
              {vet.rating.toFixed(1)} ({vet.reviewCount} отзива)
            </span>
          </div>

          {vet.clinic && (
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              {vet.clinic.city} · {vet.clinic.name}
            </p>
          )}

          {vet.bio && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{vet.bio}</p>
          )}
        </div>
      </div>

      {/* Working hours today */}
      {todaySlots.length > 0 && (
        <div className="px-5 py-2.5 bg-green-50 border-t border-green-100 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <p className="text-xs text-green-700 font-medium">
            Днес: {todaySlots.map(s => `${s.startTime}–${s.endTime}`).join(", ")}
          </p>
        </div>
      )}

      {/* Services preview */}
      {vet.services.length > 0 && (
        <div className="px-5 py-3 border-t border-gray-50 flex items-center gap-2 flex-wrap">
          {vet.services.slice(0, 2).map(s => (
            <span key={s.id} className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full border border-gray-100">
              {s.name} · {s.price} лв.
            </span>
          ))}
          {vet.services.length > 2 && (
            <span className="text-xs text-gray-400">+{vet.services.length - 2} още</span>
          )}
        </div>
      )}

      <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
        {vet.phone ? (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Phone className="w-3 h-3" /> {vet.phone}
          </span>
        ) : <span />}
        <span className="text-xs font-semibold text-[#1083BD] flex items-center gap-1 group-hover:gap-2 transition-all">
          Виж профил <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  )
}

export default function SearchPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const [q,         setQ]         = useState(searchParams.get("q")        ?? "")
  const [city,      setCity]      = useState(searchParams.get("city")     ?? "")
  const [type,      setType]      = useState(searchParams.get("type")     ?? "")
  const [specialty, setSpecialty] = useState(searchParams.get("specialty") ?? "")
  const [results,   setResults]   = useState<Vet[]>([])
  const [loading,   setLoading]   = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searched,  setSearched]  = useState(false)
  const [viewMode,  setViewMode]  = useState<"list"|"map">("list")
  const [clinics,   setClinics]   = useState<any[]>([])
  const [selClinic, setSelClinic] = useState<any>(null)
  const mapRef         = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  const search = useCallback(async (params: { q: string; city: string; type: string; specialty: string }) => {
    setLoading(true)
    setSearched(true)
    const qs = new URLSearchParams()
    if (params.q)         qs.set("q",         params.q)
    if (params.city)      qs.set("city",       params.city)
    if (params.type)      qs.set("type",       params.type)
    if (params.specialty) qs.set("specialty",  params.specialty)

    router.replace(`/search?${qs.toString()}`, { scroll: false })

    const res  = await fetch(`/api/search?${qs.toString()}`)
    const data = await res.json()
    setResults(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [router])

  useEffect(() => {
    const hasParams = q || city || type || specialty
    if (hasParams) search({ q, city, type, specialty })
    else { search({ q: "", city: "", type: "", specialty: "" }) }
  }, [])

  // Fetch clinics for map view
  useEffect(() => {
    if (viewMode !== "map") return
    const qs = new URLSearchParams()
    if (type === "vet") qs.set("type", "VET")
    if (type === "grooming") qs.set("type", "GROOMING")
    fetch(`/api/clinics?${qs}`)
      .then(r => r.json())
      .then(data => setClinics(Array.isArray(data) ? data : []))
  }, [viewMode, type])

  // Init Leaflet map
  useEffect(() => {
    if (viewMode !== "map" || !mapRef.current || clinics.length === 0) return
    if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null }

    import("leaflet").then(L => {
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })
      const map = L.map(mapRef.current!, { center: [42.7, 23.32], zoom: 7 })
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map)

      clinics.forEach(c => {
        const color     = c.isEmergency ? "#EF3988" : c.type === "GROOMING" ? "#DAF467" : "#1083BD"
        const textColor = c.type === "GROOMING" ? "#1a1a1a" : "white"
        const emoji     = c.type === "GROOMING" ? "✂️" : "🐾"
        const icon = L.divIcon({
          className: "",
          html: `<div style="width:36px;height:36px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;"><div style="transform:rotate(45deg);color:${textColor};font-size:13px">${emoji}</div></div>`,
          iconSize: [36, 36], iconAnchor: [18, 36],
        })
        const marker = L.marker([c.lat, c.lng], { icon }).addTo(map)
        marker.on("click", () => setSelClinic(c))
      })
      mapInstanceRef.current = map
    })
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null } }
  }, [viewMode, clinics])

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    search({ q, city, type, specialty })
  }

  const clearFilter = (key: "city" | "type" | "specialty") => {
    const next = { q, city, type, specialty, [key]: "" }
    if (key === "city")      setCity("")
    if (key === "type")      setType("")
    if (key === "specialty") setSpecialty("")
    search(next)
  }

  const activeFilters = [
    city      && { key: "city"      as const, label: city },
    type      && { key: "type"      as const, label: type === "vet" ? "Ветеринар" : "Груминг" },
    specialty && { key: "specialty" as const, label: specialty },
  ].filter(Boolean) as { key: "city"|"type"|"specialty"; label: string }[]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Search header */}
      <div className="bg-[#1083BD] pt-24 pb-8">
        <div className="container max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-black text-white mb-6">
            Намери ветеринар или груминг салон
          </h1>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-lg">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                value={q} onChange={e => setQ(e.target.value)}
                placeholder="Специалност, д-р Иванова, клиника..."
                className="flex-1 bg-transparent text-sm focus:outline-none text-gray-900 placeholder:text-gray-400" />
            </div>

            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-white rounded-2xl px-4 py-3 shadow-lg">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <select value={city} onChange={e => setCity(e.target.value)}
                  className="flex-1 bg-transparent text-sm focus:outline-none text-gray-700 min-w-0">
                  <option value="">Всички градове</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <button type="submit"
                className="bg-[#EF3988] hover:bg-[#d42f77] text-white px-5 py-3 rounded-2xl font-semibold text-sm transition-colors shadow-lg whitespace-nowrap">
                Търси
              </button>

              <button type="button" onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-colors shadow-lg ${
                  showFilters || activeFilters.length > 0
                    ? "bg-white text-[#1083BD]"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}>
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Филтри</span>
                {activeFilters.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#EF3988] text-white text-xs flex items-center justify-center font-bold">
                    {activeFilters.length}
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Filters panel */}
          {showFilters && (
            <div className="mt-3 bg-white rounded-2xl p-5 shadow-lg">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Тип</label>
                  <div className="flex gap-2">
                    {[{ v: "", l: "Всички" }, { v: "vet", l: "Ветеринари" }, { v: "grooming", l: "Груминг" }].map(({ v, l }) => (
                      <button key={v} onClick={() => setType(v)}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-colors ${
                          type === v ? "bg-[#1083BD] text-white border-[#1083BD]" : "border-gray-200 text-gray-600 hover:border-[#1083BD]"
                        }`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">Специалност</label>
                  <div className="flex flex-wrap gap-2">
                    {SPECIALTIES.map(s => (
                      <button key={s} onClick={() => setSpecialty(specialty === s ? "" : s)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          specialty === s ? "bg-[#1083BD] text-white border-[#1083BD]" : "border-gray-200 text-gray-600 hover:border-[#1083BD]"
                        }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={() => handleSearch()}
                className="mt-4 w-full py-2.5 bg-[#1083BD] text-white rounded-xl text-sm font-semibold hover:bg-[#0d6fa0] transition-colors">
                Приложи филтри
              </button>
            </div>
          )}

          {/* Active filter chips */}
          {activeFilters.length > 0 && !showFilters && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {activeFilters.map(f => (
                <span key={f.key}
                  className="flex items-center gap-1.5 bg-white/20 text-white text-xs px-3 py-1.5 rounded-full font-medium">
                  {f.label}
                  <button onClick={() => clearFilter(f.key)}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Type quick toggle */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex gap-0">
            {[
              { v: "",         l: "Всички",    icon: null      },
              { v: "vet",      l: "Ветеринари", icon: Stethoscope },
              { v: "grooming", l: "Груминг",    icon: Scissors  },
            ].map(({ v, l, icon: Icon }) => (
              <button key={v}
                onClick={() => { setType(v); search({ q, city, type: v, specialty }) }}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
                  type === v
                    ? "border-[#1083BD] text-[#1083BD]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}>
                {Icon && <Icon className="w-4 h-4" />}
                {l}
              </button>
            ))}
            <div className="flex-1" />
            {searched && viewMode === "list" && (
              <div className="flex items-center text-sm text-gray-400 py-3.5 mr-3">
                {loading ? "Търси..." : `${results.length} резултата`}
              </div>
            )}
            {/* List / Map toggle */}
            <div className="flex items-center gap-1 py-2">
              <button onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${viewMode === "list" ? "bg-[#1083BD] text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                <List className="w-3.5 h-3.5" /> Списък
              </button>
              <button onClick={() => setViewMode("map")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${viewMode === "map" ? "bg-[#1083BD] text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                <Map className="w-3.5 h-3.5" /> Карта
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results — List view */}
      {viewMode === "list" && (
        <div className="container max-w-5xl mx-auto px-4 py-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 && searched ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Няма намерени резултати</h3>
              <p className="text-gray-500 text-sm">Опитай с различни ключови думи или филтри</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map(vet => <VetCard key={vet.id} vet={vet} />)}
            </div>
          )}
        </div>
      )}

      {/* Results — Map view */}
      {viewMode === "map" && (
        <div className="flex" style={{ height: "calc(100vh - 160px)" }}>
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

          {/* Sidebar */}
          <div className="w-72 bg-white border-r border-gray-100 overflow-y-auto flex flex-col shrink-0">
            {selClinic ? (
              <div className="p-5 flex flex-col gap-3">
                <button onClick={() => setSelClinic(null)} className="text-xs text-gray-400 hover:text-gray-600 text-left flex items-center gap-1">
                  ← Всички клиники
                </button>
                {selClinic.isEmergency && (
                  <span className="inline-flex items-center gap-1.5 bg-[#EF3988]/10 text-[#EF3988] text-xs font-bold px-3 py-1 rounded-full w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EF3988] animate-pulse" /> Спешна 24/7
                  </span>
                )}
                <div>
                  <h4 className="font-bold text-base text-gray-900">{selClinic.name}</h4>
                  {selClinic.specialty && <p className="text-gray-400 text-xs mt-0.5">{selClinic.specialty}</p>}
                </div>
                <div className="flex flex-col gap-1.5 text-sm text-gray-500">
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#1083BD] shrink-0" />{selClinic.address}</div>
                  {selClinic.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#1083BD] shrink-0" />{selClinic.phone}</div>}
                  {selClinic.hours && <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#1083BD] shrink-0" />{selClinic.hours}</div>}
                  <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400 shrink-0 fill-yellow-400" />{Number(selClinic.rating).toFixed(1)} / 5.0</div>
                </div>
              </div>
            ) : (
              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Клиники</p>
                  <span className="text-xs text-gray-400">{clinics.length} локации</span>
                </div>
                {clinics.map(c => (
                  <button key={c.id} onClick={() => setSelClinic(c)}
                    className="text-left p-3 rounded-2xl border border-gray-100 hover:border-[#1083BD]/30 hover:bg-blue-50/50 transition-all group">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-semibold text-sm text-gray-900 group-hover:text-[#1083BD] leading-tight">{c.name}</span>
                      {c.isEmergency && <span className="shrink-0 w-2 h-2 rounded-full bg-[#EF3988] mt-1" />}
                    </div>
                    <p className="text-gray-400 text-xs truncate">{c.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-gray-500">{Number(c.rating).toFixed(1)}</span>
                      {c.hours && <span className="text-xs text-gray-400">· {c.hours}</span>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map */}
          <div className="flex-1 relative">
            <div ref={mapRef} className="w-full h-full" />
            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-3 z-[1000] text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#EF3988]" /> Спешна 24/7</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#1083BD]" /> Ветеринарна</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#DAF467] border border-gray-200" /> Груминг</span>
            </div>
          </div>
        </div>
      )}

      {viewMode === "list" && <Footer />}
    </div>
  )
}
