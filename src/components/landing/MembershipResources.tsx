"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, BookOpen, Library, GraduationCap, Sparkles, Users, CalendarDays, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { T, type Tok } from "@/lib/landing-theme"
import {
  MEMBERSHIP_RESOURCE_GROUPS,
  MEMBERSHIP_RESOURCES,
  type MembershipResource,
  type MembershipResourceGroup,
} from "@/lib/membership-resources"
import styles from "./MembershipResources.module.css"

const icons = {
  book: BookOpen,
  library: Library,
  academy: GraduationCap,
  ai: Sparkles,
  community: Users,
  calendar: CalendarDays,
  payments: Wallet,
}

function firstSelectable(items: MembershipResource[]) {
  return items.find((item) => item.href) ?? items[0] ?? null
}

export function MembershipResources({
  dark,
  onExplore,
}: {
  dark: boolean
  onExplore: (id: string) => void
}) {
  const tok: Tok = dark ? T.dark : T.light
  const [group, setGroup] = useState<MembershipResourceGroup>("recursos")
  const cards = MEMBERSHIP_RESOURCES.filter((item) => item.group === group)
  const [activeId, setActiveId] = useState(firstSelectable(cards)?.id ?? null)
  const [frameReady, setFrameReady] = useState(false)
  const active = cards.find((item) => item.id === activeId) ?? firstSelectable(cards)
  const frameSrc = active?.frameSrc ?? active?.href ?? null

  useEffect(() => {
    const next = firstSelectable(MEMBERSHIP_RESOURCES.filter((item) => item.group === group))
    setActiveId(next?.id ?? null)
  }, [group])

  useEffect(() => {
    setFrameReady(false)
  }, [frameSrc])

  const selectResource = (item: MembershipResource) => {
    setActiveId(item.id)
    if (item.href) onExplore(item.id)
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
              color: "#A855F7",
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

        <div className={styles.filters} role="group" aria-label="Ver recursos o herramientas">
          {MEMBERSHIP_RESOURCE_GROUPS.map((item, index) => (
            <Button
              key={item.id}
              variant="ghost"
              className={styles.filter}
              aria-pressed={group === item.id}
              aria-controls="membership-resource-menu"
              onClick={() => {
                setGroup(item.id)
                onExplore(`filtro-${item.id}`)
              }}
            >
              <span className={styles.step}>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </Button>
          ))}
        </div>

        <div className={styles.workspace}>
          <nav id="membership-resource-menu" className={styles.menu} aria-label="Recursos de la membresía">
            {cards.map((item) => {
              const Icon = icons[item.icon]
              const upcoming = item.status === "Próximamente"
              const selected = active?.id === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={selected ? "true" : undefined}
                  className={styles.menuItem}
                  data-upcoming={upcoming ? "true" : "false"}
                  onClick={() => selectResource(item)}
                >
                  <span className={styles.icon}>
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className={styles.menuCopy}>
                    <span className={styles.menuTitle}>{item.title}</span>
                    <span className={styles.menuLine}>{item.line}</span>
                  </span>
                  <span className={styles.status} data-status={item.status}>
                    {item.status}
                  </span>
                </button>
              )
            })}
          </nav>

          <div className={styles.preview} aria-live="polite">
            {frameSrc ? (
              <>
                <div className={styles.previewHeader}>
                  <h3 className={styles.previewTitle}>{active?.title}</h3>
                  {active?.href ? (
                    <a className={styles.previewLink} href={active.href} target="_blank" rel="noopener noreferrer">
                      Abrir en nueva pestaña
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
                <div className={styles.frameWrap}>
                  {!frameReady ? (
                    <p className={styles.frameLoading} role="status">
                      Abriendo {active?.title.toLowerCase()}…
                    </p>
                  ) : null}
                  <iframe
                    key={frameSrc}
                    className={styles.frame}
                    src={frameSrc}
                    title={active?.title}
                    referrerPolicy="no-referrer"
                    onLoad={() => setFrameReady(true)}
                  />
                </div>
              </>
            ) : (
              <div className={styles.empty}>
                <h3 className={styles.previewTitle}>{active?.title ?? "Elige un recurso"}</h3>
                <p>
                  {active?.status === "Próximamente"
                    ? "Este acompañamiento está en preparación. Elige otra opción del menú para ver un recurso disponible."
                    : "Elige una opción a la izquierda para verla aquí."}
                </p>
              </div>
            )}
          </div>
        </div>

        <p className={styles.note}>
          La vista previa abre el recurso en este panel. Si pide iniciar sesión, usa «Abrir en nueva pestaña». No envíes datos de pacientes en estos enlaces.
        </p>
      </div>
    </section>
  )
}
