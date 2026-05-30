"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"

interface RotatingEarthProps {
  width?: number
  height?: number
  className?: string
  onZoomComplete?: () => void
  targetLng?: number
  targetLat?: number
  autoZoom?: boolean
}

export default function RotatingEarth({
  width = 800,
  height = 600,
  className = "",
  onZoomComplete,
  targetLng = 25.5,  // Bulgaria center
  targetLat = 42.7,
  autoZoom = false,
}: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    const containerWidth = Math.min(width, window.innerWidth - 40)
    const containerHeight = Math.min(height, window.innerHeight - 100)
    const radius = Math.min(containerWidth, containerHeight) / 2.5

    const dpr = window.devicePixelRatio || 1
    canvas.width = containerWidth * dpr
    canvas.height = containerHeight * dpr
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = `${containerHeight}px`
    context.scale(dpr, dpr)

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90)

    const path = d3.geoPath().projection(projection).context(context)

    const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point
      let inside = false
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i]
        const [xj, yj] = polygon[j]
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside
        }
      }
      return inside
    }

    const pointInFeature = (point: [number, number], feature: any): boolean => {
      const geometry = feature.geometry
      if (geometry.type === "Polygon") {
        if (!pointInPolygon(point, geometry.coordinates[0])) return false
        for (let i = 1; i < geometry.coordinates.length; i++) {
          if (pointInPolygon(point, geometry.coordinates[i])) return false
        }
        return true
      } else if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) { inHole = true; break }
            }
            if (!inHole) return true
          }
        }
        return false
      }
      return false
    }

    const generateDotsInPolygon = (feature: any, dotSpacing = 16) => {
      const dots: [number, number][] = []
      const bounds = d3.geoBounds(feature)
      const [[minLng, minLat], [maxLng, maxLat]] = bounds
      const stepSize = dotSpacing * 0.08
      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point: [number, number] = [lng, lat]
          if (pointInFeature(point, feature)) dots.push(point)
        }
      }
      return dots
    }

    interface DotData { lng: number; lat: number }
    const allDots: DotData[] = []
    let landFeatures: any

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight)
      const currentScale = projection.scale()
      const scaleFactor = currentScale / radius

      // Ocean gradient
      const gradient = context.createRadialGradient(
        containerWidth / 2, containerHeight / 2, 0,
        containerWidth / 2, containerHeight / 2, currentScale
      )
      gradient.addColorStop(0, "#1a6fd4")
      gradient.addColorStop(1, "#0a3d7a")
      context.beginPath()
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI)
      context.fillStyle = gradient
      context.fill()
      context.strokeStyle = "rgba(255,255,255,0.15)"
      context.lineWidth = 1.5 * scaleFactor
      context.stroke()

      if (landFeatures) {
        // Graticule
        const graticule = d3.geoGraticule()
        context.beginPath()
        path(graticule())
        context.strokeStyle = "rgba(255,255,255,0.12)"
        context.lineWidth = 0.5 * scaleFactor
        context.stroke()

        // Land fill
        context.beginPath()
        landFeatures.features.forEach((feature: any) => path(feature))
        context.fillStyle = "rgba(255,255,255,0.08)"
        context.fill()
        context.strokeStyle = "rgba(255,255,255,0.4)"
        context.lineWidth = 0.8 * scaleFactor
        context.stroke()

        // Dots — white with slight blue tint
        allDots.forEach((dot) => {
          const projected = projection([dot.lng, dot.lat])
          if (projected && projected[0] >= 0 && projected[0] <= containerWidth && projected[1] >= 0 && projected[1] <= containerHeight) {
            context.beginPath()
            context.arc(projected[0], projected[1], 1.4 * scaleFactor, 0, 2 * Math.PI)
            context.fillStyle = "rgba(255,255,255,0.75)"
            context.fill()
          }
        })

        // Bulgaria marker — pink pulse
        const bulgariaPt = projection([targetLng, targetLat])
        if (bulgariaPt) {
          // Outer glow
          context.beginPath()
          context.arc(bulgariaPt[0], bulgariaPt[1], 10 * scaleFactor, 0, 2 * Math.PI)
          context.fillStyle = "rgba(239,57,136,0.25)"
          context.fill()
          // Inner dot
          context.beginPath()
          context.arc(bulgariaPt[0], bulgariaPt[1], 5 * scaleFactor, 0, 2 * Math.PI)
          context.fillStyle = "#EF3988"
          context.fill()
          context.strokeStyle = "#ffffff"
          context.lineWidth = 2 * scaleFactor
          context.stroke()
        }
      }
    }

    const rotation = [0, 0]
    let autoRotate = true
    let zoomingToBulgaria = false

    const loadWorldData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(
          "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json"
        )
        if (!response.ok) throw new Error("Failed to load land data")
        landFeatures = await response.json()

        landFeatures.features.forEach((feature: any) => {
          const dots = generateDotsInPolygon(feature, 16)
          dots.forEach(([lng, lat]) => allDots.push({ lng, lat }))
        })

        render()
        setIsLoading(false)

        // After 2s of rotating, zoom to Bulgaria
        if (autoZoom) {
          setTimeout(() => startZoomToBulgaria(), 2000)
        }
      } catch (err) {
        setError("Failed to load map data")
        setIsLoading(false)
      }
    }

    const startZoomToBulgaria = () => {
      autoRotate = false
      zoomingToBulgaria = true
      rotationTimer.stop()

      const startRotation = [...projection.rotate()]
      const targetRotation = [-targetLng, -targetLat]
      const startScale = projection.scale()
      const targetScale = radius * 6
      const duration = 2500

      const start = performance.now()

      const animate = (now: number) => {
        const t = Math.min((now - start) / duration, 1)
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t // ease in-out quad

        projection.rotate([
          startRotation[0] + (targetRotation[0] - startRotation[0]) * eased,
          startRotation[1] + (targetRotation[1] - startRotation[1]) * eased,
        ])
        projection.scale(startScale + (targetScale - startScale) * eased)
        render()

        if (t < 1) {
          requestAnimationFrame(animate)
        } else {
          // Fade out and call callback
          setTimeout(() => onZoomComplete?.(), 400)
        }
      }

      requestAnimationFrame(animate)
    }

    const rotationTimer = d3.timer(() => {
      if (autoRotate) {
        rotation[0] += 0.5
        projection.rotate(rotation)
        render()
      }
    })

    // Manual drag
    canvas.addEventListener("mousedown", (event: MouseEvent) => {
      if (zoomingToBulgaria) return
      autoRotate = false
      const startX = event.clientX
      const startY = event.clientY
      const startRotation = [...projection.rotate()]
      const onMove = (e: MouseEvent) => {
        projection.rotate([
          startRotation[0] + (e.clientX - startX) * 0.5,
          Math.max(-90, Math.min(90, startRotation[1] - (e.clientY - startY) * 0.5)),
        ])
        render()
      }
      const onUp = () => {
        document.removeEventListener("mousemove", onMove)
        document.removeEventListener("mouseup", onUp)
        setTimeout(() => { autoRotate = true }, 10)
      }
      document.addEventListener("mousemove", onMove)
      document.addEventListener("mouseup", onUp)
    })

    loadWorldData()

    return () => { rotationTimer.stop() }
  }, [width, height, autoZoom, targetLng, targetLat, onZoomComplete])

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-black rounded-2xl p-8 ${className}`}>
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a3d7a] rounded-3xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-white/20 border-t-[#DAF467] rounded-full animate-spin" />
            <p className="text-white/50 text-sm">Зареждане...</p>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-3xl"
        style={{ maxWidth: "100%", height: "auto", background: "#0a3d7a" }}
      />
      {!isLoading && (
        <div className="absolute bottom-4 left-4 text-xs text-white/40 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
          Влачи за завъртане
        </div>
      )}
    </div>
  )
}
