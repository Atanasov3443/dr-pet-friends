import { Sticker, PawSticker } from "@/components/sticker"

export function AppDownloadSection() {
  return (
    <section className="bg-[#1083BD] relative overflow-hidden py-20">

      {/* Background circles */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/8 pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — text */}
          <div>
            <div className="inline-flex items-center gap-2 border border-white/30 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#DAF467] animate-pulse" />
              <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">Мобилно приложение</span>
            </div>

            <h2 className="font-display font-black text-5xl md:text-6xl text-white leading-tight mb-6">
              Изтеглете<br />
              <span className="text-[#DAF467]">Dr. Pet Friend</span>
            </h2>

            <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-sm">
              Записи, напомняния и здравно досие на вашия любимец — всичко в джоба ви.
            </p>

            {/* Store buttons */}
            <div className="flex flex-wrap gap-4">
              <a href="#" className="flex items-center gap-3 bg-black hover:bg-gray-900 text-white rounded-2xl px-6 py-3.5 transition-colors shadow-xl">
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white shrink-0">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <p className="text-white/60 text-xs leading-none mb-0.5">Изтеглете от</p>
                  <p className="font-bold text-sm leading-none">App Store</p>
                </div>
              </a>

              <a href="#" className="flex items-center gap-3 bg-black hover:bg-gray-900 text-white rounded-2xl px-6 py-3.5 transition-colors shadow-xl">
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white shrink-0">
                  <path d="M3.18 23.76c.3.17.63.24.96.2l12.49-7.2-2.63-2.63-10.82 9.63zM.56 1.4C.21 1.77 0 2.32 0 3.02v18c0 .7.21 1.25.56 1.62l.08.08 10.08-10.08v-.24L.64 1.32.56 1.4zM20.34 10.69l-2.86-1.65-2.93 2.93 2.93 2.93 2.87-1.65c.82-.47.82-1.09-.01-1.56zM4.14.24L16.63 7.44l-2.63 2.63L3.18.44A1.2 1.2 0 014.14.24z"/>
                </svg>
                <div className="text-left">
                  <p className="text-white/60 text-xs leading-none mb-0.5">Изтеглете от</p>
                  <p className="font-bold text-sm leading-none">Google Play</p>
                </div>
              </a>
            </div>
          </div>

          {/* Right — phone mockup */}
          <div className="relative flex items-center justify-center min-h-[360px]">
            {/* Phone frame */}
            <div className="relative w-56 h-[440px] bg-[#0a6fa0] rounded-[3rem] border-4 border-white/30 shadow-2xl overflow-hidden">
              {/* Screen */}
              <div className="absolute inset-2 rounded-[2.5rem] bg-gradient-to-b from-white to-gray-50 overflow-hidden">
                {/* Notch */}
                <div className="w-20 h-5 bg-[#0a6fa0] rounded-b-2xl mx-auto mt-0" />
                {/* App content mock */}
                <div className="p-4 pt-3">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-[#1083BD] flex items-center justify-center">
                      <svg viewBox="0 0 100 100" fill="white" className="w-4 h-4">
                        <rect x="44" y="19" width="12" height="62" rx="6"/>
                        <circle cx="37" cy="25" r="14"/><circle cx="63" cy="25" r="14"/>
                        <circle cx="37" cy="75" r="14"/><circle cx="63" cy="75" r="14"/>
                      </svg>
                    </div>
                    <p className="font-bold text-[#191919] text-xs">Dr. Pet Friend</p>
                  </div>
                  {/* Mock cards */}
                  <div className="space-y-2">
                    <div className="bg-[#1083BD] rounded-xl p-3">
                      <p className="text-white text-xs font-bold">Следващ запис</p>
                      <p className="text-white/70 text-xs">Утре, 10:00 — Д-р Иванова</p>
                    </div>
                    {[
                      { label: "Макс", sub: "Лабрадор · 3г", color: "bg-[#EF3988]/10" },
                      { label: "Мими", sub: "Котка · 5г", color: "bg-[#DAF467]/30" },
                    ].map(c => (
                      <div key={c.label} className={`${c.color} rounded-xl p-2.5 flex items-center gap-2`}>
                        <div className="w-7 h-7 rounded-lg bg-white shadow-sm" />
                        <div>
                          <p className="text-[#191919] text-xs font-bold">{c.label}</p>
                          <p className="text-gray-400 text-xs">{c.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stickers */}
            <div className="absolute top-8 right-4">
              <Sticker text="WOOF" color="lime" rotation={10} size="sm" />
            </div>
            <div className="absolute bottom-12 left-4">
              <PawSticker color="pink" icon="heart" rotation={-8} />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
