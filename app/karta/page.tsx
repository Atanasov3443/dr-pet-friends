"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Star, Phone, Clock, ArrowLeft, Stethoscope, Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type PlaceType = "vet" | "grooming"

const places = [
  // Ветеринари
  { id: 1,  type: "vet" as PlaceType, name: "Вет Клиника Св. Франциск", specialty: "Обща медицина · Хирургия",    address: "бул. Витоша 45, София",          phone: "+359 2 123 456",   rating: 4.9, hours: "24/7",           emergency: true,  lat: 42.6977, lng: 23.3219 },
  { id: 2,  type: "vet" as PlaceType, name: "АнималВет Център",         specialty: "Кардиология · Дерматология",  address: "ул. Граф Игнатиев 12, София",    phone: "+359 2 234 567",   rating: 4.8, hours: "09:00 - 20:00", emergency: false, lat: 42.6943, lng: 23.3314 },
  { id: 3,  type: "vet" as PlaceType, name: "ПетМед Клиника",           specialty: "Офталмология · Ортопедия",    address: "бул. България 102, София",       phone: "+359 2 345 678",   rating: 4.7, hours: "08:00 - 19:00", emergency: false, lat: 42.6856, lng: 23.3050 },
  { id: 4,  type: "vet" as PlaceType, name: "Спешна Вет Помощ",         specialty: "Спешна помощ · Хирургия",     address: "ул. Опълченска 88, София",       phone: "+359 2 456 789",   rating: 4.9, hours: "24/7",           emergency: true,  lat: 42.7089, lng: 23.3156 },
  { id: 5,  type: "vet" as PlaceType, name: "VetStar Пловдив",          specialty: "Обща медицина · Ваксинации",  address: "бул. Марица 23, Пловдив",        phone: "+359 32 123 456",  rating: 4.8, hours: "08:00 - 20:00", emergency: false, lat: 42.1354, lng: 24.7453 },
  { id: 6,  type: "vet" as PlaceType, name: "АнималКеър Варна",         specialty: "Хирургия · Кардиология",      address: "ул. Цар Симеон 14, Варна",       phone: "+359 52 234 567",  rating: 4.9, hours: "24/7",           emergency: true,  lat: 43.2141, lng: 27.9147 },
  { id: 7,  type: "vet" as PlaceType, name: "ПетКлиник Бургас",         specialty: "Обща медицина · Дерматология",address: "ул. Александровска 67, Бургас",  phone: "+359 56 345 678",  rating: 4.7, hours: "09:00 - 19:00", emergency: false, lat: 42.5048, lng: 27.4626 },
  // Груминг
  { id: 8,  type: "grooming" as PlaceType, name: "Пухкаво студио",      specialty: "Пълен груминг · Баня",        address: "ул. Раковски 22, София",         phone: "+359 2 111 222",   rating: 4.9, hours: "09:00 - 19:00", emergency: false, lat: 42.6990, lng: 23.3280 },
  { id: 9,  type: "grooming" as PlaceType, name: "PawSpa Sofia",        specialty: "SPA · Стайлинг · Боядисване", address: "бул. Черни връх 18, София",      phone: "+359 2 222 333",   rating: 4.8, hours: "10:00 - 20:00", emergency: false, lat: 42.6710, lng: 23.3190 },
  { id: 10, type: "grooming" as PlaceType, name: "ГрумингПро Пловдив",  specialty: "Подстригване · Нокти · Уши",  address: "ул. Кукленско шосе 5, Пловдив", phone: "+359 32 444 555",  rating: 4.7, hours: "09:00 - 18:00", emergency: false, lat: 42.1500, lng: 24.7300 },
  { id: 11, type: "grooming" as PlaceType, name: "FurStyle Варна",      specialty: "Груминг · Зъбна хигиена",     address: "бул. Приморски 44, Варна",       phone: "+359 52 555 666",  rating: 4.8, hours: "09:00 - 19:00", emergency: false, lat: 43.2200, lng: 27.9250 },
  { id: 12, type: "grooming" as PlaceType, name: "Котешки кът",         specialty: "Котешки груминг · SPA",       address: "ул. Патриарх Евтимий 7, София",  phone: "+359 2 333 444",   rating: 4.9, hours: "10:00 - 19:00", emergency: false, lat: 42.6920, lng: 23.3350 },
]

