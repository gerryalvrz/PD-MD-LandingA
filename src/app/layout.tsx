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

export const metadata: Metadata = {
  title: "Técnica Avanzada en Psicoterapia — MotusDAO",
  description:
    "El programa que integra análisis clínico avanzado e inteligencia artificial para psicólogos que lideran la psicología digital.",
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
