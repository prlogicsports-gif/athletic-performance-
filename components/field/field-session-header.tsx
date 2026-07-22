"use client"

import { Activity, Database, Radio, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"
import { staggerItem } from "@/lib/motion"
import type { FieldSession } from "@/lib/mock-field-session"

export function FieldSessionHeader({ session }: { session: FieldSession }) {
  return (
    <motion.header variants={staggerItem} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <span className="text-[9px] uppercase tracking-[0.24em] text-foreground/35">{session.type} - {session.field}</span>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{session.name} - {session.field}</h2>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-surface/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/80">
          <span className="size-2 rounded-full bg-alert" />
          {session.state} - {session.duration}
        </div>
      </div>

      <div className="grid gap-3 text-[10px] uppercase tracking-[0.14em] text-foreground/45 sm:grid-cols-2 xl:grid-cols-5">
        <span className="flex items-center gap-2"><Activity className="size-3.5 text-good" /> {session.activeAthletes} atletas ativos</span>
        <span className="flex items-center gap-2"><Radio className="size-3.5 text-good" /> Catapult {session.catapultStatus}</span>
        <span className="flex items-center gap-2"><Database className="size-3.5 text-info" /> Apollo {session.apolloStatus}</span>
        <span className="flex items-center gap-2"><ShieldCheck className="size-3.5 text-good" /> Qualidade {session.dataQuality}</span>
        <span>{session.lastUpdate} - {session.activePeriod}</span>
      </div>
    </motion.header>
  )
}
