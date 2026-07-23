import { fieldPlayers, type FieldPlayer } from "@/lib/field-data"

export type FieldMode = "session" | "live"

export type FieldValuation =
  | "overview"
  | "movement"
  | "load"
  | "sprints"
  | "speed"
  | "distance"
  | "accelerations"
  | "heartRate"
  | "actions"

export type FieldCardMetric =
  | "load"
  | "distance"
  | "distancePerMinute"
  | "maxSpeed"
  | "sprints"
  | "heartRate"
  | "recovery"
  | "target"

export type FieldLayer =
  | "markers"
  | "heatmap"
  | "routes"
  | "sprints"
  | "shots"
  | "actions"
  | "accelerations"
  | "decelerations"

export type FieldPreset = "movement" | "intensity" | "sprints" | "actions" | "load" | "clear"

export type FieldActionType =
  | "pass"
  | "reception"
  | "shot"
  | "recovery"
  | "turnover"
  | "pressure"
  | "duel"
  | "interception"
  | "tackle"

export type FieldEventPoint = {
  x: number
  y: number
  type: FieldActionType
  result: "positive" | "neutral" | "negative"
  timestamp: number
  label: string
}

export type LiveFieldPlayer = FieldPlayer & {
  active: boolean
  availability: "disponivel" | "monitorar" | "alerta"
  dataStatus: "validado" | "revisar" | "pendente"
  dataQualityScore: number
  heartRate: {
    current: number
    average: number
    peak: number
    zone: number
  }
  target: {
    load: number
    distance: number
    sprints: number
  }
  distancePerMinute: number
  loadPct: number
  targetPct: number
  recentTrail: Array<{ x: number; y: number; timestamp: number }>
  actions: FieldEventPoint[]
}

export type FieldTimelineEvent = {
  id: string
  minute: number
  type: "period" | "exercise" | "alert" | "issue" | "decision"
  label: string
}

export const fieldValuations: Array<{ id: FieldValuation; label: string; description: string }> = [
  { id: "overview", label: "Visao geral", description: "Status dos atletas e indicadores principais." },
  { id: "movement", label: "Movimentacao", description: "Heatmap, rotas, setores e posicao media." },
  { id: "load", label: "Carga", description: "Player Load, metas, zonas e alertas." },
  { id: "sprints", label: "Sprints", description: "Origem, destino, velocidade e exposicao planejada." },
  { id: "speed", label: "Velocidade", description: "Velocidade atual, maxima, media e zonas." },
  { id: "distance", label: "Distancia", description: "Trilha acumulada e comparacao com meta." },
  { id: "accelerations", label: "Aceleracoes", description: "Vetores de aceleracao e desaceleracao." },
  { id: "heartRate", label: "Freq. cardiaca", description: "FC atual, media, pico e tempo por zona." },
  { id: "actions", label: "Acoes", description: "Eventos tecnicos ofensivos e defensivos." },
]

export const fieldCardMetrics: Array<{ id: FieldCardMetric; label: string }> = [
  { id: "load", label: "Carga" },
  { id: "distance", label: "Distancia" },
  { id: "distancePerMinute", label: "Dist/min" },
  { id: "maxSpeed", label: "Vel. max" },
  { id: "sprints", label: "Sprints" },
  { id: "heartRate", label: "FC" },
  { id: "recovery", label: "Recovery" },
  { id: "target", label: "Meta" },
]

export const fieldPresets: Array<{ id: FieldPreset; label: string; layers: FieldLayer[] }> = [
  { id: "movement", label: "Movimentacao", layers: ["markers", "heatmap", "routes"] },
  { id: "intensity", label: "Intensidade", layers: ["markers", "heatmap", "accelerations", "decelerations"] },
  { id: "sprints", label: "Sprints", layers: ["markers", "sprints", "routes"] },
  { id: "actions", label: "Acoes", layers: ["markers", "actions", "shots"] },
  { id: "load", label: "Carga", layers: ["markers", "heatmap", "accelerations"] },
  { id: "clear", label: "Limpar campo", layers: ["markers"] },
]

const actionTypes: FieldActionType[] = ["pass", "reception", "pressure", "recovery", "duel", "interception"]

