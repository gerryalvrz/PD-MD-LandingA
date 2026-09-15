import {
  LANDING_FAQS,
  LANDING_META,
  LANDING_OFFERS,
} from "@/content/landing"
import { getSiteUrl } from "@/lib/site-url"

export function LandingJsonLd() {
  const siteUrl = getSiteUrl()

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: LANDING_META.orgName,
        url: siteUrl,
        email: LANDING_META.orgEmail,
        logo: `${siteUrl}/logo.svg`,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: LANDING_META.title,
        description: LANDING_META.description,
        inLanguage: "es",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${siteUrl}/#webpage`,
        url: siteUrl,
        name: LANDING_META.title,
        description: LANDING_META.description,
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": `${siteUrl}/#organization` },
        inLanguage: "es",
        primaryImageOfPage: `${siteUrl}/MAsterclass3.avif`,
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        url: siteUrl,
        mainEntity: LANDING_FAQS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      {
        "@type": "Offer",
        "@id": `${siteUrl}/#offer-membership-monthly`,
        name: LANDING_OFFERS.membershipMonthly.name,
        url: `${siteUrl}/#membresia`,
        price: LANDING_OFFERS.membershipMonthly.price,
        priceCurrency: LANDING_OFFERS.membershipMonthly.currency,
        availability: "https://schema.org/InStock",
        seller: { "@id": `${siteUrl}/#organization` },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: LANDING_OFFERS.membershipMonthly.price,
          priceCurrency: LANDING_OFFERS.membershipMonthly.currency,
          billingDuration: "P1M",
        },
      },
      {
        "@type": "Offer",
        "@id": `${siteUrl}/#offer-membership-annual`,
        name: LANDING_OFFERS.membershipAnnual.name,
        url: `${siteUrl}/#membresia`,
        price: LANDING_OFFERS.membershipAnnual.price,
        priceCurrency: LANDING_OFFERS.membershipAnnual.currency,
        availability: "https://schema.org/InStock",
        seller: { "@id": `${siteUrl}/#organization` },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: LANDING_OFFERS.membershipAnnual.price,
          priceCurrency: LANDING_OFFERS.membershipAnnual.currency,
          billingDuration: "P1Y",
        },
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
