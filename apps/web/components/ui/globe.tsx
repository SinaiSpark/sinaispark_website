"use client"
import { useEffect, useRef, useState } from "react"
import { Color, Scene, Fog, Group, PerspectiveCamera, Vector3 } from "three"
import ThreeGlobe from "three-globe"
import { useThree, Canvas, extend } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import countries from "@/data/globe.json"
declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: ThreeElements["mesh"] & {
      new (): ThreeGlobe
    }
  }
}

extend({ ThreeGlobe: ThreeGlobe })

const RING_PROPAGATION_SPEED = 3
const aspect = 1.2
const cameraZ = 300

type Position = {
  order: number
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  arcAlt: number
  color: string
}

export type GlobeConfig = {
  pointSize?: number
  globeColor?: string
  showAtmosphere?: boolean
  atmosphereColor?: string
  atmosphereAltitude?: number
  emissive?: string
  emissiveIntensity?: number
  shininess?: number
  polygonColor?: string
  ambientLight?: string
  directionalLeftLight?: string
  directionalTopLight?: string
  pointLight?: string
  arcTime?: number
  arcLength?: number
  /**
   * Blank space trailing each arc, as a multiple of the arc's own length. The
   * original hardcoded 15, so an arc is drawn for only ~6% of its cycle — fine
   * for the demo's dozens of arcs, invisible with a handful. Bring it near the
   * dash length to keep each route on screen.
   */
  arcDashGap?: number
  /** Fixed arc thickness; omit for the original's random 0.28-0.32. */
  arcStroke?: number
  rings?: number
  maxRings?: number
  initialPosition?: {
    lat: number
    lng: number
  }
  autoRotate?: boolean
  autoRotateSpeed?: number
}

interface WorldProps {
  globeConfig: GlobeConfig
  data: Position[]
}

export function Globe({ globeConfig, data }: WorldProps) {
  const globeRef = useRef<ThreeGlobe | null>(null)
  const groupRef = useRef<Group>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    arcDashGap: 15,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  }

  // Initialize globe only once
  useEffect(() => {
    if (!globeRef.current && groupRef.current) {
      globeRef.current = new ThreeGlobe()
      ;(groupRef.current as any).add(globeRef.current)
      setIsInitialized(true)
    }
  }, [])

  // Build material when globe is initialized or when relevant props change
  useEffect(() => {
    if (!globeRef.current || !isInitialized) return

    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color
      emissive: Color
      emissiveIntensity: number
      shininess: number
    }
    globeMaterial.color = new Color(globeConfig.globeColor)
    globeMaterial.emissive = new Color(globeConfig.emissive)
    globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0.1
    globeMaterial.shininess = globeConfig.shininess || 0.9
  }, [
    isInitialized,
    globeConfig.globeColor,
    globeConfig.emissive,
    globeConfig.emissiveIntensity,
    globeConfig.shininess,
  ])

  // Build data when globe is initialized or when data changes
  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return

    const arcs = data
    const points = []
    for (const arc of arcs) {
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: arc.color,
        lat: arc.startLat,
        lng: arc.startLng,
      })
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: arc.color,
        lat: arc.endLat,
        lng: arc.endLng,
      })
    }

    // remove duplicates for same lat and lng
    const filteredPoints = points.filter(
      (v, i, a) =>
        a.findIndex((v2) =>
          ["lat", "lng"].every(
            (k) => v2[k as "lat" | "lng"] === v[k as "lat" | "lng"]
          )
        ) === i
    )

    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor(() => defaultProps.polygonColor)

    globeRef.current
      .arcsData(data)
      .arcStartLat((d) => (d as { startLat: number }).startLat * 1)
      .arcStartLng((d) => (d as { startLng: number }).startLng * 1)
      .arcEndLat((d) => (d as { endLat: number }).endLat * 1)
      .arcEndLng((d) => (d as { endLng: number }).endLng * 1)
      .arcColor((e: any) => (e as { color: string }).color)
      .arcAltitude((e) => (e as { arcAlt: number }).arcAlt * 1)
      .arcStroke(
        () =>
          globeConfig.arcStroke ??
          [0.32, 0.28, 0.3][Math.round(Math.random() * 2)] ??
          0.3
      )
      .arcDashLength(defaultProps.arcLength)
      .arcDashInitialGap((e) => (e as { order: number }).order * 1)
      .arcDashGap(defaultProps.arcDashGap)
      .arcDashAnimateTime(() => defaultProps.arcTime)

    globeRef.current
      .pointsData(filteredPoints)
      .pointColor((e) => (e as { color: string }).color)
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(2)

    globeRef.current
      .ringsData([])
      .ringColor(() => defaultProps.polygonColor)
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod(
        (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings
      )
  }, [
    isInitialized,
    data,
    defaultProps.pointSize,
    defaultProps.showAtmosphere,
    defaultProps.atmosphereColor,
    defaultProps.atmosphereAltitude,
    defaultProps.polygonColor,
    defaultProps.arcLength,
    defaultProps.arcTime,
    defaultProps.arcDashGap,
    defaultProps.rings,
    defaultProps.maxRings,
  ])

  // Handle rings animation with cleanup
  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return

    const interval = setInterval(() => {
      if (!globeRef.current) return

      const newNumbersOfRings = genRandomNumbers(
        0,
        data.length,
        Math.floor((data.length * 4) / 5)
      )

      const ringsData = data
        .filter((d, i) => newNumbersOfRings.includes(i))
        .map((d) => ({
          lat: d.startLat,
          lng: d.startLng,
          color: d.color,
        }))

      globeRef.current.ringsData(ringsData)
    }, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [isInitialized, data])

  return <group ref={groupRef} />
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree()

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio)
    gl.setSize(size.width, size.height)
    gl.setClearColor(0xffaaff, 0)
  }, [])

  return null
}

