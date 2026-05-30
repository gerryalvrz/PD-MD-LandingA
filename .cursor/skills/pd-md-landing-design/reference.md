# MotusDAO Landing — Design Reference

Extracted from [`src/app/page.tsx`](../../../src/app/page.tsx), [`src/app/layout.tsx`](../../../src/app/layout.tsx), [`src/app/globals.css`](../../../src/app/globals.css).

---

## Color Tokens

Define once per file (or import when refactored):

```ts
const GRAD = "linear-gradient(to right, #9333EA, #EC4899)"

const T = {
  dark: {
    bg: "#0E0A1A",
    bgAlt: "#130D22",
    t1: "rgba(255,255,255,0.92)",
    t2: "rgba(255,255,255,0.52)",
    t3: "rgba(255,255,255,0.28)",
    card: "rgba(255,255,255,0.04)",
    cardBorder: "rgba(255,255,255,0.08)",
    cardHighBg: "rgba(147,51,234,0.07)",
    cardHighBorder: "rgba(147,51,234,0.3)",
    navBg: "rgba(14,10,26,0.85)",
    navBorder: "rgba(255,255,255,0.06)",
    toggleTrack: "rgba(255,255,255,0.10)",
  },
  light: {
    bg: "#F8F6FF",
    bgAlt: "#F0ECF9",
    t1: "rgba(14,10,26,0.90)",
    t2: "rgba(14,10,26,0.55)",
    t3: "rgba(14,10,26,0.32)",
    card: "rgba(0,0,0,0.03)",
    cardBorder: "rgba(0,0,0,0.08)",
    cardHighBg: "rgba(147,51,234,0.06)",
    cardHighBorder: "rgba(147,51,234,0.25)",
    navBg: "rgba(248,246,255,0.88)",
    navBorder: "rgba(0,0,0,0.07)",
    toggleTrack: "rgba(0,0,0,0.10)",
  },
} as const
```

| Role | Value |
|------|-------|
| Accent label | `#A855F7` |
| Toggle knob | `#9333EA` |
| Error text | `#EC4899` |
| Hero radial glow | `radial-gradient(ellipse, rgba(147,51,234,0.11) 0%, transparent 72%)` |
| Final CTA glow | `radial-gradient(ellipse, rgba(236,72,153,0.07) 0%, transparent 70%)` |

---

## Typography

Fonts loaded in [`layout.tsx`](../../../src/app/layout.tsx):

| Role | Font | CSS variable | Weights |
|------|------|--------------|---------|
| Headings | Jura | `var(--font-jura)` | 700 |
| Body / UI | Inter | `var(--font-inter)` | 400, 500, 600 |

### Scale (use `clamp()` for responsive)

| Element | Size | Other |
|---------|------|-------|
| Hero H1 (mobile) | `clamp(30px, 9.2vw, 40px)` | `line-height: 1.12`, `letter-spacing: -0.02em` |
| Hero H1 (desktop) | `clamp(26px, 4.6vw, 44px)` | same |
| Section H2 | `clamp(28px, 4vw, 44px)` | Jura 700 |
| Final CTA H2 | `clamp(26px, 4.2vw, 44px)` | centered |
| Section label | 12px | uppercase, `letter-spacing: 0.10em`, `#A855F7` |
| Body / intro | 15–17px | Inter, `line-height: 1.55–1.6`, `tok.t2` |
| Card title | 16px | Jura 700 |
| Card body / FAQ answer | 14px | Inter, `tok.t2` |
| Card index number | `clamp(42px, 6vw, 68px)` | Jura, ~18% opacity |
| Nav wordmark | 15–17px | Jura 700 |
| Badge pill | 11–12px | Inter 600, uppercase |

---

## Motion

### Framer Motion variants

```ts
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11 } },
}
```

### useReveal hook

```ts
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return { ref, inView }
}
```

Usage: `initial="hidden" animate={inView ? "show" : "hidden"}` on `motion.div` with `variants={stagger}`.

### Hero exception

Hero uses `animate="show"` on mount (no scroll wait).

### Final CTA exception

Direct `initial={{ opacity: 0, y: 40 }}` / `animate={inView ? { opacity: 1, y: 0 } : {}}` with `duration: 0.9`.

### GradientButton micro-interaction

