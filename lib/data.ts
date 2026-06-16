export type ZoneState = "good" | "warn" | "alert"

export type CatapultPlaceholder = {
  distance: number
  maxSpeed: number
  sprints: number
  playerLoad: number
  accelerations: number
  decelerations: number
}

export type ApolloPlaceholder = {
  recovery: number
  wellness: number
  sleep: number
  fatigue: number
  soreness: number
  thermography: "normal" | "monitorar" | "alerta"
}

export type Athlete = {
  id: string
  number: number
  firstName: string
  lastName: string
  position: string
  positionShort: string
  group: "goleiros" | "defensores" | "meio-campistas" | "atacantes"
  photo: string
  country: string
  age: number
  distance: number // km
  zone: number // 1-5
  zoneState: ZoneState
  height: string
  weight: string
  catapult: CatapultPlaceholder
  apollo: ApolloPlaceholder
}

const baseCatapult = (distance: number, zone: number): CatapultPlaceholder => ({
  distance,
  maxSpeed: 24 + zone * 1.4,
  sprints: Math.round(distance * 5.4),
  playerLoad: Math.round(distance * 34),
  accelerations: Math.round(distance * 7.2),
  decelerations: Math.round(distance * 6.4),
})

const baseApollo = (zoneState: ZoneState): ApolloPlaceholder => ({
  recovery: zoneState === "alert" ? 64 : zoneState === "warn" ? 76 : 88,
  wellness: zoneState === "alert" ? 68 : zoneState === "warn" ? 79 : 90,
  sleep: zoneState === "alert" ? 6.2 : zoneState === "warn" ? 7.1 : 8.0,
  fatigue: zoneState === "alert" ? 72 : zoneState === "warn" ? 54 : 31,
  soreness: zoneState === "alert" ? 66 : zoneState === "warn" ? 42 : 24,
  thermography: zoneState === "alert" ? "alerta" : zoneState === "warn" ? "monitorar" : "normal",
})

const athleteBase: Omit<Athlete, "catapult" | "apollo">[] = [
  {
    id: "giroud",
    number: 18,
    firstName: "Olivier",
    lastName: "Giroud",
    position: "Atacante",
    positionShort: "ATA",
    group: "atacantes",
    photo: "/athletes/hero.png",
    country: "Brasil",
    age: 37,
    distance: 9.8,
    zone: 4,
    zoneState: "warn",
    height: "1.92 m",
    weight: "93 kg",
  },
  {
    id: "alason",
    number: 8,
    firstName: "Alason",
    lastName: "Miranda",
    position: "Meio-campista",
    positionShort: "MEI",
    group: "meio-campistas",
    photo: "/athletes/player-2.png",
    country: "Brasil",
    age: 24,
    distance: 8.4,
    zone: 3,
    zoneState: "good",
    height: "1.78 m",
    weight: "74 kg",
  },
  {
    id: "edson",
    number: 10,
    firstName: "Edson",
    lastName: "Natanael",
    position: "Defensor",
    positionShort: "ZAG",
    group: "defensores",
    photo: "/athletes/player-3.png",
    country: "Brasil",
    age: 29,
    distance: 8.6,
    zone: 3,
    zoneState: "good",
    height: "1.85 m",
    weight: "81 kg",
  },
  {
    id: "goncalo",
    number: 24,
    firstName: "Gonçalo",
    lastName: "Silva",
    position: "Zagueiro",
    positionShort: "ZAG",
    group: "defensores",
    photo: "/athletes/player-4.png",
    country: "Portugal",
    age: 27,
    distance: 9.4,
    zone: 4,
    zoneState: "alert",
    height: "1.88 m",
    weight: "83 kg",
  },
  {
    id: "diogo",
    number: 21,
    firstName: "Diogo",
    lastName: "Nascimento",
    position: "Atacante",
    positionShort: "ATA",
    group: "atacantes",
    photo: "/athletes/player-5.png",
    country: "Brasil",
    age: 22,
    distance: 8.1,
    zone: 3,
    zoneState: "good",
    height: "1.80 m",
    weight: "76 kg",
  },
  {
    id: "ronaldinho",
    number: 7,
    firstName: "Ronaldinho",
    lastName: "Junior",
    position: "Volante",
    positionShort: "VOL",
    group: "meio-campistas",
    photo: "/athletes/player-6.png",
    country: "Brasil",
    age: 31,
    distance: 9.2,
    zone: 4,
    zoneState: "warn",
    height: "1.82 m",
    weight: "79 kg",
  },
]