/**
 * Unit vector pointing out of the globe at the given coordinates, or straight
 * at the camera's default position when none are given.
 */
function directionTo(start: GlobeConfig["initialPosition"]) {
  if (!start) return new Vector3(0, 0, 1)
  const phi = ((90 - start.lat) * Math.PI) / 180
  const theta = ((90 - start.lng) * Math.PI) / 180
  return new Vector3(
    Math.sin(phi) * Math.cos(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta)
  )
}

/**
 * Where the camera starts, so the globe opens on the part of the world the
 * section is about. ThreeGlobe has no pointOfView() of its own — that belongs
 * to globe.gl — and OrbitControls pins the distance, so the way to choose the
 * opening view is to place the camera on the sphere through those coordinates.
 */
function cameraFor(start: GlobeConfig["initialPosition"]) {
  // The original near plane is 180, with the camera 300 from the centre of a
  // globe of radius 100 — so everything within 120 of the centre line is
  // clipped away. An arc at altitude 0.25 peaks at radius 125, which is 175
  // from the camera: inside the near plane, and therefore invisible. Arcs near
  // the limb are further away and survive, which is why this looked like
  // "some lines are not completely visible" rather than an outright failure.
  const camera = new PerspectiveCamera(50, aspect, 10, 1800)
  camera.position.copy(directionTo(start).multiplyScalar(cameraZ))
  return camera
}

export function World(props: WorldProps) {
  const { globeConfig } = props
  const scene = new Scene()
  scene.fog = new Fog(0xffffff, 400, 2000)
  const eye = directionTo(globeConfig.initialPosition).multiplyScalar(cameraZ)
  return (
    <Canvas scene={scene} camera={cameraFor(globeConfig.initialPosition)}>
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={eye
          .clone()
          .multiplyScalar(1.4)
          .add(new Vector3(-140, 90, 0))}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={eye
          .clone()
          .multiplyScalar(1.1)
          .add(new Vector3(-60, 460, 0))}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={eye
          .clone()
          .multiplyScalar(1.1)
          .add(new Vector3(-60, 460, 0))}
        intensity={0.8}
      />
      <Globe {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={globeConfig.autoRotateSpeed ?? 1}
        autoRotate={globeConfig.autoRotate ?? true}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  )
}

export function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  const full = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b
  })

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(full)
  return result
    ? {
        r: parseInt(result[1] ?? "0", 16),
        g: parseInt(result[2] ?? "0", 16),
        b: parseInt(result[3] ?? "0", 16),
      }
    : null
}

export function genRandomNumbers(min: number, max: number, count: number) {
  const arr = []
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min
    if (arr.indexOf(r) === -1) arr.push(r)
  }

  return arr
}
