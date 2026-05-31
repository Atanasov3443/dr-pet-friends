"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, Stethoscope, Scissors, ArrowRight, Clock, Shield, Star } from "lucide-react"
import { Sticker, PawSticker } from "@/components/sticker"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { GlowCard } from "@/components/ui/spotlight-card"
import Link from "next/link"

const carouselSlides = [
  {
    src: "/Untitled%20design%20(1).png",
    alt: "Ветеринар с кученце",
    subtitle: "Вашият домашен любимец е наш приятел!",
    description: "Грижа, на която можете да се доверите. Намерете най-добрите ветеринарни специалисти.",
  },
  {
    src: "/4.png",
    alt: "Домашен любимец",
    subtitle: "Груминг салони с реални отзиви",
    description: "Изберете най-добрия груминг салон за вашия любимец за секунди.",
  },
  {
    src: "/6.png",
    alt: "Ветеринарен преглед на зайче",
    subtitle: "Грижа за всички домашни любимци",
    description: "Намерете специалист за куче, котка, зайче или екзотично животно.",
  },
  {
    src: "/veterinarian-taking-care-pet.jpg",
    alt: "Ветеринар се грижи за любимец",
    subtitle: "Специалисти, на които можете да се доверите",
    description: "Проверени ветеринари с реални отзиви от хиляди доволни домашни любимци.",
  },
]

