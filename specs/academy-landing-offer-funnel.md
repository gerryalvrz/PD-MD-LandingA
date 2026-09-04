# Academia landing — offer funnel

Spec para reconstruir `src/app/page.tsx` como landing que **vende Academia**: qué es, qué se compra, cuánto cuesta, y un siguiente paso.

Implementar **un slice por commit**. Push después de cada slice para previews de Vercel y rollback limpio.

Fuente de verdad: ruta PSM (Gitbook + curriculum Hub: Génesis, Fundamentos, Praxis, Validación, Portal) + mapa comercial interno. El Knowledge MCP de Motus no está conectado en este workspace; si se conecta, prevalece sobre copy inventado.

---

## Cómo ejecutar

```text
1. Crear rama: feat/academy-offer-funnel
2. Decir al agente: "Implementa slice N de specs/academy-landing-offer-funnel.md"
3. Verificar en browser (desktop + mobile)
4. Commit con el mensaje sugerido del slice
5. git push -u origin HEAD   (el primer push; después git push)
6. Siguiente slice
```

No mezclar slices en un mismo commit. Si un slice deja la página a medias, no pushear: completar o revertir.

Rama sugerida: `feat/academy-offer-funnel`  
Base: `main`

---

## Producto que esta landing vende

**Oferta principal de lanzamiento:** entrar a **01 — Génesis** (gratis) y, cuando quiera, activar **Membresía de Práctica Digital (02 — Fundamentos)**.

**Oferta secundaria (descubrimiento):** Diagnóstico de práctica digital → perfil + next step.

**Ofertas posteriores (visibles, no CTAs competidores):** Praxis a la carta y herramientas (videollamada, chat, agente).

### Precios publicados (usar tal cual)

| Oferta | Precio | Notas |
|---|---|---|
| 01 Génesis | Gratis | Sin compromiso. Comunidad + mapa + perfil. |
| 02 Fundamentos / Membresía de Práctica Digital | USD 20/mes o USD 120/año | No es certificación ni Portal. |
| 03 Praxis | Desde USD 15; programa avanzado USD 40 | Supervisión es capa aparte (referencia USD 50). |
| 04 Validación | No es un curso | Revisión interna. |
| 05 Portal Profesional beta | Vía Pase Motus Beta + aprobación | No es automático. |

### Precios no publicados (no inventar)

Videollamada suelta, chat individual y agente-asistente personal **existen como superficies** (consultorio Jitsi, MotusAI, Agents) pero **no tienen SKU/precio en la fuente de verdad**. En copy: nombrarlos como disponibles en la ruta; no poner cifra hasta que el equipo la cierre. Placeholder interno: `TBD`.

---

## CTAs canónicos (toda la página)

Solo dos destinos. El resto de botones son variaciones de etiqueta, no nuevas decisiones.

| Intención | Destino | Copy canónico | Tracking |
|---|---|---|---|
| **A — descubrimiento** | `/diagnostico` | “Descubrir mi perfil” | `cta_click` · `intent: "lead"` · `ctaLabel: "Descubrir mi perfil"` |
| **B — entrada** | Hub Academia Génesis (`https://app.motusdao.org/academia/01-genesis`) | “Entrar gratis a Génesis” | `cta_click` · `intent: "lead"` · `ctaLabel: "Entrar gratis a Génesis"` |

Nav CTA corto A: “Diagnóstico”  
Sticky mobile: A por defecto. Si más adelante se reintroduce masterclass como evento, el sticky puede cambiar a B en esa sección — no antes.

**No usar** como botones: “Explorar Academia”, “Conoce el ecosistema”, “Entrar a Comunidad”, “Conocer MotusDAO”, “Haz el diagnóstico” (reemplazar por A). “Conoce MotusDAO Academy” del hero actual se convierte en scroll a `#oferta` o desaparece: no es un tercer destino.

Constante de URL B: extraer a `src/lib/academy-links.ts` en el slice 1 para no hardcodear en cada botón.