```ts
whileHover={{ scale: 1.03 }}
whileTap={{ scale: 0.97 }}
```

### Theme toggle

Spring: `stiffness: 400, damping: 30`; knob `x: dark ? 2 : 22`.

### GSAP horizontal card rail (desktop only)

```ts
gsap.matchMedia().add("(min-width: 901px)", () => {
  gsap.fromTo(track, { x: 0 }, {
    x: () => -Math.max(0, track.scrollWidth - pinWrap.clientWidth),
    ease: "none",
    scrollTrigger: {
      trigger: pinWrap,
      start: "top top+=72",
      end: () => `+=${distance}`,
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
    },
  })
})
```

Mobile: native `overflowX: auto` on pin wrapper — no GSAP pin.

### Page theme transition

Root wrapper: `transition: "background 0.35s ease"`.

---

## Layout Catalog

### Funnel section order (landing)

1. `GlassFilter` + fixed `Nav`
2. `Hero`
3. `TrustBar`
4. `WhatYouLearnSection` (horizontal cards)
5. `ExperienceFormatSection` (horizontal cards)
6. `AudienceFitSection` (DotField + lists)
7. `MidCtaBand`
8. `InstructorBlock`
9. `TrustSignalsSection`
10. `ObjectionFaq`
11. `FinalCTA`
12. Sticky bottom gradient banner
13. `Footer`

### Pattern: Fixed Nav

- `GlassEffect` bar, `h-14`, `rounded-2xl`, fixed top with safe-area
- Logo `/logo.svg` + "MotusDAO" (wordmark hidden on mobile)
- Theme toggle + `GradientButton small` ("Reservar lugar")

### Pattern: Hero

- `minHeight: 100svh`, `LiquidGradientBackground`, radial purple glow overlay
- 2-col grid: `repeat(auto-fit, minmax(min(100%, 300px), 1fr))`, gap `clamp(28px, 5vw, 48px)`
- Left: badge pill → H1 with `GradientText` span → bullets as chips → CTA → micro-copy
- Right: hero image + `MasterclassLeadForm` in `GlassEffect`

### Pattern: Trust bar

- `tok.bgAlt`, border-top, horizontal items, fade on reveal

### Pattern: Content section

```tsx
<section style={{ background: tok.bgAlt, padding: "clamp(52px, 8vh, 96px) clamp(20px, 5vw, 72px)" }}>
  <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"}>
    <motion.div variants={fadeUp}>
      <SectionLabel>Label</SectionLabel>
      <SectionHeading tok={tok}>Title</SectionHeading>
      <p style={{ marginTop: 10, fontFamily: "var(--font-inter)", fontSize: 15, color: tok.t2, maxWidth: 620 }}>
        Supporting copy.
      </p>
    </motion.div>
    {/* content */}
  </motion.div>
</section>
```

### Pattern: Horizontal card

- Card: `width: clamp(260px, 32vw, 380px)`, `minHeight: min(62vh, 560px)`, `borderRadius: 14`
- Large index number (01, 02…) at ~18% opacity
- Title Jura 16px + body Inter 14px

### Pattern: Audience fit (checklist)

- Optional full-section `DotField` at low opacity
- Checkmarks in `#A855F7`
- Separate "not for you" block with muted styling

### Pattern: Mid-CTA band

- `tok.bgAlt`, top/bottom borders, centered max-width 720px
- Short paragraph + single `GradientButton`

### Pattern: FAQ

- Grid `gap: 10`, max-width 800px, cards `borderRadius: 12`, padding `16px 18px`
- Question Jura 16px, answer Inter 14px

### Pattern: Final CTA

- Centered, extra vertical padding `clamp(80px, 14vh, 160px)`
- Bottom pink radial glow, max-width 560px

### Pattern: Sticky bottom banner

- Fixed bottom, animated gradient (`fd-moving-banner` 20s linear)
- Tailwind: `backdrop-blur-xl`, white text, compact "Reservar gratis" button

### Pattern: Gracias page

See [`src/app/gracias/page.tsx`](../../../src/app/gracias/page.tsx):

- Full viewport, `LiquidGradientBackground dark`, dark overlay gradient
- Centered glass card: `borderRadius: 20`, purple border, `rgba(255,255,255,0.04)` background

