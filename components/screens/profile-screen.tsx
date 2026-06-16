"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, Footprints } from "lucide-react"
import {
  athletes,
  profileSeason,
  profileForm,
  profilePhysical,
  profileRings,
  nextOpponents,
} from "@/lib/data"
import { MetricIcon } from "../metric-icon"
import { Ring } from "../viz"
import { cn } from "@/lib/utils"
import type { Screen } from "@/lib/nav"

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
})

function BrazilFlag() {
  return (
    <span className="flex h-4 w-6 items-center justify-center rounded-[2px] bg-good">
      <span className="size-2 rotate-45 bg-warn" />
    </span>
  )
}

function ClubBadge({ name }: { name: string }) {
  const initials = name.replace("-", " ").split(" ").map((w) => w[0]).join("").slice(0, 2)
  return (
    <span className="flex size-12 items-center justify-center rounded-full border border-border bg-surface text-xs font-bold">
      {initials}
    </span>
  )
}

export function ProfileScreen({
  athleteId,
  onBack,
}: {
  athleteId: string
  onBack: (s: Screen) => void
}) {
  const a = athletes.find((x) => x.id === athleteId) ?? athletes[0]

  return (
    <div className="relative px-4 pb-16 md:px-8">
      <button
        onClick={() => onBack("carousel")}
        className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Voltar
      </button>

      <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
        {/* left */}
        <div>
          <motion.div {...fade(0)} className="flex items-center gap-3 text-xs">
            <span className="text-xl font-bold">{a.number}</span>
            <span className="uppercase tracking-wide text-muted-foreground">{a.position}</span>
            <BrazilFlag />
            <span>{a.country}</span>
          </motion.div>

          <motion.h1 {...fade(0.05)} className="mt-2 text-4xl font-extrabold leading-none tracking-tight md:text-5xl">
            {a.firstName} <span className="block md:inline">{a.lastName}</span>
          </motion.h1>

          {/* season performance */}
          <motion.div {...fade(0.1)} className="mt-8">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Desempenho na temporada
            </h3>
            <div className="flex flex-wrap items-center gap-6">
              {profileSeason.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="text-2xl font-bold">{s.value}</span>
                  <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{s.label}</span>
                </div>
              ))}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Forma (últimos 5)</span>
                <div className="flex gap-2">
                  {profileForm.map((f, i) => (
                    <span
                      key={i}
                      className={cn(
                        "flex size-7 items-center justify-center rounded-full border text-xs font-bold",
                        f === "G" && "border-good text-good",
                        f === "E" && "border-muted-foreground text-muted-foreground",
                        f === "P" && "border-alert text-alert",
                      )}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* physical metrics */}
          <motion.div {...fade(0.15)} className="mt-8">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Métricas físicas <span className="text-muted-foreground">(temporada)</span>
            </h3>
            <div className="flex flex-wrap gap-x-8 gap-y-5">
              {profilePhysical.map((m) => (
                <div key={m.label} className="flex flex-col gap-1">
                  <MetricIcon type={m.icon} className="size-5 text-foreground" />
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-xl font-bold">{m.value}</span>
                    {m.unit && <span className="text-xs text-muted-foreground">{m.unit}</span>}
                  </div>
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{m.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* next opponents */}
          <motion.div {...fade(0.2)} className="mt-8">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Próximos adversários — Série B
            </h3>
            <div className="flex flex-wrap gap-5">
              {nextOpponents.map((o) => (
                <div key={o.name} className="flex w-20 flex-col items-center gap-2 text-center">
                  <ClubBadge name={o.name} />
                  <span className="text-[11px] font-semibold uppercase">{o.name}</span>
                  <span className="text-[10px] text-muted-foreground">{o.date} • {o.time}</span>
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{o.venue}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* right: photo + rings */}
        <div className="relative flex items-start justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] w-full max-w-sm"
          >
            <Image
              src={a.id === "giroud" ? "/athletes/hero-profile.png" : a.photo}
              alt={`${a.firstName} ${a.lastName}`}
              fill
              className="object-contain object-top"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-transparent to-background/40" />
          </motion.div>

          <div className="absolute right-0 top-2 flex flex-col gap-4">
            {profileRings.map((r, i) => (
              <motion.div key={r.label} {...fade(0.3 + i * 0.1)} className="flex flex-col items-center gap-1">
                <Ring pct={r.pct} token={r.token} size={72} />
                <span className="w-24 text-center text-[10px] uppercase tracking-wide text-muted-foreground">
                  {r.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* bottom info strip */}
      <motion.div
        {...fade(0.4)}
        className="mt-7 grid grid-cols-2 gap-5 border-t border-border pt-5 text-xs md:grid-cols-4"
      >
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Nacionalidade</span>
          <span className="flex items-center gap-2"><BrazilFlag /> {a.country}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Data de nascimento</span>
          <span className="font-semibold">30/09/1986 <span className="text-xs font-normal text-muted-foreground">· {a.age} anos</span></span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Pé preferencial</span>
          <span className="flex items-center gap-2"><Footprints className="size-4 text-good" /> Direito</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Contrato</span>
          <span className="font-semibold">30/06/2025</span>
        </div>
      </motion.div>
    </div>
  )
}