export function HeroSection() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSlide, setActiveSlide] = useState(0)
  const [displaySlide, setDisplaySlide] = useState(0)
  const [typedText, setTypedText] = useState(carouselSlides[0].subtitle)
  const [descVisible, setDescVisible] = useState(true)
  const [containerWidth, setContainerWidth] = useState(500)
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current)
    autoplayRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselSlides.length)
    }, 6000)
  }, [])

  useEffect(() => {
    startAutoplay()
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current) }
  }, [startAutoplay])

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight
      const progress = Math.min(Math.max((window.scrollY - heroHeight * 0.25) / (heroHeight * 0.35), 0), 1)
      setScrollProgress(progress)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    function onResize() {
      if (carouselRef.current) setContainerWidth(carouselRef.current.offsetWidth)
    }
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const goNext = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % carouselSlides.length)
    startAutoplay()
  }, [startAutoplay])

  const goPrev = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)
    startAutoplay()
  }, [startAutoplay])

  function getSlideStyle(i: number): React.CSSProperties {
    const gap = containerWidth * 0.18
    const stickUp = gap * 0.75
    const n = carouselSlides.length
    const isActive = i === activeSlide
    const isLeft = (activeSlide - 1 + n) % n === i
    const isRight = (activeSlide + 1) % n === i
    const base: React.CSSProperties = {
      position: "absolute", inset: 0, width: "100%", height: "100%",
      objectFit: "cover", borderRadius: "1.5rem",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    }
    if (isActive) return { ...base, zIndex: 3, opacity: 1, transform: "translateX(0) translateY(0) scale(1) rotateY(0deg)" }
    if (isLeft)   return { ...base, zIndex: 2, opacity: 0.85, transform: `translateX(-${gap}px) translateY(-${stickUp}px) scale(0.82) rotateY(18deg)` }
    if (isRight)  return { ...base, zIndex: 2, opacity: 0.85, transform: `translateX(${gap}px) translateY(-${stickUp}px) scale(0.82) rotateY(-18deg)` }
    return { ...base, zIndex: 1, opacity: 0, pointerEvents: "none" }
  }

  useEffect(() => {
    setDescVisible(false)
    setTypedText("")
    const slideTimeout = setTimeout(() => {
      setDisplaySlide(activeSlide)
      const target = carouselSlides[activeSlide].subtitle
      let i = 0
      const typing = setInterval(() => {
        i++
        setTypedText(target.slice(0, i))
        if (i >= target.length) { clearInterval(typing); setDescVisible(true) }
      }, 38)
      return () => clearInterval(typing)
    }, 350)
    return () => clearTimeout(slideTimeout)
  }, [activeSlide])

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#1083BD]">

      {/* Background blobs */}
      <svg className="absolute -top-20 -right-60 w-[600px] h-[600px] pointer-events-none" viewBox="0 0 800 800" fill="none">
        <path d="M700 200C780 280 800 420 740 540C680 660 540 740 380 720C220 700 100 600 60 440C20 280 80 120 200 60C320 0 500 40 620 120C680 160 690 180 700 200Z" fill="#FF8EC8" opacity="0.45" />
      </svg>
      <svg className="absolute -bottom-40 -left-40 w-[500px] h-[500px] pointer-events-none" viewBox="0 0 600 600" fill="none">
        <path d="M500 300C520 400 460 500 350 530C240 560 130 500 80 400C30 300 60 180 160 100C260 20 400 40 480 140C520 190 500 250 500 300Z" fill="#0D67F7" opacity="0.35" />
      </svg>

      {/* Floating stickers — only on far edges */}
      <div className="absolute top-[45%] left-[2%] z-20 hidden xl:block">
        <PawSticker color="pink" icon="heart" rotation={15} />
      </div>
      <div className="absolute bottom-60 left-[3%] z-20 hidden xl:block">
        <PawSticker color="lime" icon="bone" rotation={-10} />
      </div>


      <div className="container relative z-10 py-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Left ── */}
          <div className="text-center lg:text-left order-2 lg:order-1">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#DAF467] animate-pulse" />
              <span className="text-white/90 text-xs font-semibold uppercase tracking-widest">Ветеринарна платформа №1 в България</span>
            </div>

            {/* Heading — value proposition */}
            <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl xl:text-[88px] text-white leading-[0.95] mb-5 tracking-tight">
              Грижа за
              <br />
              <span className="text-[#DAF467]">любимеца</span>
              <br />
              <span className="whitespace-nowrap">на едно място</span>
            </h1>

            {/* Animated subtitle + description */}
            <div className="mb-7 min-h-[72px]">
              <p className="text-[#FF8EC8] text-lg md:text-xl max-w-lg mx-auto lg:mx-0 mb-2 font-bold min-h-[1.75rem]">
                {typedText}
                <span className="inline-block w-0.5 h-4 bg-[#FF8EC8] ml-0.5 align-middle" style={{ animation: "blink 0.8s step-end infinite" }} />
              </p>
              <p
                className="text-white/65 text-sm md:text-base max-w-md mx-auto lg:mx-0 leading-relaxed transition-all duration-500"
                style={{ opacity: descVisible ? 1 : 0, transform: descVisible ? "translateY(0)" : "translateY(6px)" }}
              >
                {carouselSlides[displaySlide].description}
              </p>
            </div>

            {/* Trust badges */}
            <div className="flex gap-3 justify-center lg:justify-start mb-6">
              {[
                { emoji: "🆓", text: "Безплатно" },
                { emoji: "❤️", text: "За всеки любимец" },
                { emoji: "📅", text: "24/7 онлайн" },
              ].map((b) => (
                <span key={b.text} className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1 text-white/80 text-xs font-medium whitespace-nowrap">
                  {b.emoji} {b.text}
                </span>
              ))}
            </div>

            {/* Intent cards */}
            <div className="grid grid-cols-2 gap-3 max-w-xl mx-auto lg:mx-0">

              {/* Vet card */}
              <Link href="/search?type=vet" className="group relative bg-white rounded-2xl p-5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col gap-3">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1083BD]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 rounded-xl bg-[#1083BD]/10 flex items-center justify-center group-hover:bg-[#1083BD]/15 transition-colors">
                  <Stethoscope className="w-6 h-6 text-[#1083BD]" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-base leading-tight mb-1">Ветеринар</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">Преглед · Ваксини · Хирургия · 24/7 спешна помощ</p>
                </div>
                <div className="flex flex-col gap-1">
                  {[
                    { icon: Shield, text: "Проверени лекари" },
                    { icon: Clock,  text: "Онлайн запис" },
                  ].map(({ icon: Icon, text }) => (
                    <span key={text} className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Icon className="w-3 h-3 text-[#1083BD]" /> {text}
                    </span>
                  ))}
                </div>
                <span className="mt-auto flex items-center gap-1 text-[#1083BD] font-bold text-sm group-hover:gap-2 transition-all">
                  Намери ветеринар <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

              {/* Grooming card */}
              <Link href="/search?type=grooming" className="group relative bg-[#EF3988] rounded-2xl p-5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col gap-3">
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Scissors className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base leading-tight mb-1">Груминг салон</h3>
                  <p className="text-white/70 text-xs leading-relaxed">Подстригване · Пране · Маникюр · SPA</p>
                </div>
                <div className="flex flex-col gap-1">
                  {[
                    { icon: Star,  text: "Реални отзиви" },
                    { icon: Clock, text: "Гъвкав график" },
                  ].map(({ icon: Icon, text }) => (
                    <span key={text} className="flex items-center gap-1.5 text-xs text-white/80">
                      <Icon className="w-3 h-3 text-white" /> {text}
                    </span>
                  ))}
                </div>
                <span className="mt-auto flex items-center gap-1 text-white font-bold text-sm group-hover:gap-2 transition-all">
                  Намери салон <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>

            </div>
          </div>

          {/* ── Right — 3D Carousel ── */}
          <div className="relative order-1 lg:order-2">
            {/* Extra padding so side images aren't clipped */}
            <div className="px-12 lg:px-16">
              <div
                ref={carouselRef}
                className="relative aspect-[4/5]"
                style={{ perspective: "1200px", overflow: "visible" }}
              >
                {carouselSlides.map((slide, i) => {
                  const slideStyle = getSlideStyle(i) as React.CSSProperties
                  return (
                    <div key={i} style={slideStyle}>
                      <GlowCard customSize glowColor="purple" className="w-full h-full p-0 !shadow-none">
                        <img
                          src={slide.src}
                          alt={slide.alt}
                          className="absolute inset-0 w-full h-full object-cover rounded-3xl"
                        />
                      </GlowCard>
                    </div>
                  )
                })}

                {/* Arrows overlaid on left/right */}
                <button
                  onClick={goPrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full z-30 w-10 h-10 rounded-full bg-white/20 hover:bg-[#EF3988] backdrop-blur flex items-center justify-center transition-colors duration-200 border border-white/20"
                  aria-label="Предишна"
                >
                  <FaArrowLeft size={14} color="white" />
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full z-30 w-10 h-10 rounded-full bg-white/20 hover:bg-[#EF3988] backdrop-blur flex items-center justify-center transition-colors duration-200 border border-white/20"
                  aria-label="Следваща"
                >
                  <FaArrowRight size={14} color="white" />
                </button>

                {/* Progress dots inside image */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30 items-center">
                  {carouselSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
                      style={{ width: i === activeSlide ? 24 : 6, background: "rgba(255,255,255,0.4)" }}
                    >
                      {i === activeSlide && (
                        <span
                          key={activeSlide}
                          className="absolute inset-y-0 left-0 bg-white rounded-full"
                          style={{ animation: "progressBar 6s linear forwards" }}
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Stickers */}
                <div className="absolute -bottom-5 -left-5 z-20">
                  <Sticker text="WOOF" color="orange" rotation={-5} size="md" />
                </div>
                <div className="absolute -top-4 right-0 z-20">
                  <PawSticker color="green" icon="bone" rotation={10} />
                </div>
                <div className="absolute top-1/3 -right-5 z-20">
                  <PawSticker color="pink" icon="heart" rotation={-8} />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-1">
          <ChevronRight className="w-4 h-4 rotate-90 animate-bounce" />
        </div>
      </div>

      {/* Wave transition */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <div className="w-full leading-none pointer-events-none">
          <svg viewBox="0 0 1440 50" fill="#EF3988" preserveAspectRatio="none" className="w-full h-12 block">
            <polygon points="0,0 0,50 1440,50" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes progressBar { from { width: 0% } to { width: 100% } }
        @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
      `}</style>
    </section>
  )
}
