"use client"

import type { ReadinessId, ReadinessResult } from "@/lib/readiness-index"
import { ShareInviteButton } from "@/components/share/ShareModal"
import { PsychologistTypeCard } from "@/components/share/PsychologistTypeCard"
import { psychologistTypeFromReadiness } from "@/lib/psychologist-types"
import { readinessShareDraft } from "@/lib/share-card"
import styles from "./ReadinessResult.module.css"

const BAND_CLASS: Record<ReadinessResult["band"]["id"], string> = {
  foundation: styles.foundation,
  transition: styles.transition,
  professional: styles.professional,
  "ai-ready": styles["ai-ready"],
}

export function ReadinessResultView({
  result,
  onEdit,
  onRestart,
}: {
  result: ReadinessResult
  onEdit: (id: ReadinessId) => void
  onRestart: () => void
}) {
  const critical = result.flags.some((flag) => flag.severity === "critical")
  const persona = psychologistTypeFromReadiness(result)

  return (
    <article className={styles.wrap}>
      <p className={styles.eyebrow}>Tu tipo</p>
      {persona ? <PsychologistTypeCard type={persona} /> : null}
      <h1 className={persona ? "sr-only" : styles.heading}>{persona ? persona.title : result.band.title}</h1>
      {persona ? null : <p className={styles.lede}>{result.band.description}</p>}

      <div className={styles.scoreRow}>
        <div className={styles.scoreCard}>
          <span className={styles.scoreValue}>
            {result.total}
            <span> / {result.maxTotal}</span>
          </span>
          <div className={`${styles.band} ${BAND_CLASS[result.band.id]}`}>
            <span className={styles.dot} aria-hidden />
            {result.band.label} · {result.percent}%
          </div>
        </div>
        <div className={styles.card} style={{ marginBottom: 0 }}>
          <h3>Qué significa</h3>
          <p>
            Cada área vale hasta 4 puntos. El total no es una certificación ni un dictamen legal. Si hay una alerta, esa
            alerta manda sobre el color de la banda. El tipo de la tarjeta es una lectura comercial, no un dictamen.
          </p>
        </div>
      </div>

      {result.flags.map((flag) => (
        <section key={flag.id} className={`${styles.card} ${styles.flag}`}>
          <h3>Área de atención prioritaria · {flag.title}</h3>
          <p>{flag.message}</p>
        </section>
      ))}

      {critical ? (
        <p className={styles.disclaimer}>Un puntaje alto no elimina una alerta de privacidad o de IA.</p>
      ) : null}

      {result.strengths.length > 0 ? (
        <section className={styles.card}>
          <h3>Tus fortalezas</h3>
          <ul className={styles.list}>
            {result.strengths.map((item) => (
              <li key={item.id}>
                <span>
                  <strong>{item.short}</strong>
                </span>
                <span>
                  {item.points}/{item.max}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {result.opportunities.length > 0 ? (
        <section className={styles.card}>
          <h3>Tus oportunidades</h3>
          <ul className={styles.list}>
            {result.opportunities.map((item) => (
              <li key={item.id}>
                <span>
                  <strong>{item.short}</strong>
                </span>
                <span>
                  {item.points}/{item.max}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {result.priority ? (
        <section className={styles.card}>
          <h3>Tu siguiente prioridad</h3>
          <p>{result.priority.action}</p>
        </section>
      ) : null}

      <section className={styles.card}>
        <h3>Tus 10 áreas</h3>
        <ul className={styles.bars}>
          {result.scores.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`${styles.barRow} ${item.id === result.priority?.id ? styles.barFocus : ""}`}
                onClick={() => onEdit(item.id)}
                aria-label={`${item.area}: ${item.points} de 4. Corregir.`}
              >
                <span className={styles.barLabel}>{item.short}</span>
                <span className={styles.barTrack}>
                  <span className={styles.barFill} style={{ width: `${(item.points / item.max) * 100}%` }} />
                </span>
                <span className={styles.barValue}>
                  {item.points}/{item.max}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {result.offer ? (
        <section className={styles.card}>
          <h3>{result.offer.title}</h3>
          <p>{result.offer.description}</p>
          {result.opportunities.length > 0 ? (
            <div className={styles.chips}>
              {result.opportunities.map((item) => (
                <span key={item.id} className={styles.chip}>
                  {item.short}
                </span>
              ))}
            </div>
          ) : null}
          <a className={styles.link} href={result.offer.href} target="_blank" rel="noopener noreferrer">
            {result.offer.linkLabel}
            <span className="sr-only"> (abre otra pestaña)</span>
          </a>
        </section>
      ) : null}

      <p className={styles.disclaimer}>
        Orientación de prácticas autodeclaradas. No es un diagnóstico clínico, una auditoría de privacidad ni una
        habilitación para el Portal. Recargar la página borra este intento. Nada de esto se envía al servidor por
        defecto.
      </p>

      <ShareInviteButton draft={readinessShareDraft(result)} />

      <button type="button" className={styles.restart} onClick={onRestart}>
        Empezar de nuevo
      </button>
    </article>
  )
}
