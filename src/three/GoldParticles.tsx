import { Canvas, useFrame } from '@react-three/fiber'
import { Component, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import * as THREE from 'three'

/** Deterministic PRNG so the dust field is stable across renders. */
function createRandom(seed: number): () => number {
  let state = seed

  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface GoldParticlesProps {
  /** Particle count — lowered on mobile by the caller. */
  readonly count?: number
  readonly className?: string
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec2 uMouse;

  attribute float aScale;
  attribute float aPhase;
  attribute float aSpeed;

  varying float vTwinkle;

  void main() {
    vec3 p = position;

    // Slow, independent drift — gold dust on a still air current.
    p.y += sin(uTime * 0.24 * aSpeed + aPhase) * 0.55;
    p.x += cos(uTime * 0.19 * aSpeed + aPhase * 1.3) * 0.42;
    p.z += sin(uTime * 0.16 * aSpeed + aPhase * 0.7) * 0.3;

    // Pointer parallax, scaled by depth so near motes travel further.
    p.x += uMouse.x * (0.28 + aScale * 0.34);
    p.y += uMouse.y * (0.22 + aScale * 0.26);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aScale * uPixelRatio * (10.0 / max(-mvPosition.z, 0.001));

    vTwinkle = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * 0.85 * aSpeed + aPhase));
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;

  varying float vTwinkle;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float falloff = smoothstep(0.5, 0.02, dist);
    float alpha = falloff * vTwinkle * uOpacity;

    gl_FragColor = vec4(uColor, alpha);
  }
`

function Dust({ count }: { readonly count: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const pointer = useRef({ x: 0, y: 0 })

  const geometry = useMemo(() => {
    const random = createRandom(0x61757275)
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const phases = new Float32Array(count)
    const speeds = new Float32Array(count)

    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (random() - 0.5) * 15
      positions[i * 3 + 1] = (random() - 0.5) * 9.5
      positions[i * 3 + 2] = (random() - 0.5) * 7 - 1.5

      scales[i] = 0.55 + random() * 2.3
      phases[i] = random() * Math.PI * 2
      speeds[i] = 0.5 + random() * 1.1
    }

    const buffer = new THREE.BufferGeometry()
    buffer.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    buffer.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    buffer.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
    buffer.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
    buffer.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 16)

    return buffer
  }, [count])

  useEffect(() => {
    return () => {
      geometry.dispose()
    }
  }, [geometry])

  useEffect(() => {
    const onPointerMove = (event: PointerEvent): void => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: {
        value: Math.min(typeof window === 'undefined' ? 1 : window.devicePixelRatio, 1.75),
      },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor: { value: new THREE.Color('#E8D3A2') },
      uOpacity: { value: 0.82 },
    }),
    [],
  )

  useEffect(() => {
    const material = materialRef.current

    return () => {
      material?.dispose()
    }
  }, [])

  useFrame((_, delta) => {
    const material = materialRef.current
    if (!material) return

    const uniformsLive = material.uniforms
    const time = uniformsLive.uTime
    const mouse = uniformsLive.uMouse

    if (time) time.value = (time.value as number) + Math.min(delta, 0.05)

    if (mouse) {
      const vector = mouse.value as THREE.Vector2
      vector.x += (pointer.current.x - vector.x) * 0.045
      vector.y += (pointer.current.y - vector.y) * 0.045
    }

    if (groupRef.current) {
      groupRef.current.rotation.y += (pointer.current.x * 0.14 - groupRef.current.rotation.y) * 0.04
      groupRef.current.rotation.x +=
        (-pointer.current.y * 0.08 - groupRef.current.rotation.x) * 0.04
    }
  })

  return (
    <group ref={groupRef}>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

interface BoundaryState {
  failed: boolean
}

/** If WebGL is unavailable the hero simply keeps its cinematic image. */
class WebGLBoundary extends Component<{ readonly children: ReactNode }, BoundaryState> {
  override state: BoundaryState = { failed: false }

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true }
  }

  override render(): ReactNode {
    return this.state.failed ? null : this.props.children
  }
}

export default function GoldParticles({ count = 1100, className }: GoldParticlesProps) {
  const [inView, setInView] = useState(true)
  const [supported] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      const canvas = document.createElement('canvas')
      return Boolean(
        window.WebGLRenderingContext && (canvas.getContext('webgl2') ?? canvas.getContext('webgl')),
      )
    } catch {
      return false
    }
  })

  const observeRef = (node: HTMLDivElement | null): void => {
    if (!node || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry) setInView(entry.isIntersecting)
      },
      { threshold: 0 },
    )

    observer.observe(node)
  }

  if (!supported) return null

  return (
    <div ref={observeRef} className={className} aria-hidden="true">
      <WebGLBoundary>
        <Canvas
          dpr={[1, 1.6]}
          frameloop={inView ? 'always' : 'never'}
          camera={{ position: [0, 0, 6], fov: 55 }}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
          }}
          style={{ pointerEvents: 'none' }}
        >
          <Dust count={count} />
        </Canvas>
      </WebGLBoundary>
    </div>
  )
}
