"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Calendar, Check, Download, FileText, Link2, Plus, Search, SlidersHorizontal, X } from "lucide-react"
import { athletes, loadZones } from "@/lib/data"
import { athleteDossiers } from "@/lib/athlete-dossier-data"
import { accumulatedLoad } from "@/lib/data"
import { cn } from "@/lib/utils"
import { spring, staggerContainer, staggerItem } from "@/lib/motion"

type ReportMode = "list" | "builder"
type Scope = "individual" | "team" | "comparison" | "position"
type Period = "last-session" | "week" | "month"
type Theme = "dark" | "light"

const scopeOptions: Array<{ id: Scope; label: string }> = [
  { id: "individual", label: "Atleta individual" },
  { id: "team", label: "Equipe completa" },
  { id: "comparison", label: "Comparativo indiv. x coletivo" },
  { id: "position", label: "Comparativo por posicao" },
]

const sourceOptions = [
  "Movimento / Catapult",
  "ACWR / Carga",
  "Wellness",
  "Termografia / Apollo",
  "Mapa corporal / Dor",
  "Video / Analise",
]

const blockOptions = [
  "Resumo executivo",
  "Carga acumulada",
  "Movimento - metricas",
  "Sprints e aceleracoes",
  "Zonas de velocidade",
  "Heatmap",
  "Termografia",
  "Wellness",
  "Mapa corporal / Dor",
  "Historico de dor",
  "Conclusao e recomendacoes",
]

const readiness = ["Pronto", "Monitorar", "Pronto", "Carga alta", "Pronto", "Monitorar"]
const zoneColors = ["#a3a3a3", "#61df62", "#facc15", "#f97316", "#ff3434"]

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { ...spring, delay },
})

