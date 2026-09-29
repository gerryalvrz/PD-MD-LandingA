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

/**
 * Server-rendered semantic document for crawlers/agents.
 * Kept in the DOM (not display:none / opacity:0 / hidden) via a 0-height clip
 * so extractors that ignore CSS still receive structured copy; the interactive
 * UI in LandingPage remains the visual experience.
 */
export function LandingSemanticShell() {
  const assessment = LANDING_ASSESSMENT_COPY[LANDING_ASSESSMENT]

  return (
    <article
      className="landing-semantic-shell"
      lang="es"
      aria-label="Contenido MotusDAO para indexación"
      data-agent-document="true"
    >
      <header>
        <p>{LANDING_META.audience}</p>
        <h1>{LANDING_META.headline}</h1>
        <p>{LANDING_META.lede}</p>
        <p>{LANDING_META.priceLine}</p>
        <p>
          {LANDING_META.savingsBadge}
        </p>
        <p>
          <a href={`${CANONICAL_SITE_URL}/#membresia`}>{LANDING_CTAS.membership.label}</a>
          {" · "}
          <a href={`${CANONICAL_SITE_URL}${landingAssessmentPath()}`}>{LANDING_CTAS.assessment.label}</a>
          {" · "}
          <a href={`${CANONICAL_SITE_URL}/SKILL.md`}>Brief para asistentes</a>
        </p>
      </header>

      <section aria-label="Beneficios">
        <h2>Formación, IA, pagos y comunidad</h2>
        {LANDING_TRUST.map((item) => (
          <div key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </section>

      <section aria-label={LANDING_JOURNEY.heading}>
        <h2>{LANDING_JOURNEY.heading}</h2>
        <p>{LANDING_JOURNEY.lede}</p>
        <div>
          <h3>{LANDING_JOURNEY.dualPath.community.audience}</h3>
          <p>{LANDING_JOURNEY.dualPath.community.title}</p>
          <ol>
            {LANDING_JOURNEY.dualPath.community.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p>
            <a href={`${CANONICAL_SITE_URL}/#membresia`}>
              {LANDING_JOURNEY.dualPath.community.primaryCta.label}
            </a>
          </p>
          <p>
            <a href={LANDING_JOURNEY.dualPath.community.secondaryCta.href}>
              {LANDING_JOURNEY.dualPath.community.secondaryCta.label}
            </a>
          </p>
        </div>
        <div>
          <h3>{LANDING_JOURNEY.dualPath.professional.audience}</h3>
          <p>{LANDING_JOURNEY.dualPath.professional.title}</p>
          <ol>
            {LANDING_JOURNEY.dualPath.professional.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p>
            <a href={LANDING_JOURNEY.dualPath.professional.primaryCta.href}>
              {LANDING_JOURNEY.dualPath.professional.primaryCta.label}
            </a>
          </p>
        </div>
        <p>{LANDING_JOURNEY.dualPath.convergenceLabel}</p>
        <ol>
          {LANDING_JOURNEY.dualPath.convergenceSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p>{LANDING_JOURNEY.dualPath.microcopy}</p>
        <h3>{LANDING_JOURNEY.stagesHeading}</h3>
        <p>{LANDING_JOURNEY.stagesLede}</p>
        <ol>
          {LANDING_JOURNEY.stages.map((stage) => (
            <li key={stage.label}>
              <strong>{stage.label}</strong> — {stage.line}{" "}
              <a href={stage.href.startsWith("#") ? `${CANONICAL_SITE_URL}/${stage.href}` : stage.href}>
                {stage.cta}
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section aria-label={LANDING_MEMBERSHIP.heading}>
        <h2>{LANDING_MEMBERSHIP.heading}</h2>
        <p>{LANDING_MEMBERSHIP.lede}</p>
        <article>
          <h3>{LANDING_MEMBERSHIP.community.title}</h3>
          <p>
            {LANDING_MEMBERSHIP.community.priceMonthlyLabel}
            {LANDING_MEMBERSHIP.community.priceMonthlySuffix} o{" "}
            {LANDING_MEMBERSHIP.community.priceAnnual}
          </p>
          <ul>
            {LANDING_MEMBERSHIP.community.includes.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>{LANDING_MEMBERSHIP.invitation.title}</h3>
          <p>
            {LANDING_MEMBERSHIP.invitation.priceMonthlyLabel}
            {LANDING_MEMBERSHIP.invitation.priceMonthlySuffix} o{" "}
            {LANDING_MEMBERSHIP.invitation.priceAnnual}
          </p>
          <p>{LANDING_MEMBERSHIP.invitation.body}</p>
          <p>
            <a href="https://app.motusdao.org/registro">{LANDING_MEMBERSHIP.invitation.ctaLabel}</a>
          </p>
          <p>
            <a href="mailto:contact@motusdao.org">{LANDING_MEMBERSHIP.invitation.secondaryCtaLabel}</a>
          </p>
        </article>
        <p>{LANDING_MEMBERSHIP.praxisNote}</p>
      </section>

      <section aria-label={assessment.heading}>
        <h2>{assessment.heading}</h2>
        <p>{assessment.lede}</p>
        <p>
          <a href={`${CANONICAL_SITE_URL}${landingAssessmentPath()}`}>{LANDING_CTAS.assessment.label}</a>
        </p>
      </section>

      <section aria-label="Preguntas frecuentes">
        <h2>Preguntas frecuentes</h2>
        {LANDING_FAQS.map((item) => (
          <div key={item.question}>
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </div>
        ))}
      </section>

      <section aria-label={LANDING_FINAL.heading}>
        <h2>{LANDING_FINAL.heading}</h2>
        <p>{LANDING_FINAL.lede}</p>
        <p>{LANDING_FINAL.priceLine}</p>
        <p>
          {LANDING_FINAL.savingsBadge}
        </p>
      </section>

      <footer>
        <h2>Límites</h2>
        <ul>
          {LANDING_NON_CLAIMS.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
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
        <p>
          {LANDING_META.footerBrand}. {LANDING_META.footerLegal}
        </p>
      </footer>
    </article>
  )
}
