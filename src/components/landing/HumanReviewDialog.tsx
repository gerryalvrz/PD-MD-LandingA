"use client"

import { ConvergenceNodeDialog } from "@/components/landing/ConvergenceNodeDialog"

type HumanReviewDialogProps = {
  requirementsLabel: string
  requirements: readonly string[]
  note: string
}

/** @deprecated Prefer ConvergenceNodeDialog; kept as thin alias for the review node. */
export function HumanReviewDialog({
  requirementsLabel,
  requirements,
  note,
}: HumanReviewDialogProps) {
  return (
    <ConvergenceNodeDialog
      eyebrow="Punto común"
      title="Revisión humana"
      itemsLabel={requirementsLabel}
      items={requirements}
      note={note}
      closeLabel="Cerrar requisitos"
    />
  )
}
