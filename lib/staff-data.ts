export type StaffMember = {
  id: string
  name: string
  role: string
  department: string
  email?: string
  phone?: string
  avatar?: string
  teamIds: string[]
  athleteIds: string[]
  permissions: string[]
  status: "active" | "inactive" | "away"
  teamsServed: string[]
  assignedSessions: number
  ownedAlerts: number
  pendingDecisions: number
  lastActivity: string
}

export const staffDepartments = [
  "Comissao tecnica",
  "Preparacao fisica",
  "Fisiologia",
  "Fisioterapia",
  "Departamento medico",
  "Analise de desempenho",
  "Analise de dados",
  "Nutricao",
  "Psicologia",
  "Gestao",
  "Scout",
  "Administracao",
] as const

export const staffMembers: StaffMember[] = [
  {
    id: "mancini",
    name: "R. Mancini",
    role: "Treinador principal",
    department: "Comissao tecnica",
    email: "mancini@athletic.performance",
    phone: "+55 31 90000-1001",
    avatar: "/athletes/hero-profile.png",
    teamIds: ["professional"],
    athleteIds: ["giroud", "alason", "edson", "goncalo", "diogo", "ronaldinho"],
    permissions: ["decisoes", "sessoes", "relatorios"],
    status: "active",
    teamsServed: ["Profissional"],
    assignedSessions: 4,
    ownedAlerts: 1,
    pendingDecisions: 2,
    lastActivity: "08:31 - revisou plano tatico",
  },
  {
    id: "sampaio",
    name: "A. Sampaio",
    role: "Preparador fisico",
    department: "Preparacao fisica",
    email: "sampaio@athletic.performance",
    phone: "+55 31 90000-1002",
    avatar: "/athletes/player-4.png",
    teamIds: ["professional"],
    athleteIds: ["giroud", "goncalo", "diogo"],
    permissions: ["catapult", "carga", "decisoes"],
    status: "active",
    teamsServed: ["Profissional", "Transicao"],
    assignedSessions: 6,
    ownedAlerts: 3,
    pendingDecisions: 4,
    lastActivity: "08:27 - ajustou meta de carga",
  },
  {
    id: "duarte",
    name: "L. Duarte",
    role: "Fisiologista",
    department: "Fisiologia",
    email: "duarte@athletic.performance",
    phone: "+55 31 90000-1003",
    avatar: "/athletes/player-5.png",
    teamIds: ["professional"],
    athleteIds: ["alason", "edson", "ronaldinho"],
    permissions: ["apollo", "wellness", "termografia"],
    status: "active",
    teamsServed: ["Profissional"],
    assignedSessions: 3,
    ownedAlerts: 2,
    pendingDecisions: 1,
    lastActivity: "08:15 - sincronizou Apollo",
  },
  {
    id: "paiva",
    name: "M. Paiva",
    role: "Analista de desempenho",
    department: "Analise de desempenho",
    email: "paiva@athletic.performance",
    phone: "+55 31 90000-1004",
    avatar: "/athletes/player-6.png",
    teamIds: ["professional"],
    athleteIds: ["giroud", "diogo"],
    permissions: ["campo", "video", "relatorios"],
    status: "active",
    teamsServed: ["Profissional"],
    assignedSessions: 5,
    ownedAlerts: 1,
    pendingDecisions: 1,
    lastActivity: "08:12 - marcou evento de campo",
  },
  {
    id: "naves",
    name: "B. Naves",
    role: "Medico do clube",
    department: "Departamento medico",
    email: "naves@athletic.performance",
    avatar: "/athletes/player-3.png",
    teamIds: ["professional"],
    athleteIds: ["goncalo"],
    permissions: ["medical", "termografia", "restricoes"],
    status: "away",
    teamsServed: ["Profissional"],
    assignedSessions: 2,
    ownedAlerts: 2,
    pendingDecisions: 1,
    lastActivity: "07:44 - revisou termografia",
  },
  {
    id: "lara",
    name: "C. Lara",
    role: "Administradora da plataforma",
    department: "Administracao",
    email: "lara@athletic.performance",
    avatar: "/athletes/player-2.png",
    teamIds: ["professional"],
    athleteIds: [],
    permissions: ["admin", "usuarios", "integracoes"],
    status: "active",
    teamsServed: ["Profissional", "Base"],
    assignedSessions: 1,
    ownedAlerts: 0,
    pendingDecisions: 0,
    lastActivity: "08:03 - conferiu integracoes",
  },
]
