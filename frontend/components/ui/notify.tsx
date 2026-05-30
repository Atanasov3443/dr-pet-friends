"use client"

import { ReactNode, useCallback, useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import clsx from "clsx"
import { Button } from "@/components/ui/button-1"

const CloseIcon = ({ className }: { className: string }) => (
  <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.4697 13.5303L13 14.0607L14.0607 13L13.5303 12.4697L9.06065 7.99999L13.5303 3.53032L14.0607 2.99999L13 1.93933L12.4697 2.46966L7.99999 6.93933L3.53032 2.46966L2.99999 1.93933L1.93933 2.99999L2.46966 3.53032L6.93933 7.99999L2.46966 12.4697L1.93933 13L2.99999 14.0607L3.53032 13.5303L7.99999 9.06065L12.4697 13.5303Z"
    />
  </svg>
)

type ToastEntry = {
  id: number
  text: string | ReactNode
  measuredHeight?: number
  timeout?: ReturnType<typeof setTimeout>
  remaining?: number
  start?: number
  pause?: () => void
  resume?: () => void
  preserve?: boolean
  action?: string
  onAction?: () => void
  type: "message" | "success" | "warning" | "error"
}

let root: ReturnType<typeof createRoot> | null = null
let toastId = 0

const toastStore = {
  toasts: [] as ToastEntry[],
  listeners: new Set<() => void>(),

  add(
    text: string | ReactNode,
    type: "message" | "success" | "warning" | "error",
    preserve?: boolean,
    action?: string,
    onAction?: () => void
  ) {
    const id = toastId++
    const toast: ToastEntry = { id, text, preserve, action, onAction, type }

    if (!toast.preserve) {
      toast.remaining = 4000
      toast.start = Date.now()

      const close = () => {
        this.toasts = this.toasts.filter((t) => t.id !== id)
        this.notify()
      }

      toast.timeout = setTimeout(close, toast.remaining)

      toast.pause = () => {
        if (!toast.timeout) return
        clearTimeout(toast.timeout)
        toast.timeout = undefined
        toast.remaining! -= Date.now() - toast.start!
      }

      toast.resume = () => {
        if (toast.timeout) return
        toast.start = Date.now()
        toast.timeout = setTimeout(close, toast.remaining)
      }
    }

    this.toasts.push(toast)
    this.notify()
  },

  remove(id: number) {
    toastStore.toasts = toastStore.toasts.filter((t) => t.id !== id)
    toastStore.notify()
  },

  subscribe(listener: () => void) {
    toastStore.listeners.add(listener)
    return () => { toastStore.listeners.delete(listener) }
  },

  notify() {
    toastStore.listeners.forEach((fn) => fn())
  },
}

const bgClass: Record<ToastEntry["type"], string> = {
  message: "bg-geist-background text-gray-1000",
  success: "bg-[#1083BD] text-white",
  warning: "bg-amber-800 text-gray-1000",
  error: "bg-red-800 text-white",
}

const iconClass: Record<ToastEntry["type"], string> = {
  message: "fill-gray-1000",
  success: "fill-white",
  warning: "fill-gray-1000",
  error: "fill-white",
}

const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastEntry[]>([])
  const [shownIds, setShownIds] = useState<number[]>([])
  const [isHovered, setIsHovered] = useState(false)

  const measureRef = (toast: ToastEntry) => (node: HTMLDivElement | null) => {
    if (node && toast.measuredHeight == null) {
      toast.measuredHeight = node.getBoundingClientRect().height
      toastStore.notify()
    }
  }

  useEffect(() => {
    setToasts([...toastStore.toasts])
    return toastStore.subscribe(() => setToasts([...toastStore.toasts]))
  }, [])

  useEffect(() => {
    const unseen = toasts.filter((t) => !shownIds.includes(t.id)).map((t) => t.id)
    if (unseen.length > 0) {
      requestAnimationFrame(() => setShownIds((prev) => [...prev, ...unseen]))
    }
  }, [toasts, shownIds])

  const lastVisibleStart = Math.max(0, toasts.length - 3)

  const getFinalTransform = (index: number, length: number) => {
    if (index === length - 1) return "none"
    const offset = length - 1 - index
    let translateY = toasts[length - 1]?.measuredHeight || 63
    for (let i = length - 1; i > index; i--) {
      translateY += isHovered ? (toasts[i - 1]?.measuredHeight || 63) + 10 : 20
    }
    const scale = isHovered ? 1 : 1 - 0.05 * offset
    return `translate3d(0, calc(100% - ${translateY}px), ${-offset}px) scale(${scale})`
  }

  const containerHeight = toasts
    .slice(lastVisibleStart)
    .reduce((acc, t) => acc + (t.measuredHeight ?? 63), 0)

  return (
    <div className="fixed bottom-4 right-4 z-[9999] pointer-events-none w-[360px]" style={{ height: containerHeight }}>
      <div
        className="relative pointer-events-auto w-full"
        style={{ height: containerHeight }}
        onMouseEnter={() => { setIsHovered(true); toastStore.toasts.forEach((t) => t.pause?.()) }}
        onMouseLeave={() => { setIsHovered(false); toastStore.toasts.forEach((t) => t.resume?.()) }}
      >
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            ref={measureRef(toast)}
            className={clsx(
              "absolute right-0 bottom-0 rounded-xl shadow-menu leading-[21px] p-4 h-fit",
              bgClass[toast.type],
              index >= lastVisibleStart ? "opacity-100" : "opacity-0",
              index < lastVisibleStart && "pointer-events-none"
            )}
            style={{
              width: 360,
              transition: "all .35s cubic-bezier(.25,.75,.6,.98)",
              transform: shownIds.includes(toast.id)
                ? getFinalTransform(index, toasts.length)
                : "translate3d(0, 100%, 150px) scale(1)",
            }}
          >
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="font-medium">{toast.text}</span>
              <div className="flex gap-1 shrink-0">
                {toast.action && (
                  <Button type="tertiary" size="small" onClick={() => { toast.onAction?.(); toastStore.remove(toast.id) }}>
                    {toast.action}
                  </Button>
                )}
                <Button type="tertiary" svgOnly size="small" onClick={() => toastStore.remove(toast.id)}>
                  <CloseIcon className={iconClass[toast.type]} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const mountContainer = () => {
  if (root) return
  const el = document.createElement("div")
  document.body.appendChild(el)
  root = createRoot(el)
  root.render(<ToastContainer />)
}

export const useNotify = () => ({
  message: useCallback((text: string | ReactNode, opts?: { preserve?: boolean; action?: string; onAction?: () => void }) => {
    mountContainer()
    toastStore.add(text, "message", opts?.preserve, opts?.action, opts?.onAction)
  }, []),
  success: useCallback((text: string) => { mountContainer(); toastStore.add(text, "success") }, []),
  warning: useCallback((text: string) => { mountContainer(); toastStore.add(text, "warning") }, []),
  error: useCallback((text: string) => { mountContainer(); toastStore.add(text, "error") }, []),
})
