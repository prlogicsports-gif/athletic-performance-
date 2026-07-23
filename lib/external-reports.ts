import { athletes } from "@/lib/data"

export type ExternalReportSource = "catapult" | "apollo"
export type ExternalReportStatus =
  | "received"
  | "reading"
  | "interpreting"
  | "validating"
  | "ready"
  | "ready_with_issues"
  | "error"

export type ParsedRecordStatus =
  | "valid"
  | "probable_match"
  | "unmatched"
  | "conflict"
  | "ignored"
  | "review_required"

export type ExternalReport = {
  id: string
  source: ExternalReportSource
  fileName: string
  importedAt: string
  reportDate?: string
  periodStart?: string
  periodEnd?: string
  status: ExternalReportStatus
  athleteCount: number
  sessionCount: number
  recordCount: number
  importedBy: string
  title: string
}

export type ParsedExternalRecord = {
  id: string
  reportId: string
  source: ExternalReportSource
  originalField: string
  originalValue: string | number
  originalUnit?: string
  normalizedField?: string
  normalizedValue?: string | number
  normalizedUnit?: string
  athleteId?: string
  sessionId?: string
  recordedAt?: string
  status: ParsedRecordStatus
  interpretationRule?: string
  reviewedBy?: string
  notes?: string
}

export const externalReports: ExternalReport[] = [
  {
    id: "catapult-tatico-2207",
    source: "catapult",
    fileName: "catapult_treino_tatico_22-07.csv",
    importedAt: "22/07/2026 20:15",
    reportDate: "22/07/2026",
    periodStart: "22/07/2026",
    periodEnd: "22/07/2026",
    status: "ready_with_issues",
    athleteCount: 24,
    sessionCount: 6,
    recordCount: 1248,
    importedBy: "Bruno - Fisiologia",
    title: "Treino Tatico - 22/07/2026",
  },
  {
    id: "catapult-jogo-2107",
    source: "catapult",
    fileName: "catapult_jogo_21-07.csv",
    importedAt: "21/07/2026 22:04",
    reportDate: "21/07/2026",
    periodStart: "21/07/2026",
    periodEnd: "21/07/2026",
    status: "ready",
    athleteCount: 22,
    sessionCount: 1,
    recordCount: 932,
    importedBy: "Bruno - Fisiologia",
    title: "Jogo - 21/07/2026",
  },
  {
    id: "apollo-wellness-2207",
    source: "apollo",
    fileName: "apollo_wellness_semanal_22-07.xlsx",
    importedAt: "22/07/2026 20:20",
    reportDate: "22/07/2026",
    periodStart: "16/07/2026",
    periodEnd: "22/07/2026",
    status: "ready_with_issues",
    athleteCount: 24,
    sessionCount: 0,
    recordCount: 96,
    importedBy: "Bruno - Fisiologia",
    title: "Wellness Semanal - 22/07/2026",
  },
  {
    id: "apollo-termografia-2207",
    source: "apollo",
    fileName: "apollo_termografia_22-07.xlsx",
    importedAt: "22/07/2026 20:24",
    reportDate: "22/07/2026",
    status: "ready",
    athleteCount: 18,
    sessionCount: 0,
    recordCount: 42,
    importedBy: "Bruno - Fisiologia",
    title: "Termografia - 22/07/2026",
  },
]

export const parsedExternalRecords: ParsedExternalRecord[] = [
  {
    id: "record-catapult-distance-giroud",
    reportId: "catapult-tatico-2207",
    source: "catapult",
    originalField: "Total Distance",
    originalValue: 8400,
    originalUnit: "m",
    normalizedField: "Distancia total",
    normalizedValue: 8.4,
    normalizedUnit: "km",
    athleteId: "giroud",
    sessionId: "session-live-01",
    recordedAt: "22/07/2026 18:42",
    status: "valid",
    interpretationRule: "metros_para_quilometros",
    reviewedBy: "Bruno",
  },
  {
    id: "record-catapult-sprints-giroud",
    reportId: "catapult-tatico-2207",
    source: "catapult",
    originalField: "Sprint Count",
    originalValue: 18,
    normalizedField: "Sprints",
    normalizedValue: 18,
    athleteId: "giroud",
    sessionId: "session-live-01",
    recordedAt: "22/07/2026 18:42",
    status: "valid",
    interpretationRule: "contagem_direta",
  },
  {
    id: "record-apollo-recovery-giroud",
    reportId: "apollo-wellness-2207",
    source: "apollo",
    originalField: "Perceived Recovery",
    originalValue: 6,
    originalUnit: "0-10",
    normalizedField: "Recuperacao percebida",
    normalizedValue: 60,
    normalizedUnit: "%",
    athleteId: "giroud",
    recordedAt: "22/07/2026 08:12",
    status: "valid",
    interpretationRule: "escala_10_para_percentual",
  },
  {
    id: "record-apollo-pain-giroud",
    reportId: "apollo-wellness-2207",
    source: "apollo",
    originalField: "Pain Notes",
    originalValue: "posterior da coxa direita",
    normalizedField: "Observacao de dor",
    normalizedValue: "posterior da coxa direita",
    athleteId: "giroud",
    recordedAt: "22/07/2026 08:12",
    status: "review_required",
    interpretationRule: "texto_clinico_para_observacao",
    notes: "Interpretacao operacional, nao diagnostico clinico.",
  },
  {
    id: "record-catapult-name-conflict",
    reportId: "catapult-tatico-2207",
    source: "catapult",
    originalField: "Athlete Name",
    originalValue: "G. Silva",
    normalizedField: "Atleta identificado",
    normalizedValue: "Goncalo Silva",
    athleteId: "goncalo",
    sessionId: "session-live-01",
    recordedAt: "22/07/2026 18:42",
    status: "probable_match",
    interpretationRule: "similaridade_nome_numero_posicao",
    notes: "Confirmar correspondencia antes de publicar relatorio unificado.",
  },
]

export const sourceSummaries = {
  catapult: {
    label: "CATAPULT",
    description: "Dados fisicos, distancia, velocidade, sprints e carga importados por relatorio.",
    reports: 12,
    sessions: 18,
    athletes: 24,
    metrics: 36,
    valid: 1246,
    pending: 2,
    lastRead: "Treino Tatico - 22/07/2026",
    period: "16/07/2026 - 22/07/2026",
    status: "Pronto com pendencias",
  },
  apollo: {
    label: "APOLLO",
    description: "Wellness, recuperacao, disponibilidade, termografia e observacoes importadas por relatorio.",
    reports: 8,
    sessions: 0,
    athletes: 24,
    metrics: 22,
    valid: 93,
    pending: 3,
    lastRead: "Avaliacao semanal - 22/07/2026",
    period: "16/07/2026 - 22/07/2026",
    status: "Pronto com pendencias",
  },
}

export const readingLog = [
  "20:15:02 - Arquivo recebido",
  "20:15:03 - Estrutura identificada",
  "20:15:05 - 24 atletas encontrados",
  "20:15:07 - 6 sessoes identificadas",
  "20:15:10 - 1.248 registros normalizados",
  "20:15:12 - 2 conflitos encontrados",
  "20:15:15 - Relatorio pronto para revisao",
]

export function getAthleteName(id?: string) {
  const athlete = athletes.find((item) => item.id === id)
  return athlete ? `${athlete.firstName} ${athlete.lastName}` : "Nao identificado"
}
