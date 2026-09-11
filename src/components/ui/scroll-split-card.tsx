"use client"

import { cn } from "@/lib/utils"
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react"

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

function CardBackVisual({ card }: { card: ScrollSplitCardItem }) {
  const mediaClassName = cn(
    "relative z-10 mb-3 w-full shrink-0",
    card.icon && card.media && "origin-bottom scale-y-[1.2]",
    card.mediaClassName,
  )

  return (
    <>
      {card.icon ? <div className="relative z-10 mb-auto shrink-0 self-start">{card.icon}</div> : null}
      {card.media ? <div className={mediaClassName}>{card.media}</div> : null}
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
  const [layout, setLayout] = useState<"static" | "animated">("static")

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)")
    const update = () => {
      setLayout(reduceMotion || media.matches ? "static" : "animated")
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

  return <AnimatedScrollSplitCard {...props} />
}