```ts
export const ACADEMY_GENESIS_URL = "https://app.motusdao.org/academia/01-genesis"
```

Si el slug del Hub cambia, se actualiza un solo archivo.

---

## Claims bloqueados (nunca decir)

- Pacientes garantizados, ingresos garantizados
- Certificación oficial, licencia, posgrado con validez
- Completar formación = acceso al Portal
- La IA sustituye al psicólogo
- 5/5 Praxis = validado / apto / certificado
- Precios de videollamada / chat / agente inventados

Siempre que se hable de la ruta: *Completar formación no certifica, no sustituye cédula y no asigna pacientes. El Portal no es automático.*

---

## Palabras de la investigación (usar)

práctica digital · encuadre · ética · privacidad · videollamada · perfil profesional · membresía · Génesis · Fundamentos · Praxis · criterio clínico · IA asistiva · comunidad · supervisión (capa separada) · solo psicólogos

Tono: clínico-profesional, español. Sin “revolucionario”, “hack”, “disruptivo”.

Audiencia (tres estados de Génesis):

1. Recién egresado, sin mapa
2. Consulta presencial que quiere digital
3. Ya atiende online, desordenado

---

## Arquitectura de secciones

### Hoy (`src/app/page.tsx`)

```
Nav → Hero → TrustBar → AcademyIntro (6 pilares)
→ PracticeShift → Diagnóstico → Journey (6 etapas no oficiales)
→ AudienceFit → HumanAi → Ecosystem (otro mapa)
→ FAQ → FinalCTA → Sticky → Footer
```

Problema: tres mapas, cero precios, un solo CTA (diagnóstico), nombres que no coinciden con la ruta PSM.

### Objetivo

```
Nav
Hero                         A + B
TrustBar
Qué vendemos (#oferta)       3 ofertas + precios
Diagnóstico (#diagnostico)   motor A
Recorrido (#recorrido)       5 bloques oficiales, énfasis en hoy + siguiente pago
Herramientas (#herramientas) videollamada / chat / agente / perfil — sin precio inventado
Para quién                   sí / no
FAQ
FinalCTA                     A + B
Sticky                       A
Footer
```

**Se elimina** como sección propia: `EcosystemSection` (tercer mapa).  
**Se absorbe** `PracticeShiftSection` en el lead de `#oferta` (el párrafo “no es solo videollamada” se conserva).  
**Se absorbe** `HumanAiSection` en `#herramientas` (IA asistiva, criterio humano).  
**Se absorbe** `AcademyIntroSection` (6 pilares genéricos) en `#oferta`.

Masterclass en vivo: **fuera de lanzamiento** salvo que se pida en un slice extra. Si vuelve, es formato de entrada a Génesis, no un tercer CTA.

---

## Copy canónico por bloque

Usar este texto salvo ajuste de wrapping. No reescribir el sentido.

### Hero

- Badge: `MotusDAO Academy · Solo psicólogos`
- H1: `Ordena tu práctica clínica digital. Empieza gratis.`
- Sub: `No se trata solo de atender por videollamada. Cambia el encuadre, la privacidad, las herramientas y el criterio. Academia es la capa de formación de MotusDAO: Génesis para orientarte, Fundamentos para montar tu práctica, Praxis para profundizar.`
- A: `Descubrir mi perfil`
- B: `Entrar gratis a Génesis`
- Microcopy: `Gratis · Sin compromiso · Membresía desde USD 20/mes cuando quieras`

### Trust bar

`Solo psicólogos` · `Génesis sin costo` · `Sin promesa de pacientes ni cédula`

### Qué vendemos (`#oferta`)

Label: `Qué incluye`  
H2: `Qué se vende — y cuánto cuesta`  
Lead (ex PracticeShift): `No se trata simplemente de atender por videollamada. Se trata de entender cómo cambian el encuadre, la privacidad, la comunicación, la tecnología, la IA, los procesos y la relación profesional cuando tu práctica entra al entorno digital.`

