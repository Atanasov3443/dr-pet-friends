"use client"

import { useEffect, useState } from "react"
import { Check, X, Clock, Phone, MapPin, Mail } from "lucide-react"

type Request = {
  id: string; name: string; email: string; phone: string | null
  type: string; clinicName: string | null; specialty: string | null
  city: string | null; message: string | null; status: string
  createdAt: string
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState<"ALL"|"PENDING"|"APPROVED"|"REJECTED">("PENDING")

  const load = async () => {
    setLoading(true)
    const res  = await fetch("/api/admin/requests")
    const data = await res.json()
    setRequests(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    await fetch("/api/admin/requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    load()
  }

  const filtered = filter === "ALL" ? requests : requests.filter(r => r.status === filter)

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Заявки за профил</h1>
        <p className="text-gray-500 text-sm mt-1">Ветеринари и груминг салони, заявили профил</p>
      </div>

      <div className="flex gap-2 mb-6">
        {(["PENDING","APPROVED","REJECTED","ALL"] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === s ? "bg-[#1083BD] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-[#1083BD]"
            }`}>
            {s === "PENDING" ? "Чакащи" : s === "APPROVED" ? "Одобрени" : s === "REJECTED" ? "Отхвърлени" : "Всички"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Зарежда...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Няма заявки</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{r.name}</h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      r.type === "VET" ? "bg-blue-50 text-blue-700" : "bg-pink-50 text-[#EF3988]"
                    }`}>
                      {r.type === "VET" ? "Ветеринар" : "Груминг"}
                    </span>
                    {r.specialty && (
                      <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-0.5 rounded-full">{r.specialty}</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{r.email}</span>
                    {r.phone    && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{r.phone}</span>}
                    {r.city     && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{r.city}</span>}
                    {r.clinicName && <span className="font-medium text-gray-700">{r.clinicName}</span>}
                  </div>

                  {r.message && (
                    <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{r.message}</p>
                  )}

                  <p className="text-xs text-gray-400 mt-2">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date(r.createdAt).toLocaleDateString("bg-BG", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>

                {r.status === "PENDING" && (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => updateStatus(r.id, "APPROVED")}
                      className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium transition-colors">
                      <Check className="w-4 h-4" /> Одобри
                    </button>
                    <button onClick={() => updateStatus(r.id, "REJECTED")}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors">
                      <X className="w-4 h-4" /> Отхвърли
                    </button>
                  </div>
                )}

                {r.status !== "PENDING" && (
                  <span className={`text-sm font-medium px-3 py-1.5 rounded-xl ${
                    r.status === "APPROVED" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}>
                    {r.status === "APPROVED" ? "✓ Одобрена" : "✗ Отхвърлена"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
