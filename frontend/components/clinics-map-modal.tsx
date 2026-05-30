"use client"

import { apiUrl } from "@/lib/api"

import { useEffect, useRef, useState } from "react"
import { X, MapPin, Star, Phone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

type Clinic = {
  id: string; name: string; specialty: string; address: string
  phone: string; rating: number; hours: string; isEmergency: boolean
  lat: number; lng: number; type: string
}

interface ClinicsMapModalProps {
  isOpen: boolean
  onClose: () => void
  standalone?: boolean
}

export function ClinicsMapModal({ isOpen, onClose, standalone }: ClinicsMapModalProps) {
  const mapRef         = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [clinics, setClinics]   = useState<Clinic[]>([])
  const [selected, setSelected] = useState<Clinic | null>(null)
  const [filter, setFilter]     = useState<"ALL"|"VET"|"GROOMING">("ALL")
  const [loading, setLoading]   = useState(false)

  // Fetch clinics from API
  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    fetch(apiUrl("/api/clinics"))
      .then(r => r.json())
      .then(data => { setClinics(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [isOpen])

  // Init map after clinics are loaded
  useEffect(() => {
    if (!isOpen || !mapRef.current || clinics.length === 0) return
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    import("leaflet").then((L) => {
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

      const visible = filter === "ALL" ? clinics : clinics.filter(c => c.type === filter)
      visible.forEach(clinic => {
        const color = clinic.isEmergency ? "#EF3988" : clinic.type === "GROOMING" ? "#DAF467" : "#1083BD"
        const textColor = clinic.type === "GROOMING" ? "#1a1a1a" : "white"
        const emoji = clinic.type === "GROOMING" ? "✂️" : "🐾"

        const icon = L.divIcon({
          className: "",
          html: `<div style="
            width:36px;height:36px;border-radius:50% 50% 50% 0;
            background:${color};transform:rotate(-45deg);
            border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);
            display:flex;align-items:center;justify-content:center;">
            <div style="transform:rotate(45deg);color:${textColor};font-size:13px">${emoji}</div>
          </div>`,
          iconSize: [36, 36], iconAnchor: [18, 36],
        })

        const marker = L.marker([clinic.lat, clinic.lng], { icon }).addTo(map)
        marker.on("click", () => setSelected(clinic))
      })

      mapInstanceRef.current = map
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isOpen, clinics, filter])

  if (!isOpen) return null

  const visible = filter === "ALL" ? clinics : clinics.filter(c => c.type === filter)

  const content = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1083BD]/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-[#1083BD]" />
          </div>
          <div>
            <h3 className="font-display font-black text-lg text-[#191919]">Клиники от платформата</h3>
            <p className="text-gray-400 text-xs">{visible.length} клиники в България</p>
          </div>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Filter tabs + Legend */}
      <div className="flex items-center justify-between px-6 py-2 bg-gray-50 border-b border-gray-100">
        <div className="flex gap-1">
          {(["ALL","VET","GROOMING"] as const).map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === t ? "bg-[#1083BD] text-white" : "text-gray-500 hover:bg-gray-200"
              }`}>
              {t === "ALL" ? "Всички" : t === "VET" ? "Ветеринари" : "Груминг"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF3988]" /> Спешна 24/7
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1083BD]" /> Стандартна
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DAF467]" /> Груминг
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <p className="text-gray-400 text-sm">Зарежда клиники...</p>
            </div>
          )}
          <div ref={mapRef} className="w-full h-full" />
        </div>

        {/* Sidebar */}
        <div className="w-72 border-l border-gray-100 overflow-y-auto flex flex-col">
          {selected ? (
            <div className="p-5 flex flex-col gap-4">
              <button onClick={() => setSelected(null)} className="text-xs text-gray-400 hover:text-gray-600 text-left flex items-center gap-1">
                ← Всички клиники
              </button>
              {selected.isEmergency && (
                <span className="inline-flex items-center gap-1.5 bg-[#EF3988]/10 text-[#EF3988] text-xs font-bold px-3 py-1 rounded-full w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EF3988] animate-pulse" /> Спешна 24/7
                </span>
              )}
              <div>
                <h4 className="font-display font-black text-base text-[#191919] mb-1">{selected.name}</h4>
                <p className="text-gray-400 text-xs">{selected.specialty}</p>
              </div>
              <div className="flex flex-col gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#1083BD] shrink-0" />{selected.address}</div>
                {selected.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#1083BD] shrink-0" />{selected.phone}</div>}
                {selected.hours && <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#1083BD] shrink-0" />{selected.hours}</div>}
                <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400 shrink-0 fill-yellow-400" />{selected.rating.toFixed(1)} / 5.0</div>
              </div>
              <Button className="bg-[#1083BD] hover:bg-[#0D67F7] text-white rounded-full font-bold text-sm h-10 w-full">
                Запази час
              </Button>
            </div>
          ) : (
            <div className="p-4 flex flex-col gap-2">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold px-1 mb-1">
                {filter === "ALL" ? "Всички клиники" : filter === "VET" ? "Ветеринарни клиники" : "Груминг салони"}
              </p>
              {visible.map(clinic => (
                <button key={clinic.id} onClick={() => setSelected(clinic)}
                  className="text-left p-3 rounded-2xl border border-gray-100 hover:border-[#1083BD]/30 hover:bg-blue-50/50 transition-all group">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-semibold text-sm text-[#191919] group-hover:text-[#1083BD] leading-tight">{clinic.name}</span>
                    {clinic.isEmergency && <span className="shrink-0 w-2 h-2 rounded-full bg-[#EF3988] mt-1" />}
                  </div>
                  <p className="text-gray-400 text-xs truncate">{clinic.address}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-500">{clinic.rating.toFixed(1)}</span>
                    {clinic.hours && <span className="text-xs text-gray-400">· {clinic.hours}</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )

  if (standalone) {
    return (
      <div className="w-full h-screen bg-white flex flex-col">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        {content}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col" style={{ height: "85vh" }}>
        {content}
      </div>
    </div>
  )
}
