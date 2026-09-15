"use client"

import { useMemo, useState, type ReactNode } from "react"
import { BookOpen, GraduationCap, Library, Sparkles, Users } from "lucide-react"
import { InteractiveSelector, type InteractiveSelectorOption } from "@/components/ui/interactive-selector"
import { ACCENT, T, type Tok } from "@/lib/landing-theme"
import { MEMBERSHIP_RESOURCES, type MembershipResource } from "@/lib/membership-resources"
import styles from "./MembershipResources.module.css"

const icons = {
  book: BookOpen,
  library: Library,
  academy: GraduationCap,
  ai: Sparkles,
  community: Users,
}

const SELECTOR_IMAGES: Record<string, string> = {
  manual: "/experience/membresia/manual-clinico.jpg",
  biblioteca: "/experience/membresia/biblioteca-virtual.jpg",
  formacion: "/experience/membresia/formacion-continua.jpg",
  psychat: "/experience/membresia/psychat.png",
  comunidad: "/experience/membresia/comunidad-practica.jpg",
}

/** Prefer right/left when the subject sits on an edge (avoids center-crop clipping). */
const SELECTOR_IMAGE_POSITION: Partial<Record<string, string>> = {
  comunidad: "right center",
}

function buildSelectorOptions(items: MembershipResource[], dark: boolean): InteractiveSelectorOption[] {
  const iconClass = dark ? "text-white" : "text-[#6E56CF]"

  return items.map((item) => {
    const Icon = icons[item.icon as keyof typeof icons]
    const icon: ReactNode = <Icon size={22} className={iconClass} aria-hidden="true" />

    return {
      title: item.title,
      description: item.line,
      image: SELECTOR_IMAGES[item.id] ?? SELECTOR_IMAGES.manual,
      imagePosition: SELECTOR_IMAGE_POSITION[item.id],
      icon,
    }
  })
}

export function MembershipResources({
  dark,
  onExplore,
}: {
  dark: boolean
  onExplore: (id: string) => void
}) {
  const tok: Tok = dark ? T.dark : T.light
  const selectorItems = useMemo(
    () => MEMBERSHIP_RESOURCES.filter((item) => item.group === "recursos" && item.status !== "Próximamente"),
    [],
  )
  const selectorOptions = useMemo(() => buildSelectorOptions(selectorItems, dark), [selectorItems, dark])
  const [activeIndex, setActiveIndex] = useState(0)

  const handleSelectorSelect = (index: number, source?: "auto" | "user") => {
    const item = selectorItems[index]
    if (!item) return
    setActiveIndex(index)
    if (source !== "auto") onExplore(item.id)
  }

  return (
    <section
      id="beneficios"
      className={styles.section}
      data-theme={dark ? "dark" : "light"}
      style={{ background: tok.bg, color: tok.t1 }}
      aria-labelledby="beneficios-title"
    >
      <span id="academia" aria-hidden="true" style={{ display: "block", scrollMarginTop: 88 }} />
      <div className={styles.container}>
        <div className={styles.intro}>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 12,
              fontWeight: 500,
              color: ACCENT.iris,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Incluido en tu membresía
          </p>
          <h2
            id="beneficios-title"
            style={{
              fontFamily: "var(--font-jura)",
              fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 44px)",
              color: tok.t1,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Recursos para dar el siguiente paso
          </h2>
          <p className={styles.body}>
            La Membresía de Práctica Digital es tu entrada comunitaria al bloque Fundamentos. Reúne recursos, formación y comunidad para organizar tu práctica online. Talleres, supervisión y Pase Motus Beta se contratan aparte.
          </p>
        </div>

        <InteractiveSelector
          dark={dark}
          options={selectorOptions}
          activeIndex={activeIndex}
          onSelect={handleSelectorSelect}
          aria-label="Vista previa de recursos incluidos en la membresía"
        />
      </div>
    </section>
  )
}
