import { LandingJsonLd } from "@/components/seo/LandingJsonLd"
import LandingPage from "@/components/landing/LandingPage"
import { LandingNoscriptSummary } from "@/components/landing/LandingNoscriptSummary"
import { LandingSemanticShell } from "@/components/landing/LandingSemanticShell"

export default function HomePage() {
  return (
    <>
      <LandingJsonLd />
      <LandingNoscriptSummary />
      <LandingSemanticShell />
      <LandingPage />
    </>
  )
}