export const athletes: Athlete[] = athleteBase.map((athlete) => ({
  ...athlete,
  catapult: baseCatapult(athlete.distance, athlete.zone),
  apollo: baseApollo(athlete.zoneState),
}))

export const positionFilters = [
  "Todos",
  "Goleiros",
  "Defensores",
  "Meio-campistas",
  "Atacantes",
] as const

export type TeamMetric = {
  label: string
  value: string
  unit: string
  delta: string
  icon: "distance" | "speed" | "sprints" | "load" | "time"
}

export const teamMetrics: TeamMetric[] = [
  { label: "Distância total", value: "8.4", unit: "km", delta: "+4.2%", icon: "distance" },
  { label: "Velocidade média", value: "7.2", unit: "km/h", delta: "+3.1%", icon: "speed" },
  { label: "Sprints total", value: "182", unit: "", delta: "+12.4%", icon: "sprints" },
  { label: "Carga de treino", value: "312", unit: "UA", delta: "+8.7%", icon: "load" },
  { label: "Tempo de sessão", value: "62", unit: "min", delta: "+5.4%", icon: "time" },
]

export const teamMetricsPlaceholders = {
  averages: {
    distance: 8.4,
    maxSpeed: 28.7,
    sprints: 182,
    playerLoad: 312,
    recovery: 81,
  },
  positionAverages: {
    atacantes: 8.9,
    defensores: 8.3,
    "meio-campistas": 8.2,
    goleiros: 6.4,
  },
  comparisons: {
    previousWeekLoad: 268,
    currentWeekLoad: 312,
    previousWeekDistance: 7.8,
    currentWeekDistance: 8.4,
  },
  alerts: {
    highLoad: 2,
    lowRecovery: 1,
    thermography: 1,
    fatigueRisk: 1,
  },
}

export const loadZones = [
  { label: "Z1 (0-7 km/h)", pct: 8, token: "z1" },
  { label: "Z2 (7-14 km/h)", pct: 24, token: "z2" },
  { label: "Z3 (14-21 km/h)", pct: 32, token: "z3" },
  { label: "Z4 (21-25 km/h)", pct: 26, token: "z4" },
  { label: "Z5 (>25 km/h)", pct: 10, token: "z5" },
] as const

export const teamComparison = [
  { label: "Distância total (km)", now: 8.4, prev: 7.8, delta: "+7.7%", max: 10 },
  { label: "Velocidade média (km/h)", now: 7.2, prev: 6.9, delta: "+4.3%", max: 10 },
  { label: "Sprints totais", now: 182, prev: 162, delta: "+12.3%", max: 200 },
  { label: "Carga de treino (UA)", now: 312, prev: 267, delta: "+8.7%", max: 350 },
  { label: "Tempo de sessão (min)", now: 62, prev: 59, delta: "+5.1%", max: 90 },
]

export const positionComparison = [
  { pos: "ATA", dist: 8.9, athletes: 4, max: 10 },
  { pos: "MEI", dist: 8.2, athletes: 5, max: 10 },
  { pos: "VOL", dist: 8.1, athletes: 3, max: 10 },
  { pos: "ZAG", dist: 8.3, athletes: 4, max: 10 },
  { pos: "LD/LE", dist: 7.9, athletes: 4, max: 10 },
]

export const accumulatedLoad = {
  now: [40, 95, 150, 200, 250, 295, 312],
  prev: [38, 85, 130, 175, 215, 245, 268],
  days: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
}

export const internalRanking = [
  { pos: 1, name: "O. Giroud", value: "9.8 km", pct: 100 },
  { pos: 2, name: "G. Silva", value: "9.4 km", pct: 96 },
  { pos: 3, name: "Ronaldinho", value: "9.2 km", pct: 94 },
  { pos: 4, name: "E. Natanael", value: "8.6 km", pct: 88 },
  { pos: 5, name: "A. Miranda", value: "8.4 km", pct: 86 },
]

export const weekAlerts = [
  { state: "alert" as const, text: "2 atletas com carga acima do ideal" },
  { state: "warn" as const, text: "1 atleta com baixa recuperação (Apolo)" },
  { state: "warn" as const, text: "1 atleta com termografia alterada" },
  { state: "warn" as const, text: "1 atleta com risco de fadiga elevado" },
]

