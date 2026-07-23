"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Maximize2, MonitorPlay, Pause, Play, Radio, RotateCcw } from "lucide-react"
import { athletes } from "@/lib/data"
import { athleticSessions, deviceAssignments, liveCaptureEvents } from "@/lib/session-data"
import { fieldSession, liveFieldPlayers } from "@/lib/mock-field-session"
import { FieldPitch } from "@/components/field/field-pitch"
import { FieldLegends } from "@/components/field/field-legends"
import { DataSourceBadge } from "@/components/analytics/data-source-badge"
import { mockProvenance } from "@/lib/analytics-data"
import { cn } from "@/lib/utils"
import { staggerContainer, staggerItem } from "@/lib/motion"

const modes = ["comissao", "tv coletiva", "foco atleta", "campo", "carga", "fisiologia", "alertas", "relatorios"] as const

export function LiveViewScreen() {
  const [mode, setMode] = useState<(typeof modes)[number]>("comissao")
  const [selectedId, setSelectedId] = useState(athletes[0].id)
  const [rotation, setRotation] = useState(false)
  const selected = athletes.find((athlete) => athlete.id === selectedId) ?? athletes[0]
  const selectedLive = liveFieldPlayers.find((player) => player.id === selectedId) ?? liveFieldPlayers[0]
  const session = athleticSessions[0]
  const active = deviceAssignments.filter((device) => device.status !== "missing").length
  const noSignal = deviceAssignments.filter((device) => device.status === "missing" || device.status === "unstable").length
  const criticalEvents = liveCaptureEvents.filter((event) => event.status !== "normal")
  const teamLoad = useMemo(() => Math.round(liveFieldPlayers.reduce((sum, player) => sum + player.catapult.playerLoad, 0) / liveFieldPlayers.length), [])

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="min-h-screen bg-[#000000] px-4 pb-16 pt-1 md:px-8">
      <motion.header variants={staggerItem} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.26em] text-foreground/45">Ao vivo</span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">{session.name}</h2>
          <p className="mt-2 text-sm text-foreground/52">{fieldSession.activePeriod} - {fieldSession.field} - ultima atualizacao {fieldSession.lastUpdate}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setRotation(!rotation)} className="flex items-center gap-2 rounded-full bg-surface/70 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground/55 hover:text-foreground">
            {rotation ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
            Rotacao 20s
          </button>
          <button type="button" className="flex items-center gap-2 rounded-full bg-surface/70 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground/55 hover:text-foreground">
            <Maximize2 className="size-3.5" />
            Tela cheia
          </button>
        </div>
      </motion.header>

      <motion.section
        variants={staggerItem}
        className="relative mt-6 overflow-hidden rounded-[26px] bg-white/[0.035] p-4 backdrop-blur-2xl ring-1 ring-white/[0.06] md:p-5"
      >
        <div className="pointer-events-none absolute inset-x-8 top-0 h-24 bg-[radial-gradient(circle_at_68%_0%,rgba(255,255,255,0.11),transparent_58%)]" />
        <div className="relative grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-alert">
              Sessao ao vivo
            </span>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/64">
              Monitoramento mockado de carga, sinal e eventos criticos para orientar a comissao durante o treino.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-5 text-right md:min-w-[340px]">
            <span>
              <strong className="block text-xl leading-none">{active}</strong>
              <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">ativos</span>
            </span>
            <span>
              <strong className="block text-xl leading-none">{noSignal}</strong>
              <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">sinal</span>
            </span>
            <span>
              <strong className="block text-xl leading-none">{teamLoad}</strong>
              <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">UA media</span>
            </span>
          </div>
        </div>
      </motion.section>

      <motion.div variants={staggerItem} className="mt-7 flex max-w-full gap-2 overflow-x-auto no-scrollbar">
        {modes.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] transition-colors",
              mode === item ? "bg-foreground text-background" : "bg-surface/65 text-foreground/45 hover:text-foreground",
            )}
          >
            {item}
          </button>
        ))}
      </motion.div>

      <motion.section variants={staggerContainer} className="mt-8 grid gap-5 lg:grid-cols-4">
        {[
          ["Relogio", "42:15", "AO VIVO"],
          ["Atletas ativos", active, `${athletes.length} associados`],
          ["Sem sinal", noSignal, "qualidade monitorada"],
          ["Carga coletiva", `${teamLoad} UA`, "media atual"],
        ].map(([label, value, sub]) => (
          <motion.div key={label} variants={staggerItem} className="rounded-2xl bg-card/14 p-4">
            <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">{label}</span>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
            <p className="mt-1 text-xs text-foreground/42">{sub}</p>
          </motion.div>
        ))}
      </motion.section>

      {mode === "comissao" && (
        <motion.section variants={staggerContainer} className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-4 md:grid-cols-2">
            {liveFieldPlayers.map((player) => (
              <button key={player.id} type="button" onClick={() => setSelectedId(player.id)} className="relative overflow-hidden rounded-2xl bg-card/16 p-4 text-left transition-colors hover:bg-card/28">
                <div className="flex items-center justify-between gap-4">
                  <span>
                    <span className="block font-semibold">{player.number} - {player.name}</span>
                    <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/40">{player.position} - {player.signal}</span>
                  </span>
                  <span className="font-semibold">{player.catapult.playerLoad} UA</span>
                </div>
              </button>
            ))}
          </div>
          <aside className="space-y-4">
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/45">Alertas ao vivo</h3>
            {criticalEvents.map((event) => {
              const athlete = athletes.find((item) => item.id === event.athleteId) ?? athletes[0]
              return (
                <button key={event.id} type="button" onClick={() => setSelectedId(athlete.id)} className="flex w-full gap-3 rounded-2xl bg-card/16 p-4 text-left text-sm text-foreground/65 hover:bg-card/28">
                  <AlertTriangle className="size-4 shrink-0 text-warn" />
                  {athlete.firstName[0]}. {athlete.lastName} - {event.metric} {event.value}{event.unit}
                </button>
              )
            })}
          </aside>
        </motion.section>
      )}

      {mode === "tv coletiva" && (
        <motion.section variants={staggerItem} className="mt-10 grid min-h-[420px] place-items-center text-center">
          <div>
            <MonitorPlay className="mx-auto size-10 text-alert" />
            <h3 className="mt-6 text-6xl font-semibold leading-none">{active} ativos</h3>
            <p className="mt-4 text-2xl text-foreground/60">{criticalEvents.length} atletas em atencao - carga coletiva {teamLoad} UA</p>
          </div>
        </motion.section>
      )}

      {mode === "foco atleta" && (
        <motion.section variants={staggerItem} className="mt-8 grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="relative min-h-[420px] overflow-hidden rounded-[28px] bg-card/18 p-5">
            <Image src={selected.photo} alt={`${selected.firstName} ${selected.lastName}`} fill sizes="360px" className="object-cover object-top opacity-58" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/15" />
            <div className="relative z-10 flex h-full flex-col justify-end">
              <span className="text-[9px] uppercase tracking-[0.22em] text-good">Conectado a sessao ao vivo</span>
              <h3 className="mt-3 text-4xl font-semibold">{selected.number} {selected.firstName[0]}. {selected.lastName}</h3>
              <p className="mt-2 text-foreground/52">{selected.position} - meta {selectedLive.targetPct}%</p>
            </div>
          </div>
          <div className="grid content-start gap-4 md:grid-cols-3">
            {[
              ["Carga", `${selectedLive.catapult.playerLoad} UA`],
              ["Distancia", `${selectedLive.catapult.distance.toFixed(1)} km`],
              ["Sprints", selectedLive.catapult.sprints],
              ["FC", `${selectedLive.heartRate.current} bpm`],
              ["Recovery", `${selectedLive.apollo.recovery}%`],
              ["Sinal", `${selectedLive.signalQuality}%`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-card/16 p-4">
                <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">{label}</span>
                <p className="mt-2 text-2xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {mode === "campo" && (
        <motion.section variants={staggerItem} className="mt-8 space-y-4">
          <FieldPitch players={liveFieldPlayers} selected={selectedLive} activeLayers={new Set(["markers", "heatmap", "routes", "sprints"])} live onSelect={setSelectedId} />
          <FieldLegends layers={["markers", "heatmap", "routes", "sprints"]} />
        </motion.section>
      )}

      {["carga", "fisiologia", "alertas", "relatorios"].includes(mode) && (
        <motion.section variants={staggerContainer} className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {liveCaptureEvents.map((event) => {
            const athlete = athletes.find((item) => item.id === event.athleteId) ?? athletes[0]
            return (
              <motion.div key={event.id} variants={staggerItem} className="rounded-2xl bg-card/16 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">{event.minute}:00 - atualizado automaticamente</span>
                  <DataSourceBadge provenance={event.provenance} compact />
                </div>
                <p className="mt-3 text-sm font-semibold">{athlete.firstName[0]}. {athlete.lastName}</p>
                <p className="mt-1 text-2xl font-semibold">{event.value} {event.unit}</p>
                <p className="mt-2 text-xs text-foreground/42">{event.metric} - snapshot parcial disponivel</p>
              </motion.div>
            )
          })}
          <motion.div variants={staggerItem} className="rounded-2xl bg-card/16 p-4">
            <Radio className="size-4 text-alert" />
            <p className="mt-3 font-semibold">Relatorio vivo</p>
            <p className="mt-2 text-sm text-foreground/50">Atualizado automaticamente. Ultima atualizacao: 18:45:22. Fonte: Catapult.</p>
            <div className="mt-3"><DataSourceBadge provenance={mockProvenance.catapult} compact /></div>
          </motion.div>
        </motion.section>
      )}

      <motion.div variants={staggerItem} className="mt-10 flex flex-wrap items-center gap-4 text-[9px] uppercase tracking-[0.16em] text-foreground/35">
        <span className="flex items-center gap-2"><RotateCcw className="size-3.5" /> rotacao mockada</span>
        <span>alto contraste pronto</span>
        <span>QR/link interno mock</span>
        <span>snapshots parciais preparados</span>
      </motion.div>
    </motion.div>
  )
}
