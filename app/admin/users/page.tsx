"use client"

import { useEffect, useState } from "react"
import { Shield, User, Stethoscope, Building2 } from "lucide-react"

type UserRow = {
  id: string; name: string | null; email: string; role: string
  createdAt: string; image: string | null
}

const roleLabels: Record<string, { label: string; color: string; icon: typeof Shield }> = {
  ADMIN:        { label: "Администратор", color: "bg-purple-50 text-purple-700", icon: Shield      },
  VET:          { label: "Ветеринар",     color: "bg-blue-50 text-blue-700",     icon: Stethoscope },
  CLINIC_ADMIN: { label: "Клиника",       color: "bg-pink-50 text-[#EF3988]",    icon: Building2   },
  OWNER:        { label: "Собственик",    color: "bg-gray-100 text-gray-600",    icon: User        },
}

export default function UsersPage() {
  const [users, setUsers]     = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const res = await fetch("/api/admin/users")
    setUsers(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const changeRole = async (id: string, role: string) => {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role }),
    })
    load()
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Потребители</h1>
        <p className="text-gray-500 text-sm mt-1">Всички регистрирани акаунти</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Зарежда...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Потребител</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Роля</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Регистриран</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const { label, color, icon: Icon } = roleLabels[u.role] ?? roleLabels.OWNER
                return (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {u.image ? (
                          <img src={u.image} alt={u.name ?? ""} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{u.name ?? "—"}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${color}`}>
                        <Icon className="w-3 h-3" /> {label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString("bg-BG")}
                    </td>
                    <td className="px-5 py-3.5">
                      <select value={u.role} onChange={e => changeRole(u.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#1083BD] bg-white">
                        <option value="OWNER">Собственик</option>
                        <option value="VET">Ветеринар</option>
                        <option value="CLINIC_ADMIN">Клиника</option>
                        <option value="ADMIN">Администратор</option>
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
