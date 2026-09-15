import type { Metadata } from "next"
import { Jura, Inter, Geist } from "next/font/google"
import "./globals.css"
import ConvexClientProvider from "@/components/ConvexClientProvider"
import { MottyWidget } from "@/components/motty/MottyWidget"
import { LANDING_META } from "@/content/landing"
import { getSiteUrl } from "@/lib/site-url"
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const jura = Jura({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-jura",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
})

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: LANDING_META.title,
  description: LANDING_META.description,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "/",
    siteName: LANDING_META.orgName,
    title: LANDING_META.title,
    description: LANDING_META.description,
    images: ["/MAsterclass3.avif"],
  },
  twitter: {
    card: "summary_large_image",
    title: LANDING_META.title,
    description: LANDING_META.description,
    images: ["/MAsterclass3.avif"],
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      data-landing-theme="dark"
      className={cn(jura.variable, inter.variable, "font-sans", geist.variable)}
    >
      <body>
        <ConvexClientProvider>
          {children}
          <MottyWidget />
        </ConvexClientProvider>
      </body>
    </html>
  )
}