Cards:

1. **Génesis** — USD 0  
   Mapa, manifiesto, comunidad inicial y perfil profesional. Entras, ves, decides.  
   CTA de card: B

2. **Membresía de Práctica Digital (Fundamentos)** — USD 20/mes o USD 120/año  
   Lenguaje común de clínica digital, encuadre, ética, perfil y encuentros.  
   No incluye certificación oficial ni acceso al Portal.

3. **Praxis** — desde USD 15  
   Cursos y talleres a la carta. Supervisión clínica aparte.  
   Completar cursos no valida ni asigna pacientes.

### Diagnóstico

Label: `Empieza donde estás`  
H2: `¿Qué tipo de psicólogo digital eres?`  
Body: `Seis preguntas. Resultado inmediato. Te sitúa en un perfil (Constructor, Estructurado, Explorador de IA, Conector o Profesional digital) y te indica el siguiente paso: Génesis o Fundamentos.`  
CTA: A  
Micro: `Gratis · Orientativo · No es diagnóstico clínico ni certificación`

### Recorrido

Label: `Ruta PSM`  
H2: `Cinco bloques. Hoy solo necesitas el primero.`  
Lead: `Avanzas cuando tú quieras. Los bloques 3, 4 y 5 se ven cuando llegues.`

| # | Bloque | Una línea | Precio en card |
|---|---|---|---|
| 1 | Génesis | Orientación y comunidad. Estás aquí. | Gratis |
| 2 | Fundamentos | Membresía de Práctica Digital. | USD 20/mes |
| 3 | Praxis | Formación aplicada, a la carta. | Desde USD 15 |
| 4 | Validación | Revisión interna. No es un curso. | — |
| 5 | Portal beta | Consultorio y herramientas, con aprobación. | No automático |

Disclaimer bajo el mapa: `Completar formación no certifica, no sustituye cédula y no asigna pacientes. El Portal no es automático.`

### Herramientas

Label: `Operación`  
H2: `Herramientas que puedes activar`  
Lead: `La tecnología procesa, organiza y amplifica. El criterio profesional permanece humano.`

| Servicio | Qué es | Precio en UI |
|---|---|---|
| Consultorio / videollamada | Sala MotusDAO (Jitsi) para sesión | Disponible en la ruta. Precio individual TBD. |
| Chat / MotusAI | Apoyo entre sesiones. No sustituye juicio clínico. | Disponible en la ruta. Precio individual TBD. |
| Agente asistente | Asistente del profesional (operación, no clínica). | Disponible en la ruta. Precio individual TBD. |
| Perfil y agenda | Presencia profesional y horarios. | Crear perfil: en Génesis, sin costo. |

Hasta cerrar SKU: en la card, **no** mostrar “USD —”. Mostrar `Incluido en la ruta` o `Se activa por separado`.

### Para quién

**Es para ti si** (estados Génesis + lista actual):

- Recién egresaste y necesitas un camino claro
- Tienes consulta presencial y quieres atender en digital sin perder criterio
- Ya atiendes online y está desordenado
- Quieres incorporar IA con criterio
- Buscas formación y comunidad profesional

**No es para ti si:**

- Buscas hacks para conseguir pacientes
- Esperas que una IA sustituya el criterio profesional
- Buscas una certificación automática
- No te interesa desarrollar una práctica digital

### FAQ

1. **¿Qué compro en Academia?** Génesis es gratis. La membresía de Fundamentos es USD 20/mes o USD 120/año. Los cursos de Praxis empiezan en USD 15.
2. **¿Qué incluye la membresía / qué no?** Incluye lenguaje común, encuadre, ética, perfil y encuentros. No entrega certificación oficial, licencia, pacientes ni Portal automático.
3. **¿Puedo contratar solo videollamada, chat o un agente?** Sí, como servicios de operación dentro del ecosistema. El precio individual se confirma al activarlos; no están atados a un curso.
4. **¿El diagnóstico certifica?** No. Es orientación de práctica digital, no evaluación clínica ni de licencia.
5. **¿La IA sustituye al psicólogo?** No. Es asistiva. El juicio permanece humano.
6. **¿Necesito trabajar online hoy?** No. Puedes entrar desde presencial o desde una práctica digital ya en marcha.
7. **¿El Portal viene con el curso?** No. Completar bloques no otorga acceso automático.

