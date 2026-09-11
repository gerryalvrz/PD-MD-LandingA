/*
 * @ozzy · OpenShaders
 * https://openshaders.com/@ozzy
 * WebGL2 · JavaScript module · pixel
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

const float HUE = 0.800378382;
const float HUE_SPREAD = 0.128298715;
const float HUE_TRAVEL = 2.21683359;
const float CHROMA = 0.10855937;
const float LIGHTNESS = 0.48204127;
const float COLOUR_CYCLE = 0.180320606;
const float THETA = 2.13843346;
const float SHEAR = 0.959096253;
const float SHRINK = 0.949985027;
const float LAYERS = 76.0;
const float WARP_FREQ_X = 0.550294459;
const float WARP_FREQ_Y = 2.89887476;
const float WARP_AMP_X = 0.125778213;
const float WARP_AMP_Y = 0.0237466618;
const float ASPECT_X = 1.88647902;
const float ASPECT_Y = 0.136681676;
const float OFFSET_X = 0.415932;
const float OFFSET_Y = -0.0316232219;
const float TILT = 2.47161794;
const float ZOOM = 1.03617585;
const float CENTRE_X = 0.600753486;
const float CENTRE_Y = -0.466731042;
const float GLOW_SIZE = 0.00171076821;
const float FALLOFF = 0.320297986;
const float VIGNETTE = 0.00557572674;
const float FLOW_SPEED = 0.502458811;
const float FLOW_DIRECTION = -1.0;
const float BREATH_RATE = 0.579693556;
const float BREATH_AMOUNT = 0.0841006935;
const float PHASE = 91.1688538;
const float ECHO = 0.49448657;
const float ECHO_SHIFT = -0.185279146;
const float SOFTNESS = 0.00199934281;
const float LIGHT_SWING = 0.133718356;

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
uniform vec2 iResolution;
uniform float iTime;
uniform float uLightMode;
uniform vec3 uDarkBackground;
uniform vec3 uLightBackground;
uniform float uPixelRatio;
out vec4 fragColor;

const float uStrength = 0.809774816;
const float uScale = 0.996147633;
const float uSeed = 0.54160887;

const float TAU = 6.28318530718;
const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);

vec3 toInk(vec3 c) { return mix(c - uDarkBackground, uLightBackground - c, uLightMode); }
vec3 fromInk(vec3 ink) { return mix(uDarkBackground + ink, uLightBackground - ink, uLightMode); }
vec3 sceneInk(vec2 uv) { return toInk(texture(tScene, clamp(uv, 0.0, 1.0)).rgb); }

vec3 pixelate(vec2 frag) {
  float cell = max(3.0, floor(uScale * 6.0 * uPixelRatio + 0.5));
  vec2 grid = floor(frag / cell);
  vec2 centre = (grid + 0.5) * cell;
  vec3 ink = vec3(0.0);
  ink += sceneInk((centre + cell * vec2(-0.25, -0.25)) / iResolution);
  ink += sceneInk((centre + cell * vec2(0.25, -0.25)) / iResolution);
  ink += sceneInk((centre + cell * vec2(-0.25, 0.25)) / iResolution);
  ink += sceneInk((centre + cell * vec2(0.25, 0.25)) / iResolution);
  return ink * 0.25;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec3 ink = pixelate(frag);
  vec3 color = fromInk(clamp(ink, 0.0, 1.0));
  fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`

const MAX_PIXELS = 2400000
const THEME_EASE = 7

export interface OzzyShaderOptions {
  theme?: "dark" | "light"
  autoplay?: boolean
  background?: { dark?: string; light?: string }
  onError?: (error: Error) => void
  signal?: AbortSignal
}

export interface OzzyShaderHandle {
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
  options: OzzyShaderOptions,
  draw: (time: number, theme: number, pixelRatio: number) => void,
  canvas: HTMLCanvasElement,
  release: () => void,
  maxDimension = Infinity,
): OzzyShaderHandle {
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

export function createShader(canvas: HTMLCanvasElement, options: OzzyShaderOptions = {}): OzzyShaderHandle {
  const gl = canvas.getContext("webgl2", { alpha: false, antialias: false, depth: false, stencil: false })
  if (!gl) throw new Error("WebGL2 is not available in this browser.")
  const dark = parseHex(options.background?.dark ?? "#090909")
  const light = parseHex(options.background?.light ?? "#ffffff")

  const field = compile(gl, FIELD_SHADER)
  const fieldUniforms = uniforms(gl, field, ["iResolution", "iTime", "uLightMode", "uDarkBackground", "uLightBackground"])
  const post = compile(gl, RARITY_SHADER)
  const postUniforms = uniforms(gl, post, [
    "tScene",
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
    },
    Math.min(gl.getParameter(gl.MAX_TEXTURE_SIZE), gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)),
  )
}
