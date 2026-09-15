export const MOTTY_SURFACE = "academy" as const;

export type MottySurface = typeof MOTTY_SURFACE;

export type MottyRuntimeKind = "in-process-loop" | "openclaw";

export function getPublicMottyRuntime(): MottyRuntimeKind {
  return "in-process-loop";
}
