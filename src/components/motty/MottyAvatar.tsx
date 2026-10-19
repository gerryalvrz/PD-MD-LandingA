"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  drawParticles,
  kickExplode,
  particlesSettled,
  sampleMottyParticles,
  stepParticles,
  type MottyParticle,
  type MottyParticlePhase,
} from "@/components/motty/motty-particles";

export type MottyExpression =
  | "neutral"
  | "curious"
  | "excited"
  | "dizzy"
  | "thinking";

export type MottyAvatarHandle = {
  explode: () => void;
};

type MottyAvatarProps = {
  size: number;
  className?: string;
  expression?: MottyExpression;
  /** Eyes follow pointer. Off when reduced motion. */
  trackPointer?: boolean;
  label?: string;
  onActionComplete?: (action: "explode" | "reform") => void;
};

/** Normalized eye centers from Motty still (192×192) — pupil centroids. */
const LEFT_EYE = { x: 0.421, y: 0.377 };
const RIGHT_EYE = { x: 0.61, y: 0.403 };
const SCLERA_R = 0.058;
const PUPIL_R = 0.036;
const MAX_PUPIL = 0.024;

const EXPLODE_MS = 2000;
const ANTICIPATE_MS = 280;
const PAD_RATIO = 0.85;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

export const MottyAvatar = forwardRef<MottyAvatarHandle, MottyAvatarProps>(
  function MottyAvatar(
    {
      size,
      className = "",
      expression = "curious",
      trackPointer = true,
      label = "Motty",
      onActionComplete,
    },
    ref,
  ) {
    const rootRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pupilsRef = useRef<SVGGElement>(null);
    const particlesRef = useRef<MottyParticle[]>([]);
    const phaseRef = useRef<MottyParticlePhase>("idle");
    const rafRef = useRef(0);
    const glanceRef = useRef({ x: 0, y: 0 });
    const reducedMotion = usePrefersReducedMotion();
    const [phase, setPhase] = useState<MottyParticlePhase>("idle");
    const [blink, setBlink] = useState(false);
    const onCompleteRef = useRef(onActionComplete);
    onCompleteRef.current = onActionComplete;

    const tracking = trackPointer && !reducedMotion && phase === "idle";
    const pad = Math.round(size * PAD_RATIO);
    const canvasSize = size + pad * 2;

    const setGazeCss = useCallback((lx: number, ly: number, rx: number, ry: number) => {
      const el = pupilsRef.current;
      if (!el) return;
      el.style.setProperty("--lx", `${lx}px`);
      el.style.setProperty("--ly", `${ly}px`);
      el.style.setProperty("--rx", `${rx}px`);
      el.style.setProperty("--ry", `${ry}px`);
    }, []);

    useEffect(() => {
      if (!tracking) {
        const bias = gazeBias(expression);
        const px = bias.x * MAX_PUPIL * size;
        const py = bias.y * MAX_PUPIL * size;
        if (expression === "dizzy") {
          setGazeCss(px, py, -px, -py);
        } else {
          setGazeCss(px, py, px, py);
        }
        return;
      }

      let frame = 0;
      const onMove = (event: PointerEvent) => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          const root = rootRef.current;
          if (!root) return;
          const rect = root.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = event.clientX - cx;
          const dy = event.clientY - cy;
          const dist = Math.hypot(dx, dy) || 1;
          const reach = Math.min(1, dist / (size * 2.2));
          const nx = (dx / dist) * reach;
          const ny = (dy / dist) * reach;
          const bias = gazeBias(expression);
          const bx = (nx + bias.x * 0.35) * MAX_PUPIL * size;
          const by = (ny + bias.y * 0.35) * MAX_PUPIL * size;
          glanceRef.current = { x: bx, y: by };
          if (expression === "dizzy") setGazeCss(bx, by, -bx, -by);
          else setGazeCss(bx, by, bx, by);
        });
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      return () => {
        window.removeEventListener("pointermove", onMove);
        if (frame) cancelAnimationFrame(frame);
      };
    }, [tracking, expression, size, setGazeCss]);

    useEffect(() => {
      if (reducedMotion || phase !== "idle") return;
      let timeout = 0;
      const schedule = () => {
        const wait = 2200 + Math.random() * 3200;
        timeout = window.setTimeout(() => {
          setBlink(true);
          window.setTimeout(() => setBlink(false), 90);
          schedule();
        }, wait);
      };
      schedule();
      return () => window.clearTimeout(timeout);
    }, [reducedMotion, phase]);

    const stopLoop = useCallback(() => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    }, []);

    const runParticleLoop = useCallback(() => {
      stopLoop();
      let last = performance.now();
      const tick = (now: number) => {
        const dt = Math.min(0.033, (now - last) / 1000);
        last = now;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        const particles = particlesRef.current;
        const current = phaseRef.current;
        if (!ctx || !canvas) return;

        stepParticles(particles, current, dt);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawParticles(ctx, particles, pad, pad);

        if (current === "reform" && particlesSettled(particles)) {
          phaseRef.current = "idle";
          setPhase("idle");
          stopLoop();
          onCompleteRef.current?.("reform");
          return;
        }

        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }, [pad, stopLoop]);

    const explode = useCallback(() => {
      if (reducedMotion || phaseRef.current !== "idle") return;

      phaseRef.current = "anticipate";
      setPhase("anticipate");

      void (async () => {
        try {
          const [, particles] = await Promise.all([
            wait(ANTICIPATE_MS),
            sampleMottyParticles(size),
          ]);
          if (phaseRef.current !== "anticipate") return;
          particlesRef.current = particles;
        } catch {
          phaseRef.current = "idle";
          setPhase("idle");
          return;
        }

        kickExplode(particlesRef.current, 480 + size * 2.2);
        phaseRef.current = "explode";
        setPhase("explode");
        runParticleLoop();

        await wait(EXPLODE_MS);
        if (phaseRef.current !== "explode") return;

        onCompleteRef.current?.("explode");
        phaseRef.current = "reform";
        setPhase("reform");
      })();
    }, [reducedMotion, size, runParticleLoop]);

    useImperativeHandle(ref, () => ({ explode }), [explode]);

    useEffect(() => () => stopLoop(), [stopLoop]);

    const showSprite = phase === "idle" || phase === "anticipate";
    const showParticles = phase === "explode" || phase === "reform";
    const scale =
      phase === "anticipate" ? 0.86 : expression === "excited" ? 1.04 : 1;
    const pupilScale =
      expression === "excited" ? 1.18 : expression === "thinking" ? 0.92 : 1;

    return (
      <div
        ref={rootRef}
        className={`relative select-none ${className}`}
        style={{
          width: size,
          height: size,
          transform: `scale(${scale})`,
          transition: reducedMotion ? undefined : "transform 220ms ease",
        }}
        role="img"
        aria-label={label}
      >
        {showSprite ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/motty/motty-still.png"
              alt=""
              width={size}
              height={size}
              draggable={false}
              className="pointer-events-none absolute inset-0 object-contain"
              style={{ width: size, height: size }}
            />
            {!reducedMotion ? (
              <svg
                className="pointer-events-none absolute inset-0"
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                aria-hidden
              >
                <EyeMask
                  cx={LEFT_EYE.x * size}
                  cy={LEFT_EYE.y * size}
                  sclera={SCLERA_R * size}
                />
                <EyeMask
                  cx={RIGHT_EYE.x * size}
                  cy={RIGHT_EYE.y * size}
                  sclera={SCLERA_R * size}
                />
                <g
                  ref={pupilsRef}
                  style={
                    {
                      ["--lx"]: "0px",
                      ["--ly"]: "0px",
                      ["--rx"]: "0px",
                      ["--ry"]: "0px",
                    } as CSSProperties
                  }
                >
                  <Pupil
                    cx={LEFT_EYE.x * size}
                    cy={LEFT_EYE.y * size}
                    r={PUPIL_R * size * pupilScale}
                    ox="var(--lx)"
                    oy="var(--ly)"
                    blink={blink}
                    dizzy={expression === "dizzy"}
                  />
                  <Pupil
                    cx={RIGHT_EYE.x * size}
                    cy={RIGHT_EYE.y * size}
                    r={PUPIL_R * size * pupilScale}
                    ox="var(--rx)"
                    oy="var(--ry)"
                    blink={blink}
                    dizzy={expression === "dizzy"}
                  />
                </g>
              </svg>
            ) : null}
          </>
        ) : null}

        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          className="pointer-events-none absolute"
          aria-hidden
          style={{
            width: canvasSize,
            height: canvasSize,
            left: -pad,
            top: -pad,
            opacity: showParticles ? 1 : 0,
            visibility: showParticles ? "visible" : "hidden",
          }}
        />
      </div>
    );
  },
);