### Cierre

H2: `Empieza por un paso, no por toda la ruta.`  
Body: `No necesitas tener la práctica resuelta. Génesis es gratis. El diagnóstico te dice por dónde seguir.`  
A + B  
Micro: `Gratis · Para psicólogos · Sin compromiso`

Footer: `MotusDAO Academy · Formación para psicólogos`  
Sticky: `¿Qué tipo de psicólogo digital eres?` + A (`Descubrir mi perfil →`)

---

## Slices

Cada slice: archivos, criterio de hecho, mensaje de commit, qué no tocar.

### Slice 0 — Spec (este archivo)

**Archivos:** `specs/academy-landing-offer-funnel.md`  
**Hecho cuando:** el spec está en git y el equipo puede implementarlo slice a slice.  
**Commit:**

```
docs: spec del funnel de oferta de Academy.

Deja la ruta PSM, precios publicados y CTAs canónicos como fuente para reconstruir la landing por slices.
```

---

### Slice 1 — CTAs canónicos + links + hero + trust + nav + sticky

Objetivo: la página **ya no miente en los botones**. Sigue teniendo las secciones viejas, pero todos los CTAs apuntan a A o B, y el above-the-fold vende entrada gratis + membresía como siguiente precio.

**Archivos:**

- `src/lib/academy-links.ts` (nuevo)
- `src/app/page.tsx` — `Nav`, `Hero`, `TrustBar`, `StickyConversionBar`, handlers
- `src/app/layout.tsx` — metadata title/description alineados al nuevo hero

**Cambios:**

- Extraer `ACADEMY_GENESIS_URL`
- Nav: anclas `Oferta` `#oferta` (puede apuntar a `#academia` hasta el slice 2), `Recorrido`, `Diagnóstico`. CTA nav: A corto “Diagnóstico”
- Hero: copy canónico, A + B (B es link externo, `rel` no necesario si same-org; abrir misma pestaña)
- Trust bar: 3 señales nuevas
- Sticky: copy + A
- Reemplazar `handleConoce` (scroll a academia) por B o por scroll a oferta
- Tracking: `ctaLabel` exacto de la tabla canónica; B también `intent: "lead"`

**Hecho cuando:**

- [ ] No queda el string “Haz el diagnóstico” / “Haz mi diagnóstico” / “Hacer diagnóstico” / “Conoce MotusDAO Academy”
- [ ] Hero muestra USD 20/mes en microcopy
- [ ] Hay exactamente dos destinos de botón en hero
- [ ] Dark/light y mobile no rompen el hero (CTAs full-width en mobile)
- [ ] Browser: click A → `/diagnostico`; click B → Hub Génesis

**No tocar:** Journey, Ecosystem, FAQ, Audience, ofertas nuevas.

**Commit:**

```
fix: alinear hero y CTAs al funnel de Génesis + diagnóstico.

Deja dos destinos (perfil y Génesis) y el precio de membresía visible above the fold.
```

---

### Slice 2 — Sección `#oferta` (qué se vende)

Objetivo: el visitante entiende **qué compra y cuánto cuesta**.

**Archivos:** `src/app/page.tsx`

**Cambios:**

- Reemplazar `AcademyIntroSection` + `PracticeShiftSection` por una sola `OfferSection` (`id="oferta"`)
- Nav “Academia” / “Oferta” apunta a `#oferta`
- 3 cards con precios de la tabla
- Conservar el párrafo “no es solo videollamada” como lead
- CTA de la card Génesis = B; no poner CTA de pago a Stripe todavía (el Hub cobra)

**Hecho cuando:**

