"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Activity, Network, ShieldCheck, UsersRound } from "lucide-react"
import { staffDepartments, staffMembers, type StaffMember } from "@/lib/staff-data"
import { spring, staggerContainer, staggerItem } from "@/lib/motion"
import { StaffCard } from "@/components/staff/staff-card"
import { StaffDetailDialog } from "@/components/staff/staff-detail-dialog"

export function TeamScreen() {
  const [department, setDepartment] = useState<string>("Todos")
  const [selected, setSelected] = useState<StaffMember | null>(null)
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
                  Responsabilidades conectadas a sessoes, alertas, atletas e relatorios.
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
      </AnimatePresence>
    </motion.div>
  )
}
