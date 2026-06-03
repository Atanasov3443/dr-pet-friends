"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem("cookie-consent")) setShow(true)
  }, [])

  const accept = () => { localStorage.setItem("cookie-consent", "accepted"); setShow(false) }
  const reject = () => { localStorage.setItem("cookie-consent", "rejected"); setShow(false) }

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5">
        <p className="text-sm text-gray-700 mb-1 font-semibold">🍪 Използваме бисквитки</p>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          Използваме бисквитки за подобряване на вашето изживяване.{" "}
          <Link href="/privacy" className="text-[#1083BD] hover:underline">Политика за поверителност</Link>
        </p>
        <div className="flex gap-2">
          <button onClick={accept}
            className="flex-1 py-2 bg-[#1083BD] hover:bg-[#0d6fa0] text-white rounded-xl text-xs font-bold transition-colors">
            Приемам
          </button>
          <button onClick={reject}
            className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-colors">
            Отказвам
          </button>
        </div>
      </div>
    </div>
  )
}
