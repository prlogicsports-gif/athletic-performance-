"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import { spring, staggerContainer, staggerItem } from "@/lib/motion"
import type { FieldValuation, LiveFieldPlayer } from "@/lib/mock-field-session"

export function FieldValuationModal({
  valuation,
  label,
  selected,
  players,
  onClose,
}: {
  valuation: FieldValuation
  label: string
  selected: LiveFieldPlayer
  players: LiveFieldPlayer[]
  onClose: () => void
}) {
  const sorted = [...players].sort((a, b) => b.loadPct - a.loadPct)
  const averageLoad = Math.round(players.reduce((sum, player) => sum + player.loadPct, 0) / players.length)

  return (
    <motion.div
      className="fixed inset-0 z-[120] overflow-y-auto bg-background/88 px-4 py-6 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="mx-auto max-w-5xl rounded-[28px] bg-[#050505] p-5 shadow-[0_40px_120px_-70px_rgba(255,255,255,0.45)] md:p-8"
        initial={{ opacity: 0, y: 24, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={spring}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[9px] uppercase tracking-[0.24em] text-foreground/35">Detalhes da valencia</span>
            <h3 className="mt-2 text-2xl font-semibold">{label}</h3>
            <p className="mt-2 text-sm text-foreground/45">{selected.fullName} - Bloco 2 - Catapult + Apollo - dado de qualidade alta</p>
          </div>
          <button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-full bg-surface text-foreground/60 hover:text-foreground" aria-label="Fechar detalhes">
            <X className="size-4" />
          </button>
        </div>

        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1fr]">
          <motion.div variants={staggerItem} className="grid grid-cols-2 gap-5">
            {[
              ["Media", `${averageLoad}%`],
              ["Maior valor", `${sorted[0]?.loadPct ?? 0}%`],
              ["Menor valor", `${sorted.at(-1)?.loadPct ?? 0}%`],
              ["Meta", `${selected.targetPct}%`],
              ["Diferenca", `${selected.targetPct - 100 > 0 ? "+" : ""}${selected.targetPct - 100}%`],
              ["Qualidade", `${selected.dataQualityScore}%`],
            ].map(([labelText, value]) => (
              <div key={labelText}>
                <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">{labelText}</span>
                <strong className="mt-1 block text-2xl">{value}</strong>
              </div>
            ))}
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-3">
            <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/35">Ranking da sessao</span>
            {sorted.map((player, index) => (
              <div key={player.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                <span className="text-[10px] text-foreground/35">{index + 1}</span>
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span>{player.name}</span>
                    <span>{player.loadPct}%</span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-foreground/10">
                    <motion.span
                      className="block h-full rounded-full bg-good"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: player.loadPct / 100 }}
                      transition={spring}
                      style={{ transformOrigin: "left" }}
                    />
                  </div>
                </div>
                <span className="text-[9px] uppercase tracking-[0.12em] text-foreground/40">{player.position}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="mt-8 flex flex-wrap gap-2">
          {["Abrir atleta", "Comparar", "Criar alerta", "Registrar decisao", "Fixar no painel", "Exportar recorte"].map((action) => (
            <button key={action} type="button" className="rounded-full bg-surface/70 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground/50 transition-colors hover:text-foreground">
              {action}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
