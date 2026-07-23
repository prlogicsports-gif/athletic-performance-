import { athletes } from "@/lib/data"
import { mockProvenance, type DataProvenance } from "@/lib/analytics-data"
import { staffMembers } from "@/lib/staff-data"

export type SessionType = "TREINO" | "JOGO" | "AMISTOSO" | "TESTE" | "RECUPERACAO" | "AVALIACAO" | "INDIVIDUAL" | "TRANSICAO"
export type SessionStatus = "draft" | "scheduled" | "ready" | "live" | "review" | "published" | "archived"
export type ReportSource = "CATAPULT" | "APOLLO" | "MANUAL" | "CSV" | "RELATORIO EXTERNO"

export type TrainingBlock = {
  id: string
  name: string
  duration: number
  objective: string
  plannedLoad: number
  valences: string[]
  responsible: string
}

export type AthleticSession = {
  id: string
  name: string
  type: SessionType
  date: string
  time: string
  location: string
  field: string
  duration: number
  competition?: string
  opponent?: string
  objective: string
  responsibleId: string
  team: string
  athleteIds: string[]
  status: SessionStatus
  sources: ReportSource[]
  quality: number
  blocks: TrainingBlock[]
  provenance: DataProvenance
}

export type InterpretedSessionEvent = {
  id: string
  minute: number
  athleteId: string
  metric: string
  value: number
  unit: string
  status: "normal" | "attention" | "critical"
  provenance: DataProvenance
}

export const athleticSessions: AthleticSession[] = [
  {
    id: "session-live-01",
    name: "Treino tatico - Campo A",
    type: "TREINO",
    date: "2026-07-23",
    time: "08:10",
    location: "CT Athletic",
    field: "Campo A",
    duration: 90,
    objective: "Comportamento defensivo e transicao curta.",
    responsibleId: "mancini",
    team: "Profissional",
    athleteIds: athletes.map((athlete) => athlete.id),
    status: "live",
    sources: ["CATAPULT", "APOLLO", "CSV"],
    quality: 94,
    provenance: mockProvenance.calculated,
    blocks: [
      { id: "b1", name: "Aquecimento integrado", duration: 12, objective: "Ativacao", plannedLoad: 45, valences: ["FC", "mobilidade"], responsible: "sampaio" },
      { id: "b2", name: "Pressao alta", duration: 24, objective: "Recuperacao imediata", plannedLoad: 118, valences: ["sprints", "acoes"], responsible: "paiva" },
      { id: "b3", name: "Transicao defensiva", duration: 26, objective: "Fechar corredor central", plannedLoad: 136, valences: ["carga", "distancia"], responsible: "mancini" },
    ],
  },
  {
    id: "session-review-02",
    name: "Pressao alta - bloco competitivo",
    type: "TREINO",
    date: "2026-07-22",
    time: "09:00",
    location: "CT Athletic",
    field: "Campo B",
    duration: 72,
    objective: "Alta intensidade por setores.",
    responsibleId: "sampaio",
    team: "Profissional",
    athleteIds: athletes.slice(0, 5).map((athlete) => athlete.id),
    status: "review",
    sources: ["CATAPULT", "APOLLO"],
    quality: 88,
    provenance: mockProvenance.catapult,
    blocks: [
      { id: "b1", name: "Rondos direcionais", duration: 18, objective: "Velocidade de decisao", plannedLoad: 72, valences: ["acoes"], responsible: "paiva" },
      { id: "b2", name: "Jogo reduzido", duration: 32, objective: "Sprint curto", plannedLoad: 142, valences: ["sprints", "carga"], responsible: "sampaio" },
    ],
  },
  {
    id: "session-draft-03",
    name: "Jogo - plano de monitoramento",
    type: "JOGO",
    date: "2026-07-27",
    time: "16:00",
    location: "Arena Sicredi",
    field: "Principal",
    duration: 95,
    competition: "Serie B",
    opponent: "America-MG",
    objective: "Monitorar titulares, reservas e retorno.",
    responsibleId: "mancini",
    team: "Profissional",
    athleteIds: athletes.map((athlete) => athlete.id),
    status: "scheduled",
    sources: ["CATAPULT", "APOLLO", "MANUAL"],
    quality: 91,
    provenance: mockProvenance.manual,
    blocks: [
      { id: "b1", name: "1 tempo", duration: 45, objective: "Exposicao competitiva", plannedLoad: 220, valences: ["carga", "distancia", "FC"], responsible: "mancini" },
      { id: "b2", name: "2 tempo", duration: 45, objective: "Resposta de fadiga", plannedLoad: 210, valences: ["sprints", "acoes"], responsible: "paiva" },
    ],
  },
]

export const interpretedSessionEvents: InterpretedSessionEvent[] = [
  { id: "ev-01", minute: 8, athleteId: "giroud", metric: "distancia", value: 1.2, unit: "km", status: "normal", provenance: mockProvenance.catapult },
  { id: "ev-02", minute: 18, athleteId: "goncalo", metric: "playerLoad", value: 188, unit: "UA", status: "attention", provenance: mockProvenance.catapult },
  { id: "ev-03", minute: 31, athleteId: "giroud", metric: "meta", value: 82, unit: "%", status: "attention", provenance: mockProvenance.calculated },
  { id: "ev-04", minute: 42, athleteId: "ronaldinho", metric: "conflito de leitura", value: 1, unit: "registro", status: "critical", provenance: mockProvenance.catapult },
  { id: "ev-05", minute: 53, athleteId: "diogo", metric: "sprints", value: 28, unit: "spr", status: "normal", provenance: mockProvenance.catapult },
]

export function getSessionResponsible(session: AthleticSession) {
  return staffMembers.find((member) => member.id === session.responsibleId) ?? staffMembers[0]
}

export function getSessionImportReadiness() {
  const catapultReports = 2
  const apolloReports = 2
  const pendingRecords = 5
  const conflicts = 2
  return {
    catapultReports,
    apolloReports,
    pendingRecords,
    conflicts,
    canBuildUnifiedReport: pendingRecords <= 5,
  }
}
