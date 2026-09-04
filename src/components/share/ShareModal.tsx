"use client"

import { useEffect, useId, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import {
  campaignShareUrl,
  colleagueShareText,
  socialShareUrl,
  usesImageShare,
  type ShareDraft,
  type SocialNetwork,
} from "@/lib/share-card"
import { getOrCreateSessionId, getStoredLeadContext } from "@/lib/funnel-session"
import { SocialIconRow } from "@/components/ui/social-icon"
import styles from "./ShareModal.module.css"

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ")
  const lines: string[] = []
  let current = ""
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines
}

function paintCard(draft: ShareDraft, url: string): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.width = 1080
  canvas.height = 1350
  const ctx = canvas.getContext("2d")
  if (!ctx) return canvas

  const gradient = ctx.createLinearGradient(0, 0, 1080, 1350)
  gradient.addColorStop(0, "#1a1230")
  gradient.addColorStop(1, "#0e0a1a")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1080, 1350)

  ctx.fillStyle = "#c084fc"
  ctx.font = "600 28px sans-serif"
  ctx.fillText("MOTUSDAO", 80, 140)
  ctx.fillText(draft.kicker.toUpperCase(), 80, 190)

  ctx.fillStyle = "#ffffff"
  ctx.font = "700 56px sans-serif"
  let y = 320
  for (const line of wrapLines(ctx, draft.headline, 920)) {
    ctx.fillText(line, 80, y)
    y += 72
  }

  ctx.fillStyle = "rgba(255,255,255,0.72)"
  ctx.font = "400 32px sans-serif"
  y += 24
  for (const line of wrapLines(ctx, draft.detail, 920)) {
    ctx.fillText(line, 80, y)
    y += 48
  }

  ctx.fillStyle = "#ec4899"
  ctx.font = "600 30px sans-serif"
  ctx.fillText("Evalúa tu práctica", 80, 1120)
  ctx.fillStyle = "rgba(255,255,255,0.55)"
  ctx.font = "400 24px sans-serif"
  ctx.fillText("Autoevaluación orientativa · no es certificación", 80, 1180)
  ctx.fillText(url.replace(/^https?:\/\//, ""), 80, 1240)
  return canvas
}

function canvasToPngFile(canvas: HTMLCanvasElement): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("png"))
        return
      }
      resolve(new File([blob], "motus-practica-digital.png", { type: "image/png" }))
    }, "image/png")
  })
}

function canSharePayload(data: ShareData): boolean {
  return typeof navigator.canShare === "function" && navigator.canShare(data)
}

function trackShare(section: string, ctaLabel: string) {
  try {
    const sessionId = getOrCreateSessionId()
    const leadCtx = getStoredLeadContext()
    const args: {
      eventName: "cta_click" | "modal_open"
      sessionId: string
      page?: string
      section: string
      ctaLabel: string
      intent: "lead"
      metadata: Record<string, string>
      email?: string
    } = {
      eventName: section === "share_preview" ? "modal_open" : "cta_click",
      sessionId,
      page: window.location.pathname,
      section,
      ctaLabel,
      intent: "lead",
      metadata: { instrument: draftSafe(ctaLabel) },
    }
    if (leadCtx?.email) args.email = leadCtx.email
    return args
  } catch {
    return null
  }
}

function draftSafe(label: string) {
  return label.slice(0, 40)
}

export function ShareInviteButton({
  draft,
  label = "Compartir con un colega",
  full = true,
}: {
  draft: ShareDraft
  label?: string
  full?: boolean
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        style={full ? undefined : { width: "auto", marginTop: 0 }}
        onClick={() => setOpen(true)}
      >
        {label}
      </button>
      {open ? <ShareModal draft={draft} onClose={() => setOpen(false)} /> : null}
    </>
  )
}

