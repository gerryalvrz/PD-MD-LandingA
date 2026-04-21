"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"

type LiquidGradientBackgroundProps = {
  dark: boolean
}

type ColorScheme = {
  hexes: [string, string, string, string, string, string]
  darkBase: string
  gradientSize: number
  gradientCount: number
  speed: number
  c1Weight: number
  c2Weight: number
  bgHex: string
}

const SCHEMES: Record<number, ColorScheme> = {
  1: {
    hexes: ["#2E1032", "#000000", "#000000", "#000000", "#000000", "#3E1B50"],
    darkBase: "#000000",
    gradientSize: 0.45,
    gradientCount: 12,
    speed: 0.14,
    c1Weight: 0.9,
    c2Weight: 0.9,
    bgHex: "#000000",
  },
  2: {
    hexes: ["#FF6C50", "#40E0D0", "#FF6C50", "#40E0D0", "#FF6C50", "#40E0D0"],
    darkBase: "#0A0E27",
    gradientSize: 1.0,
    gradientCount: 6,
    speed: 0.28,
    c1Weight: 1.0,
    c2Weight: 1.0,
    bgHex: "#0A0E27",
  },
  3: {
    hexes: ["#F15A22", "#0A0E27", "#40E0D0", "#F15A22", "#0A0E27", "#40E0D0"],
    darkBase: "#0A0E27",
    gradientSize: 0.45,
    gradientCount: 12,
    speed: 0.34,
    c1Weight: 0.65,
    c2Weight: 1.5,
    bgHex: "#0A0E27",
  },
  4: {
    hexes: ["#F26633", "#2D6B6D", "#D1AF9C", "#F26633", "#2D6B6D", "#D1AF9C"],
    darkBase: "#FAFAFA",
    gradientSize: 0.8,
    gradientCount: 10,
    speed: 0.26,
    c1Weight: 1.0,
    c2Weight: 1.0,
    bgHex: "#FFFFFF",
  },
  5: {
    hexes: ["#F15A22", "#004238", "#F15A22", "#000000", "#F15A22", "#000000"],
    darkBase: "#0A0E27",
    gradientSize: 0.45,
    gradientCount: 12,
    speed: 0.34,
    c1Weight: 0.5,
    c2Weight: 1.8,
    bgHex: "#0A0E27",
  },
}

function hexToVector3(hex: string) {
  const clean = hex.replace("#", "")
  const value = parseInt(clean, 16)
  const r = ((value >> 16) & 255) / 255
  const g = ((value >> 8) & 255) / 255
  const b = (value & 255) / 255
  return new THREE.Vector3(r, g, b)
}

class TouchTexture {
  size = 64
  width = this.size
  height = this.size
  maxAge = 64
  radius = 0.25 * this.size
  speed = 1 / this.maxAge
  trail: Array<{ x: number; y: number; age: number; force: number; vx: number; vy: number }> = []
  last: { x: number; y: number } | null = null
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  texture: THREE.Texture

  constructor() {
    this.canvas = document.createElement("canvas")
    this.canvas.width = this.width
    this.canvas.height = this.height
    const ctx = this.canvas.getContext("2d")
    if (!ctx) throw new Error("Could not create 2D context for touch texture")
    this.ctx = ctx
    this.ctx.fillStyle = "black"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.texture = new THREE.Texture(this.canvas)
  }

