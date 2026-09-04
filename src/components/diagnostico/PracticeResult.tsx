"use client"

import {
  MIN_NUMERIC_COVERAGE,
  QUESTIONS,
  type Answers,
  type AnswerValue,
  type PracticeResult,
  type PriorityMode,
  type QuestionId,
} from "@/lib/practice-index"
import { ShareInviteButton } from "@/components/share/ShareModal"
import { PsychologistTypeCard } from "@/components/share/PsychologistTypeCard"
import { practiceShareDraft } from "@/lib/share-card"
import { psychologistTypeFromPractice } from "@/lib/psychologist-types"
import styles from "./PracticeResult.module.css"

const LEVEL_LABEL: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "Aún no está definido",
  1: "Lo estás definiendo",
  2: "Ya lo estás probando",
  3: "Ya lo usas con regularidad",
  4: "Ya lo revisaste y ajustaste",
}

const MODE_LABEL: Record<PriorityMode, string> = {
  start: "Conviene empezar aquí",
  develop: "Conviene desarrollarlo",
  review: "Conviene revisarlo",
  maintain: "Conviene mantenerlo",
}

function numericValue(value: AnswerValue | undefined): 0 | 1 | 2 | 3 | 4 | null {
  return typeof value === "number" ? value : null
}

function omissionLabel(value: AnswerValue | undefined): string {
  if (value === "UNKNOWN") return "No lo sé"
  if (value === "NA") return "No aplica"
  if (value === "SKIP") return "Omitida"
  return "—"
}

