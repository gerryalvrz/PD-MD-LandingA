---
name: pd-md-landing-design
description: >-
  Designs and builds UI for the MotusDAO masterclass landing funnel (PD-MD-LandingA).
  Encodes clinical digital noir aesthetic, Spanish copy voice, layout patterns, and
  animation rules from src/app/page.tsx. Use when editing the landing page, gracias page,
  hero, sections, forms, CTAs, dark/light theme, MotusDAO branding, psicoterapia digital,
  masterclass funnel, or any marketing UI in this repository. Takes precedence over
  generic landing-page skills for this project.
---

# MotusDAO Landing Design

Build UI for **MotusDAO — Técnica Avanzada en Psicoterapia**: a masterclass funnel for licensed psychologists transitioning to digital clinical practice. Output must feel **premium clinical + digital-native** — authoritative healthcare education with Apple/Linear polish, not generic SaaS purple templates.

**Source of truth:** [`src/app/page.tsx`](../../../src/app/page.tsx)  
**Detailed tokens and templates:** [reference.md](reference.md)  
**External inspiration:** [reference.md § External Inspiration](reference.md#external-inspiration) — MemeCore (community simplicity), Ecosapiens (concise layouts), [motusdao.org](https://www.motusdao.org/), Academy slides in `public/Reference/bloque 1/`

---

## Before Writing Code

Run this 4-step loop for every UI task:

### 1. Parse intent

| Request type | Action |
|--------------|--------|
| New funnel section | Pick a layout pattern from reference.md; insert in established section order |
| Component tweak | Match surrounding section's `dark`/`tok`/padding/motion tier |
| New page (e.g. gracias) | Reuse `LiquidGradientBackground`, glass card, Jura/Inter, `T` tokens |
| Copy-only change | Keep clinical Spanish voice; preserve CTA strings unless user asks |

### 2. Check brand voice

- **Language:** Spanish (`lang="es"`). No English unless user explicitly requests it.
- **Audience:** Licensed psychologists only — signal exclusivity ("solo psicólogos", "grupo reducido", "en vivo").
- **Tone:** Clear, credible, clinical-professional. No startup hype, no "hack" language, no emoji-heavy marketing.
- **Primary CTA:** "Reservar mi lugar gratis" → scroll to `#registro-principal` (focus `#registro-principal-nombre`).
- **Secondary nav CTA:** "Reservar lugar" (shorter, in nav bar).

### 3. Pick layout pattern

Consult the **Layout catalog** in [reference.md](reference.md). For **community** or **product** sections, also apply **External Inspiration** (short blocks like MemeCore/Ecosapiens; numbered curriculum cards from `public/Reference/bloque 1/`).

Default section anatomy:

```
SectionLabel → SectionHeading → supporting paragraph → content block
```

Common patterns: hero 2-col, trust bar, horizontal card rail (GSAP desktop), audience fit list, mid-CTA band, FAQ stack, final CTA, sticky bottom banner.

### 4. Choose motion tier

| Tier | When | How |
|------|------|-----|
| **Hero** | Above fold on load | `stagger` + `fadeUp`, `initial="hidden" animate="show"` |
| **Reveal** | Scroll sections | `useReveal()` + `stagger`/`fadeUp` when `inView` |
| **GSAP rail** | Horizontal card tracks desktop | ScrollTrigger pin + scrub at `min-width: 901px` only |
| **Static** | FAQ items, dense text | Reveal on section only; no per-item loops |
| **Micro** | Buttons, theme toggle | `whileHover` / `whileTap` on CTAs |

**Motion philosophy:** Motion supports reading flow — never blocks content. One reveal per section beats constant animation. GSAP only for horizontal scroll pin; Framer Motion for everything else.

---

## Aesthetic Checklist

Before finishing, verify:

- [ ] **Theme:** `dark` prop passed; `const tok = dark ? T.dark : T.light`
- [ ] **Backgrounds:** `tok.bg` / `tok.bgAlt` — deep violet-black (`#0E0A1A`) in dark mode
- [ ] **Text:** `tok.t1` (primary), `tok.t2` (body), `tok.t3` (muted)
- [ ] **Accent gradient:** `linear-gradient(to right, #9333EA, #EC4899)` for CTAs and `GradientText`
- [ ] **Section labels:** 12px uppercase purple `#A855F7`, `letter-spacing: 0.10em`
- [ ] **Headings:** Jura 700, `letter-spacing: -0.02em`, `clamp()` font sizes
- [ ] **Body:** Inter 400–600, `line-height: 1.55–1.6`
- [ ] **Cards:** `tok.card` + `tok.cardBorder`, `borderRadius: 12–16`
- [ ] **Glass:** `GlassEffect` for forms/nav; include `<GlassFilter />` at page root
- [ ] **Atmosphere:** `LiquidGradientBackground` in hero; optional `DotField` for texture sections
- [ ] **Glow accents:** Soft radial purple/pink ellipses at low opacity — ambient, not decorative overload

**Default theme:** Dark-first (`useState(true)`). Light mode must remain fully supported via `T.light`.

---

## Implementation Rules

1. **Reuse, don't reinvent** — `GradientText`, `GradientButton`, `SectionLabel`, `SectionHeading`, `MasterclassLeadForm`, `GlassEffect`, `LiquidGradientBackground`, `DotField` (see reference.md component index).

2. **Styling convention** — Inline styles with `T` tokens + selective Tailwind (`className` on glass/banner). Do not migrate existing sections to Tailwind-only.

3. **Responsive** — Use `useIsMobile()` (breakpoint 768px) and `clamp()` for padding/font sizes. Safe-area insets on nav/hero: `env(safe-area-inset-top)`.

4. **Section padding** — Standard: `clamp(52px, 8vh, 96px) clamp(20px, 5vw, 72px)`.

5. **Max widths** — Hero content ~1080px; intro copy ~620px; FAQ ~800px; mid-CTA ~720px; final CTA ~560px.

6. **Funnel tracking** — When adding/editing CTAs, wire `onTrack("cta_click", { section, ctaLabel, intent: "lead" })` and scroll via `scrollToId("registro-principal", "registro-principal-nombre")`. Form fields trigger `form_started` / `form_submitted`. See reference.md for event names.

7. **Images** — Rounded 16px, purple border, soft shadow. Prefer `.avif`/`.webp` for hero assets.

8. **Accessibility** — `aria-label` on icon-only controls; meaningful `alt` on images; sufficient contrast on `tok.t2` body text.

---

## Anti-Patterns (Do Not)

- Generic 3-column "features" grid with icon placeholders
- Lorem ipsum or fake testimonials (project explicitly avoids placeholder social proof)
- English copy without user request
- New color palettes outside `T` / `GRAD` without explicit approval
- Heavy animation on mobile that hurts scroll performance
- Inventing new CTA copy — use established funnel language
- Replacing clinical tone with startup/marketing jargon ("revolucionario", "disruptivo", etc.)
- Overloading sections with Three.js or DotField — one atmospheric layer per viewport area

---

## Relationship to Other Skills

| Skill / tool | When to use |
|--------------|-------------|
| **This skill** | All UI in PD-MD-LandingA |
| `landing-page` (personal) | Ignore for this repo unless user explicitly asks for a different aesthetic |
| `motusdao-hub-ui` | Hub/dashboard apps — not this landing funnel |
| **shadcn MCP** | Primitive UI (dialogs, sheets) if needed — not for landing aesthetic |
| **Convex skills** | Backend/leads/followups — not visual design |

---

## When to Read reference.md

Open [reference.md](reference.md) when you need:

- Exact token hex/rgba values (dark + light)
- Typography `clamp()` scales
- Section template snippets
- GSAP horizontal scroll setup
- Funnel event names and payload shapes
- File map of where patterns live

Open [references/README.md](references/README.md) for the inventory; full guidance is in [reference.md § External Inspiration](reference.md#external-inspiration).

---

## Quick Copy Patterns

**Badge pill (hero):** "Masterclass gratuita en vivo para psicólogos"

**Trust signals:** "Solo psicólogos y clínica" · "Sesión en vivo (no grabación)" · "Grupo reducido · cupo limitado"

**Micro-copy under CTA:** "Gratis · En vivo · Registro limitado"

**Form title:** "Regístrate a la Masterclass gratuita en vivo"

**Scarcity framing:** "Cupo reducido por edición" / "Nueva sesión en vivo aproximadamente cada 15 días"
