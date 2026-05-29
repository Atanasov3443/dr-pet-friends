"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { Sticker, PawSticker } from "@/components/sticker"

interface CarouselSlide {
  src: string
  alt: string
}

interface PhotoCarouselProps {
  slides: CarouselSlide[]
  interval?: number
}

export function PhotoCarousel({ slides, interval = 4000 }: PhotoCarouselProps) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [containerWidth, setContainerWidth] = useState(500)
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current)
    autoplayRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, interval)
  }, [slides.length, interval])

  useEffect(() => {
    startAutoplay()
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current) }
  }, [startAutoplay])

  useEffect(() => {
    function onResize() {
      if (carouselRef.current) setContainerWidth(carouselRef.current.offsetWidth)
    }
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const goNext = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % slides.length)
    startAutoplay()
  }, [slides.length, startAutoplay])

  const goPrev = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)
    startAutoplay()
  }, [slides.length, startAutoplay])

  function getSlideStyle(i: number): React.CSSProperties {
    const gap = containerWidth * 0.18
    const stickUp = gap * 0.75
    const n = slides.length
    const isActive = i === activeSlide
    const isLeft = (activeSlide - 1 + n) % n === i
    const isRight = (activeSlide + 1) % n === i
    const base: React.CSSProperties = {
      position: "absolute", inset: 0, width: "100%", height: "100%",
      objectFit: "cover", borderRadius: "1.5rem",
      boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    }
    if (isActive) return { ...base, zIndex: 3, opacity: 1, transform: "translateX(0) translateY(0) scale(1) rotateY(0deg)" }
    if (isLeft)   return { ...base, zIndex: 2, opacity: 0.85, transform: `translateX(-${gap}px) translateY(-${stickUp}px) scale(0.82) rotateY(18deg)` }
    if (isRight)  return { ...base, zIndex: 2, opacity: 0.85, transform: `translateX(${gap}px) translateY(-${stickUp}px) scale(0.82) rotateY(-18deg)` }
    return { ...base, zIndex: 1, opacity: 0, pointerEvents: "none" }
  }

  return (
    <div className="px-10 lg:px-14">
      <div
        ref={carouselRef}
        className="relative aspect-[4/5]"
        style={{ perspective: "1200px", overflow: "visible" }}
      >
        {slides.map((slide, i) => (
          <img key={i} src={slide.src} alt={slide.alt} style={getSlideStyle(i)} />
        ))}

        {/* Arrows */}
        <button
          onClick={goPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full z-30 w-10 h-10 rounded-full bg-white/20 hover:bg-[#EF3988] backdrop-blur flex items-center justify-center transition-colors duration-200 border border-white/20"
        >
          <FaArrowLeft size={14} color="white" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full z-30 w-10 h-10 rounded-full bg-white/20 hover:bg-[#EF3988] backdrop-blur flex items-center justify-center transition-colors duration-200 border border-white/20"
        >
          <FaArrowRight size={14} color="white" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30 items-center">
          {slides.map((_, i) => (
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
                  style={{ animation: `progressBar ${interval}ms linear forwards` }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Stickers */}
        <div className="absolute -bottom-4 -left-4 z-20">
          <Sticker text="WOOF" color="orange" rotation={-5} size="md" />
        </div>
        <div className="absolute -top-4 right-0 z-20">
          <PawSticker color="lime" icon="bone" rotation={10} />
        </div>
        <div className="absolute top-1/3 -right-4 z-20">
          <PawSticker color="pink" icon="heart" rotation={-8} />
        </div>
      </div>

      <style>{`@keyframes progressBar { from { width: 0% } to { width: 100% } }`}</style>
    </div>
  )
}
