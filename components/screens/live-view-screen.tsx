"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock,
  Database,
  Eye,
  Gauge,
  HeartPulse,
  LineChart,
  Maximize2,
  Minimize2,
  Move,
  RotateCcw,
  Table2,
  Thermometer,
  Users,
  X,
  Zap,
} from "lucide-react"
import { athletes, loadZones } from "@/lib/data"
import { athleticSessions, interpretedSessionEvents } from "@/lib/session-data"
import { athleteDossiers } from "@/lib/athlete-dossier-data"
import { fieldSession, liveFieldPlayers, type LiveFieldPlayer } from "@/lib/mock-field-session"
import { parsedExternalRecords, sourceSummaries } from "@/lib/external-reports"
import { cn } from "@/lib/utils"
import { spring, staggerContainer, staggerItem } from "@/lib/motion"

type FocusTab = "overview" | "athletes" | "load" | "movement" | "wellness" | "thermography" | "alerts"
type PanelId =
  | "loadDistribution"
  | "loadAccumulated"
  | "heatmap"
  | "wellness"
  | "speedZones"
  | "heartRate"
  | "sprints"
  | "thermography"
  | "alerts"
  | "athleteTable"
type DetailModal = { panel: PanelId; title: string } | null

const focusTabs: Array<{ id: FocusTab; label: string; panels: PanelId[] }> = [
  { id: "overview", label: "Visao geral", panels: ["loadDistribution", "loadAccumulated", "heatmap", "wellness", "speedZones", "heartRate", "sprints", "thermography", "alerts", "athleteTable"] },
  { id: "athletes", label: "Atletas", panels: ["athleteTable", "alerts", "wellness", "thermography"] },
  { id: "load", label: "Carga", panels: ["loadDistribution", "loadAccumulated", "speedZones", "athleteTable"] },
  { id: "movement", label: "Movimento", panels: ["heatmap", "speedZones", "sprints", "athleteTable"] },
  { id: "wellness", label: "Wellness", panels: ["wellness", "alerts", "athleteTable"] },
  { id: "thermography", label: "Termografia", panels: ["thermography", "wellness", "alerts", "athleteTable"] },
  { id: "alerts", label: "Alertas", panels: ["alerts", "athleteTable", "wellness"] },
]

const panelTitles: Record<PanelId, string> = {
  loadDistribution: "Distribuicao de carga",
  loadAccumulated: "Carga acumulada",
  heatmap: "Heatmap - posicionamento",
  wellness: "Wellness - pre / pos atual",
  speedZones: "Zonas de velocidade",
  heartRate: "Frequencia cardiaca",
  sprints: "Sprints por tempo",
  thermography: "Termografia Apollo",
  alerts: "Alertas ao vivo",
  athleteTable: "Atletas - visao ao vivo",
}

const zoneColors = ["#a3a3a3", "#61df62", "#facc15", "#f97316", "#ff3434"]

function compactName(id: string) {
  const athlete = athletes.find((item) => item.id === id)
  return athlete ? `${athlete.firstName[0]}. ${athlete.lastName}` : "Equipe"
}

function MiniLineChart({
  values,
  previous,
  color = "#61df62",
  height = 130,
}: {
  values: number[]
  previous?: number[]
  color?: string
  height?: number
}) {
  const max = Math.max(...values, ...(previous ?? []), 1)
  const buildPoints = (items: number[]) =>
    items
      .map((value, index) => {
        const x = 8 + (index / Math.max(items.length - 1, 1)) * 84
        const y = 88 - (value / max) * 72
        return `${x},${y}`
      })
      .join(" ")

  return (
    <svg viewBox="0 0 100 100" style={{ height }} className="w-full overflow-visible" preserveAspectRatio="none" aria-hidden="true">
      {[20, 45, 70, 95].map((y) => (
        <line key={y} x1="8" x2="95" y1={y} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.7" />
      ))}
      {previous && <polyline points={buildPoints(previous)} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.3" strokeDasharray="3 4" strokeLinecap="round" strokeLinejoin="round" />}
      <polyline points={buildPoints(values)} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((value, index) => {
        const x = 8 + (index / Math.max(values.length - 1, 1)) * 84
        const y = 88 - (value / max) * 72
        return <circle key={`${value}-${index}`} cx={x} cy={y} r="1.5" fill={color} />
      })}
    </svg>
  )
}

