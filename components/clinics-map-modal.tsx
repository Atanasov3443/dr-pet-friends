"use client"

import { useEffect, useRef, useState } from "react"
import { X, MapPin, Star, Phone, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

const clinics = [
  {
    id: 1,
    name: "Вет Клиника Св. Франциск",
    specialty: "Обща медицина · Хирургия",
    address: "бул. Витоша 45, София",
    phone: "+359 2 123 456",
    rating: 4.9,
    hours: "24/7",
    emergency: true,
    lat: 42.6977,
    lng: 23.3219,
  },
  {
    id: 2,
    name: "АнималВет Център",
    specialty: "Кардиология · Дерматология",
    address: "ул. Граф Игнатиев 12, София",
    phone: "+359 2 234 567",
    rating: 4.8,
    hours: "09:00 - 20:00",
    emergency: false,
    lat: 42.6943,
    lng: 23.3314,
  },
  {
    id: 3,
    name: "ПетМед Клиника",
    specialty: "Офталмология · Ортопедия",
    address: "бул. България 102, София",
    phone: "+359 2 345 678",
    rating: 4.7,
    hours: "08:00 - 19:00",
    emergency: false,
    lat: 42.6856,
    lng: 23.3050,
  },
  {
    id: 4,
    name: "Спешна Вет Помощ",
    specialty: "Спешна помощ · Хирургия",
    address: "ул. Опълченска 88, София",
    phone: "+359 2 456 789",
    rating: 4.9,
    hours: "24/7",
    emergency: true,
    lat: 42.7089,
    lng: 23.3156,
  },
  {
    id: 5,
    name: "Клиника Доктор Пет",
    specialty: "Обща медицина · Груминг",
    address: "бул. Сливница 55, София",
    phone: "+359 2 567 890",
    rating: 4.6,
    hours: "09:00 - 18:00",
    emergency: false,
    lat: 42.7125,
    lng: 23.2890,
  },
  {
    id: 6,
    name: "VetStar Пловдив",
    specialty: "Обща медицина · Ваксинации",
    address: "бул. Марица 23, Пловдив",
    phone: "+359 32 123 456",
    rating: 4.8,
    hours: "08:00 - 20:00",
    emergency: false,
    lat: 42.1354,
    lng: 24.7453,
  },
  {
    id: 7,
    name: "АнималКеър Варна",
    specialty: "Хирургия · Кардиология",
    address: "ул. Цар Симеон 14, Варна",
    phone: "+359 52 234 567",
    rating: 4.9,
    hours: "24/7",
    emergency: true,
    lat: 43.2141,
    lng: 27.9147,
  },
  {
    id: 8,
    name: "ПетКлиник Бургас",
    specialty: "Обща медицина · Дерматология",
    address: "ул. Александровска 67, Бургас",
    phone: "+359 56 345 678",
    rating: 4.7,
    hours: "09:00 - 19:00",
    emergency: false,
    lat: 42.5048,
    lng: 27.4626,
  },
]

interface ClinicsMapModalProps {
  isOpen: boolean
  onClose: () => void
  standalone?: boolean
}

export function ClinicsMapModal({ isOpen, onClose, standalone }: ClinicsMapModalProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [selected, setSelected] = useState<typeof clinics[0] | null>(null)

  useEffect(() => {
    if (!isOpen || !mapRef.current) return
    if (mapInstanceRef.current) return

    import("leaflet").then((L) => {
      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      const map = L.map(mapRef.current!, {
        center: [42.7, 23.32],
        zoom: 7,
        zoomControl: true,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map)

      clinics.forEach((clinic) => {
        const icon = L.divIcon({
          className: "",
          html: `<div style="
            width: 36px; height: 36px; border-radius: 50% 50% 50% 0;
            background: ${clinic.emergency ? "#EF3988" : "#1083BD"};
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
            display: flex; align-items: center; justify-content: center;
          "><div style="transform: rotate(45deg); color: white; font-size: 14px;">🐾</div></div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
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
  }, [isOpen])

  if (!isOpen) return null

  if (standalone) {
    return (
      <div className="w-full h-screen bg-white flex flex-col">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <MapContent mapRef={mapRef} selected={selected} setSelected={setSelected} onClose={onClose} standalone />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col" style={{ height: "85vh" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1083BD]/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#1083BD]" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-[#191919]">Клиники от платформата</h3>
              <p className="text-gray-400 text-xs">{clinics.length} клиники в България</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-6 py-2 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-3 h-3 rounded-full bg-[#EF3988]" /> Спешна помощ 24/7
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-3 h-3 rounded-full bg-[#1083BD]" /> Стандартна клиника
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Map */}
          <div className="flex-1 relative">
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <div ref={mapRef} className="w-full h-full" />
          </div>

          {/* Sidebar */}
          <div className="w-72 border-l border-gray-100 overflow-y-auto flex flex-col">
            {selected ? (
              <div className="p-5 flex flex-col gap-4">
                <button onClick={() => setSelected(null)} className="text-xs text-gray-400 hover:text-gray-600 text-left flex items-center gap-1">
                  ← Всички клиники
                </button>
                {selected.emergency && (
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
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#1083BD] shrink-0" />{selected.phone}</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#1083BD] shrink-0" />{selected.hours}</div>
                  <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400 shrink-0 fill-yellow-400" />{selected.rating} / 5.0</div>
                </div>
                <Button className="bg-[#1083BD] hover:bg-[#0D67F7] text-white rounded-full font-bold text-sm h-10 w-full">
                  Запази час
                </Button>
              </div>
            ) : (
              <div className="p-4 flex flex-col gap-2">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold px-1 mb-1">Всички клиники</p>
                {clinics.map((clinic) => (
                  <button
                    key={clinic.id}
                    onClick={() => setSelected(clinic)}
                    className="text-left p-3 rounded-2xl border border-gray-100 hover:border-[#1083BD]/30 hover:bg-blue-50/50 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-semibold text-sm text-[#191919] group-hover:text-[#1083BD] leading-tight">{clinic.name}</span>
                      {clinic.emergency && <span className="shrink-0 w-2 h-2 rounded-full bg-[#EF3988] mt-1" />}
                    </div>
                    <p className="text-gray-400 text-xs truncate">{clinic.address}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-gray-500">{clinic.rating}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
