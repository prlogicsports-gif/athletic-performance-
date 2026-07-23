import { athletes } from "@/lib/data"
import { mockProvenance, type DataProvenance } from "@/lib/analytics-data"

export type AthleteBaseline = {
  athleteId: string
  metric: string
  average: number
  lowerBound: number
  upperBound: number
  bestValue?: number
  unit: string
  sampleSize: number
  periodStart: string
  periodEnd: string
}

export type ThermographyRecord = {
  id: string
  athleteId: string
  recordedAt: string
  bodyRegion: string
  leftValue?: number
  rightValue?: number
  thermalDifference?: number
  imageUrl?: string
  observation?: string
  source: DataProvenance
  reviewedBy?: string
}

export type DailyObservation = {
  id: string
  athleteId: string
  sessionId?: string
  category: string
  content: string
  priority: "normal" | "attention" | "critical"
  visibility: "staff" | "medical" | "restricted"
  authorId: string
  createdAt: string
  updatedAt: string
}

export type AthleteLoadRecord = {
  id: string
  athleteId: string
  date: string
  session: string
  planned: number
  executed: number
  source: DataProvenance
}

export type AthleteDossier = {
  athleteId: string
  category: string
  dominantFoot: string
  availability: string
  department: string
  responsible: string
  nextAssessment: string
  connectedSources: string[]
  baselines: AthleteBaseline[]
  thermographies: ThermographyRecord[]
  observations: DailyObservation[]
  loadHistory: AthleteLoadRecord[]
  alerts: string[]
  decisions: string[]
}

function makeBaselines(athleteId: string, seed: number): AthleteBaseline[] {
  return [
    {
      athleteId,
      metric: "Player Load",
      average: 286 + seed * 12,
      lowerBound: 250 + seed * 8,
      upperBound: 330 + seed * 10,
      bestValue: 368 + seed * 11,
      unit: "UA",
      sampleSize: 18 + seed,
      periodStart: "2026-06-01",
      periodEnd: "2026-07-23",
    },
    {
      athleteId,
      metric: "Distancia",
      average: 7.7 + seed * 0.18,
      lowerBound: 6.9 + seed * 0.12,
      upperBound: 9.1 + seed * 0.18,
      bestValue: 10.2 + seed * 0.2,
      unit: "km",
      sampleSize: 20 + seed,
      periodStart: "2026-06-01",
      periodEnd: "2026-07-23",
    },
    {
      athleteId,
      metric: "Sprints",
      average: 31 + seed * 2,
      lowerBound: 24 + seed,
      upperBound: 46 + seed * 2,
      bestValue: 58 + seed,
      unit: "spr",
      sampleSize: 16 + seed,
      periodStart: "2026-06-01",
      periodEnd: "2026-07-23",
    },
  ]
}

export const athleteDossiers: AthleteDossier[] = athletes.map((athlete, index) => {
  const seed = index + 1
  return {
    athleteId: athlete.id,
    category: "Profissional",
    dominantFoot: index % 3 === 0 ? "Esquerdo" : "Direito",
    availability: athlete.zoneState === "alert" ? "Disponivel com restricao" : athlete.zoneState === "warn" ? "Disponivel com monitoramento" : "Disponivel",
    department: athlete.zoneState === "alert" ? "Departamento medico" : "Preparacao fisica",
    responsible: athlete.zoneState === "alert" ? "B. Naves" : "A. Sampaio",
    nextAssessment: "24/07/2026 08:00",
    connectedSources: ["Catapult", "Apollo", "Termografia", "Mock"],
    baselines: makeBaselines(athlete.id, seed),
    thermographies: [
      {
        id: `thermo-${athlete.id}-01`,
        athleteId: athlete.id,
        recordedAt: "2026-07-23T07:35:00-03:00",
        bodyRegion: index % 2 === 0 ? "Posterior de coxa" : "Panturrilha",
        leftValue: 36.1 + seed * 0.04,
        rightValue: 36.3 + seed * 0.05,
        thermalDifference: 0.2 + seed * 0.03,
        imageUrl: "/thermography.png",
        observation: "Registro demonstrativo para revisao profissional.",
        source: mockProvenance.thermography,
        reviewedBy: "Departamento medico",
      },
    ],
    observations: [
      {
        id: `obs-${athlete.id}-01`,
        athleteId: athlete.id,
        sessionId: "athletic-live-field",
        category: athlete.zoneState === "alert" ? "medico" : "fisico",
        content: athlete.zoneState === "good" ? "Resposta normal ao bloco de ativacao." : "Monitorar resposta no bloco principal.",
        priority: athlete.zoneState === "alert" ? "critical" : athlete.zoneState === "warn" ? "attention" : "normal",
        visibility: athlete.zoneState === "alert" ? "medical" : "staff",
        authorId: athlete.zoneState === "alert" ? "naves" : "sampaio",
        createdAt: "2026-07-23T08:20:00-03:00",
        updatedAt: "2026-07-23T08:20:00-03:00",
      },
    ],
    loadHistory: [
      {
        id: `load-${athlete.id}-01`,
        athleteId: athlete.id,
        date: "23/07",
        session: "Treino tatico",
        planned: 300 + seed * 8,
        executed: athlete.catapult.playerLoad,
        source: mockProvenance.catapult,
      },
      {
        id: `load-${athlete.id}-02`,
        athleteId: athlete.id,
        date: "22/07",
        session: "Pressao alta",
        planned: 280 + seed * 7,
        executed: 268 + seed * 10,
        source: mockProvenance.catapult,
      },
    ],
    alerts: athlete.zoneState === "good" ? [] : ["Carga acima da faixa individual esperada."],
    decisions: athlete.zoneState === "alert" ? ["Reduzir participacao para 70% da meta."] : ["Reavaliar apos aquecimento."],
  }
})

export function getAthleteDossier(athleteId: string) {
  return athleteDossiers.find((dossier) => dossier.athleteId === athleteId) ?? athleteDossiers[0]
}
