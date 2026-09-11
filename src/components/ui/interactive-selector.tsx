"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { BookOpen, ChevronLeft, ChevronRight, GraduationCap, Library, Sparkles, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import styles from "./interactive-selector.module.css"

const AUTO_PLAY_MS = 5000

export type InteractiveSelectorOption = {
  title: string
  description: string
  image: string
  icon: ReactNode
}

const DEFAULT_OPTIONS: InteractiveSelectorOption[] = [
  {
    title: "Manual clínico-operativo",
    description: "Referencia para estructurar tu práctica digital",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
    icon: <BookOpen size={22} className="text-white" aria-hidden="true" />,
  },
  {
    title: "Biblioteca virtual",
    description: "Recursos para consultar y seguir aprendiendo",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80",
    icon: <Library size={22} className="text-white" aria-hidden="true" />,
  },
  {
    title: "Formación continua",
    description: "Actividades para desarrollar tu práctica profesional",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
    icon: <GraduationCap size={22} className="text-white" aria-hidden="true" />,
  },
  {
    title: "Introducción a PsyChat",
    description: "Herramientas de apoyo con criterio clínico",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    icon: <Sparkles size={22} className="text-white" aria-hidden="true" />,
  },
  {
    title: "Comunidad de práctica",
    description: "Comparte el recorrido con otros profesionales",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    icon: <Users size={22} className="text-white" aria-hidden="true" />,
  },
]

export type InteractiveSelectorSelectSource = "auto" | "user"

export type InteractiveSelectorProps = {
  options?: InteractiveSelectorOption[]
  activeIndex?: number
  onSelect?: (index: number, source?: InteractiveSelectorSelectSource) => void
  dark?: boolean
  className?: string
  title?: string
  description?: string
  autoPlay?: boolean
  autoPlayInterval?: number
  "aria-label"?: string
}

export function InteractiveSelector({
  options = DEFAULT_OPTIONS,
  activeIndex: controlledIndex,
  onSelect,
  dark = true,
  className,
  title,
  description,
  autoPlay = true,
  autoPlayInterval = AUTO_PLAY_MS,
  "aria-label": ariaLabel = "Explorar recursos de la membresía",
}: InteractiveSelectorProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentIndex = controlledIndex ?? activeIndex

  const goToIndex = useCallback(
    (index: number, source: InteractiveSelectorSelectSource = "user") => {
      if (controlledIndex === undefined) {
        setActiveIndex(index)
      }
      onSelect?.(index, source)
    },
    [controlledIndex, onSelect],
  )

  const pauseAutoPlay = useCallback(
    (duration = autoPlayInterval) => {
      setIsPaused(true)
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
      pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), duration)
    },
    [autoPlayInterval],
  )

  const handleOptionClick = (index: number) => {
    goToIndex(index, "user")
    pauseAutoPlay()
  }

  const handlePrevious = () => {
    const nextIndex = (currentIndex - 1 + options.length) % options.length
    goToIndex(nextIndex, "user")
    pauseAutoPlay()
  }

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % options.length
    goToIndex(nextIndex, "user")
    pauseAutoPlay()
  }

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    options.forEach((_, index) => {
      const timer = setTimeout(() => {
        setAnimatedOptions((prev) => (prev.includes(index) ? prev : [...prev, index]))
      }, 180 * index)
      timers.push(timer)
    })

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [options])

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (!autoPlay || isPaused || options.length <= 1) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    const timer = window.setInterval(() => {
      const nextIndex = (currentIndex + 1) % options.length
      goToIndex(nextIndex, "auto")
    }, autoPlayInterval)

    return () => window.clearInterval(timer)
  }, [autoPlay, autoPlayInterval, currentIndex, goToIndex, isPaused, options.length])

  return (
    <div className={cn("relative flex w-full flex-col items-center justify-center", className)}>
      {title || description ? (
        <div className="mb-8 w-full max-w-2xl px-2 text-center">
          {title ? (
            <h3
              className={cn(
                styles.fadeInTop,
                styles.delay300,
                "mb-3 text-3xl font-bold tracking-tight drop-shadow-lg md:text-4xl",
                dark ? "text-white" : "text-[#0E0A1A]",
              )}
              style={{ fontFamily: "var(--font-jura)" }}
            >
              {title}
            </h3>
          ) : null}
          {description ? (
            <p
              className={cn(
                styles.fadeInTop,
                styles.delay600,
                "mx-auto max-w-xl text-base font-medium md:text-lg",
                dark ? "text-white/65" : "text-[#544765]",
              )}
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {description}
            </p>
          ) : null}
        </div>
      ) : null}

      <div
        className={styles.shell}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          if (!pauseTimeoutRef.current) setIsPaused(false)
        }}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null) && !pauseTimeoutRef.current) {
            setIsPaused(false)
          }
        }}
      >
        <div className={styles.options} role="list" aria-label={ariaLabel}>
          {options.map((option, index) => {
            const isActive = currentIndex === index
            const isVisible = animatedOptions.includes(index)

            return (
              <button
                key={`${option.title}-${index}`}
                type="button"
                role="listitem"
                aria-pressed={isActive}
                aria-label={`${option.title}. ${option.description}`}
                className={cn(
                  styles.option,
                  dark ? null : styles.optionLight,
                  isActive ? styles.optionActive : styles.optionInactive,
                )}
                style={{
                  backgroundImage: `url('${option.image}')`,
                  backgroundSize: isActive ? "auto 100%" : "auto 120%",
                  backgroundPosition: "center",
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateX(0)" : "translateX(-60px)",
                  transition:
                    "opacity 0.7s ease-in-out, transform 0.7s ease-in-out, flex 0.7s ease-in-out, box-shadow 0.7s ease-in-out, background-size 0.7s ease-in-out, border-color 0.7s ease-in-out",
                }}
                onClick={() => handleOptionClick(index)}
              >
                <div className={cn(styles.shadow, isActive ? styles.shadowActive : styles.shadowInactive)} />

                <div className={cn(styles.label, isActive ? styles.labelActive : styles.labelInactive)}>
                  <div className={cn(styles.iconWrap, !dark && styles.iconWrapLight)}>{option.icon}</div>
                  <div className={cn(styles.info, !dark && styles.infoLight)}>
                    <div className={cn(styles.main, isActive ? styles.mainVisible : styles.mainHidden)}>
                      {option.title}
                    </div>
                    <div
                      className={cn(
                        styles.sub,
                        !dark && styles.subLight,
                        isActive ? styles.subVisible : styles.subHidden,
                      )}
                    >
                      {option.description}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {options.length > 1 ? (
          <div className={styles.controls} aria-label="Navegar recursos">
            <button
              type="button"
              className={cn(styles.navButton, dark ? styles.navButtonDark : styles.navButtonLight)}
              onClick={handlePrevious}
              aria-label="Recurso anterior"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              className={cn(styles.navButton, dark ? styles.navButtonDark : styles.navButtonLight)}
              onClick={handleNext}
              aria-label="Siguiente recurso"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        ) : null}

        <div
          className={cn(styles.mobileCaption, dark ? styles.mobileCaptionDark : styles.mobileCaptionLight)}
          aria-live="polite"
        >
          <p className={styles.mobileTitle}>{options[currentIndex]?.title}</p>
          <p className={styles.mobileDescription}>{options[currentIndex]?.description}</p>
        </div>
      </div>
    </div>
  )
}

export default InteractiveSelector
