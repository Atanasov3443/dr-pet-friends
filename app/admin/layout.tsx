"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard, Users, Stethoscope, ClipboardList,
  FileText, LogOut, ChevronRight, Heart, MapPin,
} from "lucide-react"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/admin",          label: "Dashboard",   icon: LayoutDashboard },
  { href: "/admin/requests", label: "Заявки",      icon: ClipboardList   },
  { href: "/admin/vets",     label: "Ветеринари",  icon: Stethoscope     },
  { href: "/admin/users",    label: "Потребители", icon: Users           },
  { href: "/admin/content",  label: "Съдържание",  icon: FileText        },
  { href: "/admin/clinics",  label: "Клиники",     icon: MapPin          },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#1083BD] flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900">Dr. Pet Friends</p>
              <p className="text-xs text-gray-400">Администратор</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href)
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

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