---

## Component Index

| Component | Location | Notes |
|-----------|----------|-------|
| `GradientText` | `page.tsx` | `backgroundImage: GRAD`, `backgroundClip: text` |
| `GradientButton` | `page.tsx` | `borderRadius: 10`, white text, optional `small` / `full` |
| `SectionLabel` | `page.tsx` | Uppercase purple label |
| `SectionHeading` | `page.tsx` | Jura H2 with `tok.t1` |
| `MasterclassLeadForm` | `page.tsx` | Glass form, Convex registrar, redirects to `/gracias?flow=lead` |
| `GlassEffect` | `components/ui/liquid-glass.tsx` | Blur 18px, distortion filter |
| `GlassFilter` | `components/ui/liquid-glass.tsx` | SVG filter — mount once at page root |
| `LiquidGradientBackground` | `components/hero/LiquidGradientBackground.tsx` | Three.js ambient hero bg |
| `DotField` | `components/effects/DotField.tsx` | Interactive dot texture |
| `Banner` | `components/ui/banner.tsx` | Optional promo banner |

### Form input style

```ts
{
  width: "100%",
  background: dark ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.30)",
  border: dark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(14,10,26,0.10)",
  borderRadius: 10,
  padding: "12px 14px",
  fontFamily: "var(--font-inter)",
  fontSize: isMobile ? 16 : 15,
  color: tok.t1,
}
```

---

## Funnel Events

Type: `FunnelEventName`

| Event | When |
|-------|------|
| `page_view` | Landing mount |
| `cta_click` | Any CTA — payload: `section`, `ctaLabel`, `intent: "lead"` |
| `modal_open` | Modal opened |
| `form_started` | First form field interaction |
| `form_submitted` | Successful lead registration |
| `checkout_click` | Checkout CTA |
| `checkout_complete` | Payment confirmed |
| `calendly_booked` | Call scheduled |

Primary CTA handler pattern:

```ts
onTrack("cta_click", { section: "global", ctaLabel: "Reservar mi lugar gratis", intent: "lead" })
scrollToId("registro-principal", "registro-principal-nombre")
```

Session ID: `localStorage` key `motus_session_id`. Lead context: `motus_lead_ctx`.

---

## File Map

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Main landing — tokens, components, all sections |
| `src/app/layout.tsx` | Fonts, metadata, Convex provider |
| `src/app/gracias/page.tsx` | Post-registration thank-you |
| `src/app/globals.css` | Reset, smooth scroll, keyframes |
| `src/components/ui/liquid-glass.tsx` | Glass morphism |
| `src/components/hero/LiquidGradientBackground.tsx` | Three.js hero atmosphere |
| `src/components/effects/DotField.tsx` | Dot field texture |
| `public/logo.svg` | Brand mark |
| `public/MAsterclass3.avif` | Hero masterclass image |
| `public/Reference/bloque 1/*.png` | Academy deck slides — layout/color reference |

---

## Anti-Patterns

See [SKILL.md](SKILL.md). Additional technical notes:

- Do not add ScrollTrigger without `mm.revert()` cleanup on unmount
- Do not pin horizontal sections on viewports below 901px
- Do not use `100vh` for hero — prefer `100svh` for mobile browser chrome
- Do not skip `GlassFilter` when using `GlassEffect` on a page

---

## External Inspiration

User-provided references (merged). **Rule:** Steal *layout, density, and information architecture* from these sources; map colors to `T` / `GRAD` on the masterclass landing unless the user explicitly asks for Academy deck colors on a page.

### Brand hub (MotusDAO main site)

