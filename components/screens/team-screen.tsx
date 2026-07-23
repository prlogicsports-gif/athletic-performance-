"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Activity, Network, Plus, ShieldCheck, UsersRound, X } from "lucide-react"
import { staffDepartments, staffMembers, type StaffMember } from "@/lib/staff-data"
import { spring, staggerContainer, staggerItem } from "@/lib/motion"
import { StaffCard } from "@/components/staff/staff-card"
import { StaffDetailDialog } from "@/components/staff/staff-detail-dialog"

export function TeamScreen() {
  const [department, setDepartment] = useState<string>("Todos")
  const [selected, setSelected] = useState<StaffMember | null>(null)
  const [adding, setAdding] = useState(false)
  const filtered = useMemo(
    () => department === "Todos" ? staffMembers : staffMembers.filter((member) => member.department === department),
    [department],
  )
  const activeCount = staffMembers.filter((member) => member.status === "active").length
  const alerts = staffMembers.reduce((sum, member) => sum + member.ownedAlerts, 0)
  const decisions = staffMembers.reduce((sum, member) => sum + member.pendingDecisions, 0)

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="px-4 pb-16 pt-1 md:px-8">
      <motion.div variants={staggerItem} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.26em] text-foreground/45">
            Equipe profissional
          </span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">
            Comissao e operacao
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/50">
            Estrutura tecnica, responsabilidades, permissoes e atividade da plataforma.
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/45">
          {staffMembers.length} profissionais
        </span>
      </motion.div>

      <motion.button
        type="button"
        onClick={() => setAdding(true)}
        variants={staggerItem}
        whileHover={{ y: -3, scale: 1.015 }}
        transition={spring}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/[0.055] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/62 backdrop-blur-xl ring-1 ring-white/[0.06] hover:text-foreground"
      >
        <Plus className="size-3.5" strokeWidth={1.5} />
        Adicionar profissional
      </motion.button>

      <motion.section
        variants={staggerItem}
        className="relative mt-6 overflow-hidden rounded-[26px] bg-white/[0.035] p-4 backdrop-blur-2xl ring-1 ring-white/[0.06] md:p-5"
      >
        <div className="relative grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-foreground/38">
              Central da comissao
            </span>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/64">
              Responsaveis, alertas e decisoes ficam reunidos em uma visao compacta para orientar o trabalho do dia.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-5 text-right md:min-w-[320px]">
            <span>
              <strong className="block text-xl leading-none">{activeCount}</strong>
              <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">ativos</span>
            </span>
            <span>
              <strong className="block text-xl leading-none">{alerts}</strong>
              <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">alertas</span>
            </span>
            <span>
              <strong className="block text-xl leading-none">{decisions}</strong>
              <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">decisoes</span>
            </span>
          </div>
        </div>
      </motion.section>

      <motion.div variants={staggerContainer} className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
        {[
          { icon: UsersRound, label: "Ativos", value: activeCount },
          { icon: Network, label: "Departamentos", value: staffDepartments.length },
          { icon: Activity, label: "Alertas sob responsabilidade", value: alerts },
          { icon: ShieldCheck, label: "Decisoes pendentes", value: decisions },
        ].map((item) => (
          <motion.div key={item.label} variants={staggerItem}>
            <div className="flex items-center gap-2 text-foreground/45">
              <item.icon className="size-3.5" strokeWidth={1.5} />
              <span className="text-[9px] font-medium uppercase tracking-[0.18em]">{item.label}</span>
            </div>
            <p className="mt-2 text-3xl font-semibold leading-none">{item.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={staggerItem} className="mt-8 flex max-w-full gap-2 overflow-x-auto no-scrollbar">
        {["Todos", ...staffDepartments].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setDepartment(item)}
            className={`shrink-0 rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] transition-colors ${
              department === item ? "bg-foreground text-background" : "bg-surface/65 text-foreground/45 hover:text-foreground"
            }`}
          >
            {item}
          </button>
        ))}
      </motion.div>

      <motion.section variants={staggerContainer} className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((member) => (
          <motion.div key={member.id} variants={staggerItem} transition={spring}>
            <StaffCard member={member} onOpen={setSelected} />
          </motion.div>
        ))}
      </motion.section>

      <motion.section variants={staggerItem} className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,0.65fr)_minmax(280px,0.35fr)]">
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/45">Organograma</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {["Comissao tecnica", "Performance", "Saude", "Dados"].map((group) => (
              <div key={group} className="rounded-2xl bg-card/14 p-4">
                <span className="text-xs font-semibold">{group}</span>
                <p className="mt-2 text-xs leading-relaxed text-foreground/45">
                  Responsabilidades vinculadas a sessoes, alertas, atletas e relatorios.
                </p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/45">Responsabilidades</h3>
          <div className="mt-4 space-y-3 text-sm text-foreground/62">
            <p>Preparacao fisica responde por carga e metas Catapult.</p>
            <p>Fisiologia responde por Apollo, wellness e termografia.</p>
            <p>Analise conecta campo, eventos e relatorios da sessao.</p>
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {selected && <StaffDetailDialog member={selected} onClose={() => setSelected(null)} />}
        {adding && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-end justify-center bg-background/82 px-3 pb-3 backdrop-blur-md md:items-center md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAdding(false)}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-xl rounded-[28px] bg-[#101010]/92 p-5 text-foreground ring-1 ring-white/[0.08] backdrop-blur-2xl md:p-7"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={spring}
              onClick={(event) => event.stopPropagation()}
            >
              <button type="button" onClick={() => setAdding(false)} className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-white/[0.06] text-foreground/55 hover:text-foreground" aria-label="Fechar cadastro">
                <X className="size-4" />
              </button>
              <span className="text-[9px] font-medium uppercase tracking-[0.24em] text-foreground/40">
                Equipe habilitada
              </span>
              <h3 className="mt-2 pr-10 text-2xl font-semibold">Adicionar profissional</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/52">
                Mock preparado para cadastro futuro de profissionais por Bruno/Fisiologia.
              </p>
              <div className="mt-6 grid gap-3">
                {["Nome completo", "Departamento", "Funcao", "Permissao", "Contato"].map((label) => (
                  <div key={label} className="rounded-2xl bg-white/[0.055] p-4">
                    <span className="text-[9px] uppercase tracking-[0.16em] text-foreground/35">{label}</span>
                    <p className="mt-2 text-sm text-foreground/62">Campo mockado para integracao futura.</p>
                  </div>
                ))}
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
