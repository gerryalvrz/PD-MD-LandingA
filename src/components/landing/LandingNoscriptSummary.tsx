import {
  CANONICAL_SITE_URL,
  LANDING_CTAS,
  LANDING_FAQS,
  LANDING_FINAL,
  LANDING_FOOTER,
  LANDING_JOURNEY,
  LANDING_MEMBERSHIP,
  LANDING_META,
  LANDING_NON_CLAIMS,
  LANDING_TRUST,
} from "@/content/landing"
import { LANDING_ASSESSMENT, LANDING_ASSESSMENT_COPY, landingAssessmentPath } from "@/lib/active-assessment"

/** Plain HTML for agents/browsers without JavaScript. */
export function LandingNoscriptSummary() {
  const assessment = LANDING_ASSESSMENT_COPY[LANDING_ASSESSMENT]

  return (
    <noscript>
      <article
        lang="es"
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: 24,
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1.55,
          color: "#0E0A1A",
          background: "#F0ECF9",
        }}
      >
        <p style={{ textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 12 }}>{LANDING_META.audience}</p>
        <h1>{LANDING_META.headline}</h1>
        <p>{LANDING_META.lede}</p>
        <p>
          <strong>{LANDING_META.priceLine}</strong>
        </p>
        <p>
          <a href={`${CANONICAL_SITE_URL}/#membresia`}>{LANDING_CTAS.membership.label}</a>
          {" · "}
          <a href={`${CANONICAL_SITE_URL}${landingAssessmentPath()}`}>{LANDING_CTAS.assessment.label}</a>
          {" · "}
          <a href={`${CANONICAL_SITE_URL}/SKILL.md`}>Skill para agentes</a>
        </p>

        <h2>{LANDING_TRUST.map((t) => t.title).join(" · ")}</h2>
        <ul>
          {LANDING_TRUST.map((item) => (
            <li key={item.title}>
              <strong>{item.title}.</strong> {item.description}
            </li>
          ))}
        </ul>

        <h2>{LANDING_JOURNEY.heading}</h2>
        <p>{LANDING_JOURNEY.lede}</p>
        <ol>
          {LANDING_JOURNEY.stages.map((stage) => (
            <li key={stage.label}>
              <strong>{stage.label}.</strong> {stage.line}
            </li>
          ))}
        </ol>

        <h2>{LANDING_MEMBERSHIP.heading}</h2>
        <p>{LANDING_MEMBERSHIP.lede}</p>
        <h3>{LANDING_MEMBERSHIP.community.title}</h3>
        <p>
          {LANDING_MEMBERSHIP.community.priceMonthlyLabel}
          {LANDING_MEMBERSHIP.community.priceMonthlySuffix} o {LANDING_MEMBERSHIP.community.priceAnnual}
        </p>
        <ul>
          {LANDING_MEMBERSHIP.community.includes.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <h3>{LANDING_MEMBERSHIP.invitation.title}</h3>
        <p>
          {LANDING_MEMBERSHIP.invitation.priceMonthlyLabel}
          {LANDING_MEMBERSHIP.invitation.priceMonthlySuffix} o {LANDING_MEMBERSHIP.invitation.priceAnnual}
        </p>
        <p>{LANDING_MEMBERSHIP.invitation.body}</p>

        <h2>{assessment.heading}</h2>
        <p>{assessment.lede}</p>
        <p>
          <a href={`${CANONICAL_SITE_URL}${landingAssessmentPath()}`}>{LANDING_CTAS.assessment.label}</a>
        </p>

        <h2>Preguntas frecuentes</h2>
        {LANDING_FAQS.map((item) => (
          <section key={item.question}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </section>
        ))}

        <h2>{LANDING_FINAL.heading}</h2>
        <p>{LANDING_FINAL.lede}</p>
        <p>{LANDING_FINAL.priceLine}</p>

        <h2>Límites</h2>
        <ul>
          {LANDING_NON_CLAIMS.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <p>
          Canonical: <a href={CANONICAL_SITE_URL}>{CANONICAL_SITE_URL}</a>
        </p>
        <h2>Recursos</h2>
        <ul>
          {LANDING_FOOTER.resources.map((item) => (
            <li key={item.href}>
              <a href={item.external ? item.href : `${CANONICAL_SITE_URL}${item.href}`}>{item.label}</a>
            </li>
          ))}
        </ul>
        <h2>Documentación</h2>
        <ul>
          {LANDING_FOOTER.docs.map((item) => (
            <li key={item.href}>
              <a href={item.external ? item.href : `${CANONICAL_SITE_URL}${item.href}`}>{item.label}</a>
            </li>
          ))}
        </ul>
        <h2>Redes</h2>
        <ul>
          {LANDING_FOOTER.socials.map((item) => (
            <li key={item.id}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </article>
    </noscript>
  )
}