function MiniBarChart({ values, color = "#41d34f" }: { values: number[]; color?: string }) {
  const max = Math.max(...values, 1)
  return (
    <div className="mt-5 flex h-28 items-end gap-4 px-1">
      {values.map((value, index) => (
        <span key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-2">
          <span className="w-full rounded-t-md" style={{ height: `${Math.max(12, (value / max) * 96)}px`, backgroundColor: color }} />
          <span className="text-[9px] text-foreground/38">{["0-15", "15-30", "30-45", "45-60", "60+"][index]}</span>
        </span>
      ))}
    </div>
  )
}

function Donut({ value, label, color = "#61df62" }: { value: number; label: string; color?: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="grid size-24 place-items-center rounded-full" style={{ background: `conic-gradient(${color} ${value}%, rgba(255,255,255,0.1) 0)` }}>
        <div className="grid size-16 place-items-center rounded-full bg-[#050505]">
          <span className="text-xl font-semibold">{value}%</span>
        </div>
      </div>
      <div>
        <p className="text-[9px] uppercase tracking-[0.16em] text-foreground/38">{label}</p>
        <p className="mt-1 text-sm font-semibold text-good">Alto</p>
      </div>
    </div>
  )
}

function LivePanel({
  id,
  title,
  subtitle,
  children,
  expanded,
  minimized,
  onMinimize,
  onExpand,
  onDetails,
  className,
}: {
  id: PanelId
  title: string
  subtitle?: string
  children: React.ReactNode
  expanded: boolean
  minimized: boolean
  onMinimize: (id: PanelId) => void
  onExpand: (id: PanelId) => void
  onDetails: (modal: DetailModal) => void
  className?: string
}) {
  return (
    <motion.section
      layout
      variants={staggerItem}
      className={cn(
        "relative overflow-hidden rounded-[8px] bg-white/[0.045] p-4 ring-1 ring-white/[0.08] backdrop-blur-xl",
        expanded && "xl:col-span-2",
        minimized && "min-h-0",
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.08em]">{title}</h3>
          {subtitle && <p className="mt-1 text-[10px] text-foreground/42">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 gap-1">
          <button type="button" onClick={() => onDetails({ panel: id, title })} className="grid size-7 place-items-center rounded-full bg-white/[0.06] text-foreground/50 hover:text-foreground" aria-label={`Abrir detalhes de ${title}`}>
            <Eye className="size-3.5" />
          </button>
          <button type="button" onClick={() => onExpand(id)} className="grid size-7 place-items-center rounded-full bg-white/[0.06] text-foreground/50 hover:text-foreground" aria-label={`Expandir ${title}`}>
            <Maximize2 className="size-3.5" />
          </button>
          <button type="button" onClick={() => onMinimize(id)} className="grid size-7 place-items-center rounded-full bg-white/[0.06] text-foreground/50 hover:text-foreground" aria-label={`Minimizar ${title}`}>
            <Minimize2 className="size-3.5" />
          </button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {!minimized && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={spring}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  expected,
  pct,
  tone = "good",
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  unit: string
  expected: string
  pct: number
  tone?: "good" | "warn" | "alert"
  onClick: () => void
}) {
  const color = tone === "alert" ? "bg-alert" : tone === "warn" ? "bg-warn" : "bg-good"
  const text = tone === "alert" ? "text-alert" : tone === "warn" ? "text-warn" : "text-good"
  return (
    <motion.button type="button" variants={staggerItem} whileHover={{ y: -4 }} transition={spring} onClick={onClick} className="rounded-[8px] bg-white/[0.045] p-4 text-left ring-1 ring-white/[0.08] backdrop-blur-xl">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-foreground/52">
        <Icon className={cn("size-4", text)} />
        {label}
      </div>
      <p className="mt-4 text-3xl font-semibold leading-none">{value} <span className="text-xs text-foreground/45">{unit}</span></p>
      <p className="mt-3 text-xs text-foreground/45">{expected}</p>
      <div className="mt-3 flex items-center gap-3">
        <span className="h-1.5 flex-1 rounded-full bg-white/[0.08]">
          <span className={cn("block h-full rounded-full", color)} style={{ width: `${Math.min(100, Math.max(6, pct))}%` }} />
        </span>
        <span className={cn("text-xs font-semibold", text)}>{pct}%</span>
      </div>
    </motion.button>
  )
}

function HeatmapPanel({ selected }: { selected: LiveFieldPlayer | null }) {
  const points = selected ? selected.heatmapPoints : liveFieldPlayers.flatMap((player) => player.heatmapPoints.slice(0, 2))
  return (
    <div>
      <svg viewBox="0 0 100 58" className="h-52 w-full rounded-[6px] bg-[#06170d]" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <rect x="6" y="6" width="88" height="46" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.45" />
        <line x1="50" x2="50" y1="6" y2="52" stroke="rgba(255,255,255,0.42)" strokeWidth="0.35" />
        <circle cx="50" cy="29" r="5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.35" />
        <rect x="6" y="20" width="10" height="18" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="0.35" />
        <rect x="84" y="20" width="10" height="18" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="0.35" />
        {points.map((point, index) => (
          <g key={`${point.x}-${point.y}-${index}`}>
            <circle cx={point.x} cy={point.y} r={8 + point.intensity * 8} fill={point.intensity > 0.74 ? "#ef4444" : point.intensity > 0.55 ? "#facc15" : "#22c55e"} opacity="0.2" />
            <circle cx={point.x} cy={point.y} r={3 + point.intensity * 3} fill={point.intensity > 0.74 ? "#ef4444" : point.intensity > 0.55 ? "#facc15" : "#22c55e"} opacity="0.58" />
          </g>
        ))}
      </svg>
      <p className="mt-3 text-center text-xs text-foreground/45">Area de maior atividade: meio-campo ofensivo</p>
    </div>
  )
}

function LoadDistribution() {
  return (
    <div className="grid gap-5 sm:grid-cols-[140px_minmax(0,1fr)]">
      <div className="grid size-36 place-items-center rounded-full" style={{ background: `conic-gradient(${zoneColors[0]} 0 8%, ${zoneColors[1]} 8% 32%, ${zoneColors[2]} 32% 64%, ${zoneColors[3]} 64% 90%, ${zoneColors[4]} 90% 100%)` }}>
        <div className="grid size-24 place-items-center rounded-full bg-[#050505] text-center">
          <span className="text-3xl font-semibold leading-none">267</span>
          <span className="-mt-5 text-[10px] text-foreground/45">UA</span>
        </div>
      </div>
      <div className="space-y-3 self-center">
        {loadZones.map((zone, index) => (
          <div key={zone.label} className="flex items-center justify-between gap-3 text-xs">
            <span className="flex items-center gap-2 text-foreground/58"><span className="size-2 rounded-full" style={{ backgroundColor: zoneColors[index] }} />{zone.label}</span>
            <strong>{zone.pct}%</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function WellnessTable({ selectedId }: { selectedId: string | null }) {
  const base = selectedId ? athletes.find((item) => item.id === selectedId) ?? athletes[0] : athletes[0]
  const rows = [
    ["PSE", "5/10", "7/10", "+2"],
    ["PSR", "6/10", `${Math.max(4, Math.round(base.apollo.recovery / 14))}/10`, "-1"],
    ["Sono", `${base.apollo.sleep.toFixed(1)}h`, `${Math.max(5, base.apollo.sleep - 0.6).toFixed(1)}h`, "-0,6"],
    ["Fadiga", "4/10", `${Math.round(base.apollo.fatigue / 10)}/10`, "+1"],
    ["Dor muscular", "3/10", `${Math.round(base.apollo.soreness / 12)}/10`, "+1"],
    ["Humor", "8/10", `${Math.round(base.apollo.wellness / 12)}/10`, "-1"],
  ]
  return (
    <div>
      <div className="grid grid-cols-[1fr_80px_100px_60px] gap-2 border-b border-white/[0.08] pb-2 text-[9px] uppercase tracking-[0.14em] text-foreground/35">
        <span />
        <span>Pre</span>
        <span>Atual</span>
        <span>Delta</span>
      </div>
      <div className="divide-y divide-white/[0.06]">
        {rows.map(([label, pre, current, delta]) => (
          <div key={label} className="grid grid-cols-[1fr_80px_100px_60px] gap-2 py-2 text-sm">
            <span className="text-foreground/58">{label}</span>
            <span>{pre}</span>
            <span className="font-semibold">{current}</span>
            <span className={delta.startsWith("+") ? "text-warn" : "text-good"}>{delta}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-warn">Status geral: atencao</p>
    </div>
  )
}

function ThermographyPanel({ selectedId }: { selectedId: string | null }) {
  const dossier = athleteDossiers.find((item) => item.athleteId === selectedId) ?? athleteDossiers[0]
  const record = dossier.thermographies[0]
  const rows = [
    ["Peitoral", "+0,6 C", "text-foreground/70"],
    ["Quadriceps", "+1,1 C", "text-warn"],
    [record.bodyRegion, `+${record.thermalDifference?.toFixed(1) ?? "0.4"} C`, "text-alert"],
    ["Panturrilha", "+0,7 C", "text-warn"],
    ["Lombar", "-0,2 C", "text-good"],
  ]
  return (
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_180px]">
      <div className="flex justify-center gap-4">
        <div className="text-center">
          <Image src="/thermography.png" alt="Termografia frontal" width={90} height={150} className="h-40 w-auto object-contain opacity-90" />
          <span className="text-[9px] uppercase tracking-[0.14em] text-foreground/35">Frontal</span>
        </div>
        <div className="text-center">
          <Image src="/thermography.png" alt="Termografia posterior" width={90} height={150} className="h-40 w-auto object-contain opacity-90" />
          <span className="text-[9px] uppercase tracking-[0.14em] text-foreground/35">Posterior</span>
        </div>
      </div>
      <div className="space-y-3 self-center text-sm">
        {rows.map(([label, value, color]) => (
          <div key={label} className="flex justify-between gap-4">
            <span className="text-foreground/58">{label}</span>
            <strong className={color}>{value}</strong>
          </div>
        ))}
        <p className="pt-2 text-xs text-foreground/42">{record.observation}</p>
      </div>
    </div>
  )
}

function AthleteTable({ selectedId, onSelect }: { selectedId: string | null; onSelect: (id: string | null) => void }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-left text-xs">
        <thead className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">
          <tr className="border-b border-white/[0.08]">
            <th className="pb-3">#</th>
            <th className="pb-3">Atleta</th>
            <th className="pb-3">Pos</th>
            <th className="pb-3 text-right">Dist.</th>
            <th className="pb-3 text-right">V. max</th>
            <th className="pb-3 text-right">Sprints</th>
            <th className="pb-3 text-right">Carga</th>
            <th className="pb-3 text-right">FC</th>
            <th className="pb-3 text-right">Wellness</th>
            <th className="pb-3 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06]">
          {liveFieldPlayers.map((player) => {
            const athlete = athletes.find((item) => item.id === player.id) ?? athletes[0]
            const active = selectedId === player.id
            return (
              <tr key={player.id} onClick={() => onSelect(active ? null : player.id)} className={cn("cursor-pointer transition-colors hover:bg-white/[0.035]", active && "bg-white/[0.055]")}>
                <td className="py-3 font-semibold">{player.number}</td>
                <td className="py-3 font-semibold">{player.fullName}</td>
                <td className="py-3 text-foreground/52">{player.position}</td>
                <td className="py-3 text-right">{player.catapult.distance.toFixed(1)} km</td>
                <td className="py-3 text-right">{player.catapult.maxSpeed.toFixed(1)}</td>
                <td className="py-3 text-right">{player.catapult.sprints}</td>
                <td className="py-3 text-right">{player.catapult.playerLoad}</td>
                <td className="py-3 text-right">{player.heartRate.current}</td>
                <td className="py-3 text-right">{athlete.apollo.wellness}%</td>
                <td className={cn("py-3 text-right font-semibold", player.availability === "alerta" ? "text-alert" : player.availability === "monitorar" ? "text-warn" : "text-good")}>{player.availability}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function LiveViewScreen() {
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null)
  const [activeFocus, setActiveFocus] = useState<FocusTab>("overview")
  const [expandedPanelId, setExpandedPanelId] = useState<PanelId | null>(null)
  const [minimizedPanelIds, setMinimizedPanelIds] = useState<PanelId[]>([])
  const [detailModal, setDetailModal] = useState<DetailModal>(null)

  const session = athleticSessions[0]
  const selectedPlayer = selectedAthleteId ? liveFieldPlayers.find((player) => player.id === selectedAthleteId) ?? null : null
  const selectedAthlete = selectedAthleteId ? athletes.find((athlete) => athlete.id === selectedAthleteId) ?? null : null
  const selectedEvents = selectedAthleteId ? interpretedSessionEvents.filter((event) => event.athleteId === selectedAthleteId) : interpretedSessionEvents
  const activePanels = focusTabs.find((tab) => tab.id === activeFocus)?.panels ?? focusTabs[0].panels

  const team = useMemo(() => {
    const source = selectedPlayer ? [selectedPlayer] : liveFieldPlayers
    const athletesSource = selectedAthlete ? [selectedAthlete] : athletes
    const avg = (items: number[]) => items.reduce((sum, value) => sum + value, 0) / Math.max(items.length, 1)
    return {
      distance: source.reduce((sum, player) => sum + player.catapult.distance, 0),
      maxSpeed: Math.max(...source.map((player) => player.catapult.maxSpeed)),
      sprints: source.reduce((sum, player) => sum + player.catapult.sprints, 0),
      load: Math.round(avg(source.map((player) => player.catapult.playerLoad))),
      heartRate: Math.round(avg(source.map((player) => player.heartRate.current))),
      recovery: Math.round(avg(source.map((player) => player.apollo.recovery))),
      wellness: Math.round(avg(athletesSource.map((athlete) => athlete.apollo.wellness))),
      fatigue: Math.round(avg(athletesSource.map((athlete) => athlete.apollo.fatigue))),
      soreness: Math.round(avg(athletesSource.map((athlete) => athlete.apollo.soreness))),
      index: Math.round(avg(source.map((player) => player.targetPct))),
    }
  }, [selectedAthlete, selectedPlayer])

  const toggleMinimized = (id: PanelId) => {
    setMinimizedPanelIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  const toggleExpanded = (id: PanelId) => {
    setExpandedPanelId((current) => (current === id ? null : id))
  }

  const panelVisible = (id: PanelId) => activePanels.includes(id)

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="min-h-screen bg-[#000000] px-4 pb-16 pt-1 md:px-8">
      <motion.header variants={staggerItem} className="flex flex-col gap-4 border-b border-white/[0.07] pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em]"><span className="size-2 rounded-full bg-alert" />Ao vivo</span>
            <span className="text-sm text-foreground/72">17:14:10</span>
            <span className="text-xs text-foreground/45">{session.name}</span>
          </div>
          <div className="mt-6 flex flex-wrap items-end gap-4">
            <h2 className="text-3xl font-semibold uppercase tracking-tight">Sessao ao vivo</h2>
            <span className="pb-1 text-xs uppercase tracking-[0.18em] text-foreground/42">{fieldSession.name}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 text-left lg:text-right">
          <span><span className="block text-[9px] uppercase tracking-[0.16em] text-foreground/35">Duracao</span><strong className="mt-1 block text-2xl font-medium">01:02:45</strong></span>
          <span><span className="block text-[9px] uppercase tracking-[0.16em] text-foreground/35">Tempo restante</span><strong className="mt-1 block text-2xl font-medium">00:27:15</strong></span>
        </div>
      </motion.header>

      <motion.div variants={staggerItem} className="mt-4 flex max-w-full gap-6 overflow-x-auto no-scrollbar border-b border-white/[0.07]">
        {focusTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFocus(tab.id)}
            className={cn(
              "shrink-0 border-b-2 px-0 pb-3 text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
              activeFocus === tab.id ? "border-warn text-foreground" : "border-transparent text-foreground/45 hover:text-foreground/80",
            )}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      <motion.div variants={staggerItem} className="mt-4 flex max-w-full gap-2 overflow-x-auto no-scrollbar">
        <button type="button" onClick={() => setSelectedAthleteId(null)} className={cn("shrink-0 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em]", !selectedAthleteId ? "bg-foreground text-background" : "bg-white/[0.06] text-foreground/50")}>Todos</button>
        {liveFieldPlayers.map((player) => (
          <button key={player.id} type="button" onClick={() => setSelectedAthleteId(player.id)} className={cn("shrink-0 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em]", selectedAthleteId === player.id ? "bg-foreground text-background" : "bg-white/[0.06] text-foreground/50 hover:text-foreground")}>
            {player.number} {player.name}
          </button>
        ))}
      </motion.div>

      <motion.section variants={staggerContainer} className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-7">
        <MetricCard icon={Move} label="Distancia total" value={team.distance.toFixed(2).replace(".", ",")} unit="km" expected={selectedPlayer ? "meta individual em leitura" : "8,4 km esperada"} pct={Math.round((team.distance / (selectedPlayer ? selectedPlayer.target.distance : 8.4 * liveFieldPlayers.length)) * 100)} onClick={() => setDetailModal({ panel: "speedZones", title: "Distancia total" })} />
        <MetricCard icon={Gauge} label="Velocidade media" value={(team.maxSpeed / 4).toFixed(1).replace(".", ",")} unit="km/h" expected="7,2 km/h esperada" pct={selectedPlayer ? 94 : 72} tone="warn" onClick={() => setDetailModal({ panel: "speedZones", title: "Velocidade media" })} />
        <MetricCard icon={Zap} label="Sprints" value={`${team.sprints}`} unit="" expected="182 esperados" pct={selectedPlayer ? Math.round((team.sprints / selectedPlayer.target.sprints) * 100) : 72} tone="warn" onClick={() => setDetailModal({ panel: "sprints", title: "Sprints" })} />
        <MetricCard icon={Activity} label="Carga de treino" value={`${team.load}`} unit="UA" expected="312 UA esperada" pct={Math.min(100, Math.round((team.load / 312) * 100))} onClick={() => setDetailModal({ panel: "loadAccumulated", title: "Carga de treino" })} />
        <MetricCard icon={HeartPulse} label="FC media" value={`${team.heartRate}`} unit="bpm" expected="138 bpm esperada" pct={92} tone={team.heartRate > 150 ? "alert" : "warn"} onClick={() => setDetailModal({ panel: "heartRate", title: "Frequencia cardiaca" })} />
        <MetricCard icon={Clock} label="Tempo Z4+Z5" value="18:42" unit="min" expected="20:00 min esperada" pct={93} onClick={() => setDetailModal({ panel: "speedZones", title: "Tempo em zonas" })} />
        <motion.button variants={staggerItem} whileHover={{ y: -4 }} transition={spring} type="button" onClick={() => setDetailModal({ panel: "wellness", title: "Indice fisico" })} className="rounded-[8px] bg-white/[0.045] p-4 text-left ring-1 ring-white/[0.08] backdrop-blur-xl">
          <Donut value={Math.min(99, Math.max(68, team.index))} label="Indice fisico" />
        </motion.button>
      </motion.section>

      {selectedPlayer && (
        <motion.section variants={staggerItem} className="mt-5 flex flex-col gap-4 rounded-[8px] bg-white/[0.04] p-4 ring-1 ring-white/[0.08] md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative size-14 overflow-hidden rounded-full bg-white/[0.05]">
              <Image src={selectedAthlete?.photo ?? "/athletes/hero.png"} alt={selectedPlayer.fullName} fill sizes="56px" className="object-cover object-top" />
            </div>
            <div>
              <p className="text-lg font-semibold">{selectedPlayer.number} {selectedPlayer.fullName}</p>
              <p className="text-xs uppercase tracking-[0.16em] text-foreground/42">{selectedPlayer.position} - foco da comissao</p>
            </div>
          </div>
          <button type="button" onClick={() => setSelectedAthleteId(null)} className="self-start rounded-full bg-white/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/55 hover:text-foreground md:self-auto">
            Limpar filtro
          </button>
        </motion.section>
      )}

      <motion.section variants={staggerContainer} className="mt-5 grid gap-3 xl:grid-cols-4">
        {panelVisible("loadDistribution") && (
          <LivePanel id="loadDistribution" title={panelTitles.loadDistribution} subtitle="UA por zona" expanded={expandedPanelId === "loadDistribution"} minimized={minimizedPanelIds.includes("loadDistribution")} onMinimize={toggleMinimized} onExpand={toggleExpanded} onDetails={setDetailModal}>
            <LoadDistribution />
          </LivePanel>
        )}
        {panelVisible("loadAccumulated") && (
          <LivePanel id="loadAccumulated" title={panelTitles.loadAccumulated} subtitle="Esta sessao x referencia" expanded={expandedPanelId === "loadAccumulated"} minimized={minimizedPanelIds.includes("loadAccumulated")} onMinimize={toggleMinimized} onExpand={toggleExpanded} onDetails={setDetailModal}>
            <div className="flex items-end justify-between"><span /><strong className="text-2xl">{team.load} <span className="text-xs text-foreground/45">UA</span></strong></div>
            <MiniLineChart values={[18, 46, 72, 108, 141, 173, 202, 238, 267]} previous={[20, 34, 55, 78, 106, 130, 154, 176, 198]} />
            <div className="mt-2 flex gap-5 text-[10px] text-foreground/45"><span className="text-good">Esta sessao</span><span>Sessao anterior</span></div>
          </LivePanel>
        )}
        {panelVisible("heatmap") && (
          <LivePanel id="heatmap" title={panelTitles.heatmap} subtitle={selectedPlayer ? compactName(selectedPlayer.id) : "Equipe"} expanded={expandedPanelId === "heatmap"} minimized={minimizedPanelIds.includes("heatmap")} onMinimize={toggleMinimized} onExpand={toggleExpanded} onDetails={setDetailModal}>
            <HeatmapPanel selected={selectedPlayer} />
          </LivePanel>
        )}
        {panelVisible("wellness") && (
          <LivePanel id="wellness" title={panelTitles.wellness} subtitle="Apollo" expanded={expandedPanelId === "wellness"} minimized={minimizedPanelIds.includes("wellness")} onMinimize={toggleMinimized} onExpand={toggleExpanded} onDetails={setDetailModal}>
            <WellnessTable selectedId={selectedAthleteId} />
          </LivePanel>
        )}
        {panelVisible("speedZones") && (
          <LivePanel id="speedZones" title={panelTitles.speedZones} subtitle="Distancia" expanded={expandedPanelId === "speedZones"} minimized={minimizedPanelIds.includes("speedZones")} onMinimize={toggleMinimized} onExpand={toggleExpanded} onDetails={setDetailModal}>
            <div className="space-y-3">
              {loadZones.map((zone, index) => (
                <div key={zone.label} className="grid grid-cols-[110px_minmax(0,1fr)_42px_48px] items-center gap-3 text-xs">
                  <span className="text-foreground/58">{zone.label}</span>
                  <span className="h-2 rounded-full bg-white/[0.08]"><span className="block h-full rounded-full" style={{ width: `${zone.pct * 2.5}%`, backgroundColor: zoneColors[index] }} /></span>
                  <strong className="text-right">{zone.pct}%</strong>
                  <span className="text-right text-foreground/45">{(zone.pct / 12).toFixed(1)} km</span>
                </div>
              ))}
            </div>
          </LivePanel>
        )}
        {panelVisible("heartRate") && (
          <LivePanel id="heartRate" title={panelTitles.heartRate} subtitle="BPM" expanded={expandedPanelId === "heartRate"} minimized={minimizedPanelIds.includes("heartRate")} onMinimize={toggleMinimized} onExpand={toggleExpanded} onDetails={setDetailModal}>
            <p className="text-3xl font-semibold">{team.heartRate} <span className="text-xs text-foreground/45">bpm</span></p>
            <MiniLineChart values={[108, 128, 136, 142, 138, 151, 148, 158, 154]} color="#facc15" />
          </LivePanel>
        )}
        {panelVisible("sprints") && (
          <LivePanel id="sprints" title={panelTitles.sprints} subtitle={`${team.sprints} sprints`} expanded={expandedPanelId === "sprints"} minimized={minimizedPanelIds.includes("sprints")} onMinimize={toggleMinimized} onExpand={toggleExpanded} onDetails={setDetailModal}>
            <MiniBarChart values={[22, 28, 21, 21, 14]} />
          </LivePanel>
        )}
        {panelVisible("thermography") && (
          <LivePanel id="thermography" title={panelTitles.thermography} subtitle={selectedPlayer ? compactName(selectedPlayer.id) : "Equipe"} expanded={expandedPanelId === "thermography"} minimized={minimizedPanelIds.includes("thermography")} onMinimize={toggleMinimized} onExpand={toggleExpanded} onDetails={setDetailModal} className="xl:col-span-2">
            <ThermographyPanel selectedId={selectedAthleteId} />
          </LivePanel>
        )}
        {panelVisible("alerts") && (
          <LivePanel id="alerts" title={panelTitles.alerts} subtitle={`${selectedEvents.length} registros`} expanded={expandedPanelId === "alerts"} minimized={minimizedPanelIds.includes("alerts")} onMinimize={toggleMinimized} onExpand={toggleExpanded} onDetails={setDetailModal} className="xl:col-span-2">
            <div className="space-y-2">
              {selectedEvents.map((event) => {
                const tone = event.status === "critical" ? "bg-alert" : event.status === "attention" ? "bg-warn" : "bg-good"
                return (
                  <button key={event.id} type="button" onClick={() => setSelectedAthleteId(event.athleteId)} className="grid w-full grid-cols-[44px_minmax(0,1fr)_110px] items-center gap-3 border-b border-white/[0.06] py-2 text-left text-xs last:border-0">
                    <span className="flex items-center gap-2 text-foreground/45"><span className={cn("size-2 rounded-full", tone)} />{event.minute}:00</span>
                    <span>{event.metric} - {event.value} {event.unit}</span>
                    <span className="text-right text-foreground/50">{compactName(event.athleteId)}</span>
                  </button>
                )
              })}
            </div>
          </LivePanel>
        )}
        {panelVisible("athleteTable") && (
          <LivePanel id="athleteTable" title={panelTitles.athleteTable} subtitle="Clique para filtrar" expanded={expandedPanelId === "athleteTable"} minimized={minimizedPanelIds.includes("athleteTable")} onMinimize={toggleMinimized} onExpand={toggleExpanded} onDetails={setDetailModal} className="xl:col-span-3">
            <AthleteTable selectedId={selectedAthleteId} onSelect={setSelectedAthleteId} />
            <p className="mt-4 text-[10px] text-foreground/42">Dados atualizados a cada 5 segundos. Fonte: Catapult e Apollo mockados.</p>
          </LivePanel>
        )}
      </motion.section>

      <motion.section variants={staggerItem} className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-[8px] bg-white/[0.04] p-4 ring-1 ring-white/[0.08]">
          <Database className="size-4 text-good" />
          <p className="mt-3 text-sm font-semibold">Catapult</p>
          <p className="mt-1 text-xs text-foreground/45">{sourceSummaries.catapult.status} - {sourceSummaries.catapult.metrics} metricas</p>
        </div>
        <div className="rounded-[8px] bg-white/[0.04] p-4 ring-1 ring-white/[0.08]">
          <Thermometer className="size-4 text-warn" />
          <p className="mt-3 text-sm font-semibold">Apollo</p>
          <p className="mt-1 text-xs text-foreground/45">{sourceSummaries.apollo.status} - termografia e wellness</p>
        </div>
        <div className="rounded-[8px] bg-white/[0.04] p-4 ring-1 ring-white/[0.08]">
          <Table2 className="size-4 text-foreground/55" />
          <p className="mt-3 text-sm font-semibold">Dados interpretados</p>
          <p className="mt-1 text-xs text-foreground/45">{parsedExternalRecords.length} registros normalizados para revisao</p>
        </div>
      </motion.section>

      <AnimatePresence>
        {detailModal && (
          <motion.div className="fixed inset-0 z-[90] flex items-end justify-center bg-background/84 px-3 pb-3 backdrop-blur-md md:items-center md:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetailModal(null)}>
            <motion.section role="dialog" aria-modal="true" className="relative max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-[30px] bg-[#101010]/94 p-5 text-foreground ring-1 ring-white/[0.08] backdrop-blur-2xl md:p-7" initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }} transition={spring} onClick={(event) => event.stopPropagation()}>
              <button type="button" onClick={() => setDetailModal(null)} className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/[0.06] text-foreground/55 hover:text-foreground" aria-label="Fechar detalhes">
                <X className="size-4" />
              </button>
              <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-foreground/40">Ao vivo - detalhes</span>
              <h3 className="mt-2 pr-10 text-3xl font-semibold">{detailModal.title}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/52">
                Visualizacao ampliada para a comissao revisar {selectedPlayer ? compactName(selectedPlayer.id) : "a equipe inteira"} durante a sessao.
              </p>
              <div className="mt-7 grid gap-4 md:grid-cols-3">
                {[
                  ["Atletas", selectedPlayer ? "1 filtrado" : `${liveFieldPlayers.length} ativos`],
                  ["Fonte", detailModal.panel === "thermography" || detailModal.panel === "wellness" ? "Apollo" : "Catapult"],
                  ["Qualidade", `${selectedPlayer?.dataQualityScore ?? 94}%`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-white/[0.045] p-4">
                    <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">{label}</span>
                    <p className="mt-2 text-2xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-white/[0.04] p-4">
                {detailModal.panel === "thermography" ? <ThermographyPanel selectedId={selectedAthleteId} /> : detailModal.panel === "wellness" ? <WellnessTable selectedId={selectedAthleteId} /> : detailModal.panel === "athleteTable" ? <AthleteTable selectedId={selectedAthleteId} onSelect={setSelectedAthleteId} /> : <MiniLineChart values={[18, 46, 72, 108, 141, 173, 202, 238, 267]} previous={[20, 34, 55, 78, 106, 130, 154, 176, 198]} height={220} />}
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
