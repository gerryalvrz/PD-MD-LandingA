"use client"

import * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const SPRING =
  "max-width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), height 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
const SMOOTH =
  "max-width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), height 0.15s ease-out"

type SpeechRecognitionLike = {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onresult: ((event: {
    resultIndex: number
    results: ArrayLike<{ isFinal: boolean; 0?: { transcript?: string } }>
  }) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
}

function ArrowUpIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M7 12V2M7 2L2.5 6.5M7 2L11.5 6.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MicIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="5" y="1" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2.75 6.5V7a4.25 4.25 0 0 0 8.5 0v-.5M7 11.25V13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" fill="currentColor" />
    </svg>
  )
}

export type PromptInputProps = {
  onSubmit?: (value: string) => void
  placeholder?: string
  className?: string
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  pending?: boolean
  /** Collapsed hint label (defaults to placeholder). */
  collapsedLabel?: string
}

export const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
  (
    {
      onSubmit,
      placeholder = "Pregunta a Motty…",
      className,
      defaultValue = "",
      value: controlledValue,
      onChange,
      disabled = false,
      pending = false,
      collapsedLabel,
    },
    ref,
  ) => {
    const [expanded, setExpanded] = useState(false)
    const [isSmoothResize, setIsSmoothResize] = useState(false)
    const [localValue, setLocalValue] = useState(defaultValue)
    const [isRecording, setIsRecording] = useState(false)
    const [audioData, setAudioData] = useState<number[]>(() => Array(5).fill(0))
    const [containerHeight, setContainerHeight] = useState(116)
    const [textareaHeight, setTextareaHeight] = useState(68)
    const [isScrolling, setIsScrolling] = useState(false)

    const isControlled = controlledValue !== undefined
    const value = isControlled ? controlledValue : localValue
    const hasValue = value.trim() !== ""
    const valueRef = useRef(value)

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const internalContainerRef = useRef<HTMLDivElement>(null)
    const topFadeRef = useRef<HTMLDivElement>(null)
    const bottomFadeRef = useRef<HTMLDivElement>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const rafRef = useRef<number | null>(null)
    // Browser SpeechRecognition is not always in lib.dom typings across targets.
    const recognitionRef = useRef<{ stop: () => void } | null>(null)

    useEffect(() => {
      valueRef.current = value
    }, [value])

    const updateFades = () => {
      const el = textareaRef.current
      if (!el) return
      const { scrollTop, scrollHeight, clientHeight } = el
      if (topFadeRef.current) {
        topFadeRef.current.style.opacity = String(Math.min(scrollTop / 20, 1))
      }
      if (bottomFadeRef.current) {
        const bottomScroll = scrollHeight - clientHeight - scrollTop
        bottomFadeRef.current.style.opacity = String(
          Math.min(Math.max(bottomScroll - 16, 0) / 10, 1),
        )
      }
    }

    const handleValueChange = useCallback(
      (val: string) => {
        setIsSmoothResize(true)
        if (!isControlled) setLocalValue(val)
        onChange?.(val)
      },
      [isControlled, onChange],
    )

    const expand = () => {
      if (disabled) return
      setIsSmoothResize(false)
      setExpanded(true)
    }

    const stopRecording = useCallback(() => {
      recognitionRef.current?.stop()
      recognitionRef.current = null
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      void audioContextRef.current?.close()
      audioContextRef.current = null
      setIsRecording(false)
      setAudioData(Array(5).fill(0))
    }, [])

    const startRecording = useCallback(async () => {
      if (disabled || pending) return
      setIsSmoothResize(false)
      setExpanded(true)

      let stream: MediaStream | null = null
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      } catch {
        return
      }

      setIsRecording(true)
      streamRef.current = stream

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const audioCtx = new AudioCtx()
      audioContextRef.current = audioCtx
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 64
      audioCtx.createMediaStreamSource(stream).connect(analyser)
      const dataArray = new Uint8Array(analyser.frequencyBinCount)

      const updateVisualizer = () => {
        analyser.getByteFrequencyData(dataArray)
        const bands = new Array(5).fill(0)
        const step = Math.floor(dataArray.length / 5)
        for (let i = 0; i < 5; i++) {
          let sum = 0
          for (let j = 0; j < step; j++) sum += dataArray[i * step + j]
          bands[i] = sum / step / 255
        }
        setAudioData(bands)
        rafRef.current = requestAnimationFrame(updateVisualizer)
      }
      updateVisualizer()

      const speechWindow = window as Window & {
        SpeechRecognition?: new () => SpeechRecognitionLike
        webkitSpeechRecognition?: new () => SpeechRecognitionLike
      }
      const SpeechRecognitionCtor =
        speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition
      if (!SpeechRecognitionCtor) {
        stopRecording()
        return
      }

      const recognition = new SpeechRecognitionCtor()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "es-MX"
      let baseline = valueRef.current

      recognition.onresult = (event) => {
        let interim = ""
        let final = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const piece = event.results[i][0]?.transcript ?? ""
          if (event.results[i].isFinal) final += piece
          else interim += piece
        }
        if (final) baseline += (baseline ? " " : "") + final
        handleValueChange((baseline + (interim ? ` ${interim}` : "")).trim())
      }
      recognition.onerror = () => stopRecording()
      recognition.onend = () => stopRecording()
      recognitionRef.current = recognition
      recognition.start()
    }, [disabled, pending, handleValueChange, stopRecording])

    useEffect(() => () => stopRecording(), [stopRecording])

    useEffect(() => {
      if ((hasValue || isRecording) && !expanded) {
        setIsSmoothResize(false)
        setExpanded(true)
      }
    }, [hasValue, expanded, isRecording])

    useEffect(() => {
      if (!expanded || isRecording || disabled) return
      const timer = setTimeout(() => {
        const el = textareaRef.current
        if (!el) return
        el.focus()
        const length = el.value.length
        el.setSelectionRange(length, length)
      }, 50)
      return () => clearTimeout(timer)
    }, [expanded, isRecording, disabled])

    useEffect(() => {
      const el = textareaRef.current
      if (!el) return
      const currentHeight = el.style.height
      el.style.transition = "none"
      el.style.height = "0px"
      const scrollHeight = el.scrollHeight
      el.style.height = currentHeight
      void el.offsetHeight
      el.style.transition = ""
      const next = Math.max(68, Math.min(scrollHeight, 160))
      el.style.height = `${next}px`
      setTextareaHeight(next)
      setIsScrolling(scrollHeight > 160)
      setTimeout(updateFades, 0)
    }, [value, expanded])

    useEffect(() => {
      setContainerHeight(Math.max(116, textareaHeight + 48))
      setTimeout(updateFades, 0)
    }, [textareaHeight])

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
      if (internalContainerRef.current?.contains(e.relatedTarget as Node)) return
      if (!hasValue && !isRecording) {
        setIsSmoothResize(false)
        setExpanded(false)
      }
    }

    const handleSubmit = () => {
      if (!hasValue || pending || disabled) return
      setIsSmoothResize(false)
      onSubmit?.(value.trim())
      handleValueChange("")
      setExpanded(false)
      stopRecording()
    }

    const showArrow = hasValue && !isRecording
    const showStop = isRecording
    const showMic = !hasValue && !isRecording

    return (
      <div
        ref={(node) => {
          if (typeof ref === "function") ref(node)
          else if (ref) ref.current = node
          internalContainerRef.current = node
        }}
        onBlur={handleBlur}
        className={cn("relative flex w-full flex-col", className)}
        style={{
          maxWidth: expanded ? 520 : 340,
          transition: isSmoothResize ? "max-width 0.15s ease-out" : "max-width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        }}
      >
        <div
          onMouseDown={(e) => {
            if (expanded && e.target !== textareaRef.current && !isRecording) {
              e.preventDefault()
              textareaRef.current?.focus()
            }
          }}
          style={{
            borderRadius: 24,
            height: expanded ? containerHeight : 48,
            transition: isSmoothResize ? SMOOTH : SPRING,
            overflow: expanded ? "visible" : "hidden",
          }}
          className={cn(
            "relative z-10 w-full border border-border bg-card shadow-sm",
            "focus-within:border-ring/40 focus-within:ring-1 focus-within:ring-ring/20",
            expanded ? "cursor-text" : "cursor-default",
            disabled && "opacity-60",
          )}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => handleValueChange(e.target.value)}
            onScroll={updateFades}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
              if (e.key === "Escape" && !hasValue) {
                setIsSmoothResize(false)
                setExpanded(false)
              }
            }}
            placeholder={placeholder}
            aria-label={placeholder}
            disabled={isRecording || disabled || pending}
            maxLength={2000}
            style={{
              transition: isSmoothResize
                ? "height 0.15s ease-out"
                : "opacity 0.3s ease-out, transform 0.3s ease-out, height 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
            className={cn(
              "absolute inset-x-0 top-0 z-[1] w-full resize-none bg-transparent py-3.5 pl-4 pr-12 text-sm leading-[22px] text-foreground outline-none",
              "placeholder:font-medium placeholder:text-muted-foreground/80",
              expanded ? "opacity-100" : "pointer-events-none opacity-0",
              isScrolling ? "overflow-y-auto" : "overflow-y-hidden",
            )}
          />

          <div
            ref={topFadeRef}
            className="pointer-events-none absolute left-4 right-12 top-0 z-[2] h-8 bg-gradient-to-b from-card via-card/90 to-transparent"
          />
          <div
            ref={bottomFadeRef}
            className="pointer-events-none absolute left-4 right-12 z-[2] h-8 bg-gradient-to-t from-card via-card/90 to-transparent"
            style={{
              opacity: 0,
              top: `${textareaHeight - 32}px`,
              transition: isSmoothResize
                ? "top 0.15s ease-out"
                : "top 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          />

          <button
            type="button"
            onClick={expand}
            disabled={disabled}
            className={cn(
              "absolute inset-x-0 top-0 z-[1] cursor-text px-4 py-[15px] pr-12 text-left text-sm font-medium leading-[17px] text-muted-foreground/80 outline-none",
              !expanded ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            aria-label="Abrir chat con Motty"
          >
            {collapsedLabel ?? placeholder}
          </button>

          <div
            className={cn(
              "absolute right-12 bottom-2 z-[10] flex h-8 items-center justify-end gap-[3px] transition-all duration-300",
              isRecording ? "w-16 opacity-100" : "pointer-events-none w-0 opacity-0",
            )}
          >
            {audioData.map((val, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-primary transition-[height] duration-75"
                style={{ height: `${Math.max(4, val * 24)}px` }}
              />
            ))}
          </div>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onClick={() => {
              if (isRecording) stopRecording()
              else if (hasValue) handleSubmit()
              else void startRecording()
            }}
            disabled={disabled || (pending && !isRecording)}
            aria-label={
              showArrow ? "Enviar" : showStop ? "Detener dictado" : "Dictar pregunta"
            }
            className="absolute right-2 bottom-2 z-[10] flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
          >
            <span className="relative flex h-full w-full items-center justify-center">
              <span
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-all duration-300",
                  showArrow ? "scale-100 opacity-100" : "pointer-events-none scale-50 opacity-0",
                )}
              >
                <ArrowUpIcon />
              </span>
              <span
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-all duration-300",
                  showMic ? "scale-100 opacity-100" : "pointer-events-none scale-50 opacity-0",
                )}
              >
                <MicIcon />
              </span>
              <span
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-all duration-300",
                  showStop ? "scale-100 opacity-100" : "pointer-events-none scale-50 opacity-0",
                )}
              >
                <StopIcon />
              </span>
            </span>
          </button>
        </div>
      </div>
    )
  },
)

PromptInput.displayName = "PromptInput"