- [ ] Visible Génesis USD 0, Fundamentos USD 20/mes · 120/año, Praxis desde USD 15
- [ ] Disclaimer de lo que la membresía **no** entrega
- [ ] No hay 6 pilares genéricos (Formación/Comunidad/…)
- [ ] Browser: scroll desde nav y desde hero (si hay ancla) llega a las 3 cards

**No tocar:** Recorrido viejo todavía puede existir (slice 3 lo reemplaza). FAQ viejo ok.

**Commit:**

```
feat: mostrar oferta y precios de Academia en la landing.

Génesis, membresía de Fundamentos y Praxis quedan como productos legibles, no como pilares abstractos.
```

---

### Slice 3 — Recorrido oficial de 5 bloques

Objetivo: un solo mapa, el de la investigación, recortado a “hoy + siguiente pago”.

**Archivos:** `src/app/page.tsx` — `JourneySection`

**Cambios:**

- Sustituir las 6 etapas (Diagnóstico → … → Motus Beta) por los 5 bloques oficiales
- Enfatizar bloque 1 (hoy) y bloque 2 (siguiente pago); 3–5 visibles pero secundarios (opacidad o copy “cuando llegues”)
- Disclaimer canónico debajo
- Quitar duplicar chips + grid si queda ruidoso: una fila de 5 cards es suficiente

**Hecho cuando:**

- [ ] Los nombres son Génesis, Fundamentos, Praxis, Validación, Portal (beta)
- [ ] No aparecen “Motus Beta” ni “Diagnóstico” como etapa de la ruta
- [ ] Precios de 1 y 2 visibles en las cards
- [ ] Browser: `#recorrido` scrolleable desde nav

**No tocar:** Ecosystem todavía (sale en slice 4).

**Commit:**

```
fix: usar la ruta PSM de cinco bloques en el recorrido.

El mapa deja de ser un inventario de capas y muestra Génesis ahora y Fundamentos como siguiente pago.
```

---

### Slice 4 — Herramientas como servicios + quitar ecosistema duplicado

Objetivo: explicar videollamada, chat y agente **sin** tercer mapa y **sin** precio inventado.

**Archivos:** `src/app/page.tsx` — eliminar `EcosystemSection` y `HumanAiSection`; añadir `ToolsSection` (`id="herramientas"`)

**Cambios:**

- Nav: `Herramientas` → `#herramientas` (reemplaza “Ecosistema”)
- 4 cards de la tabla de herramientas
- Absorber el mensaje Human/AI en el lead
- FAQ aún no (slice 5)

**Hecho cuando:**

- [ ] No existe sección Ecosistema con 6 capas
- [ ] Videollamada, chat/MotusAI y agente están nombrados como servicios
- [ ] Ninguna card de herramienta muestra un USD inventado
- [ ] Browser: nav y anclas no 404 / no apuntan a `#ecosistema`

**Commit:**

```
feat: presentar videollamada, chat y agente como servicios de operación.

Quita el mapa duplicado de ecosistema y deja las herramientas como oferta posterior, sin precios no publicados.
```

---

### Slice 5 — Audiencia (sí/no) + FAQ + cierre

Objetivo: objeciones y encaje. Cierre con A+B.

**Archivos:** `src/app/page.tsx` — `AudienceFitSection`, `ObjectionFaq`, `FinalCTA`

**Cambios:**

- Audience: 3 estados Génesis + lista “no es para ti”
- FAQ: las 7 preguntas canónicas
- FinalCTA: A + B, copy de cierre
- Diagnóstico section copy (si no se hizo en slice 1): H2 y body canónicos

**Hecho cuando:**

- [ ] FAQ responde precio, membresía, herramientas, Portal, IA
- [ ] Cierre tiene los dos CTAs
- [ ] “No es para ti” visible
- [ ] Browser: FAQ y cierre en mobile, sticky no tapa el footer (paddingBottom existente)

**Commit:**

