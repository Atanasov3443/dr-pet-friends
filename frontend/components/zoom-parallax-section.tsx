'use client';

import { useEffect } from 'react';
import { ZoomParallax } from '@/components/ui/zoom-parallax';

const images = [
  {
    // Pomeranian smiling — fluffy, bright, irresistible
    src: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=85',
    alt: 'Щастливо куче',
  },
  {
    // Two dogs at beach — energy, warmth, golden light
    src: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=85',
    alt: 'Две кучета',
  },
  {
    // Cat looking straight at camera — clean portrait
    src: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=800&fit=crop&crop=faces&auto=format&q=85',
    alt: 'Котка',
    objectPosition: 'center top',
  },
  {
    // Golden retriever with owner — warm lifestyle shot
    src: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=85',
    alt: 'Куче с стопанин',
    objectPosition: 'center center',
  },
  {
    // Border collie face — sharp eyes, beautiful coat
    src: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&h=800&fit=crop&crop=faces&auto=format&q=85',
    alt: 'Куче',
    objectPosition: 'center top',
  },
  {
    // Puppy close-up — adorable, centered
    src: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&h=800&fit=crop&crop=faces&auto=format&q=85',
    alt: 'Кученце',
    objectPosition: 'center top',
  },
  {
    // Fluffy white cat — soft tones, variety
    src: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800&h=800&fit=crop&crop=faces&auto=format&q=85',
    alt: 'Бяла котка',
    objectPosition: 'center top',
  },
]

const stats = [
  { num: "200+",     label: "Ветеринари" },
  { num: "80+",      label: "Груминг салона" },
  { num: "50 000+",  label: "Доволни клиенти" },
  { num: "4.9★",     label: "Средна оценка" },
]

export function ZoomParallaxSection() {
  useEffect(() => {
    import('lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis()
      function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)
      return () => lenis.destroy()
    })
  }, [])

  return (
    <section className="bg-white relative">

      {/* Header content */}
      <div className="container pt-20 pb-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#1083BD]/10 border border-[#1083BD]/20 rounded-full px-4 py-1.5 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#1083BD] animate-pulse" />
              <span className="text-[#1083BD] text-xs font-semibold uppercase tracking-widest">Нашата общност</span>
            </div>
            <h2 className="font-display font-black text-4xl md:text-5xl text-[#191919] leading-tight">
              Реална грижа за<br />
              <span className="text-[#EF3988]">реални любимци</span>
            </h2>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 shrink-0">
            {stats.map(({ num, label }) => (
              <div key={label} className="text-center">
                <p className="font-black text-3xl text-[#1083BD] leading-none">{num}</p>
                <p className="text-gray-400 text-xs mt-1.5 uppercase tracking-widest whitespace-nowrap">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ZoomParallax images={images} />
      <div className="absolute bottom-0 left-0 w-full leading-none pointer-events-none z-10"><svg viewBox="0 0 1440 50" fill="#EF3988" preserveAspectRatio="none" className="w-full h-12 block"><polygon points="0,50 1440,0 1440,50" /></svg></div>
    </section>
  )
}
