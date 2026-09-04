"use client"

import type { PsychologistType } from "@/lib/psychologist-types"
import { PSYCHOLOGIST_TYPE_IDS, PSYCHOLOGIST_TYPES } from "@/lib/psychologist-types"
import styles from "./PsychologistTypeCard.module.css"

export function PsychologistTypeCard({
  type,
  compact = false,
}: {
  type: PsychologistType
  compact?: boolean
}) {
  return (
    <figure className={compact ? `${styles.card} ${styles.compact}` : styles.card}>
      <div className={styles.frame}>
        <img className={styles.art} src={type.image} alt={type.title} />
        <div className={styles.brand}>
          <img src="/logo.svg" alt="" width={16} height={16} />
          <span>MotusDAO</span>
        </div>
      </div>
      <figcaption className={styles.caption}>
        <span className={styles.kicker}>
          Paso {type.step} de {PSYCHOLOGIST_TYPE_IDS.length}
        </span>
        <ol className={styles.ladder} aria-label="Ruta de tipos">
          {PSYCHOLOGIST_TYPE_IDS.map((id) => (
            <li key={id} className={id === type.id ? styles.current : undefined}>
              {PSYCHOLOGIST_TYPES[id].shortName}
            </li>
          ))}
        </ol>
        <span className={styles.note}>Lectura comercial y orientativa. No es certificación.</span>
      </figcaption>
    </figure>
  )
}
