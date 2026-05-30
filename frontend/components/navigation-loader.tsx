"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

export function BoneIcon({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill={color} xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(-45 50 50)">
        <rect x="44" y="19" width="12" height="62" rx="6" />
        <circle cx="37" cy="25" r="14" />
        <circle cx="63" cy="25" r="14" />
        <circle cx="37" cy="75" r="14" />
        <circle cx="63" cy="75" r="14" />
      </g>
    </svg>
  )
}

export function NavigationLoader() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [pathname])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1083BD]">
      <BoneIcon className="w-20 h-20 bone-spin" color="white" />
      <p className="text-white/80 mt-5 font-semibold text-lg tracking-wide">Зарежда...</p>
    </div>
  )
}
