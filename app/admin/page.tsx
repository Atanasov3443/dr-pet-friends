import { db } from "@/lib/db"
import { Users, Stethoscope, ClipboardList, CalendarCheck } from "lucide-react"

export default async function AdminDashboard() {
  const [totalUsers, totalVets, pendingRequests, totalAppointments] = await Promise.all([
    db.user.count(),
    db.vet.count(),
    db.profileRequest.count({ where: { status: "PENDING" } }),
    db.appointment.count(),
  ])

  const stats = [
    { label: "Потребители",       value: totalUsers,        icon: Users,          color: "bg-blue-50 text-[#1083BD]"  },
    { label: "Ветеринари",        value: totalVets,         icon: Stethoscope,    color: "bg-pink-50 text-[#EF3988]"  },
    { label: "Чакащи заявки",     value: pendingRequests,   icon: ClipboardList,  color: "bg-yellow-50 text-yellow-600" },
    { label: "Резервации",        value: totalAppointments, icon: CalendarCheck,  color: "bg-green-50 text-green-600"  },
  ]

  const recentRequests = await db.profileRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Преглед на платформата</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", color)}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Последни заявки</h2>
        {recentRequests.length === 0 ? (
          <p className="text-gray-400 text-sm">Няма заявки все още.</p>
        ) : (
          <div className="space-y-3">
            {recentRequests.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.email} · {r.type === "VET" ? "Ветеринар" : "Груминг"} · {r.city}</p>
                </div>
                <span className={cn(
                  "text-xs font-medium px-2.5 py-1 rounded-full",
                  r.status === "PENDING"  && "bg-yellow-50 text-yellow-700",
                  r.status === "APPROVED" && "bg-green-50 text-green-700",
                  r.status === "REJECTED" && "bg-red-50 text-red-700",
                )}>
                  {r.status === "PENDING" ? "Чакаща" : r.status === "APPROVED" ? "Одобрена" : "Отхвърлена"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
