import type { Metadata } from "next"
import { Jura, Inter } from "next/font/google"
import "./globals.css"
import ConvexClientProvider from "@/components/ConvexClientProvider"

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

export const metadata: Metadata = {
  title: "Técnica Avanzada en Psicoterapia — MotusDAO",
  description:
    "El programa que integra análisis clínico avanzado e inteligencia artificial para psicólogos que lideran la psicología digital.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${jura.variable} ${inter.variable}`}>
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  )
}
