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

  return {
    id: athlete.id,
    number: athlete.number,
    name: `${athlete.firstName[0]}. ${athlete.lastName}`,
    position: athlete.positionShort,
    status: athlete.zoneState === "alert" ? "alerta" : athlete.zoneState === "warn" ? "atenção" : "normal",
    zone: pos.zone,
    colorToken: athlete.zoneState,
    fieldPosition: pos,
    heatmapPoints: route.map((p, i) => ({ x: p.x, y: p.y, intensity: 0.45 + i * 0.14 })),
    routes: route,
    sprints: route.slice(1).map((p, i) => ({ x: p.x, y: p.y, speed: 27 + i * 1.8, timestamp: p.timestamp })),
    shots: [
      { x: pos.x + 16, y: pos.y - 6, result: index % 2 === 0 ? "gol" : "defesa" },
      { x: pos.x + 20, y: pos.y + 9, result: "fora" },
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