function gazeBias(expression: MottyExpression) {
  switch (expression) {
    case "thinking":
      return { x: -0.35, y: -0.55 };
    case "curious":
      return { x: 0.08, y: -0.06 };
    case "excited":
      return { x: 0, y: 0.1 };
    case "dizzy":
      return { x: 0.55, y: 0.2 };
    default:
      return { x: 0, y: 0 };
  }
}

function EyeMask({
  cx,
  cy,
  sclera,
}: {
  cx: number;
  cy: number;
  sclera: number;
}) {
  return (
    <circle cx={cx} cy={cy} r={sclera} fill="#f7f7f8" stroke="#e8e8ea" strokeWidth={0.5} />
  );
}

function Pupil({
  cx,
  cy,
  r,
  ox,
  oy,
  blink,
  dizzy,
}: {
  cx: number;
  cy: number;
  r: number;
  ox: string;
  oy: string;
  blink: boolean;
  dizzy: boolean;
}) {
  return (
    <g
      style={{
        transform: `translate(${ox}, ${oy})`,
        transformOrigin: `${cx}px ${cy}px`,
      }}
    >
      <ellipse
        cx={cx}
        cy={cy}
        rx={r}
        ry={blink ? r * 0.12 : r}
        fill="#141418"
      />
      {!blink && !dizzy ? (
        <circle
          cx={cx - r * 0.28}
          cy={cy - r * 0.32}
          r={r * 0.22}
          fill="rgba(255,255,255,0.9)"
        />
      ) : null}
      {dizzy && !blink ? (
        <path
          d={`M ${cx - r * 0.55} ${cy} A ${r * 0.45} ${r * 0.45} 0 1 1 ${cx + r * 0.2} ${cy - r * 0.35}`}
          fill="none"
          stroke="#f4f4f5"
          strokeWidth={Math.max(1, r * 0.22)}
          strokeLinecap="round"
        />
      ) : null}
    </g>
  );
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