export const liveFieldPlayers: LiveFieldPlayer[] = fieldPlayers.map((player, index) => {
  const seed = index + 1
  const loadPct = Math.min(98, Math.round((player.catapult.playerLoad / 360) * 100 + seed * 2))
  const targetPct = Math.min(118, Math.round((player.catapult.distance / (player.catapult.distance + 0.8)) * 100 + seed))
  const dataStatus = index === 3 ? "revisar" : index === 5 ? "pendente" : "validado"

  return {
    ...player,
    active: true,
    availability: player.colorToken === "alert" ? "alerta" : player.colorToken === "warn" ? "monitorar" : "disponivel",
    dataStatus,
    dataQualityScore: dataStatus === "pendente" ? 58 : dataStatus === "revisar" ? 72 : 96 - seed,
    heartRate: {
      current: 132 + seed * 7,
      average: 124 + seed * 5,
      peak: 166 + seed * 4,
      zone: Math.min(5, 2 + Math.round(seed / 2)),
    },
    target: {
      load: 330 + seed * 12,
      distance: Number((player.catapult.distance + 0.8 + seed * 0.08).toFixed(1)),
      sprints: player.catapult.sprints + 8 + seed,
    },
    distancePerMinute: Number((player.catapult.distance / (58 + seed * 2)).toFixed(2)),
    loadPct,
    targetPct,
    recentTrail: player.distanceTrail.slice(-3),
    actions: actionTypes.slice(0, 4).map((type, actionIndex) => ({
      x: Math.min(92, player.fieldPosition.x + actionIndex * 6 - seed),
      y: Math.max(10, Math.min(90, player.fieldPosition.y + (actionIndex % 2 === 0 ? -8 : 7))),
      type,
      result: actionIndex === 2 && player.status !== "normal" ? "negative" : actionIndex === 1 ? "neutral" : "positive",
      timestamp: 8 + actionIndex * 7 + seed,
      label: type === "pass" ? "Passe vertical" : type === "pressure" ? "Pressao pos-perda" : "Acao monitorada",
    })),
  }
})

export const fieldSession = {
  id: "athletic-live-field",
  name: "Treino tatico",
  type: "Treino integrado",
  field: "Campo A",
  date: "2026-07-22",
  time: "08:10",
  duration: "64:00",
  activePeriod: "Bloco 2 - comportamento defensivo",
  dataSource: "Catapult + Apollo",
  state: "AO VIVO",
  catapultStatus: "relatorio lido",
  apolloStatus: "relatorio lido 08:10",
  dataQuality: "alta",
  lastUpdate: "ha 2 segundos",
  activeAthletes: liveFieldPlayers.filter((player) => player.active).length,
  totalAthletes: liveFieldPlayers.length,
  mode: "live" as FieldMode,
}

export type FieldSession = typeof fieldSession

export const fieldTimelineEvents: FieldTimelineEvent[] = [
  { id: "start", minute: 0, type: "period", label: "Inicio" },
  { id: "warmup", minute: 8, type: "exercise", label: "Aquecimento" },
  { id: "block-1", minute: 18, type: "exercise", label: "Pressao alta" },
  { id: "alert-18", minute: 31, type: "alert", label: "Carga 18 acima da meta parcial" },
  { id: "issue-7", minute: 42, type: "issue", label: "Conflito de leitura no 24" },
  { id: "decision", minute: 53, type: "decision", label: "Reduzir sprint dos atacantes" },
  { id: "end", minute: 64, type: "period", label: "Fim" },
]

export const fieldInsights = [
  {
    id: "load-18",
    valuation: "load" as FieldValuation,
    athleteId: "giroud",
    text: "O atleta 18 atingiu 92% da meta de carga com 71% do treino concluido.",
  },
  {
    id: "sprint-ata",
    valuation: "sprints" as FieldValuation,
    athleteId: "diogo",
    text: "Dois atacantes ainda nao atingiram a exposicao minima de sprints no bloco atual.",
  },
  {
    id: "hr-zone",
    valuation: "heartRate" as FieldValuation,
    athleteId: "goncalo",
    text: "Um atleta permanece em zona 5 por mais de tres minutos.",
  },
]