| Source | Steal | Avoid |
|--------|-------|-------|
| [motusdao.org](https://www.motusdao.org/) | Spanish clinical positioning (“Más tecnología, sin perder lo humano”), dual audience paths (psicólogo vs usuario), stats/social proof blocks, global-network framing | Wix-heavy layout, cluttered nav duplication, generic stock-photo hero — landing stays darker and more focused on one funnel |

Use the main site for **wording tone** and ecosystem context; use **this repo’s tokens** for the masterclass landing visual system.

### URL references

#### MemeCore — [memecore.com](https://memecore.com/)

- **Steal:** Simple, confident presentation of project + community; minimal sections; clear hierarchy without dense copy; community feels approachable but serious.
- **Adapt for MotusDAO:** When showing psychologist community (Academia, red global, cohort size), use **short blocks**: one headline, 2–3 proof lines, optional single stat row — not long paragraphs.
- **Avoid:** Crypto/memetic tone, meme visuals, playful slang — keep clinical-professional Spanish.

#### Ecosapiens — [ecosapiens.xyz](https://ecosapiens.xyz/)

- **Steal:** Product-forward layouts; **short, scannable sections**; strong section titles + one supporting line; cards with tight copy; generous whitespace between ideas.
- **Adapt for MotusDAO:** Masterclass sections should read in **under 10 seconds** per block (format bullets, FAQ, “qué aprenderás” cards). Prefer one idea per card over multi-paragraph walls.
- **Avoid:** Their environmental/climate narrative and illustration style — keep MotusDAO purple clinical palette.

### Presentation assets — `public/Reference/`

Academy deck slides for **Fundamentos Bloque 1** (curriculum / Academy brand). Paths use URL encoding for the space: `/Reference/bloque%201/`.

| File | What to steal | Map to landing |
|------|---------------|----------------|
| `bloque 1/1.png` | Hero title card: large outlined + solid type mix, circular course badge, diagonal teal→purple gradient, curved tagline | Hero badge pill + `GradientText` in H1; optional course-edition badge — **colors → `T`/`GRAD`**, not raw deck hex |
| `bloque 1/2.png` | Split layout: left glass/dark panel (INTRODUCCIÓN / CONTEXTO / TEMARIO bullets), right illustration column | “Para quién es” / curriculum sections: label + heading + bullet list; optional 40% visual column |
| `bloque 1/4.png` | Two equal topic cards on soft gradient; numbered section title; card glow (purple vs teal) | Horizontal card rails or 2-col grid for “fundamentos” topics; use `tok.card` + accent border instead of deck pastels |
| `bloque 1/8.png` | Centered chapter divider: 3D sphere + italic `MOTUSDAO ACADEMY` wordmark | Section transitions (“Fin de bloque”) — subtle, not on every section |
| `bloque 1/9.png` | Full product page wireframe: numbered course rows (pill + title + bullets + thumb), 3-col workshop grid, featured media band, research cards, light footer | **Information architecture** for future Academia/diplomado pages: numbered offerings, grid density, footer newsletter — **not** the light-only palette for current dark landing |
| `bloque I/*.png` | Same family as `bloque 1/` (duplicate folder spelling) | Prefer `bloque 1/` paths unless user specifies `bloque I/` |

Also present: `bloque I/4.png`, `bloque I/8.png`, `bloque I/9.png` — treat as duplicates of the `bloque 1` set.

### Academy vs landing palette

| Context | Palette | Typography accent |
|---------|---------|-------------------|
| **Masterclass landing** (`page.tsx`) | Dark violet `#0E0A1A`, purple-pink `GRAD`, glass | Jura + Inter (required) |
| **Academy decks** (`public/Reference/`) | Teal–cyan–lavender pastels, white outlined headlines | Italic all-caps Academy wordmark on slides |

When user says “like the presentation,” apply **layout and type hierarchy** from Reference images; keep **landing colors** unless they ask to match Academy slides exactly.

### Combined patterns to apply

1. **Community block (MemeCore-inspired):** `SectionLabel` → short `SectionHeading` → 3 bullets or stats → CTA. No feature grid with icons.
2. **Product sections (Ecosapiens-inspired):** One sentence intro max; cards with title + 1–2 lines; vertical rhythm `clamp(52px, 8vh, 96px)`.
3. **Curriculum (deck-inspired):** Numbered modules (`01`, `02`…), optional split text/visual, 2-col topic cards on desktop.
4. **Ecosystem page (9.png-inspired):** Numbered horizontal course rows for diplomado/Academia — reuse GSAP rail pattern from `WhatYouLearnSection`.

### Anti-patterns from references

- Do not copy MemeCore/crypto community tone or meme aesthetics.
- Do not switch masterclass landing to full white/light wireframe from `9.png` without user request.
- Do not use English taglines from slides (“Enter the future”) on Spanish funnel copy.
- Do not add 3D spheres or heavy illustration columns on mobile — simplify to stacked text-first.
