import Link from "next/link"

function PawIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} aria-hidden>
      <circle cx="28" cy="22" r="12" />
      <circle cx="50" cy="14" r="12" />
      <circle cx="72" cy="22" r="12" />
      <ellipse cx="13" cy="43" rx="10" ry="13" transform="rotate(-20 13 43)" />
      <ellipse cx="87" cy="43" rx="10" ry="13" transform="rotate(20 87 43)" />
      <path d="M18 63 C8 83 20 99 36 99 C44 99 48 93 50 91 C52 93 56 99 64 99 C80 99 92 83 82 63 C74 47 62 41 50 41 C38 41 26 47 18 63Z" />
    </svg>
  )
}

interface LogoProps {
  variant?: "light" | "dark"
  size?: "sm" | "md" | "lg"
  href?: string
}

export function Logo({ variant = "light", size = "md", href = "/" }: LogoProps) {
  const isLight = variant === "light"

  const textColor = isLight ? "text-white" : "text-[#191919]"
  const pawColor  = isLight ? "text-white" : "text-[#1083BD]"

  const sizes = {
    sm: { text: "text-base",  paw: "w-4 h-4", gap: "gap-1.5" },
    md: { text: "text-xl",    paw: "w-5 h-5", gap: "gap-2"   },
    lg: { text: "text-3xl",   paw: "w-7 h-7", gap: "gap-2.5" },
  }[size]

  const inner = (
    <span className={`inline-flex items-center ${sizes.gap}`}>
      {/* Paw icon — no circle */}
      <PawIcon className={`${sizes.paw} shrink-0 ${pawColor}`} />
      {/* Text */}
      <span className={`font-display font-black ${sizes.text} ${textColor} leading-none tracking-tight`}>
        Dr. Pet Friend
      </span>
    </span>
  )

  return href ? (
    <Link href={href} className="inline-flex">
      {inner}
    </Link>
  ) : (
    <span className="inline-flex">{inner}</span>
  )
}
