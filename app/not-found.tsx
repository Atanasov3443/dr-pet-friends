import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PawPrint, Search, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-20 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-[#1083BD]/10 flex items-center justify-center mx-auto mb-6">
            <PawPrint className="w-10 h-10 text-[#1083BD]" />
          </div>
          <h1 className="text-6xl font-black text-gray-900 mb-2">404</h1>
          <p className="text-xl font-bold text-gray-900 mb-3">Страницата не е намерена</p>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Тази страница не съществува или е преместена. Можете да се върнете към началната страница или да потърсите ветеринар.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1083BD] text-white rounded-xl font-semibold text-sm hover:bg-[#0d6fa0] transition-colors">
              <Home className="w-4 h-4" /> Начална страница
            </Link>
            <Link href="/search"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#EF3988] text-white rounded-xl font-semibold text-sm hover:bg-[#d42f77] transition-colors">
              <Search className="w-4 h-4" /> Намери ветеринар
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
