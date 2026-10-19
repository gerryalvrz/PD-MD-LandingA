"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import * as THREE from "three"
import "./color-bends.css"

const MAX_COLORS = 8

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

const fragmentShader = `
#define MAX_COLORS ${MAX_COLORS}
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRotation;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
uniform int uIterations;
uniform float uIntensity;
uniform float uBandWidth;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rotated = vec2(
    p.x * uRotation.x - p.y * uRotation.y,
    p.x * uRotation.y + p.y * uRotation.x
  );
  vec2 q = vec2(rotated.x * (uCanvas.x / uCanvas.y), rotated.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  q += (uPointer - rotated) * uMouseInfluence * 0.2;

  for (int pass = 0; pass < 5; pass++) {
    if (pass >= uIterations - 1) break;
    vec2 ripple = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
    q += (ripple - q) * 0.15;
  }

  vec3 color = vec3(0.0);
  float alpha = 1.0;

  if (uColorCount > 0) {
    vec2 samplePoint = q;
    vec3 accumulated = vec3(0.0);
    float coverage = 0.0;

    for (int index = 0; index < MAX_COLORS; index++) {
      if (index >= uColorCount) break;
      samplePoint -= 0.01;
      vec2 ripple = sin(
        1.5 * (samplePoint.yx * uFrequency) + 2.0 * cos(samplePoint * uFrequency)
      );
      float base = length(
        ripple + sin(5.0 * ripple.y * uFrequency - 3.0 * t + float(index)) / 4.0
      );
      float cappedWarp = clamp(uWarpStrength, 0.0, 1.0);
      float warpMix = pow(cappedWarp, 0.3);
      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
      vec2 warped = samplePoint + (ripple - samplePoint) * cappedWarp * gain;
      float displaced = length(
        warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(index)) / 4.0
      );
      float distanceField = mix(base, displaced, warpMix);
      float weight = 1.0 - exp(-uBandWidth / exp(uBandWidth * distanceField));
      accumulated += uColors[index] * weight;
      coverage = max(coverage, weight);
    }

    color = clamp(accumulated, 0.0, 1.0);
    alpha = uTransparent > 0 ? coverage : 1.0;
  }

  color *= uIntensity;

  if (uNoise > 0.0001) {
    float grain = fract(
      sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123
    );
    color = clamp(color + (grain - 0.5) * uNoise, 0.0, 1.0);
  }

  vec3 rgb = uTransparent > 0 ? color * alpha : color;
  gl_FragColor = vec4(rgb, alpha);
}
`

export type ColorBendsProps = {
  colors?: string[]
  rotation?: number
  autoRotate?: number
  speed?: number
  transparent?: boolean
  scale?: number
  frequency?: number
  warpStrength?: number
  mouseInfluence?: number
  parallax?: number
  noise?: number
  iterations?: number
  intensity?: number
  bandWidth?: number
  className?: string
  style?: CSSProperties
}

function toColorVector(hex: string) {
  const normalized = hex.replace("#", "").trim()
  const rgb =
    normalized.length === 3
      ? [
          Number.parseInt(normalized[0] + normalized[0], 16),
          Number.parseInt(normalized[1] + normalized[1], 16),
          Number.parseInt(normalized[2] + normalized[2], 16),
        ]
      : [
          Number.parseInt(normalized.slice(0, 2), 16),
          Number.parseInt(normalized.slice(2, 4), 16),
          Number.parseInt(normalized.slice(4, 6), 16),
        ]

  return new THREE.Vector3(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255)
}

export function ColorBends({
  className,
  style,
  rotation = 90,
  autoRotate = 0,
  speed = 0.2,
  colors = [],
  transparent = true,
  scale = 1,
  frequency = 1,
  warpStrength = 1,
  mouseInfluence = 1,
  parallax = 0.5,
  noise = 0.15,
  iterations = 1,
  intensity = 1.5,
  bandWidth = 6,
}: ColorBendsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const geometry = new THREE.PlaneGeometry(2, 2)
    const colorUniforms = Array.from({ length: MAX_COLORS }, () => new THREE.Vector3())
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uCanvas: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uRotation: { value: new THREE.Vector2(1, 0) },
        uColorCount: { value: 0 },
        uColors: { value: colorUniforms },
        uTransparent: { value: transparent ? 1 : 0 },
        uScale: { value: scale },
        uFrequency: { value: frequency },
        uWarpStrength: { value: warpStrength },
        uPointer: { value: new THREE.Vector2() },
        uMouseInfluence: { value: mouseInfluence },
        uParallax: { value: parallax },
        uNoise: { value: noise },
        uIterations: { value: iterations },
        uIntensity: { value: intensity },
        uBandWidth: { value: bandWidth },
      },
      premultipliedAlpha: true,
      transparent: true,
    })
    const palette = colors.filter(Boolean).slice(0, MAX_COLORS).map(toColorVector)
    colorUniforms.forEach((vector, index) => {
      if (index < palette.length) vector.copy(palette[index])
      else vector.set(0, 0, 0)
    })
    material.uniforms.uColorCount.value = palette.length
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    })
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, transparent ? 0 : 1)
    container.appendChild(renderer.domElement)

    const pointerTarget = new THREE.Vector2()
    const pointerCurrent = new THREE.Vector2()
    const clock = new THREE.Clock()
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let animationFrame = 0

    const resize = () => {
      const width = container.clientWidth || 1
      const height = container.clientHeight || 1
      renderer.setSize(width, height, false)
      material.uniforms.uCanvas.value.set(width, height)
    }

    const draw = () => {
      const delta = clock.getDelta()
      const elapsed = clock.elapsedTime
      const degrees = (rotation % 360) + autoRotate * elapsed
      const radians = (degrees * Math.PI) / 180

      material.uniforms.uTime.value = elapsed
      material.uniforms.uRotation.value.set(Math.cos(radians), Math.sin(radians))
      pointerCurrent.lerp(pointerTarget, Math.min(1, delta * 8))
      material.uniforms.uPointer.value.copy(pointerCurrent)
      renderer.render(scene, camera)

      if (!reducedMotion) animationFrame = requestAnimationFrame(draw)
    }

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect()
      pointerTarget.set(
        ((event.clientX - bounds.left) / (bounds.width || 1)) * 2 - 1,
        -(((event.clientY - bounds.top) / (bounds.height || 1)) * 2 - 1),
      )
    }

    const observer = new ResizeObserver(resize)
    observer.observe(container)
    container.addEventListener("pointermove", handlePointerMove)
    resize()
    draw()

    return () => {
      cancelAnimationFrame(animationFrame)
      observer.disconnect()
      container.removeEventListener("pointermove", handlePointerMove)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
  }, [
    autoRotate,
    bandWidth,
    colors,
    frequency,
    intensity,
    iterations,
    mouseInfluence,
    noise,
    parallax,
    rotation,
    scale,
    speed,
    transparent,
    warpStrength,
  ])

  return <div ref={containerRef} className={`color-bends-container ${className ?? ""}`} style={style} />
}
