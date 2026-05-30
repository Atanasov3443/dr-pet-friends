"use client"

interface StickerProps {
  text: string
  color: "pink" | "orange" | "green" | "lime" | "blue"
  rotation?: number
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
}

const colorMap = {
  pink: "bg-[#EF3988] text-white",
  orange: "bg-[#FF6B35] text-white",
  green: "bg-[#10B83D] text-white",
  lime: "bg-[#DAF467] text-[#1083BD]",
  blue: "bg-[#1083BD] text-white",
}

const sizeMap = {
  sm: "px-3 py-1.5 text-[10px]",
  md: "px-4 py-2 text-xs",
  lg: "px-5 py-2.5 text-sm",
  xl: "px-6 py-3 text-base",
}

export function Sticker({ 
  text, 
  color, 
  rotation = 0, 
  className = "",
  size = "md"
}: StickerProps) {
  return (
    <span
      className={`
        sticker inline-block rounded-full font-bold uppercase tracking-wider
        ${colorMap[color]} ${sizeMap[size]} ${className}
        shadow-lg cursor-default select-none
        border-2 border-white/20
      `}
      style={{ 
        transform: `rotate(${rotation}deg)`,
        ["--rotate" as string]: `${rotation}deg`
      }}
    >
      {text}
    </span>
  )
}

type PawStickerIcon = "paw" | "bone" | "cat" | "fish" | "rabbit" | "dog" | "heart"

interface PawStickerProps {
  color: "pink" | "green" | "lime" | "blue" | "orange"
  rotation?: number
  className?: string
  withBone?: boolean
  icon?: PawStickerIcon
  size?: "sm" | "md" | "lg"
}

const pawSizeMap = {
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-18 h-18",
}

function AnimalIcon({ icon, color }: { icon: PawStickerIcon; color: string }) {
  switch (icon) {
    case "bone":
      return (
        <svg width="65%" height="65%" viewBox="0 0 100 100" fill={color}>
          <g transform="rotate(-45 50 50)">
            <rect x="44" y="19" width="12" height="62" rx="6" />
            <circle cx="37" cy="25" r="14" />
            <circle cx="63" cy="25" r="14" />
            <circle cx="37" cy="75" r="14" />
            <circle cx="63" cy="75" r="14" />
          </g>
        </svg>
      )
    case "cat":
      return (
        <svg width="62%" height="62%" viewBox="0 0 24 24" fill="none">
          <path d="M5 10V7L8 10" fill={color} />
          <path d="M19 10V7L16 10" fill={color} />
          <ellipse cx="12" cy="14" rx="7" ry="6" fill={color} />
          <circle cx="9.5" cy="13" r="1" fill="currentColor" opacity="0.4" />
          <circle cx="14.5" cy="13" r="1" fill="currentColor" opacity="0.4" />
          <path d="M10.5 16.5C10.5 16.5 11 17 12 17C13 17 13.5 16.5 13.5 16.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
        </svg>
      )
    case "fish":
      return (
        <svg width="62%" height="62%" viewBox="0 0 24 24" fill="none">
          <path d="M21 12C18 7 11 5 6 7L10 12L6 17C11 19 18 17 21 12Z" fill={color} />
          <path d="M3 9L6 12L3 15" fill={color} />
          <circle cx="17" cy="10.5" r="1" fill="currentColor" opacity="0.4" />
        </svg>
      )
    case "rabbit":
      return (
        <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none">
          <ellipse cx="9" cy="6" rx="2" ry="4" fill={color} />
          <ellipse cx="15" cy="6" rx="2" ry="4" fill={color} />
          <ellipse cx="12" cy="15" rx="6" ry="6" fill={color} />
          <circle cx="10" cy="14" r="0.8" fill="currentColor" opacity="0.4" />
          <circle cx="14" cy="14" r="0.8" fill="currentColor" opacity="0.4" />
          <circle cx="12" cy="16" r="1" fill="currentColor" opacity="0.3" />
        </svg>
      )
    case "dog":
      return (
        <svg width="62%" height="62%" viewBox="0 0 24 24" fill="none">
          <path d="M5 9C4 8 3 9 4 11L5 13" fill={color} />
          <path d="M19 9C20 8 21 9 20 11L19 13" fill={color} />
          <ellipse cx="12" cy="14" rx="7" ry="6" fill={color} />
          <path d="M7 10C7 10 6 8 5 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M17 10C17 10 18 8 19 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="9.5" cy="13" r="1" fill="currentColor" opacity="0.4" />
          <circle cx="14.5" cy="13" r="1" fill="currentColor" opacity="0.4" />
          <path d="M10 16.5Q12 18 14 16.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
        </svg>
      )
    case "heart":
      return (
        <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none">
          <path d="M12 20C12 20 4 14 4 9C4 6.5 6 5 8 5C9.5 5 11 6 12 7C13 6 14.5 5 16 5C18 5 20 6.5 20 9C20 14 12 20 12 20Z" fill={color} />
        </svg>
      )
    default:
      return (
        <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none">
          <path d="M12 18C12 18 7 14 7 10C7 7.5 8.5 6 10.5 6C11.5 6 12 7 12 7C12 7 12.5 6 13.5 6C15.5 6 17 7.5 17 10C17 14 12 18 12 18Z" fill={color} />
          <circle cx="8.5" cy="5.5" r="2" fill={color} />
          <circle cx="15.5" cy="5.5" r="2" fill={color} />
          <circle cx="5.5" cy="9.5" r="2" fill={color} />
          <circle cx="18.5" cy="9.5" r="2" fill={color} />
        </svg>
      )
  }
}

export function PawSticker({
  color,
  rotation = 0,
  className = "",
  withBone = false,
  icon,
  size = "md"
}: PawStickerProps) {
  const bgColors: Record<string, string> = {
    pink: "#EF3988",
    green: "#10B83D",
    lime: "#DAF467",
    blue: "#1083BD",
    orange: "#FF6B35",
  }

  const iconColors: Record<string, string> = {
    pink: "#FFFFFF",
    green: "#DAF467",
    lime: "#EF3988",
    blue: "#FFFFFF",
    orange: "#FFFFFF",
  }

  const resolvedIcon: PawStickerIcon = icon ?? (withBone ? "bone" : "paw")

  return (
    <div
      className={`sticker inline-flex items-center justify-center ${pawSizeMap[size]} rounded-full shadow-lg ${className}`}
      style={{
        backgroundColor: bgColors[color],
        transform: `rotate(${rotation}deg)`,
        ["--rotate" as string]: `${rotation}deg`
      }}
    >
      <AnimalIcon icon={resolvedIcon} color={iconColors[color]} />
    </div>
  )
}

// Cat face sticker
export function CatSticker({ 
  rotation = 0, 
  className = "",
}: {
  rotation?: number
  className?: string
}) {
  return (
    <div
      className={`sticker inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FF6B35] shadow-lg ${className}`}
      style={{ 
        transform: `rotate(${rotation}deg)`,
        ["--rotate" as string]: `${rotation}deg`
      }}
    >
      <svg width="70%" height="70%" viewBox="0 0 24 24" fill="none">
        <path d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" fill="white"/>
        <path d="M4 8L6 4L8 7" fill="white"/>
        <path d="M20 8L18 4L16 7" fill="white"/>
        <circle cx="9" cy="11" r="1.5" fill="#1083BD"/>
        <circle cx="15" cy="11" r="1.5" fill="#1083BD"/>
        <path d="M12 14C12 14 10 15 10 16C10 17 12 17 12 17C12 17 14 17 14 16C14 15 12 14 12 14Z" fill="#EF3988"/>
      </svg>
    </div>
  )
}
