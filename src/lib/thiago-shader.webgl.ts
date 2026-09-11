/*
 * @thiago · OpenShaders
 * https://openshaders.com/@thiago
 * WebGL2 · JavaScript module · ascii
 */

const VERTEX_SHADER = `#version 300 es
void main() {
  vec2 position = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(position * 2.0 - 1.0, 0.0, 1.0);
}
`

const FIELD_SHADER = `#version 300 es
precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform float uLightMode;
uniform vec3 uDarkBackground;
uniform vec3 uLightBackground;
out vec4 fragColor;

const float HUE = 0.484620959;
const float HUE_SPREAD = 0.341715127;
const float HUE_TRAVEL = 1.77796519;
const float CHROMA = 0.138092861;
const float LIGHTNESS = 0.503435254;
const float COLOUR_CYCLE = 0.150891945;
const float THETA = 2.11682868;
const float SHEAR = 0.965542614;
const float SHRINK = 0.946440101;
const float LAYERS = 92.0;
const float WARP_FREQ_X = 0.339075059;
const float WARP_FREQ_Y = 2.53393435;
const float WARP_AMP_X = 0.126797557;
const float WARP_AMP_Y = 0.0218412597;
const float ASPECT_X = 2.40788031;
const float ASPECT_Y = 0.192960188;
const float OFFSET_X = 0.395338953;
const float OFFSET_Y = -0.0557533428;
const float TILT = 1.38376307;
const float ZOOM = 0.918497562;
const float CENTRE_X = 0.378092825;
const float CENTRE_Y = 0.622739851;
const float GLOW_SIZE = 0.00129726087;
const float FALLOFF = 0.338763356;
const float VIGNETTE = 0.0518569238;
const float FLOW_SPEED = 0.468923122;
const float FLOW_DIRECTION = 1.0;
const float BREATH_RATE = 0.506781757;
const float BREATH_AMOUNT = 0.0761116073;
const float PHASE = 28.945303;
const float ECHO = 0.0;
const float ECHO_SHIFT = 0.137000725;
const float SOFTNESS = 0.00129308086;
const float LIGHT_SWING = 0.196232855;

const float TAU = 6.28318530718;

vec3 oklchToLinear(float L, float C, float h) {
  float a = C * cos(h), b = C * sin(h);
  float l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  float m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  float s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  vec3 lms = vec3(l_, m_, s_);
  lms = lms * lms * lms;
  return mat3(4.0767416621, -1.2684380046, -0.0041960863,
              -3.3077115913, 2.6097574011, -0.7034186147,
              0.2309699292, -0.3413193965, 1.7076147010) * lms;
}

float blueNoise(vec2 p, float frame) {
  p += 5.588238 * mod(frame, 64.0);
  return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y));
}

void main() {
  vec2 R = iResolution.xy;
  vec2 pos = (gl_FragCoord.xy - 0.5 * R) / R.y;
  float t = iTime * FLOW_SPEED * FLOW_DIRECTION + PHASE;
  float breath = (-sin(iTime * BREATH_RATE * 1.5) + sin(iTime * BREATH_RATE + 1.0)) * 0.25 + 0.5;

  vec2 u = (pos - vec2(CENTRE_X, CENTRE_Y)) * (ZOOM - breath * BREATH_AMOUNT);
  float ct = cos(TILT), st = sin(TILT);
  u = mat2(ct, st, -st, ct) * u;

  mat2 fold = mat2(cos(THETA), sin(THETA), -SHEAR, cos(THETA));

  float hue0 = HUE * TAU;
  float hue1 = hue0 + HUE_SPREAD * TAU;
  vec3 color = vec3(0.0);

  for (float i = 1.0; i <= 96.0; i += 1.0) {
    if (i > LAYERS) break;
    u.x += -sin(u.y * WARP_FREQ_X + t + i * 0.007) * WARP_AMP_X;
    u.y += -sin(u.x * WARP_FREQ_Y - t + i * 0.02) * WARP_AMP_Y;
    u = fold * u * SHRINK;

    vec2 q = u - vec2(OFFSET_X + breath * 0.1, OFFSET_Y);
    vec2 s = vec2(q.x * ASPECT_X, q.y * ASPECT_Y);
    float glow = GLOW_SIZE / (dot(s, s) + SOFTNESS);
#ifndef SKIP_ECHO
    vec2 e = vec2((q.x - ECHO_SHIFT) * ASPECT_X, s.y);
    glow += ECHO * GLOW_SIZE / (dot(e, e) + SOFTNESS);
#endif
    glow *= 0.25 + breath * 0.4;

    float r = length(u);
    float k = sin(i * COLOUR_CYCLE + t * 1.2 + r * HUE_TRAVEL) * 0.5 + 0.5;
    vec3 tint = clamp(oklchToLinear(LIGHTNESS + LIGHT_SWING * k, CHROMA * (0.75 + 0.35 * k), mix(hue0, hue1, k)), 0.0, 1.0);
    color += glow * tint * exp2(-r * FALLOFF);
  }

  vec3 x = max(color, 0.0);
  color = (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14);
  color = pow(clamp(color, 0.0, 1.0), vec3(0.85, 0.92, 0.98));

  float edge = smoothstep(0.5, 1.6, length(pos));
  color *= 1.0 - edge * VIGNETTE;

  vec3 dark = uDarkBackground + color * (1.0 - uDarkBackground);
  float strength = max(color.r, max(color.g, color.b));
  vec3 light = uLightBackground * (1.0 - strength) + color * 0.96;
  color = mix(dark, light, uLightMode);

  color += (blueNoise(gl_FragCoord.xy, floor(iTime * 24.0)) - 0.5) / 255.0;
  fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`

