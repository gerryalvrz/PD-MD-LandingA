"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowUpRight, BookOpen, Library, Users, Sparkles, GraduationCap, MessagesSquare, UserRound, CalendarDays, Video, Wallet, NotebookPen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EXPERIENCE_FEATURES, EXPERIENCE_STAGES, type ExperienceStage } from "@/lib/app-experience"
import { T, type Tok } from "@/lib/landing-theme"
import styles from "./AppExperience.module.css"

const icons = { academy: GraduationCap, library: Library, community: Users, ai: Sparkles, course: BookOpen, supervision: MessagesSquare, profile: UserRound, calendar: CalendarDays, video: Video, payments: Wallet, users: Users, journal: NotebookPen }

export function AppExperience({ dark, onExplore }: { dark: boolean; onExplore: (id: string) => void }) {
  const [stage, setStage] = useState<ExperienceStage>("membership")
  const tok: Tok = dark ? T.dark : T.light
  const selected = EXPERIENCE_STAGES.find((item) => item.id === stage)!
  const cards = EXPERIENCE_FEATURES.filter((item) => item.stage === stage)

  return (
    <section id="experiencia" className={styles.section} data-theme={dark ? "dark" : "light"} style={{ background: tok.bgAlt, color: tok.t1 }} aria-labelledby="experience-title">
      <div className={styles.container}>
        <p className={styles.eyebrow}>TU EXPERIENCIA EN MOTUSDAO</p>
        <h2 id="experience-title" className={styles.heading}>Una ruta que se convierte<br className={styles.desktopBreak} /> en herramientas para tu práctica.</h2>
        <p className={styles.intro}>Descubre qué puedes aprender, qué recursos te acompañan y cómo se abre el camino hacia tu consultorio digital.</p>

        <div className={styles.featured}>
          <figure className={styles.cover}>
            <Image src="/experience/fundamentos-cover.png" alt="Portada ilustrada del bloque Fundamentos de MotusDAO Academy" width={1905} height={826} sizes="(max-width: 760px) 100vw, 55vw" />
            <figcaption>Portada del bloque publicada en Academia</figcaption>
          </figure>
          <div className={styles.sample}>
            <p className={styles.eyebrow}>UNA MUESTRA DE FUNDAMENTOS</p>
            <h3>Tu encuadre listo en 20 minutos</h3>
            <p>Una lección con un ejercicio de media página para definir espacio, tiempo, confidencialidad y presencia digital.</p>
            <a href="https://app.motusdao.org/academia/02-fundamentos/leccion/tu-encuadre-listo" target="_blank" rel="noopener noreferrer" onClick={() => onExplore("encuadre-preview")} className={styles.link}>Ver la lección de muestra <ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (abre otra pestaña)</span></a>
          </div>
        </div>

        <div className={styles.filters} role="group" aria-label="Explorar funciones por etapa">
          {EXPERIENCE_STAGES.map((item, index) => (
            <Button key={item.id} variant="ghost" className={styles.filter} aria-pressed={stage === item.id} aria-controls="experience-cards" onClick={() => setStage(item.id)}>
              <span className={styles.step}>{String(index + 1).padStart(2, "0")}</span>{item.label}
            </Button>
          ))}
        </div>

        <div className={styles.stageIntro}>
          <p className={styles.stageName}>{selected.stage}</p>
          <p>{selected.description}</p>
          <span className={styles.count} aria-live="polite">{cards.length} funciones y recursos · {selected.label}</span>
        </div>

        <div id="experience-cards" className={styles.grid}>
          {cards.map((item) => {
            const Icon = icons[item.icon]
            return (
              <Card key={item.id} className={styles.card}>
                <CardContent className={styles.cardContent}>
                  <div className={styles.cardTop}><span className={styles.icon}><Icon size={22} aria-hidden="true" /></span><span className={styles.status} data-status={item.status}>{item.status}</span></div>
                  <h3>{item.title}</h3>
                  <p className={styles.benefit}>{item.benefit}</p>
                  <ul>{item.examples.map((example) => <li key={example}>{example}</li>)}</ul>
                  <div className={styles.access}><span>CUÁNDO ACCEDES</span><p>{item.access}</p></div>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => onExplore(item.id)} className={styles.link}>{item.linkLabel}<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (abre otra pestaña)</span></a>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <div className={styles.footer}><p>Los enlaces abren la app. Algunas herramientas requieren iniciar sesión y contar con permisos. Las funciones próximas se muestran para que conozcas el recorrido.</p><a href="#membresia" className={styles.link}>Volver a la membresía <span aria-hidden="true">→</span></a></div>
      </div>
    </section>
  )
}
