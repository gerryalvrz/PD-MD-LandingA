"use client"

import { useState } from "react"
import Image from "next/image"
import {
  ArrowUpRight,
  BadgeCheck,
  GraduationCap,
  MessagesSquare,
  NotebookPen,
  Sparkles,
  UserRound,
  Video,
  Wallet,
} from "lucide-react"
import { APP_MODULES, EXPERIENCE_GENESIS, type AppModule, type AppModuleIcon } from "@/lib/app-experience"
import { AppModuleModal } from "@/components/landing/AppModuleModal"
import { T, type Tok } from "@/lib/landing-theme"
import styles from "./AppExperience.module.css"

const icons: Record<AppModuleIcon, typeof Sparkles> = {
  ai: Sparkles,
  profile: UserRound,
  reputation: BadgeCheck,
  supervision: MessagesSquare,
  academy: GraduationCap,
  payments: Wallet,
  video: Video,
  journal: NotebookPen,
}

export function AppExperience({ dark, onExplore }: { dark: boolean; onExplore: (id: string) => void }) {
  const tok: Tok = dark ? T.dark : T.light
  const [active, setActive] = useState<AppModule | null>(null)

  function openModule(item: AppModule) {
    onExplore(item.id)
    setActive(item)
  }

  function goMembership() {
    onExplore("membership_from_module")
    setActive(null)
    document.getElementById("membresia")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section
      id="experiencia"
      className={styles.section}
      data-theme={dark ? "dark" : "light"}
      style={{ background: tok.bgAlt, color: tok.t1 }}
      aria-labelledby="experience-title"
    >
      <div className={styles.container}>
        <p className={styles.eyebrow}>En la App MotusDAO</p>
        <h2 id="experience-title" className={styles.heading}>
          Lo que tienes en la App MotusDAO
        </h2>
        <p className={styles.intro}>
          Herramientas concretas para tu práctica digital: IA clínica, perfil, reputación, supervisión, academia,
          pagos, videochat seguro y bitácora — en un solo lugar.
        </p>

        <div className={styles.featured}>
          <figure className={styles.cover}>
            <Image
              src={EXPERIENCE_GENESIS.imageSrc}
              alt={EXPERIENCE_GENESIS.imageAlt}
              width={EXPERIENCE_GENESIS.imageWidth}
              height={EXPERIENCE_GENESIS.imageHeight}
              sizes="(max-width: 760px) 100vw, 55vw"
              priority={false}
            />
          </figure>
          <div className={styles.sample}>
            <p className={styles.eyebrow}>{EXPERIENCE_GENESIS.eyebrow}</p>
            <h3>{EXPERIENCE_GENESIS.title}</h3>
            <p>{EXPERIENCE_GENESIS.body}</p>
            <a
              href={EXPERIENCE_GENESIS.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onExplore(EXPERIENCE_GENESIS.exploreId)}
              className={styles.link}
            >
              {EXPERIENCE_GENESIS.ctaLabel}
              <ArrowUpRight size={17} aria-hidden="true" />
              <span className="sr-only"> (abre otra pestaña)</span>
            </a>
          </div>
        </div>

        <ol className={styles.moduleList} aria-label="Módulos de la App MotusDAO">
          {APP_MODULES.map((item, index) => {
            const Icon = icons[item.icon]
            return (
              <li key={item.id} className={styles.moduleRow}>
                <span className={styles.moduleIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.moduleIcon} aria-hidden="true">
                  <Icon size={20} strokeWidth={2} />
                </span>
                <div className={styles.moduleBody}>
                  <h3 className={styles.moduleTitle}>{item.title}</h3>
                  <p className={styles.moduleLine}>{item.line}</p>
                  <button type="button" className={styles.linkButton} onClick={() => openModule(item)}>
                    {item.linkLabel}
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </li>
            )
          })}
        </ol>

        <div className={styles.footer}>
          <p>Toca “Saber más” para ver qué hace cada módulo. Sin login: la explicación está aquí.</p>
          <a href="#membresia" className={styles.link}>
            Ver planes <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      {active ? (
        <AppModuleModal
          module={active}
          dark={dark}
          icon={<ModuleIcon id={active.icon} />}
          onClose={() => setActive(null)}
          onMembership={goMembership}
        />
      ) : null}
    </section>
  )
}

function ModuleIcon({ id }: { id: AppModuleIcon }) {
  const Icon = icons[id]
  return <Icon size={22} strokeWidth={2} aria-hidden="true" />
}
