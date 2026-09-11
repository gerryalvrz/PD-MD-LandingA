"use client"

import { cn } from "@/lib/utils"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion"
import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react"

export interface ScrollSplitCardItem {
  title: string
  description: string
  bgColor: string
  textColor: string
  icon?: ReactNode
  media?: ReactNode
  mediaClassName?: string
}

interface ScrollSplitCardProps {
  className?: string
  stickyClassName?: string
  imageSrc: string
  imageAlt?: string
  cards: ScrollSplitCardItem[]
  containerRef?: RefObject<HTMLElement | null>
  startLabel?: string
  endLabel?: string
  startLabelClassName?: string
  endLabelClassName?: string
}

function CardBackVisual({ card, mediaActive = true }: { card: ScrollSplitCardItem; mediaActive?: boolean }) {
  const mediaClassName = cn(
    "relative z-10 mb-3 w-full shrink-0",
    card.icon && card.media && mediaActive && "origin-bottom scale-y-[1.2]",
    card.mediaClassName,
  )

  const media =
    card.media && mediaActive
      ? isValidElement(card.media)
        ? cloneElement(card.media as ReactElement<{ active?: boolean }>, { active: true })
        : card.media
      : null

  return (
    <>
      {card.icon ? <div className="relative z-10 mb-auto shrink-0 self-start">{card.icon}</div> : null}
      {media ? <div className={mediaClassName}>{media}</div> : null}
    </>
  )
}

