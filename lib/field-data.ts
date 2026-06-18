import { athletes } from "@/lib/data"

export type FieldMetric =
  | "heatmap"
  | "distance"
  | "sprints"
  | "shots"
  | "accelerations"
  | "decelerations"
  | "speedZone"
  | "playerLoad"
  | "routes"

export const fieldMetrics: { id: FieldMetric; label: string }[] = [
  { id: "heatmap", label: "Mapa de calor" },
  { id: "distance", label: "Distância" },
  { id: "sprints", label: "Sprints" },
  { id: "shots", label: "Finalizações" },
  { id: "accelerations", label: "Acelerações" },
  { id: "decelerations", label: "Desacelerações" },
  { id: "speedZone", label: "Zona de velocidade" },
  { id: "playerLoad", label: "Player Load" },
  { id: "routes", label: "Rotas" },
]

const positions = [
  { x: 18, y: 50, zone: 2 },
  { x: 35, y: 28, zone: 3 },
  { x: 36, y: 70, zone: 3 },
  { x: 54, y: 42, zone: 4 },
  { x: 70, y: 32, zone: 3 },
  { x: 76, y: 60, zone: 4 },
]

export const fieldPlayers = athletes.map((athlete, index) => {
  const pos = positions[index] ?? positions[0]
  const route = [
    { x: pos.x - 8, y: pos.y + 8, timestamp: 1 },
    { x: pos.x - 2, y: pos.y - 4, timestamp: 2 },
    { x: pos.x + 7, y: pos.y + 3, timestamp: 3 },
    { x: pos.x + 12, y: pos.y - 7, timestamp: 4 },
  ]
  const actionSeed = index + 1
  const distanceTrail = [
    { x: Math.max(8, pos.x - 12), y: Math.min(88, pos.y + 14), timestamp: 1, meters: 18 + actionSeed * 2 },
    { x: Math.max(8, pos.x - 5), y: Math.max(10, pos.y - 8), timestamp: 2, meters: 34 + actionSeed * 3 },
    { x: Math.min(92, pos.x + 8), y: Math.min(88, pos.y + 6), timestamp: 3, meters: 51 + actionSeed * 4 },
    { x: Math.min(92, pos.x + 18), y: Math.max(10, pos.y - 11), timestamp: 4, meters: 69 + actionSeed * 5 },
    { x: Math.min(92, pos.x + 24), y: Math.min(88, pos.y + 2), timestamp: 5, meters: 86 + actionSeed * 6 },
  ]
  const accelerationVectors = [
    { x: pos.x - 4, y: pos.y + 8, dx: 8 + actionSeed, dy: -10, magnitude: 2.6 + index * 0.2 },
    { x: pos.x + 6, y: pos.y - 6, dx: 10, dy: 7 - actionSeed, magnitude: 3.1 + index * 0.18 },
  ]
  const decelerationVectors = [
    { x: pos.x + 11, y: pos.y + 3, dx: -7, dy: 5 + actionSeed, magnitude: 2.1 + index * 0.15 },
    { x: pos.x - 9, y: pos.y - 10, dx: -5, dy: -6, magnitude: 1.9 + index * 0.12 },
  ]
  const heatmapPoints = [
    { x: Math.max(12, pos.x - 10), y: Math.max(14, pos.y - 12), intensity: 0.62 },
    { x: Math.min(88, pos.x + 2), y: Math.max(12, pos.y - 6), intensity: 0.88 },
    { x: Math.min(88, pos.x + 12), y: Math.min(86, pos.y + 4), intensity: 0.74 },
    { x: Math.max(12, pos.x - 2), y: Math.min(86, pos.y + 12), intensity: 0.56 },
    { x: Math.min(90, pos.x + 22), y: Math.max(12, pos.y - 2), intensity: 0.48 },
  ]

  return {
    id: athlete.id,
    number: athlete.number,
    name: `${athlete.firstName[0]}. ${athlete.lastName}`,
    fullName: `${athlete.firstName} ${athlete.lastName}`,
    photo: athlete.photo,
    position: athlete.positionShort,
    role: athlete.position,
    status: athlete.zoneState === "alert" ? "alerta" : athlete.zoneState === "warn" ? "atenção" : "normal",
    zone: pos.zone,
    colorToken: athlete.zoneState,
    fieldPosition: pos,
    heatmapPoints,
    routes: route,
    distanceTrail,
    accelerations: accelerationVectors,
    decelerations: decelerationVectors,
    sprints: route.slice(1).map((p, i) => ({ x: p.x, y: p.y, speed: 27 + i * 1.8 + actionSeed * 0.4, timestamp: p.timestamp })),
    shots: [
      { x: Math.min(92, pos.x + 16), y: Math.max(9, pos.y - 6), targetX: 94, targetY: 45 + index * 2, result: index % 2 === 0 ? "gol" : "defesa" },
      { x: Math.min(92, pos.x + 20), y: Math.min(88, pos.y + 9), targetX: 95, targetY: 54 - index, result: "fora" },
    ],
    catapult: {
      distance: athlete.catapult.distance,
      maxSpeed: athlete.catapult.maxSpeed,
      sprints: athlete.catapult.sprints,
      accelerations: athlete.catapult.accelerations,
      decelerations: athlete.catapult.decelerations,
      playerLoad: athlete.catapult.playerLoad,
      highSpeedRunning: Math.round(athlete.distance * 620),
    },
    apollo: {
      recovery: athlete.apollo.recovery,
      fatigue: athlete.apollo.fatigue,
      wellness: athlete.apollo.wellness,
    },
  }
})

export type FieldPlayer = (typeof fieldPlayers)[number]
