"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import {
  LayoutDashboard, User, CalendarDays, Clock, LogOut, ChevronRight, Stethoscope,
} from "lucide-react"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/dashboard",              label: "Обзор",       icon: LayoutDashboard },
  { href: "/dashboard/profile",      label: "Мой профил",  icon: User            },
  { href: "/dashboard/schedule",     label: "График",      icon: Clock           },
  { href: "/dashboard/appointments", label: "Резервации",  icon: CalendarDays    },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {(session?.user as any)?.image ? (
              <img src={(session?.user as any).image} alt=""
                className="w-9 h-9 rounded-xl object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-[#1083BD] flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-bold text-sm text-gray-900 truncate">
                {(session?.user as any)?.name ?? "Ветеринар"}
              </p>
              <p className="text-xs text-gray-400">Моят профил</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href)
            return (
              <Link key={href} href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "bg-[#1083BD] text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}>
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {active && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
            <LogOut className="w-4 h-4" />
            Излез
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
