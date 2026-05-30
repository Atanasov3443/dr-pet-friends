"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { LayoutDashboard, User, CalendarDays, Clock, LogOut, ChevronRight, Stethoscope, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const nav = [
  { href: "/dashboard",              label: "Обзор",      icon: LayoutDashboard },
  { href: "/dashboard/profile",      label: "Мой профил", icon: User            },
  { href: "/dashboard/schedule",     label: "График",     icon: Clock           },
  { href: "/dashboard/appointments", label: "Резервации", icon: CalendarDays    },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {(session?.user as any)?.image ? (
            <img src={(session?.user as any).image} alt="" className="w-9 h-9 rounded-xl object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-[#1083BD] flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-bold text-sm text-gray-900 truncate">{(session?.user as any)?.name ?? "Ветеринар"}</p>
            <p className="text-xs text-gray-400">Моят профил</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href)
          return (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active ? "bg-[#1083BD] text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}>
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {active && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-1">
        <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
          ← Начална страница
        </Link>
        <button onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut className="w-4 h-4" /> Излез
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 flex items-center justify-between px-4 h-14">
        <span className="font-bold text-gray-900 text-sm">{(session?.user as any)?.name ?? "Ветеринар"}</span>
        <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          {open ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/40" onClick={() => setOpen(false)}>
          <aside className="absolute top-14 left-0 bottom-0 w-64 bg-white flex flex-col shadow-xl" onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 overflow-auto md:pt-0 pt-14">
        {children}
      </main>
    </div>
  )
}
