"use client"

import { FormEvent, type CSSProperties, useEffect, useMemo, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { marked } from "marked"
import { api } from "../../../convex/_generated/api"
import { renderTemplateString } from "../../../convex/emailTemplateDefaults"

type TemplateItem = {
  key: string
  subject: string
  text: string
  html: string
  markdown: string
  source: "db" | "default"
  updatedAt: number | null
}

export default function EditorPage() {
  const templates = useQuery(api.emailTemplates.list)
  const upsertTemplate = useMutation(api.emailTemplates.upsert)

  const [selectedKey, setSelectedKey] = useState<string>("")
  const [subject, setSubject] = useState("")
  const [text, setText] = useState("")
  const [html, setHtml] = useState("")
  const [markdown, setMarkdown] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const selectedTemplate = useMemo(() => {
    if (!templates || !selectedKey) return null
    return (templates as TemplateItem[]).find((template) => template.key === selectedKey) ?? null
  }, [templates, selectedKey])

  useEffect(() => {
    if (!templates || templates.length === 0) return
    if (!selectedKey) {
      setSelectedKey(templates[0].key)
      return
    }
    const stillExists = templates.some((template) => template.key === selectedKey)
    if (!stillExists) {
      setSelectedKey(templates[0].key)
    }
  }, [templates, selectedKey])

  useEffect(() => {
    if (!selectedTemplate) return
    setSubject(selectedTemplate.subject ?? "")
    setText(selectedTemplate.text ?? "")
    setHtml(selectedTemplate.html ?? "")
    setMarkdown(selectedTemplate.markdown ?? "")
    setStatusMessage(null)
  }, [selectedTemplate])

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedKey) return
    setIsSaving(true)
    setStatusMessage(null)
    try {
      await upsertTemplate({
        key: selectedKey,
        subject,
        text,
        html,
        markdown,
      })
      setStatusMessage("Guardado.")
    } catch (error) {
      console.error("[/editor] Failed to save email template", error)
      setStatusMessage("No se pudo guardar. Revisa la consola.")
    } finally {
      setIsSaving(false)
    }
  }

  if (!templates) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>Cargando plantillas...</div>
      </main>
    )
  }

  const previewVars: Record<string, string> = {
    nombre: "Dra. Ana Perez",
    email: "ana@example.com",
    whatsapp: "+54 11 1111 1111",
    interes: "programa",
    sessionId: "session_demo_123",
    leadId: "lead_demo_123",
    utmSource: "instagram",
    utmMedium: "cpc",
    utmCampaign: "masterclass_abril",
    utmContent: "video_a",
    utmTerm: "psicoterapia ia",
    referrer: "https://www.google.com",
    checkoutUrl: "https://www.motusdao.org/checkout",
    calendlyUrl: "https://calendly.com/motusdao/demo",
  }
  const previewSubject = renderTemplateString(subject, previewVars)
  const previewText = renderTemplateString(text, previewVars)
  const previewHtmlFromHtml = renderTemplateString(html, previewVars)
  const previewMarkdown = renderTemplateString(markdown, previewVars)
  const previewHtmlFromMarkdown = previewMarkdown.trim() ? marked.parse(previewMarkdown) : ""
  const previewHtml = previewHtmlFromHtml.trim() ? previewHtmlFromHtml : previewHtmlFromMarkdown

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Editor de plantillas de email</h1>
        <p style={styles.subtitle}>
          Variables disponibles (usa llaves dobles): {"{{nombre}}"}, {"{{email}}"}, {"{{whatsapp}}"},{" "}
          {"{{interes}}"}, {"{{sessionId}}"}, {"{{leadId}}"}, {"{{utmSource}}"}, {"{{utmMedium}}"},{" "}
          {"{{utmCampaign}}"}, {"{{utmContent}}"}, {"{{utmTerm}}"}, {"{{referrer}}"}, {"{{checkoutUrl}}"},{" "}
          {"{{calendlyUrl}}"}.
        </p>

        <div style={styles.grid}>
          <aside style={styles.sidebar}>
            <h2 style={styles.sectionTitle}>Plantillas</h2>
            {templates.map((template) => {
              const isSelected = template.key === selectedKey
              return (
                <button
                  key={template.key}
                  type="button"
                  onClick={() => setSelectedKey(template.key)}
                  style={{
                    ...styles.templateButton,
                    ...(isSelected ? styles.templateButtonSelected : {}),
                  }}
                >
                  <div style={styles.templateButtonTop}>
                    <span style={styles.templateKey}>{template.key}</span>
                    <span style={styles.sourceBadge}>{template.source}</span>
                  </div>
                  <div style={styles.templateSubject}>{template.subject}</div>
                </button>
              )
            })}
          </aside>

          <section style={styles.editor}>
            {selectedTemplate ? (
              <form onSubmit={handleSave} style={styles.form}>
                <label style={styles.label}>
                  Subject
                  <input
                    style={styles.input}
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    required
                  />
                </label>

                <label style={styles.label}>
                  Text
                  <textarea
                    style={styles.textarea}
                    rows={10}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                  />
                </label>

                <label style={styles.label}>
                  Markdown
                  <textarea
                    style={styles.textarea}
                    rows={10}
                    value={markdown}
                    onChange={(event) => setMarkdown(event.target.value)}
                  />
                </label>

                <label style={styles.label}>
                  HTML
                  <textarea
                    style={styles.textarea}
                    rows={14}
                    value={html}
                    onChange={(event) => setHtml(event.target.value)}
                  />
                </label>

                <div style={styles.actions}>
                  <button type="submit" disabled={isSaving} style={styles.saveButton}>
                    {isSaving ? "Guardando..." : "Guardar plantilla"}
                  </button>
                  {statusMessage ? <span style={styles.status}>{statusMessage}</span> : null}
                </div>
              </form>
            ) : (
              <div>Selecciona una plantilla.</div>
            )}

            {selectedTemplate ? (
              <div style={styles.preview}>
                <h3 style={styles.previewTitle}>Preview</h3>
                <p style={styles.previewLabel}>Subject</p>
                <div style={styles.previewCard}>{previewSubject}</div>

                <p style={styles.previewLabel}>Text</p>
                <pre style={styles.previewPre}>{previewText || "(vacio)"}</pre>

                <p style={styles.previewLabel}>Markdown render</p>
                <div
                  style={styles.previewCard}
                  dangerouslySetInnerHTML={{ __html: previewHtmlFromMarkdown || "<em>(vacio)</em>" }}
                />

                <p style={styles.previewLabel}>HTML render</p>
                <div
                  style={styles.previewCard}
                  dangerouslySetInnerHTML={{ __html: previewHtml || "<em>(vacio)</em>" }}
                />
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0E0A1A",
    color: "rgba(255,255,255,0.92)",
    padding: "24px",
    fontFamily: "var(--font-inter), system-ui, sans-serif",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  title: {
    margin: 0,
    fontSize: "clamp(24px, 3.2vw, 34px)",
    fontFamily: "var(--font-jura), system-ui, sans-serif",
  },
  subtitle: {
    marginTop: "10px",
    marginBottom: "20px",
    color: "rgba(255,255,255,0.7)",
    lineHeight: 1.45,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "340px 1fr",
    gap: "18px",
  },
  sidebar: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "14px",
    padding: "14px",
    height: "fit-content",
  },
  sectionTitle: {
    margin: 0,
    marginBottom: "10px",
    fontSize: "16px",
  },
  templateButton: {
    width: "100%",
    textAlign: "left",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.02)",
    color: "rgba(255,255,255,0.92)",
    padding: "10px",
    marginBottom: "8px",
    cursor: "pointer",
  },
  templateButtonSelected: {
    border: "1px solid rgba(147,51,234,0.8)",
    background: "rgba(147,51,234,0.15)",
  },
  templateButtonTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "8px",
    marginBottom: "6px",
  },
  templateKey: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: "12px",
    color: "rgba(255,255,255,0.75)",
  },
  sourceBadge: {
    fontSize: "11px",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: "999px",
    padding: "2px 8px",
    color: "rgba(255,255,255,0.75)",
  },
  templateSubject: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.95)",
  },
  editor: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "14px",
    padding: "16px",
  },
  form: {
    display: "grid",
    gap: "12px",
  },
  label: {
    display: "grid",
    gap: "6px",
    fontSize: "13px",
    color: "rgba(255,255,255,0.8)",
  },
  input: {
    width: "100%",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.02)",
    color: "rgba(255,255,255,0.95)",
    padding: "10px 12px",
    fontSize: "14px",
  },
  textarea: {
    width: "100%",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.02)",
    color: "rgba(255,255,255,0.95)",
    padding: "10px 12px",
    fontSize: "14px",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    resize: "vertical",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  saveButton: {
    border: "none",
    borderRadius: "10px",
    padding: "10px 14px",
    background: "linear-gradient(to right, #9333EA, #EC4899)",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  },
  status: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.78)",
  },
  preview: {
    marginTop: "18px",
    borderTop: "1px solid rgba(255,255,255,0.12)",
    paddingTop: "14px",
  },
  previewTitle: {
    margin: 0,
    marginBottom: "10px",
    fontSize: "16px",
  },
  previewLabel: {
    margin: "8px 0 6px",
    fontSize: "12px",
    color: "rgba(255,255,255,0.72)",
  },
  previewCard: {
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.02)",
    padding: "10px 12px",
    color: "rgba(255,255,255,0.95)",
    lineHeight: 1.45,
  },
  previewPre: {
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.02)",
    padding: "10px 12px",
    color: "rgba(255,255,255,0.95)",
    margin: 0,
    whiteSpace: "pre-wrap",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: "13px",
    lineHeight: 1.5,
  },
}
