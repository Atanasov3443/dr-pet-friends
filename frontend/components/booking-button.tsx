"use client"

import { useState } from "react"
import { CalendarCheck } from "lucide-react"
import { BookingModal } from "./booking-modal"

type Service  = { id: string; name: string; price: number; duration: number }
type Schedule = { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }

export function BookingButton({ vetId, vetName, services, schedule }: {
  vetId: string; vetName: string; services: Service[]; schedule: Schedule[]
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(true)}
        className="w-full py-3 bg-white text-[#1083BD] rounded-xl font-bold text-sm hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
        <CalendarCheck className="w-4 h-4" /> Избери дата и час
      </button>
      <BookingModal
        isOpen={open} onClose={() => setOpen(false)}
        vetId={vetId} vetName={vetName}
        services={services} schedule={schedule}
      />
    </>
  )
}