function StaticSplitCards({
  cards,
  className,
  imageSrc,
  imageAlt,
}: {
  cards: ScrollSplitCardItem[]
  className?: string
  imageSrc?: string
  imageAlt?: string
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 py-16", className)}>
      {imageSrc ? (
        <figure className="mb-8 overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_48px_rgba(0,0,0,0.35)]">
          <img
            src={imageSrc}
            alt={imageAlt ?? ""}
            className="h-auto w-full"
            style={{ imageRendering: "pixelated" }}
            loading="lazy"
          />
        </figure>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-3">
        {cards.slice(0, 3).map((card) => (
          <article
            key={card.title}
            className="relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-2xl border border-white/5 p-6"
            style={{ backgroundColor: card.bgColor, color: card.textColor }}
          >
            <CardBackVisual card={card} />
            <h3
              className="relative z-10 mb-3 text-xl leading-tight font-bold"
              style={{ fontFamily: "var(--font-jura)", letterSpacing: "-0.02em" }}
            >
              {card.title}
            </h3>
            <p className="relative z-10 text-sm opacity-80" style={{ fontFamily: "var(--font-inter)", lineHeight: 1.55 }}>
              {card.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}

function usePinnedScrollProgress(targetRef: RefObject<HTMLElement | null>) {
  const progress = useMotionValue(0)

  useEffect(() => {
    const update = () => {
      const el = targetRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const distance = rect.height - window.innerHeight
      if (distance <= 0) {
        progress.set(rect.top <= 0 ? 1 : 0)
        return
      }

      progress.set(Math.min(1, Math.max(0, -rect.top / distance)))
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [progress, targetRef])

  return progress
}

function mobileScene(progress: number): "image" | 0 | 1 | 2 {
  if (progress < 0.18) return "image"
  if (progress < 0.44) return 0
  if (progress < 0.7) return 1
  return 2
}

function MobileFeatureCard({ card, active }: { card: ScrollSplitCardItem; active: boolean }) {
  const [mediaActive, setMediaActive] = useState(false)

  useEffect(() => {
    if (!active) {
      setMediaActive(false)
      return
    }

    const timeout = window.setTimeout(() => setMediaActive(true), 40)
    return () => window.clearTimeout(timeout)
  }, [active])

  return (
    <article
      className="absolute inset-x-4 top-[46%] mx-auto flex min-h-[min(62svh,460px)] max-w-md flex-col justify-end overflow-hidden rounded-2xl border border-white/5 p-6 transition-transform duration-300 ease-out"
      style={{
        transform: active ? "translateY(-50%) scale(1)" : "translateY(-50%) scale(0.96)",
        visibility: active ? "visible" : "hidden",
        zIndex: active ? 4 : 0,
        backgroundColor: card.bgColor,
        color: card.textColor,
        pointerEvents: "none",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("https://framerusercontent.com/images/6mcf62RlDfRfU61Yg5vb2pefpi4.png?width=256&height=256")`,
          backgroundRepeat: "repeat",
        }}
      />
      <CardBackVisual card={card} mediaActive={mediaActive} />
      <h3
        className="relative z-10 mb-3 text-xl leading-tight font-bold"
        style={{ fontFamily: "var(--font-jura)", letterSpacing: "-0.02em" }}
      >
        {card.title}
      </h3>
      <p className="relative z-10 text-sm opacity-80" style={{ fontFamily: "var(--font-inter)", lineHeight: 1.55 }}>
        {card.description}
      </p>
    </article>
  )
}

function MobileScrollSplitCard({
  className,
  stickyClassName,
  imageSrc,
  imageAlt = "",
  cards,
  startLabel,
  startLabelClassName,
  endLabel,
  endLabelClassName,
}: ScrollSplitCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scene, setScene] = useState<"image" | 0 | 1 | 2>("image")
  const visibleCards = cards.slice(0, 3)
  const scrollYProgress = usePinnedScrollProgress(containerRef)

  const imageOpacity = useTransform(scrollYProgress, [0, 0.14, 0.18], [1, 1, 0])
  const imageScale = useTransform(scrollYProgress, [0, 0.14, 0.18], [1, 1, 0.96])
  const startTextOpacity = useTransform(scrollYProgress, [0, 0.08, 0.14], [1, 1, 0])
  const endTextOpacity = useTransform(scrollYProgress, [0.86, 0.92, 1], [0, 1, 1])
  const endTextY = useTransform(scrollYProgress, [0.86, 0.92], [20, 0])

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const next = mobileScene(progress)
    setScene((current) => (current === next ? current : next))
  })

  return (
    <div ref={containerRef} className={cn("relative h-[520svh] w-full", className)}>
      <div
        className={cn(
          "sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden",
          stickyClassName,
        )}
      >
        {startLabel ? (
          <motion.p
            className={cn(
              "absolute top-[12%] right-0 left-0 z-20 text-center text-[12px] font-medium tracking-[0.10em] uppercase",
              startLabelClassName,
            )}
            style={{ fontFamily: "var(--font-inter)", opacity: startTextOpacity }}
          >
            {startLabel}
          </motion.p>
        ) : null}

        <motion.figure
          className="absolute inset-x-4 top-[22%] z-[1] mx-auto max-w-md overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_48px_rgba(0,0,0,0.35)]"
          style={{ opacity: imageOpacity, scale: imageScale }}
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-auto w-full"
            style={{ imageRendering: "pixelated" }}
            loading="lazy"
          />
        </motion.figure>

        {visibleCards.map((card, index) => (
          <MobileFeatureCard key={card.title} card={card} active={scene === index} />
        ))}

        {endLabel ? (
          <motion.div
            className="absolute right-0 bottom-[10%] left-0 z-20 text-center"
            style={{ opacity: endTextOpacity, y: endTextY }}
          >
            <p
              className={cn(
                "px-6 text-[clamp(22px,6.4vw,30px)] leading-tight font-bold tracking-[-0.02em]",
                endLabelClassName,
              )}
              style={{ fontFamily: "var(--font-jura)" }}
            >
              {endLabel}
            </p>
          </motion.div>
        ) : null}
      </div>
    </div>
  )
}

function AnimatedScrollSplitCard({
  className,
  stickyClassName,
  imageSrc,
  imageAlt = "",
  cards,
  containerRef: externalContainerRef,
  startLabel,
  endLabel,
  startLabelClassName,
  endLabelClassName,
}: ScrollSplitCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    ...(externalContainerRef ? { container: externalContainerRef } : {}),
    offset: ["start start", "end end"],
  })

  const leftX = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, -48, -24])
  const rightX = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, 48, 24])
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9])

  const rotateY = useTransform(scrollYProgress, [0.4, 0.8], [0, 180])
  const rotateZLeft = useTransform(scrollYProgress, [0.4, 0.8], [0, 6])
  const rotateZRight = useTransform(scrollYProgress, [0.4, 0.8], [0, -6])

  const borderRadiusLeft = useTransform(scrollYProgress, [0, 0.2], ["16px 0px 0px 16px", "16px 16px 16px 16px"])
  const borderRadiusMiddle = useTransform(scrollYProgress, [0, 0.2], ["0px 0px 0px 0px", "16px 16px 16px 16px"])
  const borderRadiusRight = useTransform(scrollYProgress, [0, 0.2], ["0px 16px 16px 0px", "16px 16px 16px 16px"])
  const borderOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 0.2])
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 0.4])
  const boxShadow = useMotionTemplate`inset 0 1px 1px rgba(255, 255, 255, ${borderOpacity}), inset 0 -24px 48px rgba(0, 0, 0, ${shadowOpacity}), 0 25px 50px -12px rgba(0, 0, 0, ${shadowOpacity})`

  const cardsY = useTransform(scrollYProgress, [0.72, 1], [0, -160])
  const textOpacity = useTransform(scrollYProgress, [0.7, 0.86, 1], [0, 1, 1])
  const textY = useTransform(scrollYProgress, [0.7, 0.86], [40, 0])
  const startTextOpacity = useTransform(scrollYProgress, [0, 0.08, 0.2, 1], [1, 0, 0, 0])
  const startTextY = useTransform(scrollYProgress, [0, 0.08], [0, 16])

  return (
    <div ref={containerRef} className={cn("relative h-[500vh] w-full", className)}>
      <div
        className={cn(
          "sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden [perspective:1200px]",
          stickyClassName,
        )}
      >
        {startLabel ? (
          <motion.div
            className="absolute top-[22%] right-0 left-0 text-center"
            style={{ opacity: startTextOpacity, y: startTextY }}
          >
            <p
              className={cn("text-[12px] font-medium tracking-[0.10em] uppercase", startLabelClassName)}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {startLabel}
            </p>
          </motion.div>
        ) : null}

        <motion.div
          style={{ scale, y: cardsY, transformStyle: "preserve-3d" }}
          className="relative flex aspect-[1024/444] w-full max-w-6xl px-4"
          role="img"
          aria-label={imageAlt || undefined}
        >
          {cards.slice(0, 3).map((card, i) => (
            <motion.div
              key={card.title}
              className="relative h-full flex-1"
              style={{
                x: i === 0 ? leftX : i === 2 ? rightX : 0,
                rotateY,
                rotateZ: i === 0 ? rotateZLeft : i === 2 ? rotateZRight : 0,
                zIndex: i,
                transformStyle: "preserve-3d",
              }}
            >
              <motion.div
                className="absolute inset-0 overflow-hidden [backface-visibility:hidden]"
                style={{
                  zIndex: 2,
                  borderRadius: i === 0 ? borderRadiusLeft : i === 2 ? borderRadiusRight : borderRadiusMiddle,
                  boxShadow,
                }}
              >
                <div
                  className="absolute inset-0 h-full w-[300%]"
                  style={
                    {
                      left: `${-100 * i}%`,
                      backgroundImage: `url(${imageSrc})`,
                      backgroundSize: "100% auto",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center top",
                      imageRendering: "pixelated",
                    } satisfies CSSProperties
                  }
                />
              </motion.div>

              <motion.div
                className={cn(
                  "absolute inset-0 flex flex-col justify-end overflow-hidden p-4 will-change-transform [backface-visibility:hidden] md:p-8",
                  "border border-white/5 bg-gradient-to-br from-white/10 to-transparent",
                  "shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-24px_48px_rgba(0,0,0,0.2)]",
                )}
                style={{
                  backgroundColor: card.bgColor,
                  color: card.textColor,
                  transform: "rotateY(180deg)",
                  zIndex: 1,
                  borderRadius: i === 0 ? borderRadiusLeft : i === 2 ? borderRadiusRight : borderRadiusMiddle,
                  boxShadow,
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
                  style={{
                    backgroundImage: `url("https://framerusercontent.com/images/6mcf62RlDfRfU61Yg5vb2pefpi4.png?width=256&height=256")`,
                    backgroundRepeat: "repeat",
                  }}
                />

                <CardBackVisual card={card} />
                <h3
                  className="relative z-10 mb-3 text-lg leading-tight font-bold md:mb-4 md:text-2xl"
                  style={{ fontFamily: "var(--font-jura)", letterSpacing: "-0.02em" }}
                >
                  {card.title}
                </h3>
                <p
                  className="relative z-10 text-xs opacity-80 md:text-sm"
                  style={{ fontFamily: "var(--font-inter)", lineHeight: 1.55 }}
                >
                  {card.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {endLabel ? (
          <motion.div
            className="absolute right-0 bottom-[18%] left-0 text-center"
            style={{ opacity: textOpacity, y: textY }}
          >
            <p
              className={cn(
                "px-6 text-[clamp(22px,3.4vw,32px)] leading-tight font-bold tracking-[-0.02em]",
                endLabelClassName,
              )}
              style={{ fontFamily: "var(--font-jura)" }}
            >
              {endLabel}
            </p>
          </motion.div>
        ) : null}
      </div>
    </div>
  )
}

function useScrollSplitLayout() {
  const reduceMotion = useReducedMotion()
  const [layout, setLayout] = useState<"static" | "mobile" | "animated">("static")

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)")
    const update = () => {
      if (reduceMotion) {
        setLayout("static")
        return
      }
      setLayout(media.matches ? "mobile" : "animated")
    }

    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [reduceMotion])

  return layout
}

export function ScrollSplitCard(props: ScrollSplitCardProps) {
  const layout = useScrollSplitLayout()

  if (layout === "static") {
    return (
      <StaticSplitCards
        cards={props.cards}
        className={props.className}
        imageSrc={props.imageSrc}
        imageAlt={props.imageAlt}
      />
    )
  }

  if (layout === "mobile") {
    return <MobileScrollSplitCard {...props} />
  }

  return <AnimatedScrollSplitCard {...props} />
}
