import type { Metadata } from "next"
import { Jura, Inter, Geist } from "next/font/google"
import "./globals.css"
import ConvexClientProvider from "@/components/ConvexClientProvider"
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "MotusDAO — Membresía y ruta profesional para psicólogos",
  description:
    "Recursos, formación y comunidad para tu práctica digital. Conoce la membresía desde USD 20/mes y la ruta de cinco bloques hacia el Portal Clínico de MotusDAO.",
  openGraph: {
    images: ["/MAsterclass3.avif"],
  },
  twitter: {
    card: "summary_large_image",
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
    <html lang="es" className={cn(jura.variable, inter.variable, "font-sans", geist.variable)}>
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  )
}