  clear() {
    this.ctx.fillStyle = "black"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  addTouch(point: { x: number; y: number }) {
    let force = 0
    let vx = 0
    let vy = 0
    const last = this.last
    if (last) {
      const dx = point.x - last.x
      const dy = point.y - last.y
      if (dx === 0 && dy === 0) return
      const dd = dx * dx + dy * dy
      const d = Math.sqrt(dd)
      vx = dx / d
      vy = dy / d
      force = Math.min(dd * 20000, 2.0)
    }
    this.last = { x: point.x, y: point.y }
    this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy })
  }

  drawPoint(point: { x: number; y: number; age: number; force: number; vx: number; vy: number }) {
    const pos = {
      x: point.x * this.width,
      y: (1 - point.y) * this.height,
    }

    let intensity = 1
    if (point.age < this.maxAge * 0.3) {
      intensity = Math.sin((point.age / (this.maxAge * 0.3)) * (Math.PI / 2))
    } else {
      const t = 1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7)
      intensity = -t * (t - 2)
    }
    intensity *= point.force

    const radius = this.radius
    const color = `${((point.vx + 1) / 2) * 255}, ${((point.vy + 1) / 2) * 255}, ${intensity * 255}`
    const offset = this.size * 5
    this.ctx.shadowOffsetX = offset
    this.ctx.shadowOffsetY = offset
    this.ctx.shadowBlur = radius
    this.ctx.shadowColor = `rgba(${color},${0.2 * intensity})`

    this.ctx.beginPath()
    this.ctx.fillStyle = "rgba(255,0,0,1)"
    this.ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2)
    this.ctx.fill()
  }

  update() {
    this.clear()
    const speed = this.speed
    for (let i = this.trail.length - 1; i >= 0; i--) {
      const point = this.trail[i]
      const f = point.force * speed * (1 - point.age / this.maxAge)
      point.x += point.vx * f
      point.y += point.vy * f
      point.age++
      if (point.age > this.maxAge) {
        this.trail.splice(i, 1)
      } else {
        this.drawPoint(point)
      }
    }
    this.texture.needsUpdate = true
  }
}

