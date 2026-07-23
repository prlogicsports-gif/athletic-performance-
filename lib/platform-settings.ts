export type FeatureFlag =
  | "morningBriefEnabled"
  | "decisionCenterEnabled"
  | "teamBoardEnabled"
  | "alertsEnabled"
  | "sessionsEnabled"
  | "liveMonitoringEnabled"
  | "reportsV2Enabled"
  | "fieldAnalysisEnabled"
  | "notificationsEnabled"
  | "exportsEnabled"

export type PlatformSettings = Record<FeatureFlag, boolean>

export type PlatformFeature = {
  id: FeatureFlag
  label: string
  description: string
  stage: "V1" | "V2" | "V3"
}

export const defaultPlatformSettings: PlatformSettings = {
  morningBriefEnabled: true,
  decisionCenterEnabled: true,
  teamBoardEnabled: false,
  alertsEnabled: true,
  sessionsEnabled: true,
  liveMonitoringEnabled: true,
  reportsV2Enabled: false,
  fieldAnalysisEnabled: true,
  notificationsEnabled: false,
  exportsEnabled: false,
}

export const platformFeatures: PlatformFeature[] = [
  {
    id: "morningBriefEnabled",
    label: "Morning Brief",
    description: "Home operacional com prioridades do dia, disponibilidade, revisoes e sincronizacoes.",
    stage: "V1",
  },
  {
    id: "decisionCenterEnabled",
    label: "Decision Center",
    description: "Fila de decisoes sugeridas com responsavel, severidade e status.",
    stage: "V1",
  },
  {
    id: "teamBoardEnabled",
    label: "Equipe / profissionais",
    description: "Habilita a sessao Equipe para Bruno/Fisiologia cadastrar e consultar profissionais.",
    stage: "V1",
  },
  {
    id: "alertsEnabled",
    label: "Alert Center",
    description: "Central de alertas de carga, recuperacao, sono, dados faltantes, lesao e revisao.",
    stage: "V1",
  },
  {
    id: "sessionsEnabled",
    label: "Sessoes",
    description: "Lista operacional de sessoes com origem, sincronizacao, qualidade e revisao.",
    stage: "V1",
  },
  {
    id: "liveMonitoringEnabled",
    label: "Ao Vivo / TV",
    description: "Painel de comissao, TV coletiva, foco atleta, campo e relatorios ao vivo.",
    stage: "V1",
  },
  {
    id: "reportsV2Enabled",
    label: "Relatorios avancados",
    description: "Templates profissionais com mapas, comparativos, analise e exportacao futura.",
    stage: "V2",
  },
  {
    id: "fieldAnalysisEnabled",
    label: "Campo 2D / live",
    description: "Analise de campo com heatmap, rotas, sprints, aceleracoes e treino ao vivo.",
    stage: "V1",
  },
  {
    id: "notificationsEnabled",
    label: "Notificacoes",
    description: "Simulacao futura de push, WhatsApp e email para a comissao tecnica.",
    stage: "V2",
  },
  {
    id: "exportsEnabled",
    label: "Exportacoes",
    description: "Preparacao para PDF, CSV e dossies de relatorio por atleta ou sessao.",
    stage: "V2",
  },
]

export type DecisionStatus = "pendente" | "em_revisao" | "resolvido"
export type DecisionSeverity = "critico" | "atencao" | "informativo"

export type DecisionItem = {
  id: string
  athleteId: string
  severity: DecisionSeverity
  indicator: string
  summary: string
  suggestedAction: string
  owner: string
  status: DecisionStatus
}

export const decisionItems: DecisionItem[] = [
  {
    id: "decision-goncalo-load",
    athleteId: "goncalo",
    severity: "critico",
    indicator: "Player Load 22% acima",
    summary: "Carga elevada com sprint distance em queda e recuperacao baixa.",
    suggestedAction: "Reduzir carga e revisar bloco final do treino.",
    owner: "Preparador fisico",
    status: "pendente",
  },
  {
    id: "decision-giroud-zone",
    athleteId: "giroud",
    severity: "atencao",
    indicator: "Zona 4 recorrente",
    summary: "Alta exposicao em intensidade com fadiga moderada no Apollo.",
    suggestedAction: "Monitorar aquecimento e limitar tiros longos.",
    owner: "Fisiologia",
    status: "em_revisao",
  },
  {
    id: "decision-alason-wellness",
    athleteId: "alason",
    severity: "atencao",
    indicator: "Sono abaixo do ideal",
    summary: "Wellness bom, mas sono reportado abaixo da media individual.",
    suggestedAction: "Reavaliar apos aquecimento antes do bloco principal.",
    owner: "Comissao tecnica",
    status: "pendente",
  },
]

export const syncStatus = [
  { source: "Apollo", time: "08:15", quality: 92 },
  { source: "Catapult", time: "08:17", quality: 100 },
  { source: "Manual", time: "08:21", quality: 100 },
]
