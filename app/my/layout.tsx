"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { LayoutDashboard, CalendarDays, PawPrint, LogOut, ChevronRight, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/my",              label: "Начало",      icon: LayoutDashboard },
  { href: "/my/appointments", label: "Моите часове", icon: CalendarDays    },
  { href: "/my/pets",         label: "Моите любимци", icon: PawPrint       },
]

export default function MyLayout({ children }: { children: React.ReactNode }) {
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
              <div className="w-9 h-9 rounded-xl bg-[#EF3988] flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-bold text-sm text-gray-900 truncate">
                {(session?.user as any)?.name ?? "Собственик"}
              </p>
              <p className="text-xs text-gray-400">Моят акаунт</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = href === "/my" ? pathname === href : pathname.startsWith(href)
            return (
              <Link key={href} href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "bg-[#EF3988] text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}>
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {active && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            ← Начална страница
          </Link>
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
