export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { db } from "@/lib/db"

const FALLBACK_CLINICS = [
  { id: "f1", name: "Вет Клиника Св. Франциск", specialty: "Обща медицина · Хирургия", address: "бул. Витоша 45, София",         phone: "+359 2 123 456",  rating: 4.9, hours: "24/7",         isEmergency: true,  lat: 42.6977, lng: 23.3219, type: "VET" },
  { id: "f2", name: "АнималВет Център",          specialty: "Кардиология · Дерматология", address: "ул. Граф Игнатиев 12, София", phone: "+359 2 234 567",  rating: 4.8, hours: "09:00–20:00", isEmergency: false, lat: 42.6943, lng: 23.3314, type: "VET" },
  { id: "f3", name: "ПетМед Клиника",            specialty: "Офталмология · Ортопедия",   address: "бул. България 102, София",    phone: "+359 2 345 678",  rating: 4.7, hours: "08:00–19:00", isEmergency: false, lat: 42.6856, lng: 23.3050, type: "VET" },
  { id: "f4", name: "Спешна Вет Помощ",          specialty: "Спешна помощ · Хирургия",    address: "ул. Опълченска 88, София",    phone: "+359 2 456 789",  rating: 4.9, hours: "24/7",         isEmergency: true,  lat: 42.7089, lng: 23.3156, type: "VET" },
  { id: "f5", name: "VetStar Пловдив",           specialty: "Обща медицина · Ваксинации", address: "бул. Марица 23, Пловдив",     phone: "+359 32 123 456", rating: 4.8, hours: "08:00–20:00", isEmergency: false, lat: 42.1354, lng: 24.7453, type: "VET" },
  { id: "f6", name: "АнималКеър Варна",          specialty: "Хирургия · Кардиология",     address: "ул. Цар Симеон 14, Варна",    phone: "+359 52 234 567", rating: 4.9, hours: "24/7",         isEmergency: true,  lat: 43.2141, lng: 27.9147, type: "VET" },
  { id: "f7", name: "ПетКлиник Бургас",          specialty: "Обща медицина · Дерматология",address: "ул. Александровска 67, Бургас",phone: "+359 56 345 678",rating: 4.7, hours: "09:00–19:00", isEmergency: false, lat: 42.5048, lng: 27.4626, type: "VET" },
]

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get("type") ?? ""

  try {
    const clinics = await db.clinic.findMany({
      where: {
        isActive: true,
        ...(type ? { type: type.toUpperCase() as any } : {}),
      },
      orderBy: { rating: "desc" },
    })

    if (clinics.length === 0) {
      return NextResponse.json(FALLBACK_CLINICS.filter(c => !type || c.type === type.toUpperCase()))
    }

    return NextResponse.json(clinics.map(c => ({
      id:         c.id,
      name:       c.name,
      specialty:  c.description ?? "",
      address:    c.address,
      phone:      c.phone ?? "",
      rating:     c.rating,
      hours:      c.hours ?? "",
      isEmergency: c.isEmergency,
      lat:        c.lat ?? 42.6977,
      lng:        c.lng ?? 23.3219,
      type:       c.type,
    })))
  } catch {
    return NextResponse.json(FALLBACK_CLINICS)
  }
}