const RARITY_SHADER = `#version 300 es
precision highp float;

uniform sampler2D tScene;
uniform sampler2D tGlyphs;
uniform vec2 iResolution;
uniform float iTime;
uniform float uLightMode;
uniform vec3 uDarkBackground;
uniform vec3 uLightBackground;
uniform float uPixelRatio;
out vec4 fragColor;

const float uStrength = 1.12599456;
const float uScale = 0.959364891;
const float uSeed = 0.195233852;
const float uGlyphCount = 10.0;

const float TAU = 6.28318530718;
const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);

vec3 toInk(vec3 c) { return mix(c - uDarkBackground, uLightBackground - c, uLightMode); }
vec3 fromInk(vec3 ink) { return mix(uDarkBackground + ink, uLightBackground - ink, uLightMode); }
vec3 sceneInk(vec2 uv) { return toInk(texture(tScene, clamp(uv, 0.0, 1.0)).rgb); }

vec3 ascii(vec2 frag) {
  vec2 cellPx = vec2(0.62, 1.0) * floor(uScale * 9.0 * uPixelRatio + 0.5);
  vec2 cell = floor(frag / cellPx);
  vec2 centre = (cell + 0.5) * cellPx;
  vec3 ink = vec3(0.0);
  ink += sceneInk(centre / iResolution) * 2.0;
  ink += sceneInk((centre + cellPx * vec2(0.3, 0.3)) / iResolution);
  ink += sceneInk((centre + cellPx * vec2(-0.3, 0.3)) / iResolution);
  ink += sceneInk((centre + cellPx * vec2(0.3, -0.3)) / iResolution);
  ink += sceneInk((centre + cellPx * vec2(-0.3, -0.3)) / iResolution);
  ink /= 6.0;
  float level = pow(clamp(dot(ink, LUMA) * (0.9 + 0.3 * uStrength), 0.0, 1.0), 0.9);
  float glyph = floor(level * (uGlyphCount - 1.0) + 0.5);
  vec2 local = (frag - cell * cellPx) / cellPx;
  vec2 atlas = vec2((glyph + local.x) / uGlyphCount, local.y);
  float mask = texture(tGlyphs, atlas).r;
  vec3 under = sceneInk(frag / iResolution) * 0.45;
  return under + ink * mask * (1.0 + 0.7 * uLightMode);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec3 ink = ascii(frag);
  vec3 color = fromInk(clamp(ink, 0.0, 1.0));
  fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`

