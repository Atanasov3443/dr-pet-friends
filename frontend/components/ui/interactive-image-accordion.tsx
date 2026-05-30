"use client"

import { useState } from "react"

interface AccordionItemData {
  id: number
  title: string
  imageUrl: string
}

interface AccordionItemProps {
  item: AccordionItemData
  isActive: boolean
  onMouseEnter: () => void
}

const AccordionItem = ({ item, isActive, onMouseEnter }: AccordionItemProps) => {
  return (
    <div
      className={`
        relative h-[420px] rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-700 ease-in-out flex-shrink-0
        ${isActive ? "w-[320px]" : "w-[58px]"}
      `}
      onMouseEnter={onMouseEnter}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          const t = e.target as HTMLImageElement
          t.src = "https://placehold.co/320x420/1083BD/ffffff?text=Dr.+Pet+Friend"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      <span
        className={`
          absolute text-white text-sm font-bold whitespace-nowrap
          transition-all duration-500 ease-in-out
          ${
            isActive
              ? "bottom-5 left-1/2 -translate-x-1/2 rotate-0 opacity-100"
              : "bottom-20 left-1/2 -translate-x-1/2 rotate-90 opacity-70"
          }
        `}
      >
        {item.title}
      </span>
    </div>
  )
}

const accordionItems: AccordionItemData[] = [
  {
    id: 1,
    title: "Онлайн записи",
    imageUrl:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Груминг",
    imageUrl:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Здравно досие",
    imageUrl:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Реални отзиви",
    imageUrl:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Статистики",
    imageUrl:
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=800&auto=format&fit=crop",
  },
]

export function InteractiveImageAccordion() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="flex flex-row items-center justify-center gap-2">
      {accordionItems.map((item, index) => (
        <AccordionItem
          key={item.id}
          item={item}
          isActive={index === activeIndex}
          onMouseEnter={() => setActiveIndex(index)}
        />
      ))}
    </div>
  )
}