export function ShareModal({ draft, onClose }: { draft: ShareDraft; onClose: () => void }) {
  const titleId = useId()
  const trackEvent = useMutation(api.leads.trackEvent)
  const [status, setStatus] = useState("")
  const [url, setUrl] = useState("")

  const [canShare, setCanShare] = useState(false)
  const [canShareImage, setCanShareImage] = useState(false)

  useEffect(() => {
    setUrl(campaignShareUrl(draft.path, window.location.origin))
    setCanShare(typeof navigator.share === "function")
    const probe = new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], "probe.png", { type: "image/png" })
    setCanShareImage(typeof navigator.share === "function" && canSharePayload({ files: [probe] }))
    const args = trackShare("share_preview", draft.version)
    if (args) void trackEvent(args).catch(() => {})
  }, [draft.path, draft.version, trackEvent])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  function emit(section: string) {
    const args = trackShare(section, draft.version)
    if (args) void trackEvent(args).catch(() => {})
  }

  async function copyLink() {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      emit("share_copy")
      setStatus("Enlace copiado. Copiar no prueba que se haya enviado.")
    } catch {
      setStatus("No se pudo copiar. Selecciona el enlace desde la vista previa.")
    }
  }

  async function shareImage(section: string, forStories: boolean) {
    if (!url) return false
    const file = await canvasToPngFile(paintCard(draft, url))
    const imageOnly: ShareData = { files: [file] }
    const withCaption: ShareData = { files: [file], text: colleagueShareText(draft) }
    const payloads = [imageOnly, withCaption]
    for (const payload of payloads) {
      if (!navigator.share || !canSharePayload(payload)) continue
      try {
        await navigator.share(payload)
        emit(section)
        setStatus(
          forStories
            ? "Elige Instagram → Stories o WhatsApp → Estado. Cancelar no publica nada."
            : "Se abrió el diálogo del sistema con la imagen. Cancelar no cuenta como publicación.",
        )
        return true
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          setStatus("Cancelaste el diálogo. No se registró como publicado.")
          return true
        }
      }
    }
    return false
  }

  async function nativeShare() {
    if (!url) return
    if (canShareImage && (await shareImage("share_native", false))) return
    if (!navigator.share) {
      await copyLink()
      return
    }
    try {
      await navigator.share({
        title: "MotusDAO",
        text: colleagueShareText(draft),
        url,
      })
      emit("share_native")
      setStatus("Se abrió el diálogo del sistema. Cancelar no cuenta como publicación.")
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatus("Cancelaste el diálogo. No se registró como publicado.")
        return
      }
      await copyLink()
    }
  }

  function savePng() {
    if (!url) return
    const canvas = paintCard(draft, url)
    const anchor = document.createElement("a")
    anchor.href = canvas.toDataURL("image/png")
    anchor.download = "motus-practica-digital.png"
    anchor.click()
  }

  function downloadImage() {
    savePng()
    emit("share_download")
    setStatus("Imagen descargada. En el escritorio, súbela a Stories o Estado desde la galería.")
  }

  async function openNetwork(network: SocialNetwork) {
    if (!url) return
    if (usesImageShare(network)) {
      if (canShareImage && (await shareImage("share_instagram", true))) return
      savePng()
      emit("share_instagram")
      setStatus("Imagen descargada. En el escritorio, ábrela en Instagram o WhatsApp y súbela a Stories o Estado.")
      return
    }
    const href = socialShareUrl(network, url, colleagueShareText(draft))
    if (!href) return
    emit(`share_${network}`)
    window.open(href, "_blank", "noopener,noreferrer")
    setStatus("Se abrió la red. Si cancelas allí, no se publica nada desde Motus.")
  }

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <p className={styles.kicker}>Vista previa para compartir</p>
        <h2 id={titleId} className={styles.title}>
          ¿Le serviría a un colega?
        </h2>
        <p className={styles.note}>
          El enlace no lleva tu puntaje ni tus respuestas. En el teléfono, Instagram lleva la imagen al diálogo del sistema: elige Stories o Estado. En el escritorio, descarga el PNG y súbelo a mano.
        </p>

        <div className={styles.preview}>
          <div className={styles.previewBrand}>
            <img src="/logo.svg" alt="" />
            <span>MotusDAO</span>
          </div>
          <p className={styles.previewKicker}>{draft.kicker}</p>
          <p className={styles.previewHeadline}>{draft.headline}</p>
          <p className={styles.previewDetail}>{draft.detail}</p>
          <span className={styles.previewCta}>Evalúa tu práctica</span>
        </div>

        <SocialIconRow className={styles.networks} onSelect={(network) => void openNetwork(network)} />

        <div className={styles.actions}>
          {canShare ? (
            <button type="button" className={styles.primary} onClick={() => void nativeShare()}>
              Más opciones del teléfono
            </button>
          ) : null}
          <button type="button" className={canShare ? styles.secondary : styles.primary} onClick={() => void copyLink()}>
            Copiar enlace
          </button>
          <button type="button" className={styles.secondary} onClick={downloadImage}>
            Descargar imagen
          </button>
          <button type="button" className={styles.ghost} onClick={onClose}>
            Cerrar
          </button>
        </div>
        <p className={styles.status} aria-live="polite">
          {status}
        </p>
      </div>
    </div>
  )
}