export default function KartaPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [selected, setSelected] = useState<typeof places[0] | null>(null)
  const [tab, setTab] = useState<PlaceType>("vet")

  const filtered = places.filter(p => p.type === tab)

  // Init map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return
    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })
      const map = L.map(mapRef.current!, { center: [42.7, 23.32], zoom: 7 })
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map)
      mapInstanceRef.current = map
    })
    return () => { mapInstanceRef.current?.remove(); mapInstanceRef.current = null }
  }, [])

  // Re-render markers on tab change
  useEffect(() => {
    if (!mapInstanceRef.current) return
    import("leaflet").then((L) => {
      // Remove old markers
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []

      const color = tab === "vet" ? "#1083BD" : "#EF3988"
      const emoji = tab === "vet" ? "🐾" : "✂️"

      filtered.forEach((place) => {
        const bg = place.emergency ? "#EF3988" : color
        const icon = L.divIcon({
          className: "",
          html: `<div style="width:36px;height:36px;border-radius:50% 50% 50% 0;background:${bg};transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;"><div style="transform:rotate(45deg);color:white;font-size:13px;">${emoji}</div></div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        })
        const marker = L.marker([place.lat, place.lng], { icon })
          .addTo(mapInstanceRef.current)
          .on("click", () => setSelected(place))
        markersRef.current.push(marker)
      })
    })
  }, [tab])

  const accentColor = tab === "vet" ? "#1083BD" : "#EF3988"
  const accentHover = tab === "vet" ? "#0D67F7" : "#d42f77"

  return (
    <div className="flex flex-col h-screen bg-white">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1.5 text-gray-400 hover:text-[#1083BD] text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Назад
          </Link>
          <div className="w-px h-5 bg-gray-200" />
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${accentColor}18` }}>
              <MapPin className="w-5 h-5" style={{ color: accentColor }} />
            </div>
            <div>
              <h1 className="font-display font-black text-lg text-[#191919]">
                {tab === "vet" ? "Ветеринарни клиники" : "Груминг салони"}
              </h1>
              <p className="text-gray-400 text-xs">{filtered.length} локации в България</p>
            </div>
          </div>
        </div>

        {/* Tab toggle — center */}
        <div className="flex bg-gray-100 rounded-2xl p-1.5 gap-1.5">
          <button
            onClick={() => { setTab("vet"); setSelected(null) }}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${tab === "vet" ? "bg-[#1083BD] text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}
          >
            <Stethoscope className="w-4 h-4" /> Ветеринари
          </button>
          <button
            onClick={() => { setTab("grooming"); setSelected(null) }}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${tab === "grooming" ? "bg-[#EF3988] text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}
          >
            <Scissors className="w-4 h-4" /> Груминг
          </button>
        </div>

        <div className="flex items-center gap-4">
          {tab === "vet" && (
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#EF3988]" /> Спешна 24/7</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#1083BD]" /> Стандартна</div>
            </div>
          )}
          <Button className="text-white rounded-full font-bold text-sm h-9 px-5 gap-2" style={{ background: accentColor }}>
            <Phone className="w-3.5 h-3.5" />
            {tab === "vet" ? "Спешен: 0888 123 456" : "Запази час"}
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <div className="w-80 border-r border-gray-100 overflow-y-auto shrink-0">
          {selected ? (
            <div className="p-5 flex flex-col gap-4">
              <button onClick={() => setSelected(null)} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                ← Всички
              </button>
              {selected.emergency && (
                <span className="inline-flex items-center gap-1.5 bg-[#EF3988]/10 text-[#EF3988] text-xs font-bold px-3 py-1 rounded-full w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EF3988] animate-pulse" /> Спешна 24/7
                </span>
              )}
              <div>
                <h2 className="font-display font-black text-xl text-[#191919] mb-1">{selected.name}</h2>
                <p className="text-gray-400 text-sm">{selected.specialty}</p>
              </div>
              <div className="flex flex-col gap-3 text-sm text-gray-500">
                <div className="flex items-center gap-3"><MapPin className="w-4 h-4 shrink-0" style={{ color: accentColor }} />{selected.address}</div>
                <div className="flex items-center gap-3"><Phone className="w-4 h-4 shrink-0" style={{ color: accentColor }} />{selected.phone}</div>
                <div className="flex items-center gap-3"><Clock className="w-4 h-4 shrink-0" style={{ color: accentColor }} />{selected.hours}</div>
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 shrink-0" />
                  <span><strong className="text-[#191919]">{selected.rating}</strong> / 5.0</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Button className="text-white rounded-full font-bold text-sm h-10" style={{ background: accentColor }}>Запази час</Button>
                <Button variant="outline" className="rounded-full font-bold text-sm h-10 border-gray-200">Профил</Button>
              </div>
            </div>
          ) : (
            <div className="p-4 flex flex-col gap-2">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold px-1 mb-1">
                {tab === "vet" ? "Ветеринарни клиники" : "Груминг салони"}
              </p>
              {filtered.map((place) => (
                <button
                  key={place.id}
                  onClick={() => setSelected(place)}
                  className="text-left p-3 rounded-2xl border border-gray-100 hover:border-opacity-30 hover:bg-blue-50/40 transition-all group"
                  style={{ ["--hover-border" as any]: accentColor }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-semibold text-sm text-[#191919] leading-tight group-hover:text-[#1083BD]">{place.name}</span>
                    {place.emergency && <span className="shrink-0 w-2 h-2 rounded-full bg-[#EF3988] mt-1.5 animate-pulse" />}
                  </div>
                  <p className="text-gray-400 text-xs truncate mb-1">{place.address}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-500">{place.rating}</span>
                    <span className="text-xs text-gray-300 mx-1">·</span>
                    <span className="text-xs text-gray-400">{place.hours}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <div ref={mapRef} className="w-full h-full" />
        </div>

      </div>
    </div>
  )
}
