"use client"

import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, X } from "lucide-react"
import type { StaffMember } from "@/lib/staff-data"
import { spring } from "@/lib/motion"
import { cn } from "@/lib/utils"

const tabs = ["perfil", "responsabilidades", "atletas", "sessoes", "alertas", "decisoes", "relatorios", "atividade", "permissoes"] as const

export function StaffDetailDialog({
  member,
  onClose,
}: {
  member: StaffMember
  onClose: () => void
}) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("perfil")

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-background/82 px-3 pb-3 backdrop-blur-md md:items-center md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-label={member.name}
        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[28px] bg-[#050505] p-5 md:p-7"
        initial={{ opacity: 0, y: 26, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={spring}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="absolute right-4 top-4 z-20 flex size-9 items-center justify-center rounded-full bg-surface/65 text-foreground/55 hover:text-foreground" aria-label="Fechar profissional">
          <X className="size-4" />
        </button>

        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="relative min-h-[360px] overflow-hidden rounded-[24px] bg-card/22 p-5">
            <Image src={member.avatar || "/placeholder.svg"} alt={member.name} fill sizes="300px" className="object-cover object-top opacity-45" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/20" />
            <div className="relative z-10 flex h-full flex-col justify-end">
              <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-foreground/38">{member.department}</span>
              <h2 className="mt-3 text-3xl font-semibold leading-none">{member.name}</h2>
              <p className="mt-2 text-sm text-foreground/60">{member.role}</p>
              <div className="mt-5 space-y-2 text-xs text-foreground/55">
                {member.email && <p className="flex items-center gap-2"><Mail className="size-3.5" /> {member.email}</p>}
                {member.phone && <p className="flex items-center gap-2"><Phone className="size-3.5" /> {member.phone}</p>}
              </div>
            </div>
          </aside>

          <main>
            <div className="flex max-w-full gap-2 overflow-x-auto no-scrollbar pr-12">
              {tabs.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] transition-colors",
                    tab === item ? "bg-foreground text-background" : "bg-surface/65 text-foreground/45 hover:text-foreground",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-card/16 p-4">
                <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">Equipes</span>
                <p className="mt-2 text-lg font-semibold">{member.teamsServed.join(", ")}</p>
              </div>
              <div className="rounded-2xl bg-card/16 p-4">
                <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">Atletas</span>
                <p className="mt-2 text-lg font-semibold">{member.athleteIds.length}</p>
              </div>
              <div className="rounded-2xl bg-card/16 p-4">
                <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">Ultima atividade</span>
                <p className="mt-2 text-sm font-semibold">{member.lastActivity}</p>
              </div>
            </div>

            <section className="mt-7 space-y-4">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/45">{tab}</h3>
              <div className="grid gap-3 text-sm text-foreground/62">
                {tab === "perfil" && (
                  <>
                    <p>Status operacional: {member.status}.</p>
                    <p>Departamento: {member.department}. Funcao: {member.role}.</p>
                  </>
                )}
                {tab === "responsabilidades" && (
                  <>
                    <p>{member.assignedSessions} sessoes atribuidas.</p>
                    <p>{member.ownedAlerts} alertas sob responsabilidade.</p>
                    <p>{member.pendingDecisions} decisoes pendentes.</p>
                  </>
                )}
                {tab === "permissoes" && member.permissions.map((permission) => <p key={permission}>{permission}</p>)}
                {!["perfil", "responsabilidades", "permissoes"].includes(tab) && (
                  <p>Mock operacional preparado para conectar {tab} aos registros reais da plataforma.</p>
                )}
              </div>
            </section>
          </main>
        </div>
      </motion.section>
    </motion.div>
  )
}