export function LiquidGradientBackground({ dark }: LiquidGradientBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const uniformsRef = useRef<Record<string, THREE.IUniform> | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const defaultScheme = useMemo(() => (dark ? 1 : 4), [dark])
  const [activeScheme, setActiveScheme] = useState(defaultScheme)
  const [colorHexes, setColorHexes] = useState<[string, string, string, string, string, string]>(
    SCHEMES[defaultScheme].hexes
  )
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const applySchemeToShader = (scheme: ColorScheme) => {
    const uniforms = uniformsRef.current
    const scene = sceneRef.current
    if (!uniforms || !scene) return

    ;(uniforms.uColor1.value as THREE.Vector3).copy(hexToVector3(scheme.hexes[0]))
    ;(uniforms.uColor2.value as THREE.Vector3).copy(hexToVector3(scheme.hexes[1]))
    ;(uniforms.uColor3.value as THREE.Vector3).copy(hexToVector3(scheme.hexes[2]))
    ;(uniforms.uColor4.value as THREE.Vector3).copy(hexToVector3(scheme.hexes[3]))
    ;(uniforms.uColor5.value as THREE.Vector3).copy(hexToVector3(scheme.hexes[4]))
    ;(uniforms.uColor6.value as THREE.Vector3).copy(hexToVector3(scheme.hexes[5]))
    ;(uniforms.uDarkNavy.value as THREE.Vector3).copy(hexToVector3(scheme.darkBase))

    uniforms.uGradientSize.value = scheme.gradientSize
    uniforms.uGradientCount.value = scheme.gradientCount
    uniforms.uSpeed.value = scheme.speed
    uniforms.uColor1Weight.value = scheme.c1Weight
    uniforms.uColor2Weight.value = scheme.c2Weight
    scene.background = new THREE.Color(scheme.bgHex)
  }

  const applyHexesToShader = (hexes: [string, string, string, string, string, string]) => {
    const uniforms = uniformsRef.current
    if (!uniforms) return
    ;(uniforms.uColor1.value as THREE.Vector3).copy(hexToVector3(hexes[0]))
    ;(uniforms.uColor2.value as THREE.Vector3).copy(hexToVector3(hexes[1]))
    ;(uniforms.uColor3.value as THREE.Vector3).copy(hexToVector3(hexes[2]))
    ;(uniforms.uColor4.value as THREE.Vector3).copy(hexToVector3(hexes[3]))
    ;(uniforms.uColor5.value as THREE.Vector3).copy(hexToVector3(hexes[4]))
    ;(uniforms.uColor6.value as THREE.Vector3).copy(hexToVector3(hexes[5]))
  }

  const handleSetScheme = (schemeId: number) => {
    const scheme = SCHEMES[schemeId]
    if (!scheme) return
    setActiveScheme(schemeId)
    setColorHexes(scheme.hexes)
    applySchemeToShader(scheme)
  }

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    let rafId = 0
    const timer = new THREE.Timer()

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
      stencil: false,
      depth: false,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    root.appendChild(renderer.domElement)
    renderer.domElement.style.width = "100%"
    renderer.domElement.style.height = "100%"
    renderer.domElement.style.display = "block"
    renderer.domElement.style.position = "absolute"
    renderer.domElement.style.inset = "0"

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000)
    camera.position.z = 50
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    sceneRef.current = scene

    const touchTexture = new TouchTexture()

    const uniforms: Record<string, THREE.IUniform> = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uColor1: { value: new THREE.Vector3(0, 0, 0) },
      uColor2: { value: new THREE.Vector3(0, 0, 0) },
      uColor3: { value: new THREE.Vector3(0, 0, 0) },
      uColor4: { value: new THREE.Vector3(0, 0, 0) },
      uColor5: { value: new THREE.Vector3(0.345, 0.075, 0.298) },
      uColor6: { value: new THREE.Vector3(0.325, 0.055, 0.506) },
      uSpeed: { value: 0.28 },
      uIntensity: { value: 1.8 },
      uTouchTexture: { value: touchTexture.texture },
      uGrainIntensity: { value: 0.08 },
      uZoom: { value: 1.0 },
      uDarkNavy: { value: new THREE.Vector3(0, 0, 0) },
      uGradientSize: { value: 1.0 },
      uGradientCount: { value: 6.0 },
      uColor1Weight: { value: 1.0 },
      uColor2Weight: { value: 1.0 },
    }
    uniformsRef.current = uniforms

    const getViewSize = () => {
      const fovInRadians = (camera.fov * Math.PI) / 180
      const height = Math.abs(camera.position.z * Math.tan(fovInRadians / 2) * 2)
      return { width: height * camera.aspect, height }
    }

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vec3 pos = position.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
        vUv = uv;
      }
    `

    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform vec3 uColor4;
      uniform vec3 uColor5;
      uniform vec3 uColor6;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform sampler2D uTouchTexture;
      uniform float uGrainIntensity;
      uniform float uZoom;
      uniform vec3 uDarkNavy;
      uniform float uGradientSize;
      uniform float uGradientCount;
      uniform float uColor1Weight;
      uniform float uColor2Weight;
      varying vec2 vUv;

      float grain(vec2 uv, float time) {
        vec2 grainUv = uv * uResolution * 0.5;
        float grainValue = fract(sin(dot(grainUv + time, vec2(12.9898, 78.233))) * 43758.5453);
        return grainValue * 2.0 - 1.0;
      }

      vec3 getGradientColor(vec2 uv, float time) {
        float gradientRadius = uGradientSize;
        vec2 center1 = vec2(0.5 + sin(time * uSpeed * 0.4) * 0.4, 0.5 + cos(time * uSpeed * 0.5) * 0.4);
        vec2 center2 = vec2(0.5 + cos(time * uSpeed * 0.6) * 0.5, 0.5 + sin(time * uSpeed * 0.45) * 0.5);
        vec2 center3 = vec2(0.5 + sin(time * uSpeed * 0.35) * 0.45, 0.5 + cos(time * uSpeed * 0.55) * 0.45);
        vec2 center4 = vec2(0.5 + cos(time * uSpeed * 0.5) * 0.4, 0.5 + sin(time * uSpeed * 0.4) * 0.4);
        vec2 center5 = vec2(0.5 + sin(time * uSpeed * 0.7) * 0.35, 0.5 + cos(time * uSpeed * 0.6) * 0.35);
        vec2 center6 = vec2(0.5 + cos(time * uSpeed * 0.45) * 0.5, 0.5 + sin(time * uSpeed * 0.65) * 0.5);
        vec2 center7 = vec2(0.5 + sin(time * uSpeed * 0.55) * 0.38, 0.5 + cos(time * uSpeed * 0.48) * 0.42);
        vec2 center8 = vec2(0.5 + cos(time * uSpeed * 0.65) * 0.36, 0.5 + sin(time * uSpeed * 0.52) * 0.44);
        vec2 center9 = vec2(0.5 + sin(time * uSpeed * 0.42) * 0.41, 0.5 + cos(time * uSpeed * 0.58) * 0.39);
        vec2 center10 = vec2(0.5 + cos(time * uSpeed * 0.48) * 0.37, 0.5 + sin(time * uSpeed * 0.62) * 0.43);
        vec2 center11 = vec2(0.5 + sin(time * uSpeed * 0.68) * 0.33, 0.5 + cos(time * uSpeed * 0.44) * 0.46);
        vec2 center12 = vec2(0.5 + cos(time * uSpeed * 0.38) * 0.39, 0.5 + sin(time * uSpeed * 0.56) * 0.41);

        float dist1 = length(uv - center1);
        float dist2 = length(uv - center2);
        float dist3 = length(uv - center3);
        float dist4 = length(uv - center4);
        float dist5 = length(uv - center5);
        float dist6 = length(uv - center6);
        float dist7 = length(uv - center7);
        float dist8 = length(uv - center8);
        float dist9 = length(uv - center9);
        float dist10 = length(uv - center10);
        float dist11 = length(uv - center11);
        float dist12 = length(uv - center12);

        float influence1 = 1.0 - smoothstep(0.0, gradientRadius, dist1);
        float influence2 = 1.0 - smoothstep(0.0, gradientRadius, dist2);
        float influence3 = 1.0 - smoothstep(0.0, gradientRadius, dist3);
        float influence4 = 1.0 - smoothstep(0.0, gradientRadius, dist4);
        float influence5 = 1.0 - smoothstep(0.0, gradientRadius, dist5);
        float influence6 = 1.0 - smoothstep(0.0, gradientRadius, dist6);
        float influence7 = 1.0 - smoothstep(0.0, gradientRadius, dist7);
        float influence8 = 1.0 - smoothstep(0.0, gradientRadius, dist8);
        float influence9 = 1.0 - smoothstep(0.0, gradientRadius, dist9);
        float influence10 = 1.0 - smoothstep(0.0, gradientRadius, dist10);
        float influence11 = 1.0 - smoothstep(0.0, gradientRadius, dist11);
        float influence12 = 1.0 - smoothstep(0.0, gradientRadius, dist12);

        vec2 rotatedUv1 = uv - 0.5;
        float angle1 = time * uSpeed * 0.15;
        rotatedUv1 = vec2(
          rotatedUv1.x * cos(angle1) - rotatedUv1.y * sin(angle1),
          rotatedUv1.x * sin(angle1) + rotatedUv1.y * cos(angle1)
        );
        rotatedUv1 += 0.5;

        vec2 rotatedUv2 = uv - 0.5;
        float angle2 = -time * uSpeed * 0.12;
        rotatedUv2 = vec2(
          rotatedUv2.x * cos(angle2) - rotatedUv2.y * sin(angle2),
          rotatedUv2.x * sin(angle2) + rotatedUv2.y * cos(angle2)
        );
        rotatedUv2 += 0.5;

        float radialGradient1 = length(rotatedUv1 - 0.5);
        float radialGradient2 = length(rotatedUv2 - 0.5);
        float radialInfluence1 = 1.0 - smoothstep(0.0, 0.8, radialGradient1);
        float radialInfluence2 = 1.0 - smoothstep(0.0, 0.8, radialGradient2);

        vec3 color = vec3(0.0);
        color += uColor1 * influence1 * (0.55 + 0.45 * sin(time * uSpeed)) * uColor1Weight;
        color += uColor2 * influence2 * (0.55 + 0.45 * cos(time * uSpeed * 1.2)) * uColor2Weight;
        color += uColor3 * influence3 * (0.55 + 0.45 * sin(time * uSpeed * 0.8)) * uColor1Weight;
        color += uColor4 * influence4 * (0.55 + 0.45 * cos(time * uSpeed * 1.3)) * uColor2Weight;
        color += uColor5 * influence5 * (0.55 + 0.45 * sin(time * uSpeed * 1.1)) * uColor1Weight;
        color += uColor6 * influence6 * (0.55 + 0.45 * cos(time * uSpeed * 0.9)) * uColor2Weight;

        if (uGradientCount > 6.0) {
          color += uColor1 * influence7 * (0.55 + 0.45 * sin(time * uSpeed * 1.4)) * uColor1Weight;
          color += uColor2 * influence8 * (0.55 + 0.45 * cos(time * uSpeed * 1.5)) * uColor2Weight;
          color += uColor3 * influence9 * (0.55 + 0.45 * sin(time * uSpeed * 1.6)) * uColor1Weight;
          color += uColor4 * influence10 * (0.55 + 0.45 * cos(time * uSpeed * 1.7)) * uColor2Weight;
        }
        if (uGradientCount > 10.0) {
          color += uColor5 * influence11 * (0.55 + 0.45 * sin(time * uSpeed * 1.8)) * uColor1Weight;
          color += uColor6 * influence12 * (0.55 + 0.45 * cos(time * uSpeed * 1.9)) * uColor2Weight;
        }

        color += mix(uColor1, uColor3, radialInfluence1) * 0.45 * uColor1Weight;
        color += mix(uColor2, uColor4, radialInfluence2) * 0.4 * uColor2Weight;
        color = clamp(color, vec3(0.0), vec3(1.0)) * uIntensity;
        float luminance = dot(color, vec3(0.299, 0.587, 0.114));
        color = mix(vec3(luminance), color, 1.35);
        color = pow(color, vec3(0.92));

        float brightness1 = length(color);
        float mixFactor1 = max(brightness1 * 1.2, 0.15);
        color = mix(uDarkNavy, color, mixFactor1);

        float maxBrightness = 1.0;
        float brightness = length(color);
        if (brightness > maxBrightness) {
          color = color * (maxBrightness / brightness);
        }
        return color;
      }

      void main() {
        vec2 uv = vUv;
        vec4 touchTex = texture2D(uTouchTexture, uv);
        float vx = -(touchTex.r * 2.0 - 1.0);
        float vy = -(touchTex.g * 2.0 - 1.0);
        float intensity = touchTex.b;
        uv.x += vx * 0.8 * intensity;
        uv.y += vy * 0.8 * intensity;

        vec2 center = vec2(0.5);
        float dist = length(uv - center);
        float ripple = sin(dist * 20.0 - uTime * 3.0) * 0.04 * intensity;
        float wave = sin(dist * 15.0 - uTime * 2.0) * 0.03 * intensity;
        uv += vec2(ripple + wave);

        vec3 color = getGradientColor(uv, uTime);
        float grainValue = grain(uv, uTime);
        color += grainValue * uGrainIntensity;

        float timeShift = uTime * 0.5;
        color.r += sin(timeShift) * 0.02;
        color.g += cos(timeShift * 1.4) * 0.02;
        color.b += sin(timeShift * 1.2) * 0.02;

        float brightness2 = length(color);
        float mixFactor2 = max(brightness2 * 1.2, 0.15);
        color = mix(uDarkNavy, color, mixFactor2);
        color = clamp(color, vec3(0.0), vec3(1.0));

        float maxBrightness = 1.0;
        float brightness = length(color);
        if (brightness > maxBrightness) {
          color = color * (maxBrightness / brightness);
        }

        gl_FragColor = vec4(color, 1.0);
      }
    `

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    })

    const initMesh = () => {
      const viewSize = getViewSize()
      const geometry = new THREE.PlaneGeometry(viewSize.width, viewSize.height, 1, 1)
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.z = 0
      scene.add(mesh)
      return mesh
    }

    const mesh = initMesh()

    const onResize = () => {
      const width = root.clientWidth
      const height = root.clientHeight
      if (width === 0 || height === 0) return
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
      ;(uniforms.uResolution.value as THREE.Vector2).set(width, height)

      const viewSize = getViewSize()
      mesh.geometry.dispose()
      mesh.geometry = new THREE.PlaneGeometry(viewSize.width, viewSize.height, 1, 1)
    }

    const onMouseMove = (ev: MouseEvent) => {
      const rect = root.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const x = (ev.clientX - rect.left) / rect.width
      const y = 1 - (ev.clientY - rect.top) / rect.height
      if (x < 0 || x > 1 || y < 0 || y > 1) return
      touchTexture.addTouch({ x, y })
    }

    const onTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0]
      if (!touch) return
      const rect = root.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const x = (touch.clientX - rect.left) / rect.width
      const y = 1 - (touch.clientY - rect.top) / rect.height
      if (x < 0 || x > 1 || y < 0 || y > 1) return
      touchTexture.addTouch({ x, y })
    }

    const tick = () => {
      timer.update()
      const delta = Math.min(timer.getDelta(), 0.1)
      uniforms.uTime.value += delta
      touchTexture.update()
      renderer.render(scene, camera)
      rafId = requestAnimationFrame(tick)
    }

    applySchemeToShader(SCHEMES[defaultScheme])
    applyHexesToShader(SCHEMES[defaultScheme].hexes)
    onResize()
    rafId = requestAnimationFrame(tick)

    window.addEventListener("resize", onResize)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("touchmove", onTouchMove, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("touchmove", onTouchMove)
      scene.remove(mesh)
      mesh.geometry.dispose()
      material.dispose()
      touchTexture.texture.dispose()
      renderer.dispose()
      if (renderer.domElement.parentElement === root) {
        root.removeChild(renderer.domElement)
      }
      uniformsRef.current = null
      sceneRef.current = null
    }
  }, [defaultScheme])

  const handleColorChange = (index: number, value: string) => {
    const next = [...colorHexes] as [string, string, string, string, string, string]
    next[index] = value.toUpperCase()
    setColorHexes(next)
    applyHexesToShader(next)
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // no-op
    }
  }

  return (
    <>
      <div
        ref={rootRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 220,
          right: 24,
          zIndex: 8,
          display: "flex",
          gap: 8,
          pointerEvents: "auto",
        }}
      >
        {[1, 2, 3, 4, 5].map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => handleSetScheme(id)}
            style={{
              minWidth: 44,
              height: 36,
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,0.35)",
              background: activeScheme === id ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {id}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setIsPanelOpen((v) => !v)}
        style={{
          position: "absolute",
          top: 264,
          right: 24,
          zIndex: 8,
          border: "1px solid rgba(255,255,255,0.35)",
          background: "rgba(255,255,255,0.12)",
          color: "#fff",
          borderRadius: 10,
          padding: "10px 14px",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          cursor: "pointer",
          pointerEvents: "auto",
        }}
      >
        {isPanelOpen ? "Cerrar adjuster" : "Adjust colors"}
      </button>

      {isPanelOpen && (
        <div
          style={{
            position: "absolute",
            top: 314,
            right: 24,
            zIndex: 9,
            width: "min(420px, calc(100% - 48px))",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.26)",
            background: "rgba(255,255,255,0.10)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            padding: 16,
            pointerEvents: "auto",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ margin: 0, color: "#fff", fontSize: 16, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Color Adjuster
            </h3>
            <button
              type="button"
              onClick={() => setIsPanelOpen(false)}
              style={{ background: "transparent", border: "none", color: "#fff", fontSize: 24, cursor: "pointer" }}
            >
              x
            </button>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {colorHexes.map((hex, idx) => (
              <div key={`color-${idx + 1}`} style={{ display: "grid", gridTemplateColumns: "56px 1fr auto", gap: 8 }}>
                <input
                  type="color"
                  value={hex}
                  onChange={(e) => handleColorChange(idx, e.target.value)}
                  style={{
                    width: 56,
                    height: 36,
                    border: "1px solid rgba(255,255,255,0.35)",
                    borderRadius: 8,
                    background: "transparent",
                    padding: 0,
                    cursor: "pointer",
                  }}
                />
                <input
                  type="text"
                  readOnly
                  value={hex}
                  style={{
                    width: "100%",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 8,
                    background: "rgba(0,0,0,0.25)",
                    color: "#fff",
                    padding: "8px 10px",
                    fontWeight: 600,
                  }}
                />
                <button
                  type="button"
                  onClick={() => void handleCopy(hex)}
                  style={{
                    border: "1px solid rgba(255,255,255,0.35)",
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.14)",
                    color: "#fff",
                    fontWeight: 600,
                    padding: "0 10px",
                    cursor: "pointer",
                  }}
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