```
feat: cerrar la landing con encaje, precio en FAQ y dos CTAs.

Las objeciones de certificación, IA y Portal quedan explícitas; el cierre vuelve a Génesis o al diagnóstico.
```

---

### Slice 6 — Diagnóstico: next step real

Objetivo: el quiz no deja al usuario en un callejón. El resultado apunta a Génesis (B) y, si aplica, nombra Fundamentos.

**Archivos:**

- `src/app/diagnostico/page.tsx`
- `src/lib/digital-profiles.ts` — `nextStep` más concreto
- `src/app/diagnostico/layout.tsx` — metadata si hace falta

**Cambios:**

- Resultado: CTA A ya cumplido; primario = B “Entrar gratis a Génesis”
- Secundario: “Volver a Academia”
- `nextStep` de cada perfil: una frase que mencione Génesis o Fundamentos, no “estructura y fundamentos” vago
- Disclaimer de orientación (ya existe): conservar

**Hecho cuando:**

- [ ] Tras el quiz hay un botón a Génesis
- [ ] Ningún perfil promete Portal, pacientes ni certificación
- [ ] Browser: completar las 6 preguntas y seguir a Hub / volver a `/`

**Commit:**

```
feat: conectar el resultado del diagnóstico con Génesis.

El perfil deja de ser un callejón y propone el siguiente paso de la ruta PSM.
```

---

### Slice 7 — Skill de diseño + tracking labels (agentes)

Objetivo: el próximo agente no revierta los CTAs al funnel de masterclass.

**Archivos:**

- `.cursor/skills/pd-md-landing-design/SKILL.md` — Primary CTA / Secondary CTA / Quick Copy Patterns
- `.cursor/skills/pd-md-landing-design/reference.md` — si lista “Reservar mi lugar” o sección order viejo

**Cambios:**

- Primary CTA: “Descubrir mi perfil” → `/diagnostico`
- Secondary: “Entrar gratis a Génesis” → `ACADEMY_GENESIS_URL`
- Section order = arquitectura objetivo de este spec
- Quitar “Inventing new CTA copy” solo si contradice este spec; los CTAs canónicos **sí** cambian respecto al skill viejo

**Hecho cuando:**

- [ ] El skill no manda “Reservar mi lugar gratis” como CTA principal de esta landing
- [ ] Orden de secciones documentado coincide con la página

**Commit:**

```
docs: actualizar el skill de landing al funnel de oferta Academy.

Los CTAs y el orden de secciones dejan de apuntar al funnel de masterclass.
```

---

### Slice extra (no implementar hasta que se pida)

- **Masterclass** como formato de Génesis (evento Luma), sticky contextual
- **Precios TBD** de videollamada / chat / agente cuando exista SKU
- Checkout Stripe directo desde la landing (hoy el cobro vive en el Hub)
- Message match `?intent=` para ads (“qué tipo de psicólogo” vs “membresía”)

---

## Orden y dependencias

```text
0 spec
1 CTAs + hero     ← la página ya convierte a dos destinos
2 oferta/precios  ← ya se entiende qué se vende
3 recorrido 5     ← un solo mapa
4 herramientas    ← servicios sin tercer mapa
5 FAQ + cierre    ← objeciones
6 diagnóstico     ← next step
7 skill           ← para no revertir
```

1 y 2 son los que desbloquean el lanzamiento. 3–5 son claridad. 6 es el puente. 7 es higiene de agentes.

---

## Verificación por slice (browser)

Obligatorio en cada slice de UI (1–6):

1. Home `/` dark y un pass light
2. Mobile (~390px) y desktop: CTAs no se solapan con sticky
3. Click real de cada CTA tocado en el slice
4. Anclas de nav del slice
5. No regresiones en `/diagnostico` salvo slice 6

---

## Fuera de alcance

- Rediseño de tokens / tipografías / fondo líquido
- Testimonials inventados
- Inglés
- Reescribir curriculum del Hub
- Conectar Stripe en esta app
- Inventar precios de herramientas
)