// Athlete profile (Giroud)
export const profileSeason = [
  { label: "Jogos", value: "28" },
  { label: "Minutos", value: "2.096" },
  { label: "Gols", value: "13" },
  { label: "Assistências", value: "3" },
]

export const profileForm: ("G" | "E" | "P")[] = ["G", "G", "E", "G", "G"]

export const profilePhysical = [
  { label: "Distância média", value: "8.4", unit: "km", icon: "distance" as const },
  { label: "Velocidade máx.", value: "28.7", unit: "km/h", icon: "speed" as const },
  { label: "Sprints", value: "45", unit: "", icon: "sprints" as const },
  { label: "Carga de treino", value: "312", unit: "UA", icon: "load" as const },
  { label: "Tempo médio", value: "62", unit: "min", icon: "time" as const },
]

export const profileRings = [
  { label: "Taxa de conversão", pct: 14, token: "warn" },
  { label: "Precisão de finalização", pct: 41, token: "warn" },
  { label: "Índice físico", pct: 87, token: "good" },
]

export const nextOpponents = [
  { name: "Santos", date: "24 MAI", time: "16:00", venue: "Fora" },
  { name: "América-MG", date: "31 MAI", time: "18:30", venue: "Casa" },
  { name: "Sport", date: "07 JUN", time: "16:00", venue: "Fora" },
  { name: "Ceará", date: "14 JUN", time: "18:00", venue: "Casa" },
  { name: "Goiás", date: "21 JUN", time: "16:00", venue: "Fora" },
]

// Calendar
export type DayType = "treino" | "recuperacao" | "viagem" | "descanso" | "jogo"

export const dayTypeMeta: Record<DayType, { label: string; token: string }> = {
  treino: { label: "Treino", token: "good" },
  recuperacao: { label: "Recuperação", token: "info" },
  viagem: { label: "Viagem", token: "warn" },
  descanso: { label: "Descanso", token: "muted-foreground" },
  jogo: { label: "Jogo", token: "alert" },
}

export type CalDay = {
  day: number
  type?: DayType
  title?: string
  sub?: string
  match?: string
  current?: boolean
}

// September 2024 starts on Sunday
export const calendarDays: (CalDay | null)[] = [
  null, null, null, null, null, null, { day: 1 },
  { day: 2, type: "descanso", title: "Descanso" },
  { day: 3, type: "treino", title: "Treino", sub: "Campo A" },
  { day: 4, type: "treino", title: "Treino", sub: "Campo B" },
  { day: 5, type: "treino", title: "Treino", sub: "Campo A" },
  { day: 6, type: "treino", title: "Revisão", sub: "Tática" },
  { day: 7, type: "jogo", title: "CRB", sub: "Série B", match: "CRB" },
  { day: 8 },
  { day: 9, type: "treino", title: "Treino", sub: "Campo A" },
  { day: 10, type: "treino", title: "Treino", sub: "Campo A" },
  { day: 11, type: "treino", title: "Treino", sub: "Campo B" },
  { day: 12, type: "treino", title: "Treino", sub: "Campo A" },
  { day: 13, type: "viagem", title: "Viagem", sub: "Vila Nova" },
  { day: 14, type: "jogo", title: "Vila Nova", sub: "Série B", match: "Vila Nova" },
  { day: 15 },
  { day: 16, type: "recuperacao", title: "Recuperação", sub: "Ativa" },
  { day: 17, type: "treino", title: "Treino", sub: "Campo A" },
  { day: 18, type: "treino", title: "Treino", sub: "Campo B" },
  { day: 19, type: "treino", title: "Treino", sub: "Campo A" },
  { day: 20, type: "treino", title: "Revisão", sub: "Tática" },
  { day: 21, type: "jogo", title: "América-MG", sub: "Série B", match: "América-MG", current: true },
  { day: 22 },
  { day: 23, type: "descanso", title: "Descanso" },
  { day: 24, type: "treino", title: "Treino", sub: "Campo A" },
  { day: 25, type: "treino", title: "Treino", sub: "Campo A" },
  { day: 26, type: "treino", title: "Treino", sub: "Campo B" },
  { day: 27, type: "viagem", title: "Viagem", sub: "Chapecó" },
  { day: 28, type: "jogo", title: "Chapecoense", sub: "Série B", match: "Chapecoense" },
  { day: 29 },
  { day: 30, type: "recuperacao", title: "Recuperação", sub: "Ativa" },
  { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 }, { day: 6 },
]

export const weekDayLabels = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"]
