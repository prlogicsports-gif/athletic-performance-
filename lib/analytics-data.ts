export type DataProvenance = {
  source: "catapult" | "apollo" | "manual" | "csv" | "sensor" | "thermography" | "mock" | "calculated"
  sourceLabel: string
  externalRecordId?: string
  collectedAt: string
  registeredAt: string
  synchronizedAt?: string
  updatedAt: string
  sessionId?: string
  athleteId?: string
  capturedBy?: string
  reviewedBy?: string
  qualityStatus: "valid" | "partial" | "delayed" | "estimated" | "invalid" | "mock"
  latencyMs?: number
  version?: number
}

export type MetricAnalysis = {
  id: string
  title: string
  scope: "individual" | "coletivo" | "posicao" | "sessao"
  summary: string
  history: Array<{ label: string; value: string; note?: string }>
  comparisons: Array<{ label: string; value: string; delta?: string }>
  sessions: Array<{ id: string; name: string; date: string; value: string }>
  observations: string[]
  alerts: string[]
  decisions: string[]
  provenance: DataProvenance
}

const now = "2026-07-23T08:17:03-03:00"

export const mockProvenance = {
  catapult: {
    source: "catapult",
    sourceLabel: "Catapult",
    externalRecordId: "CAT-SESSION-2048",
    collectedAt: "2026-07-23T08:16:58-03:00",
    registeredAt: "2026-07-23T08:17:00-03:00",
    synchronizedAt: "2026-07-23T08:17:03-03:00",
    updatedAt: now,
    sessionId: "athletic-live-field",
    capturedBy: "Catapult Vector",
    reviewedBy: "Preparacao fisica",
    qualityStatus: "mock",
    latencyMs: 3000,
    version: 1,
  },
  apollo: {
    source: "apollo",
    sourceLabel: "Apollo",
    externalRecordId: "APL-WELLNESS-1182",
    collectedAt: "2026-07-23T07:48:00-03:00",
    registeredAt: "2026-07-23T07:49:10-03:00",
    synchronizedAt: "2026-07-23T08:15:00-03:00",
    updatedAt: "2026-07-23T08:15:00-03:00",
    sessionId: "athletic-live-field",
    capturedBy: "Questionario Apollo",
    reviewedBy: "Fisiologia",
    qualityStatus: "mock",
    latencyMs: 1620000,
    version: 1,
  },
  calculated: {
    source: "calculated",
    sourceLabel: "Calculo Athletic Performance",
    collectedAt: "2026-07-23T08:17:03-03:00",
    registeredAt: "2026-07-23T08:17:03-03:00",
    synchronizedAt: "2026-07-23T08:17:03-03:00",
    updatedAt: now,
    sessionId: "athletic-live-field",
    capturedBy: "18 registros Catapult + Apollo",
    reviewedBy: "Sistema",
    qualityStatus: "mock",
    latencyMs: 0,
    version: 1,
  },
  thermography: {
    source: "thermography",
    sourceLabel: "Termografia",
    externalRecordId: "THERMO-ATH-330",
    collectedAt: "2026-07-23T07:35:00-03:00",
    registeredAt: "2026-07-23T07:42:00-03:00",
    updatedAt: "2026-07-23T07:44:00-03:00",
    sessionId: "pre-session-thermo",
    capturedBy: "Camera termica",
    reviewedBy: "Departamento medico",
    qualityStatus: "mock",
    version: 1,
  },
  manual: {
    source: "manual",
    sourceLabel: "Manual",
    externalRecordId: "MAN-SESSION-TIME-07",
    collectedAt: "2026-07-23T08:12:00-03:00",
    registeredAt: "2026-07-23T08:12:20-03:00",
    updatedAt: "2026-07-23T08:12:20-03:00",
    sessionId: "athletic-live-field",
    capturedBy: "Analise de desempenho",
    reviewedBy: "Comissao tecnica",
    qualityStatus: "mock",
    version: 1,
  },
} satisfies Record<string, DataProvenance>

