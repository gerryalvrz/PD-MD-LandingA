import type { Metadata } from "next"
import Link from "next/link"
import { CANONICAL_SITE_URL, LANDING_META } from "@/content/landing"
import { MEMBRESIA_GUIDE, MEMBRESIA_GUIDE_PATH } from "@/content/membresia-guide"
import { ACCENT, T } from "@/lib/landing-theme"
import { getSiteUrl } from "@/lib/site-url"

const siteUrl = getSiteUrl()
const tok = T.dark

export const metadata: Metadata = {
  title: MEMBRESIA_GUIDE.title,
  description: MEMBRESIA_GUIDE.description,
  alternates: { canonical: MEMBRESIA_GUIDE_PATH },
  robots: { index: true, follow: true },
  openGraph: {
    type: "article",
    locale: "es_MX",
    url: MEMBRESIA_GUIDE_PATH,
    siteName: LANDING_META.orgName,
    title: MEMBRESIA_GUIDE.title,
    description: MEMBRESIA_GUIDE.description,
  },
  twitter: {
    card: "summary",
    title: MEMBRESIA_GUIDE.title,
    description: MEMBRESIA_GUIDE.description,
  },
}

function GuideJsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${siteUrl}${MEMBRESIA_GUIDE_PATH}#article`,
        headline: MEMBRESIA_GUIDE.title,
        description: MEMBRESIA_GUIDE.description,
        inLanguage: "es",
        isAccessibleForFree: true,
        mainEntityOfPage: `${siteUrl}${MEMBRESIA_GUIDE_PATH}`,
        author: {
          "@type": "Organization",
          name: LANDING_META.orgName,
          url: CANONICAL_SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: LANDING_META.orgName,
          url: CANONICAL_SITE_URL,
          logo: `${siteUrl}/logo.svg`,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}${MEMBRESIA_GUIDE_PATH}#faq`,
        url: `${siteUrl}${MEMBRESIA_GUIDE_PATH}`,
        mainEntity: MEMBRESIA_GUIDE.faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: MEMBRESIA_GUIDE.title,
            item: `${siteUrl}${MEMBRESIA_GUIDE_PATH}`,
          },
        ],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}

export default function GuiaMembresiaPage() {
  return (
    <>
      <GuideJsonLd />
      <main
        lang="es"
        style={{
          minHeight: "100vh",
          background: tok.bg,
          color: tok.t1,
          padding: "48px 20px 80px",
        }}
      >
        <article style={{ maxWidth: 720, margin: "0 auto" }}>
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
            {MEMBRESIA_GUIDE.updatedLabel}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-jura)",
              fontWeight: 700,
              fontSize: "clamp(28px, 5vw, 40px)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            {MEMBRESIA_GUIDE.title}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: 17,
              lineHeight: 1.65,
              color: tok.t2,
              marginBottom: 28,
            }}
          >
            {MEMBRESIA_GUIDE.intro}
          </p>

          <nav aria-label="En esta guía" style={{ marginBottom: 36 }}>
            <ul
              style={{
                listStyle: "none",
                display: "grid",
                gap: 8,
                padding: 0,
                margin: 0,
                fontFamily: "var(--font-inter)",
                fontSize: 14,
              }}
            >
              {MEMBRESIA_GUIDE.sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} style={{ color: ACCENT.lilac, textDecoration: "none" }}>
                    {section.heading}
                  </a>
                </li>
              ))}
              <li>
                <a href="#faq" style={{ color: ACCENT.lilac, textDecoration: "none" }}>
                  Preguntas frecuentes
                </a>
              </li>
            </ul>
          </nav>

          {MEMBRESIA_GUIDE.sections.map((section) => (
            <section key={section.id} id={section.id} style={{ marginBottom: 36, scrollMarginTop: 24 }}>
              <h2
                style={{
                  fontFamily: "var(--font-jura)",
                  fontWeight: 700,
                  fontSize: 24,
                  marginBottom: 12,
                  letterSpacing: "-0.02em",
                }}
              >
                {section.heading}
              </h2>
              {"paragraphs" in section &&
                section.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph}
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: 16,
                      lineHeight: 1.65,
                      color: tok.t2,
                      marginBottom: 12,
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              {"bullets" in section && section.bullets && (
                <ul
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: 16,
                    lineHeight: 1.65,
                    color: tok.t2,
                    paddingLeft: 22,
                    display: "grid",
                    gap: 8,
                    margin: 0,
                  }}
                >
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section id="faq" style={{ marginBottom: 40, scrollMarginTop: 24 }}>
            <h2
              style={{
                fontFamily: "var(--font-jura)",
                fontWeight: 700,
                fontSize: 24,
                marginBottom: 16,
                letterSpacing: "-0.02em",
              }}
            >
              Preguntas frecuentes
            </h2>
            <div style={{ display: "grid", gap: 14 }}>
              {MEMBRESIA_GUIDE.faqs.map((item) => (
                <div key={item.question}>
                  <h3
                    style={{
                      fontFamily: "var(--font-jura)",
                      fontWeight: 700,
                      fontSize: 17,
                      marginBottom: 6,
                    }}
                  >
                    {item.question}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: 15,
                      lineHeight: 1.6,
                      color: tok.t2,
                      margin: 0,
                    }}
                  >
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            style={{
              borderTop: `1px solid ${tok.cardBorder}`,
              paddingTop: 24,
              display: "grid",
              gap: 12,
            }}
          >
            <p style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: tok.t3, margin: 0 }}>
              Contacto: {MEMBRESIA_GUIDE.contact} · {MEMBRESIA_GUIDE.org}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {MEMBRESIA_GUIDE.ctas.map((cta) => {
                const external = cta.href.startsWith("http")
                if (external) {
                  return (
                    <a
                      key={cta.href}
                      href={cta.href}
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: 14,
                        fontWeight: 600,
                        color: ACCENT.iris,
                      }}
                    >
                      {cta.label}
                    </a>
                  )
                }
                return (
                  <Link
                    key={cta.href}
                    href={cta.href}
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: 14,
                      fontWeight: 600,
                      color: ACCENT.iris,
                    }}
                  >
                    {cta.label}
                  </Link>
                )
              })}
            </div>
          </section>
        </article>
      </main>
    </>
  )
}