function MiniLine({ values, previous, color = "#61df62" }: { values: number[]; previous?: number[]; color?: string }) {
  const max = Math.max(...values, ...(previous ?? []), 1)
  const points = (items: number[]) =>
    items
      .map((value, index) => {
        const x = 4 + (index / Math.max(items.length - 1, 1)) * 92
        const y = 86 - (value / max) * 70
        return `${x},${y}`
      })
      .join(" ")

  return (
    <svg viewBox="0 0 100 100" className="h-36 w-full overflow-visible" preserveAspectRatio="none" aria-hidden="true">
      {[24, 48, 72].map((y) => (
        <line key={y} x1="4" x2="96" y1={y} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
      ))}
      {previous && <polyline points={points(previous)} fill="none" stroke="rgba(255,255,255,0.35)" strokeDasharray="4 5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />}
      <polyline points={points(values)} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
      {values.map((value, index) => {
        const x = 4 + (index / Math.max(values.length - 1, 1)) * 92
        const y = 86 - (value / max) * 70
        return <circle key={`${value}-${index}`} cx={x} cy={y} r="1.6" fill={color} />
      })}
    </svg>
  )
}

function Donut({ value }: { value: number }) {
  return (
    <div className="grid size-28 place-items-center rounded-full" style={{ background: `conic-gradient(#61df62 ${value}%, rgba(255,255,255,0.12) 0)` }}>
      <div className="grid size-20 place-items-center rounded-full bg-[#050505]">
        <span className="text-2xl font-semibold">{value}%</span>
      </div>
    </div>
  )
}

function ReportPreview({
  athleteId,
  scope,
  sources,
  blocks,
}: {
  athleteId: string
  scope: Scope
  sources: string[]
  blocks: string[]
}) {
  const athlete = athletes.find((item) => item.id === athleteId) ?? athletes[0]
  const dossier = athleteDossiers.find((item) => item.athleteId === athleteId) ?? athleteDossiers[0]
  const reportTitle =
    scope === "team"
      ? "Relatorio - Equipe completa"
      : scope === "comparison"
        ? "Relatorio - Individual x coletivo"
        : scope === "position"
          ? `Relatorio - ${athlete.position}`
          : "Relatorio - Movimento, ACWR & Wellness"

  return (
    <motion.div layout className="min-w-0">
      <div className="relative overflow-hidden rounded-[8px] bg-white/[0.035] p-5 ring-1 ring-white/[0.08]">
        <header className="grid gap-6 border-b border-white/[0.08] pb-5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
          <div className="flex items-center gap-4">
            <div className="relative size-16 overflow-hidden rounded-[8px] bg-white/[0.05]">
              <Image src={athlete.photo} alt={`${athlete.firstName} ${athlete.lastName}`} fill sizes="64px" className="object-cover object-top" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-foreground/45">
                {athlete.number} {athlete.positionShort} - Brasil
              </p>
              <h3 className="mt-1 text-2xl font-semibold">{athlete.firstName[0]}. {athlete.lastName}</h3>
              <p className="mt-1 text-xs text-foreground/45">{athlete.age} anos - {athlete.height} - {athlete.weight}</p>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold uppercase tracking-tight">{reportTitle}</h2>
            <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-foreground/45">{scope === "individual" ? "Dossie individual" : "Relatorio personalizado"} - Semana</p>
          </div>
          <div className="text-left lg:text-right">
            <p className="font-semibold">PR-AC</p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-foreground/45">Powered by PR Logic Sports</p>
            <p className="mt-2 text-xs text-foreground/45">Gerado 23/07/2026 - 19:31</p>
            <p className="text-xs text-foreground/45">Fontes: {sources.slice(0, 3).join(", ")}</p>
          </div>
        </header>

        <section className="mt-5 grid gap-3 md:grid-cols-5">
          {[
            ["Distancia total", athlete.catapult.distance.toFixed(1), "km", "+7,7%"],
            ["Velocidade max.", athlete.catapult.maxSpeed.toFixed(1), "km/h", "+4,3%"],
            ["Sprints", athlete.catapult.sprints, "", "+12,3%"],
            ["Carga de treino", athlete.catapult.playerLoad, "UA", "+8,7%"],
            ["Tempo de sessao", "62", "min", "+5,1%"],
          ].map(([label, value, unit, delta]) => (
            <div key={label} className="rounded-[8px] bg-white/[0.04] p-4">
              <p className="text-2xl font-semibold">{value} <span className="text-xs text-foreground/45">{unit}</span></p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-foreground/38">{label}</p>
              <p className="mt-2 text-xs text-good">{delta} vs semana anterior</p>
            </div>
          ))}
        </section>

        <section className="mt-4 grid gap-3 lg:grid-cols-3">
          {blocks.includes("Carga acumulada") && (
            <div className="rounded-[8px] bg-white/[0.035] p-4 ring-1 ring-white/[0.06]">
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em]">Carga acumulada</h4>
              <MiniLine values={accumulatedLoad.now} previous={accumulatedLoad.prev} />
            </div>
          )}
          {blocks.includes("Sprints e aceleracoes") && (
            <div className="rounded-[8px] bg-white/[0.035] p-4 ring-1 ring-white/[0.06]">
              <div className="flex items-start justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-[0.14em]">ACWR - carga aguda / cronica</h4>
                <span className="text-xl font-semibold text-alert">1,62</span>
              </div>
              <MiniLine values={[0.6, 0.7, 0.9, 1.05, 1.2, 1.18, 1.62]} color="#facc15" />
            </div>
          )}
          {blocks.includes("Zonas de velocidade") && (
            <div className="rounded-[8px] bg-white/[0.035] p-4 ring-1 ring-white/[0.06]">
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em]">Distribuicao de carga</h4>
              <div className="mt-4 flex items-center gap-5">
                <div className="grid size-28 place-items-center rounded-full" style={{ background: `conic-gradient(${zoneColors[0]} 0 8%, ${zoneColors[1]} 8% 32%, ${zoneColors[2]} 32% 64%, ${zoneColors[3]} 64% 90%, ${zoneColors[4]} 90% 100%)` }}>
                  <div className="grid size-20 place-items-center rounded-full bg-[#050505] text-center">
                    <span className="text-2xl font-semibold">{athlete.catapult.playerLoad}</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  {loadZones.map((zone, index) => (
                    <div key={zone.label} className="flex justify-between gap-3 text-xs">
                      <span className="flex items-center gap-2 text-foreground/55"><span className="size-2 rounded-full" style={{ backgroundColor: zoneColors[index] }} />{zone.label}</span>
                      <strong>{zone.pct}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="mt-4 grid gap-3 lg:grid-cols-3">
          {blocks.includes("Movimento - metricas") && (
            <div className="rounded-[8px] bg-white/[0.035] p-4 ring-1 ring-white/[0.06]">
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em]">Movimento - metricas</h4>
              <div className="mt-4 space-y-3">
                {[
                  ["Distancia total", athlete.catapult.distance, 10],
                  ["Velocidade media", 7.2, 10],
                  ["Velocidade max.", athlete.catapult.maxSpeed, 32],
                  ["Sprints totais", athlete.catapult.sprints, 60],
                  ["Aceleracoes", athlete.catapult.accelerations, 140],
                  ["Desaceleracoes", athlete.catapult.decelerations, 120],
                ].map(([label, value, max]) => (
                  <div key={label} className="grid grid-cols-[1fr_120px_46px] items-center gap-3 text-xs">
                    <span className="text-foreground/55">{label}</span>
                    <span className="h-2 rounded-full bg-white/[0.08]"><span className="block h-full rounded-full bg-good" style={{ width: `${Math.min(100, (Number(value) / Number(max)) * 100)}%` }} /></span>
                    <strong className="text-right">{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
          {blocks.includes("Heatmap") && (
            <div className="rounded-[8px] bg-white/[0.035] p-4 ring-1 ring-white/[0.06]">
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em]">Heatmap - posicionamento</h4>
              <svg viewBox="0 0 100 58" className="mt-4 h-44 w-full rounded-[6px] bg-[#06170d]" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                <rect x="6" y="6" width="88" height="46" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.45" />
                <line x1="50" x2="50" y1="6" y2="52" stroke="rgba(255,255,255,0.42)" strokeWidth="0.35" />
                <circle cx="50" cy="29" r="5" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.35" />
                {([
                  [27, 22, "#facc15"], [36, 31, "#ef4444"], [51, 31, "#facc15"], [61, 18, "#22c55e"], [42, 39, "#facc15"],
                ] as Array<[number, number, string]>).map(([x, y, color], index) => (
                  <g key={index}>
                    <circle cx={x} cy={y} r="11" fill={color} opacity="0.18" />
                    <circle cx={x} cy={y} r="4" fill={color} opacity="0.58" />
                  </g>
                ))}
              </svg>
              <p className="mt-3 text-center text-xs text-foreground/45">Area de maior atividade: meio-campo ofensivo</p>
            </div>
          )}
          {blocks.includes("Termografia") && (
            <div className="rounded-[8px] bg-white/[0.035] p-4 ring-1 ring-white/[0.06]">
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em]">Termografia Apollo</h4>
              <div className="mt-4 grid grid-cols-[1fr_1fr_140px] items-center gap-3">
                <Image src="/thermography.png" alt="Termografia" width={90} height={150} className="h-40 w-auto object-contain" />
                <Image src="/thermography.png" alt="Termografia posterior" width={90} height={150} className="h-40 w-auto object-contain" />
                <div className="space-y-2 text-xs">
                  <p className="flex justify-between"><span>Peitoral</span><strong className="text-info">-2,1 C</strong></p>
                  <p className="flex justify-between"><span>Quadriceps</span><strong className="text-alert">+0,8 C</strong></p>
                  <p className="flex justify-between"><span>{dossier.thermographies[0].bodyRegion}</span><strong className="text-alert">+1,2 C</strong></p>
                  <p className="flex justify-between"><span>Lombar</span><strong className="text-good">-0,3 C</strong></p>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="mt-4 grid gap-3 lg:grid-cols-3">
          {blocks.includes("Wellness") && (
            <div className="rounded-[8px] bg-white/[0.035] p-4 ring-1 ring-white/[0.06]">
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em]">Wellness - pre treino</h4>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {[
                  ["Sono", athlete.apollo.sleep.toFixed(1)],
                  ["Fadiga", Math.round(athlete.apollo.fatigue / 10)],
                  ["Recup.", Math.round(athlete.apollo.recovery / 12)],
                  ["Motiv.", Math.round(athlete.apollo.wellness / 12)],
                ].map(([label, value]) => (
                  <span key={label} className="text-center">
                    <Donut value={Math.min(92, Number(value) * 10)} />
                    <span className="mt-2 block text-[10px] text-foreground/45">{label}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
          {blocks.includes("Mapa corporal / Dor") && (
            <div className="rounded-[8px] bg-white/[0.035] p-4 ring-1 ring-white/[0.06]">
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em]">Mapa corporal - dor</h4>
              <div className="mt-4 flex items-center justify-center gap-6">
                <Image src="/thermography.png" alt="Mapa corporal" width={90} height={150} className="h-40 w-auto object-contain opacity-70 grayscale" />
                <div className="space-y-3 text-xs">
                  <p><span className="mr-2 inline-block size-2 rounded-full bg-alert" />Dor ativa</p>
                  <p><span className="mr-2 inline-block size-2 rounded-full bg-warn" />Em acompanhamento</p>
                  <p><span className="mr-2 inline-block size-2 rounded-full bg-good" />Recuperada</p>
                </div>
              </div>
            </div>
          )}
          {blocks.includes("Historico de dor") && (
            <div className="rounded-[8px] bg-white/[0.035] p-4 ring-1 ring-white/[0.06]">
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em]">Historico de dor</h4>
              <div className="mt-4 space-y-3 text-xs">
                {[
                  ["Posterior da coxa", "5/10", "Ativa", "text-alert"],
                  ["Panturrilha", "3/10", "Acompanhamento", "text-warn"],
                  ["Lombar", "2/10", "Melhorando", "text-good"],
                ].map(([region, intensity, status, color]) => (
                  <div key={region} className="grid grid-cols-[1fr_60px_110px] gap-3">
                    <span>{region}</span>
                    <span>{intensity}</span>
                    <span className={color}>{status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="mt-4 grid gap-3 lg:grid-cols-3">
          <div className="rounded-[8px] bg-white/[0.035] p-4 ring-1 ring-white/[0.06]">
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em]">Conclusao</h4>
            <p className="mt-3 text-xs leading-relaxed text-foreground/55">
              Atleta apresenta resposta consistente de carga e movimento. Revisar sinais de fadiga e manter acompanhamento fisico individual.
            </p>
          </div>
          <div className="rounded-[8px] bg-white/[0.035] p-4 ring-1 ring-white/[0.06]">
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em]">Recomendacoes</h4>
            <ul className="mt-3 space-y-1 text-xs text-foreground/55">
              <li>Monitorar carga no bloco final.</li>
              <li>Reforcar hidratacao e recuperacao.</li>
              <li>Revisao fisioterapeutica recomendada.</li>
            </ul>
          </div>
          <div className="rounded-[8px] bg-white/[0.035] p-4 ring-1 ring-white/[0.06]">
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em]">Sessoes utilizadas</h4>
            <p className="mt-3 text-2xl font-semibold">6 <span className="text-xs text-foreground/45">sessoes</span></p>
            <p className="mt-2 text-xs text-foreground/45">4 treinos, 1 jogo, 1 academia</p>
          </div>
        </section>
      </div>
    </motion.div>
  )
}

export function ReportsScreen() {
  const [mode, setMode] = useState<ReportMode>("list")
  const [selectedAthleteId, setSelectedAthleteId] = useState(athletes[0].id)
  const [scope, setScope] = useState<Scope>("individual")
  const [period, setPeriod] = useState<Period>("week")
  const [theme, setTheme] = useState<Theme>("dark")
  const [sources, setSources] = useState(sourceOptions.slice(0, 5))
  const [blocks, setBlocks] = useState(blockOptions)
  const [search, setSearch] = useState("")

  const filteredAthletes = useMemo(() => {
    const term = search.trim().toLowerCase()
    return athletes.filter((athlete) => `${athlete.firstName} ${athlete.lastName} ${athlete.position}`.toLowerCase().includes(term))
  }, [search])

  const selectedAthlete = athletes.find((athlete) => athlete.id === selectedAthleteId) ?? athletes[0]

  const toggleSource = (source: string) => {
    setSources((current) => (current.includes(source) ? current.filter((item) => item !== source) : [...current, source]))
  }

  const toggleBlock = (block: string) => {
    setBlocks((current) => (current.includes(block) ? current.filter((item) => item !== block) : [...current, block]))
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="px-4 pb-14 pt-1 md:px-8">
      <motion.div variants={staggerItem} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">Relatorios</h2>
          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-foreground/45">
            Lista de atletas, dossie individual e gerador personalizado
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setMode("list")} className={cn("rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em]", mode === "list" ? "bg-foreground text-background" : "bg-white/[0.06] text-foreground/55 hover:text-foreground")}>
            Lista de atletas
          </button>
          <button type="button" onClick={() => setMode("builder")} className={cn("flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em]", mode === "builder" ? "bg-foreground text-background" : "bg-white/[0.06] text-foreground/55 hover:text-foreground")}>
            <SlidersHorizontal className="size-3.5" />
            Gerar relatorio
          </button>
        </div>
      </motion.div>

      {mode === "list" && (
        <motion.section variants={staggerContainer} className="mt-6 grid gap-5 xl:grid-cols-[minmax(320px,0.82fr)_minmax(0,1.55fr)]">
          <motion.div variants={staggerItem} className="rounded-[8px] bg-white/[0.04] p-4 ring-1 ring-white/[0.08]">
            <div className="flex items-center gap-2 rounded-full bg-white/[0.06] px-3 py-2">
              <Search className="size-4 text-foreground/40" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar atleta" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-foreground/30" />
            </div>
            <div className="mt-4 max-h-[640px] space-y-2 overflow-y-auto pr-1">
              {filteredAthletes.map((athlete, index) => {
                const active = selectedAthleteId === athlete.id
                return (
                  <motion.button
                    key={athlete.id}
                    variants={staggerItem}
                    whileHover={{ x: 4 }}
                    transition={spring}
                    type="button"
                    onClick={() => setSelectedAthleteId(athlete.id)}
                    className={cn("grid w-full grid-cols-[54px_minmax(0,1fr)_80px] items-center gap-3 rounded-[8px] p-2.5 text-left transition-colors", active ? "bg-foreground text-background" : "bg-white/[0.045] text-foreground hover:bg-white/[0.07]")}
                  >
                    <div className="relative size-12 overflow-hidden rounded-[6px] bg-white/[0.08]">
                      <Image src={athlete.photo} alt={`${athlete.firstName} ${athlete.lastName}`} fill sizes="48px" className="object-cover object-top" />
                    </div>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{athlete.number}. {athlete.firstName[0]}. {athlete.lastName}</span>
                      <span className={cn("mt-1 block text-[9px] uppercase tracking-[0.14em]", active ? "text-background/55" : "text-foreground/38")}>{athlete.position}</span>
                    </span>
                    <span className="text-right text-xs font-semibold">{readiness[index] ?? "Pronto"}</span>
                  </motion.button>
                )
              })}
            </div>
            <button type="button" onClick={() => setMode("builder")} className="mt-4 flex w-full items-center justify-center gap-2 rounded-[8px] bg-foreground px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-background">
              <Plus className="size-4" />
              Gerar relatorio personalizado
            </button>
          </motion.div>

          <ReportPreview athleteId={selectedAthleteId} scope="individual" sources={sourceOptions.slice(0, 5)} blocks={blockOptions} />
        </motion.section>
      )}

      {mode === "builder" && (
        <motion.section variants={staggerContainer} className="mt-6 grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
          <motion.aside variants={staggerItem} className="rounded-[8px] bg-white/[0.04] p-4 ring-1 ring-white/[0.08]">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em]">Gerar relatorio</h3>
            <p className="mt-1 text-xs text-foreground/45">Monte, visualize e exporte o relatorio personalizado.</p>

            <div className="mt-5 space-y-2">
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-foreground/35">Escopo</span>
              {scopeOptions.map((item) => (
                <button key={item.id} type="button" onClick={() => setScope(item.id)} className={cn("block w-full rounded-[6px] px-3 py-2 text-left text-xs font-semibold", scope === item.id ? "bg-foreground text-background" : "bg-white/[0.045] text-foreground/60 hover:text-foreground")}>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-5">
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-foreground/35">Atleta</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {athletes.map((athlete) => (
                  <button key={athlete.id} type="button" onClick={() => setSelectedAthleteId(athlete.id)} className={cn("rounded-full px-2.5 py-1 text-[10px]", selectedAthleteId === athlete.id ? "bg-foreground text-background" : "bg-white/[0.06] text-foreground/55")}>
                    {athlete.number} {athlete.firstName[0]}. {athlete.lastName}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-foreground/35">Fontes de dados</span>
              {sourceOptions.map((source) => (
                <button key={source} type="button" onClick={() => toggleSource(source)} className="flex w-full items-center gap-2 text-left text-xs text-foreground/65">
                  <span className={cn("grid size-4 place-items-center rounded-[3px] ring-1 ring-white/[0.18]", sources.includes(source) && "bg-good text-background ring-good")}>{sources.includes(source) && <Check className="size-3" />}</span>
                  {source}
                </button>
              ))}
            </div>

            <div className="mt-5">
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-foreground/35">Periodo</span>
              <div className="mt-2 flex gap-2">
                {[
                  ["last-session", "Ultima sessao"],
                  ["week", "Semana"],
                  ["month", "Mes"],
                ].map(([id, label]) => (
                  <button key={id} type="button" onClick={() => setPeriod(id as Period)} className={cn("rounded-full px-3 py-1.5 text-[10px]", period === id ? "bg-foreground text-background" : "bg-white/[0.06] text-foreground/55")}>{label}</button>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <span className="flex items-center gap-2 rounded-[6px] bg-white/[0.045] px-3 py-2 text-xs text-foreground/60"><Calendar className="size-3.5" />15/07/2026</span>
                <span className="flex items-center gap-2 rounded-[6px] bg-white/[0.045] px-3 py-2 text-xs text-foreground/60"><Calendar className="size-3.5" />21/07/2026</span>
              </div>
            </div>

            <div className="mt-5">
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-foreground/35">Tema do PDF</span>
              <div className="mt-2 flex gap-2">
                {[
                  ["dark", "Escuro"],
                  ["light", "Claro"],
                ].map(([id, label]) => (
                  <button key={id} type="button" onClick={() => setTheme(id as Theme)} className={cn("rounded-full px-3 py-1.5 text-[10px]", theme === id ? "bg-foreground text-background" : "bg-white/[0.06] text-foreground/55")}>{label}</button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-foreground/35">Ordem dos blocos</span>
              <div className="mt-2 max-h-52 space-y-1 overflow-y-auto rounded-[8px] bg-black/30 p-2">
                {blockOptions.map((block, index) => (
                  <button key={block} type="button" onClick={() => toggleBlock(block)} className={cn("flex w-full items-center justify-between rounded-[6px] px-2 py-1.5 text-left text-xs", blocks.includes(block) ? "text-foreground" : "text-foreground/28")}>
                    <span>{index + 1}. {block}</span>
                    {blocks.includes(block) ? <Check className="size-3 text-good" /> : <X className="size-3" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <button type="button" className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-foreground px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-background">
                <Download className="size-4" />
                Exportar PDF
              </button>
              <button type="button" className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-white/[0.045] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/65 ring-1 ring-white/[0.08]">
                <Link2 className="size-4" />
                Compartilhar link
              </button>
            </div>
          </motion.aside>

          <ReportPreview athleteId={selectedAthlete.id} scope={scope} sources={sources} blocks={blocks} />
        </motion.section>
      )}
    </motion.div>
  )
}
