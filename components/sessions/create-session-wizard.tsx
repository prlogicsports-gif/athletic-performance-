"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CalendarClock, Check, Database, Dumbbell, Users, X } from "lucide-react"
import { athletes } from "@/lib/data"
import { staffMembers } from "@/lib/staff-data"
import { spring } from "@/lib/motion"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, label: "Informacoes", icon: CalendarClock },
  { id: 2, label: "Participantes", icon: Users },
  { id: 3, label: "Planejamento", icon: Dumbbell },
  { id: 4, label: "Captacao", icon: Database },
  { id: 5, label: "Revisao", icon: Check },
]

export function CreateSessionWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1)

  return (
    <motion.div className="fixed inset-0 z-[90] flex items-end justify-center bg-background/84 px-3 pb-3 backdrop-blur-md md:items-center md:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-label="Criar sessao"
        className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[30px] bg-[#050505] p-5 text-foreground md:p-7"
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={spring}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-surface/65 text-foreground/55 hover:text-foreground" aria-label="Fechar criacao">
          <X className="size-4" />
        </button>

        <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-foreground/35">Nova sessao</span>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Planejar treino ou jogo</h2>

        <div className="mt-7 flex max-w-full gap-2 overflow-x-auto no-scrollbar pr-10">
          {steps.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStep(item.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] transition-colors",
                step === item.id ? "bg-foreground text-background" : "bg-surface/65 text-foreground/45 hover:text-foreground",
              )}
            >
              <item.icon className="size-3.5" />
              {String(item.id).padStart(2, "0")} {item.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {step === 1 && (
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["Nome", "Treino tatico - Campo A"],
                ["Tipo", "TREINO"],
                ["Data", "23/07/2026"],
                ["Horario", "08:10"],
                ["Local", "CT Athletic"],
                ["Campo", "Campo A"],
                ["Duracao", "90 min"],
                ["Objetivo", "Comportamento defensivo"],
                ["Responsavel", staffMembers[0].name],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-card/16 p-4">
                  <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">{label}</span>
                  <p className="mt-2 text-sm font-semibold">{value}</p>
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {athletes.map((athlete) => (
                <div key={athlete.id} className="flex items-center justify-between rounded-2xl bg-card/16 p-3">
                  <span>
                    <span className="block text-sm font-semibold">{athlete.firstName[0]}. {athlete.lastName}</span>
                    <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/40">{athlete.positionShort} - meta {athlete.zoneState === "alert" ? "70%" : athlete.zoneState === "warn" ? "82%" : "100%"}</span>
                  </span>
                  <span className="size-2 rounded-full bg-good" />
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-4 md:grid-cols-3">
              {["Aquecimento integrado", "Pressao alta", "Transicao defensiva"].map((block, index) => (
                <div key={block} className="rounded-2xl bg-card/16 p-4">
                  <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">Bloco {index + 1}</span>
                  <h3 className="mt-2 font-semibold">{block}</h3>
                  <p className="mt-2 text-sm text-foreground/50">Duracao {12 + index * 8} min - carga planejada {45 + index * 46} UA.</p>
                </div>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-4 md:grid-cols-5">
              {["CATAPULT", "APOLLO", "MANUAL", "CSV", "MOCK AO VIVO"].map((source) => (
                <div key={source} className="rounded-2xl bg-card/16 p-4">
                  <Database className="size-4 text-good" />
                  <p className="mt-3 text-sm font-semibold">{source}</p>
                  <p className="mt-1 text-xs text-foreground/42">Qualidade minima configurada</p>
                </div>
              ))}
            </div>
          )}

          {step === 5 && (
            <div className="grid gap-4 md:grid-cols-3">
              {["Salvar rascunho", "Publicar", "Iniciar captacao"].map((action) => (
                <button key={action} type="button" className="rounded-2xl bg-card/16 p-5 text-left transition-colors hover:bg-card/28">
                  <span className="text-sm font-semibold">{action}</span>
                  <p className="mt-2 text-xs text-foreground/45">Acao mockada preparada para backend futuro.</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between gap-3">
          <button type="button" onClick={() => setStep(Math.max(1, step - 1))} className="rounded-full bg-surface/70 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/55 hover:text-foreground">
            Voltar
          </button>
          <button type="button" onClick={() => step === 5 ? onClose() : setStep(step + 1)} className="rounded-full bg-foreground px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-background">
            {step === 5 ? "Concluir" : "Proximo"}
          </button>
        </div>
      </motion.section>
    </motion.div>
  )
}