const GLYPHS = " .:;+*oO8@"
const GLYPH_CELL = { width: 48, height: 80 }
const GLYPH_MIP_LEVELS = 5
const GLYPH_FONT = "500 62px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"

const MAX_PIXELS = 2400000
const THEME_EASE = 7

export interface ThiagoShaderOptions {
  theme?: "dark" | "light"
  autoplay?: boolean
  background?: { dark?: string; light?: string }
  onError?: (error: Error) => void
  signal?: AbortSignal
}

export interface ThiagoShaderHandle {
  setTheme: (theme: "dark" | "light") => void
  render: (time: number) => void
  destroy: () => void
}

function parseHex(hex: string) {
  const match = /^#([0-9a-f]{6})$/i.exec(hex.trim())
  if (!match) throw new Error(`Background colours must be #rrggbb, got "${hex}".`)
  return [0, 2, 4].map((i) => parseInt(match[1].slice(i, i + 2), 16) / 255)
}

function animate(
  options: ThiagoShaderOptions,
  draw: (time: number, theme: number, pixelRatio: number) => void,
  canvas: HTMLCanvasElement,
  release: () => void,
  maxDimension = Infinity,
): ThiagoShaderHandle {
  const autoplay = options.autoplay !== false
  const stillness = window.matchMedia("(prefers-reduced-motion: reduce)")
  let resolution = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`)
  let deviceRatio = window.devicePixelRatio || 1
  let width = canvas.clientWidth
  let height = canvas.clientHeight
  let visible = true
  let disposed = false
  let targetTheme = options.theme === "light" ? 1 : 0
  let theme = targetTheme
  let frame = 0
  let elapsed = 0
  let lastTime = 0
  let previous: number | null = null

  function canDraw() {
    return !disposed && !document.hidden && visible && width > 0 && height > 0
  }

  function fitCanvas() {
    const scale = Math.min(
      deviceRatio,
      2,
      Math.sqrt(MAX_PIXELS / (width * height)),
      maxDimension / width,
      maxDimension / height,
    )
    const w = Math.max(1, Math.floor(width * scale))
    const h = Math.max(1, Math.floor(height * scale))
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    return w / width
  }

  function render(time: number) {
    if (disposed) return
    lastTime = time
    if (!canDraw()) return
    try {
      draw(time, theme, fitCanvas())
    } catch (error) {
      destroy()
      const failure = error instanceof Error ? error : new Error(String(error))
      if (options.onError) options.onError(failure)
      else console.error(failure)
    }
  }

  function schedule() {
    if (!frame && canDraw()) frame = requestAnimationFrame(tick)
  }

  function refresh() {
    if (!canDraw()) {
      cancelAnimationFrame(frame)
      frame = 0
      previous = null
    } else schedule()
  }

  function tick(now: number) {
    frame = 0
    if (!canDraw()) {
      previous = null
      return
    }
    const delta = previous === null ? 0 : Math.min((now - previous) / 1000, 0.1)
    previous = now
    if (autoplay) {
      if (!stillness.matches) elapsed += delta
      theme += (targetTheme - theme) * (1 - Math.exp(-delta * THEME_EASE))
      if (Math.abs(targetTheme - theme) < 0.002) theme = targetTheme
    }
    render(autoplay ? elapsed : lastTime)
    if (autoplay && (!stillness.matches || theme !== targetTheme)) schedule()
    else previous = null
  }

  function pixelRatioChanged() {
    if (disposed) return
    const next = window.devicePixelRatio || 1
    if (deviceRatio === next) return
    deviceRatio = next
    resolution.removeEventListener("change", pixelRatioChanged)
    resolution = window.matchMedia(`(resolution: ${next}dppx)`)
    resolution.addEventListener("change", pixelRatioChanged)
    refresh()
  }

  const observer = new ResizeObserver(([entry]) => {
    if (disposed || !entry) return
    const next = entry.contentRect
    if (width === next.width && height === next.height) return
    width = next.width
    height = next.height
    refresh()
  })
  const intersection = new IntersectionObserver(([entry]) => {
    if (disposed || !entry || visible === entry.isIntersecting) return
    visible = entry.isIntersecting
    refresh()
  })

  function destroy() {
    if (disposed) return
    disposed = true
    cancelAnimationFrame(frame)
    frame = 0
    observer.disconnect()
    intersection.disconnect()
    resolution.removeEventListener("change", pixelRatioChanged)
    stillness.removeEventListener("change", refresh)
    document.removeEventListener("visibilitychange", refresh)
    window.removeEventListener("resize", pixelRatioChanged)
    options.signal?.removeEventListener("abort", destroy)
    release()
  }

  observer.observe(canvas)
  intersection.observe(canvas)
  resolution.addEventListener("change", pixelRatioChanged)
  stillness.addEventListener("change", refresh)
  document.addEventListener("visibilitychange", refresh)
  window.addEventListener("resize", pixelRatioChanged)
  options.signal?.addEventListener("abort", destroy, { once: true })
  if (options.signal?.aborted) destroy()
  else schedule()

  return {
    setTheme(next) {
      if (disposed) return
      targetTheme = next === "light" ? 1 : 0
      if (autoplay) refresh()
      else {
        theme = targetTheme
        render(lastTime)
      }
    },
    render,
    destroy,
  }
}

function attach(gl: WebGL2RenderingContext, program: WebGLProgram, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error("WebGL could not create a shader object.")
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(`Shader failed to compile: ${gl.getShaderInfoLog(shader)}`)
  }
  gl.attachShader(program, shader)
  gl.deleteShader(shader)
}

function compile(gl: WebGL2RenderingContext, fragmentSource: string) {
  const program = gl.createProgram()
  if (!program) throw new Error("WebGL could not create a program object.")
  attach(gl, program, gl.VERTEX_SHADER, VERTEX_SHADER)
  attach(gl, program, gl.FRAGMENT_SHADER, fragmentSource)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`Shader failed to link: ${gl.getProgramInfoLog(program)}`)
  }
  return program
}

function uniforms(gl: WebGL2RenderingContext, program: WebGLProgram, names: string[]) {
  return Object.fromEntries(names.map((name) => [name, gl.getUniformLocation(program, name)]))
}

function createGlyphAtlas() {
  const width = GLYPH_CELL.width * GLYPHS.length
  const height = GLYPH_CELL.height
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext("2d", { willReadFrequently: true })
  if (!context) throw new Error("A 2D canvas context is needed to draw the glyph atlas.")
  context.fillStyle = "#000"
  context.fillRect(0, 0, width, height)
  context.fillStyle = "#fff"
  context.textAlign = "center"
  context.textBaseline = "middle"
  context.font = GLYPH_FONT
  for (let i = 0; i < GLYPHS.length; i++) {
    context.fillText(GLYPHS[i], i * GLYPH_CELL.width + GLYPH_CELL.width / 2, height / 2 + height * 0.04)
  }
  const levels = [context.getImageData(0, 0, width, height).data]
  for (let level = 1, w = width, h = height; level < GLYPH_MIP_LEVELS; level++) {
    const source = levels[level - 1]
    const next = new Uint8ClampedArray((w / 2) * (h / 2) * 4)
    for (let y = 0; y < h / 2; y++) {
      for (let x = 0; x < w / 2; x++) {
        const a = (y * 2 * w + x * 2) * 4
        const b = a + 4
        const c = a + w * 4
        const d = c + 4
        for (let ch = 0; ch < 4; ch++) next[(y * (w / 2) + x) * 4 + ch] = (source[a + ch] + source[b + ch] + source[c + ch] + source[d + ch] + 2) >> 2
      }
    }
    levels.push(next)
    w /= 2
    h /= 2
  }
  return { width, height, levels }
}

function uploadGlyphAtlas(gl: WebGL2RenderingContext) {
  const atlas = createGlyphAtlas()
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
  atlas.levels.forEach((pixels, level) => {
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      gl.RGBA,
      atlas.width >> level,
      atlas.height >> level,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixels,
    )
  })
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, atlas.levels.length - 1)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  return texture
}

export function createShader(canvas: HTMLCanvasElement, options: ThiagoShaderOptions = {}): ThiagoShaderHandle {
  const gl = canvas.getContext("webgl2", { alpha: false, antialias: false, depth: false, stencil: false })
  if (!gl) throw new Error("WebGL2 is not available in this browser.")
  const dark = parseHex(options.background?.dark ?? "#090909")
  const light = parseHex(options.background?.light ?? "#ffffff")

  const field = compile(gl, FIELD_SHADER)
  const fieldUniforms = uniforms(gl, field, ["iResolution", "iTime", "uLightMode", "uDarkBackground", "uLightBackground"])
  const post = compile(gl, RARITY_SHADER)
  const postUniforms = uniforms(gl, post, [
    "tScene",
    "tGlyphs",
    "iResolution",
    "iTime",
    "uLightMode",
    "uDarkBackground",
    "uLightBackground",
    "uPixelRatio",
  ])
  const framebuffer = gl.createFramebuffer()
  const scene = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, scene)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  let sceneWidth = 0
  let sceneHeight = 0
  const glyphs = uploadGlyphAtlas(gl)

  const setFrame = (
    locations: Record<string, WebGLUniformLocation | null>,
    time: number,
    themeValue: number,
  ) => {
    gl.uniform2f(locations.iResolution, canvas.width, canvas.height)
    gl.uniform1f(locations.iTime, time)
    gl.uniform1f(locations.uLightMode, themeValue)
    gl.uniform3fv(locations.uDarkBackground, dark)
    gl.uniform3fv(locations.uLightBackground, light)
  }

  return animate(
    options,
    (time, themeValue, pixelRatio) => {
      const { width, height } = canvas
      gl.viewport(0, 0, width, height)
      if (sceneWidth !== width || sceneHeight !== height) {
        sceneWidth = width
        sceneHeight = height
        gl.bindTexture(gl.TEXTURE_2D, scene)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, scene, 0)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      }
      const drawThemed = (mode: number) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
        gl.useProgram(field)
        setFrame(fieldUniforms, time, mode)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)

        gl.useProgram(post)
        setFrame(postUniforms, time, mode)
        gl.uniform1f(postUniforms.uPixelRatio, pixelRatio)
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, scene)
        gl.uniform1i(postUniforms.tScene, 0)
        gl.activeTexture(gl.TEXTURE1)
        gl.bindTexture(gl.TEXTURE_2D, glyphs)
        gl.uniform1i(postUniforms.tGlyphs, 1)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
      }
      if (themeValue <= 0 || themeValue >= 1) {
        drawThemed(themeValue)
        return
      }
      drawThemed(0)
      gl.enable(gl.BLEND)
      gl.blendColor(0, 0, 0, themeValue)
      gl.blendFunc(gl.CONSTANT_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA)
      drawThemed(1)
      gl.disable(gl.BLEND)
    },
    canvas,
    () => {
      gl.deleteProgram(field)
      gl.deleteProgram(post)
      gl.deleteFramebuffer(framebuffer)
      gl.deleteTexture(scene)
      gl.deleteTexture(glyphs)
    },
    Math.min(gl.getParameter(gl.MAX_TEXTURE_SIZE), gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)),
  )
}
