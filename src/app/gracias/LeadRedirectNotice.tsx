"use client"

import { useEffect, useState } from "react"

export function LeadRedirectNotice({
  enabled,
  href,
  seconds = 5,
}: {
  enabled: boolean
  href: string
  seconds?: number
}) {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    if (!enabled) return

    setRemaining(seconds)
    const intervalId = window.setInterval(() => {
      setRemaining((prev) => (prev <= 1 ? 0 : prev - 1))
    }, 1000)

    const timeoutId = window.setTimeout(() => {
      window.location.href = href
    }, seconds * 1000)

    return () => {
      window.clearInterval(intervalId)
      window.clearTimeout(timeoutId)
    }
  }, [enabled, href, seconds])

  if (!enabled) return null

  return (
    <p
      style={{
        marginTop: 12,
        marginBottom: 0,
        fontFamily: "var(--font-inter)",
        fontSize: 13,
        color: "rgba(255,255,255,0.68)",
      }}
    >
      Seras redirigido a Luma en {remaining}s para completar tu registro al evento.
    </p>
  )
}