function CoverageRing({ value, total }: { value: number; total: number }) {
  const size = 72
  const stroke = 7
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(value / total, 1)
  return (
    <svg className={styles.ring} width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#mpiRing)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - progress)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <defs>
        <linearGradient id="mpiRing" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function PracticeResultView({
  result,
  answers,
  onEdit,
  onRestart,
}: {
  result: PracticeResult
  answers: Answers
  onEdit: (id?: QuestionId) => void
  onRestart: () => void
}) {
  const ready = result.status === "ready" && result.priority
  const focus = result.priority
  const focusLevel = focus ? (focus.level as 0 | 1 | 2 | 3 | 4) : null
  const establishedLevel = result.established ? numericValue(answers[result.established.questionId]) : null
  const remaining = Math.max(MIN_NUMERIC_COVERAGE - result.numericCount, 0)
  const persona = psychologistTypeFromPractice(result)
  const heading = persona ? persona.title : ready ? `Siguiente paso: ${focus!.title}` : "Todavía no hay un foco claro"

  return (
    <article className={styles.wrap}>
      <p className={styles.eyebrow}>{persona ? "Tu tipo" : "Tu mapa de práctica"}</p>
      {persona ? <PsychologistTypeCard type={persona} /> : null}
      <h1 className={persona ? "sr-only" : styles.heading}>{heading}</h1>
      {persona ? null : (
      <p className={styles.lede}>
        {ready
          ? "No es una calificación ni un diagnóstico. Es el área que tus respuestas marcan para ordenar ahora."
          : `Respondiste ${result.numericCount} de ${QUESTIONS.length} áreas. Se necesitan al menos ${MIN_NUMERIC_COVERAGE} para señalar una prioridad.`}
      </p>
      )}

      <div className={styles.stats}>
        <div className={`${styles.stat} ${styles.statFocus}`}>
          <span className={styles.statLabel}>{ready ? "Nivel del foco" : "Cobertura"}</span>
          <span className={styles.statValue}>
            {ready ? (
              <>
                {focusLevel}
                <span>/4</span>
              </>
            ) : (
              <>
                {result.numericCount}
                <span>/{QUESTIONS.length}</span>
              </>
            )}
          </span>
          <span className={styles.statHint}>
            {ready && focus && focusLevel !== null
              ? `${MODE_LABEL[focus.mode]}. ${LEVEL_LABEL[focusLevel]}.`
              : remaining > 0
                ? `Faltan ${remaining} respuestas concretas.`
                : "Hay suficientes respuestas, pero no un foco."}
          </span>
        </div>

        <div className={styles.stat}>
          <span className={styles.statLabel}>Áreas con respuesta</span>
          <div className={styles.ringWrap}>
            <CoverageRing value={result.numericCount} total={QUESTIONS.length} />
            <div>
              <span className={styles.statValue}>
                {result.numericCount}
                <span>/{QUESTIONS.length}</span>
              </span>
              <span className={styles.statHint}>Cada una cuenta de 0 a 4. No se suman.</span>
            </div>
          </div>
        </div>

        <div className={styles.stat}>
          <span className={styles.statLabel}>Más consolidada</span>
          <span className={styles.statValue}>
            {establishedLevel !== null ? (
              <>
                {establishedLevel}
                <span>/4</span>
              </>
            ) : (
              <>
                —
                <span>/4</span>
              </>
            )}
          </span>
          <span className={styles.statHint}>
            {result.established ? result.established.area : "Ninguna llegó a un uso habitual (3 o 4)."}
          </span>
        </div>
      </div>

      {focus ? (
        <section className={styles.card}>
          <h3>Por qué sale esta área</h3>
          <p className={styles.why}>
            En {focus.area.toLowerCase()} respondiste <strong>{focus.level} de 4</strong>
            : “{focus.answerLabel.replace(/\.$/, "")}”. {MODE_LABEL[focus.mode]}.
          </p>
          {result.alternative ? (
            <p className={styles.note}>
              Casi empataba {result.alternative.area.toLowerCase()} ({result.alternative.answerLabel}).
            </p>
          ) : null}
        </section>
      ) : (
        <section className={styles.card}>
          <h3>Aún no se puede elegir un foco</h3>
          <p>
            Las respuestas omitidas, “no lo sé” o “no aplica” no cuentan como nivel. Completa al menos{" "}
            {MIN_NUMERIC_COVERAGE} áreas para obtener una prioridad.
          </p>
        </section>
      )}

      <section className={styles.card}>
        <h3>Tus 10 áreas</h3>
        <p className={styles.legend}>
          0 = todavía no · 4 = ya lo revisaste. La barra rosa es el foco. Toca una fila para corregirla.
        </p>
        <ul className={styles.bars}>
          {QUESTIONS.map((question) => {
            const value = answers[question.id]
            const level = numericValue(value)
            const isFocus = question.id === focus?.questionId
            const width = level === null ? 0 : (level / 4) * 100
            return (
              <li key={question.id}>
                <button
                  type="button"
                  className={`${styles.barRow} ${isFocus ? styles.barFocus : ""}`}
                  onClick={() => onEdit(question.id)}
                  aria-label={
                    level === null
                      ? `${question.area}: ${omissionLabel(value)}. Corregir.`
                      : `${question.area}: ${level} de 4. ${LEVEL_LABEL[level]}. Corregir.`
                  }
                >
                  <span className={styles.barLabel}>{question.area}</span>
                  <span className={`${styles.barTrack} ${level === null ? styles.barEmpty : ""}`}>
                    <span className={styles.barFill} style={{ width: `${width}%` }} />
                  </span>
                  <span className={styles.barValue}>{level === null ? "—" : `${level}/4`}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.card}>
        <h3>{ready ? "Qué puedes hacer ahora" : "Mientras tanto"}</h3>
        <ol className={styles.actions}>
          {result.actions.map((action, index) => (
            <li key={action} className={styles.action}>
              <span className={styles.actionIndex} aria-hidden>
                {index + 1}
              </span>
              <span>{action}</span>
            </li>
          ))}
        </ol>
      </section>

      {result.recommendation ? (
        <section className={styles.card}>
          <h3>{result.recommendation.title}</h3>
          <p>{result.recommendation.description}</p>
          <a
            className={styles.link}
            href={result.recommendation.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {result.recommendation.linkLabel}
            <span className="sr-only"> (abre otra pestaña)</span>
          </a>
        </section>
      ) : null}

      {result.unorientedAreas.length > 0 ? (
        <p className={styles.disclaimer}>
          Este resultado no orienta sobre:
          <span className={styles.chips}>
            {result.unorientedAreas.map((area) => (
              <span key={area} className={styles.chip}>
                {area}
              </span>
            ))}
          </span>
        </p>
      ) : null}

      <p className={styles.disclaimer}>
        No hay un puntaje total de 0 a 100: cada área se lee sola. Recargar la página borra este intento. Nada de esto se
        envía al servidor por defecto.
      </p>

      <ShareInviteButton draft={practiceShareDraft(result)} />

      <button type="button" className={styles.restart} onClick={onRestart}>
        Empezar de nuevo
      </button>
    </article>
  )
}