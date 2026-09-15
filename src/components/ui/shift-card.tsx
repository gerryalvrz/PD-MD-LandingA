"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

type ShiftCardProps = {
  className?: string
  topContent?: React.ReactNode
  middleContent?: React.ReactNode
  topAnimateContent?: React.ReactNode
  bottomContent?: React.ReactNode
  href?: string
  collapsedHeight?: number
  "aria-label"?: string
  transition?: React.ComponentProps<typeof motion.div>["transition"]
}

const ShiftCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  ),
)
ShiftCardHeader.displayName = "ShiftCardHeader"

function ShiftCardContent({
  expanded,
  collapsedHeight,
  reduceMotion,
  children,
  className,
}: {
  expanded: boolean
  collapsedHeight: number
  reduceMotion: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      key="shift-card-content"
      initial={false}
      animate={{
        opacity: 1,
        height: expanded ? "auto" : collapsedHeight,
      }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.3, delay: 0.08, ease: "circIn" }}
      className={cn("overflow-hidden", !expanded && "max-h-[3.5rem]", className)}
    >
      {children}
    </motion.div>
  )
}

const SHIFT_CARD_OPEN = "motus:shift-card-open"

function useFineHover() {
  const [fineHover, setFineHover] = React.useState(true)

  React.useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)")
    const sync = () => setFineHover(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  return fineHover
}

function ShiftCard({
  className,
  topContent,
  topAnimateContent,
  middleContent,
  bottomContent,
  href,
  collapsedHeight = 48,
  transition,
  "aria-label": ariaLabel,
}: ShiftCardProps) {
  const cardId = React.useId()
  const rootRef = React.useRef<HTMLAnchorElement | HTMLDivElement | null>(null)
  const skipNavRef = React.useRef(false)
  const [hovered, setHovered] = React.useState(false)
  const [focused, setFocused] = React.useState(false)
  const [tapped, setTapped] = React.useState(false)
  const reduceMotion = useReducedMotion() ?? false
  const fineHover = useFineHover()

  const expanded = hovered || focused || tapped
  const isHashLink = Boolean(href?.startsWith("#"))

  React.useEffect(() => {
    const onPeerOpen = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== cardId) {
        setTapped(false)
      }
    }
    window.addEventListener(SHIFT_CARD_OPEN, onPeerOpen)
    return () => window.removeEventListener(SHIFT_CARD_OPEN, onPeerOpen)
  }, [cardId])

  React.useEffect(() => {
    if (!tapped) return
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return
      setTapped(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [tapped])

  const openFromTap = React.useCallback(() => {
    setTapped(true)
    window.dispatchEvent(new CustomEvent(SHIFT_CARD_OPEN, { detail: cardId }))
  }, [cardId])

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.pointerType === "mouse") return
    if (!tapped) {
      skipNavRef.current = true
      openFromTap()
    }
  }

  const onClick = (event: React.MouseEvent) => {
    if (skipNavRef.current) {
      event.preventDefault()
      skipNavRef.current = false
      return
    }
    if (!fineHover && !tapped) {
      event.preventDefault()
      openFromTap()
    }
  }

  const shellClass = cn(
    "group relative flex min-h-[360px] w-full flex-col items-center justify-between overflow-hidden rounded-[1.25rem] p-3 text-sm",
    "touch-manipulation outline-none transition-shadow duration-300",
    "focus-visible:ring-2 focus-visible:ring-[rgba(155,138,255,0.5)]",
    expanded && "shadow-[0_0_28px_rgba(155,138,255,0.28)]",
    href && "cursor-pointer no-underline",
    className,
  )

  const motionBind = {
    className: shellClass,
    "data-expanded": expanded ? "true" : "false",
    "aria-expanded": expanded,
    initial: false,
    animate: { y: 0, opacity: 1 },
    whileHover: reduceMotion || !fineHover ? undefined : { scale: 1.015 },
    whileTap: reduceMotion ? undefined : { scale: 0.985 },
    transition,
    onPointerDown,
    onClick,
    onMouseEnter: () => {
      if (fineHover) setHovered(true)
    },
    onMouseLeave: () => setHovered(false),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  } as const

  const inner = (
    <>
      <ShiftCardHeader className="relative flex min-h-[52px] w-full flex-col">
        <div className="w-full">
          {topContent}
          <AnimatePresence>{expanded ? topAnimateContent : null}</AnimatePresence>
        </div>
      </ShiftCardHeader>

      <div className="flex flex-1 items-center justify-center pb-14 pt-3">
        <AnimatePresence>{!expanded ? middleContent : null}</AnimatePresence>
      </div>

      <ShiftCardContent
        expanded={expanded}
        collapsedHeight={collapsedHeight}
        reduceMotion={reduceMotion}
        className="absolute inset-x-0 -bottom-1.5 flex flex-col rounded-xl"
      >
        <div className="flex w-full flex-col">{bottomContent}</div>
      </ShiftCardContent>
    </>
  )

  if (href) {
    return (
      <motion.a
        ref={rootRef as React.Ref<HTMLAnchorElement>}
        href={href}
        target={isHashLink ? undefined : "_blank"}
        rel={isHashLink ? undefined : "noopener noreferrer"}
        aria-label={ariaLabel}
        {...motionBind}
      >
        {inner}
      </motion.a>
    )
  }

  return (
    <motion.div ref={rootRef as React.Ref<HTMLDivElement>} {...motionBind}>
      {inner}
    </motion.div>
  )
}

export { ShiftCard, ShiftCardHeader, ShiftCardContent }
export default ShiftCard