export const metricAnalyses: Record<string, MetricAnalysis> = {
  distance: {
    id: "distance",
    title: "Historico de distancia",
    scope: "coletivo",
    summary: "Distancia media da equipe 7.7% acima da semana anterior, com maior contribuicao dos atacantes.",
    history: [
      { label: "Hoje", value: "8.4 km", note: "Treino tatico - Campo A" },
      { label: "Semana anterior", value: "7.8 km" },
      { label: "Media 28 dias", value: "8.1 km" },
    ],
    comparisons: [
      { label: "Equipe", value: "8.4 km", delta: "+0.3 km" },
      { label: "Atacantes", value: "8.9 km", delta: "+0.5 km" },
      { label: "Defensores", value: "8.3 km" },
    ],
    sessions: [
      { id: "s-01", name: "Treino tatico", date: "23/07", value: "8.4 km" },
      { id: "s-02", name: "Pressao alta", date: "22/07", value: "8.0 km" },
    ],
    observations: ["Laterais reduziram amplitude no bloco final."],
    alerts: ["1 atleta abaixo da meta individual de distancia."],
    decisions: ["Revisar distribuicao de carga dos atacantes."],
    provenance: mockProvenance.catapult,
  },
  speed: {
    id: "speed",
    title: "Velocidade media e maxima",
    scope: "coletivo",
    summary: "Velocidade media estavel, com pico individual acima do esperado em zona 5.",
    history: [
      { label: "Hoje", value: "7.2 km/h" },
      { label: "Pico da sessao", value: "31.2 km/h" },
      { label: "Media 28 dias", value: "6.9 km/h" },
    ],
    comparisons: [
      { label: "Equipe", value: "7.2 km/h", delta: "+4.3%" },
      { label: "ATA", value: "7.6 km/h" },
      { label: "ZAG", value: "6.8 km/h" },
    ],
    sessions: [{ id: "s-01", name: "Treino tatico", date: "23/07", value: "7.2 km/h" }],
    observations: ["Aceleracoes curtas concentradas no lado direito."],
    alerts: ["Monitorar um atleta em zona 5 prolongada."],
    decisions: ["Reduzir exposicao de sprint no bloco seguinte."],
    provenance: mockProvenance.catapult,
  },
  sprints: {
    id: "sprints",
    title: "Analise de sprints",
    scope: "coletivo",
    summary: "Sprints totais subiram 12.4%, mas dois atacantes seguem abaixo da meta planejada.",
    history: [
      { label: "Hoje", value: "182" },
      { label: "Semana anterior", value: "162" },
      { label: "Meta planejada", value: "190" },
    ],
    comparisons: [
      { label: "Executado", value: "182", delta: "96% da meta" },
      { label: "Atacantes", value: "58" },
      { label: "Meio", value: "49" },
    ],
    sessions: [{ id: "s-01", name: "Treino tatico", date: "23/07", value: "182" }],
    observations: ["Sprint distance caiu nos atacantes no bloco final."],
    alerts: ["2 atacantes abaixo da exposicao minima."],
    decisions: ["Adicionar estimulo curto no aquecimento competitivo."],
    provenance: mockProvenance.catapult,
  },
  load: {
    id: "load",
    title: "Controle de carga",
    scope: "coletivo",
    summary: "Player Load medio em 312 UA, 8.7% acima da semana anterior.",
    history: [
      { label: "Hoje", value: "312 UA" },
      { label: "Semana anterior", value: "268 UA" },
      { label: "Faixa esperada", value: "280-330 UA" },
    ],
    comparisons: [
      { label: "Planejado", value: "300 UA" },
      { label: "Executado", value: "312 UA", delta: "+4%" },
      { label: "Maior atleta", value: "G. Silva" },
    ],
    sessions: [{ id: "s-01", name: "Treino tatico", date: "23/07", value: "312 UA" }],
    observations: ["Carga calculada com base em registros Catapult mockados."],
    alerts: ["2 atletas com carga acima do ideal."],
    decisions: ["Reduzir carga de G. Silva no bloco final."],
    provenance: mockProvenance.calculated,
  },
  time: {
    id: "time",
    title: "Tempo de sessao",
    scope: "sessao",
    summary: "Sessao com 62 minutos monitorados e boa qualidade de sinal.",
    history: [
      { label: "Hoje", value: "62 min" },
      { label: "Planejado", value: "60 min" },
      { label: "Media 28 dias", value: "58 min" },
    ],
    comparisons: [
      { label: "Bloco 1", value: "18 min" },
      { label: "Bloco 2", value: "24 min" },
      { label: "Bloco 3", value: "20 min" },
    ],
    sessions: [{ id: "s-01", name: "Treino tatico", date: "23/07", value: "62 min" }],
    observations: ["Sessao estendida em 2 minutos para repeticao de transicao defensiva."],
    alerts: [],
    decisions: ["Consolidar sessao apos revisao da comissao."],
    provenance: mockProvenance.manual,
  },
  thermography: {
    id: "thermography",
    title: "Historico de termografia",
    scope: "individual",
    summary: "Comparativo demonstrativo de termografia sem diagnostico automatico.",
    history: [
      { label: "Hoje", value: "Normal" },
      { label: "7 dias", value: "Sem variacao critica" },
      { label: "Revisao", value: "Medico" },
    ],
    comparisons: [
      { label: "Lado direito", value: "36.4 C" },
      { label: "Lado esquerdo", value: "36.1 C" },
      { label: "Diferenca", value: "0.3 C" },
    ],
    sessions: [{ id: "thermo-01", name: "Pre-treino", date: "23/07", value: "Normal" }],
    observations: ["Dados simulados para demonstracao. Nao diagnosticar lesoes automaticamente."],
    alerts: ["1 atleta para revisao profissional."],
    decisions: ["Manter acompanhamento fisiologico."],
    provenance: mockProvenance.thermography,
  },
}

export function getMetricAnalysis(id: string) {
  return metricAnalyses[id] ?? metricAnalyses.load
}
