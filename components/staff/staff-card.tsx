"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ShieldCheck } from "lucide-react"
import type { StaffMember } from "@/lib/staff-data"
import { cn } from "@/lib/utils"
import { spring } from "@/lib/motion"

const statusStyle: Record<StaffMember["status"], string> = {
  active: "text-good",
  away: "text-warn",
  inactive: "text-foreground/35",
}

export function StaffCard({
  member,
  onOpen,
}: {
  member: StaffMember
  onOpen: (member: StaffMember) => void
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(member)}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.985 }}
      transition={spring}
      className="group relative min-h-[248px] overflow-hidden rounded-2xl bg-card/26 p-4 text-left outline-none will-change-transform focus-visible:ring-1 focus-visible:ring-foreground/45"
      title={`Abrir profissional: ${member.name}`}
    >
      <Image src={member.avatar || "/placeholder.svg"} alt={member.name} fill sizes="280px" className="object-cover object-top opacity-38 transition duration-700 group-hover:scale-105 group-hover:opacity-48" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/78 to-background/25" />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-foreground/38">{member.department}</span>
            <h3 className="mt-3 text-xl font-semibold leading-tight">{member.name}</h3>
            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-foreground/50">{member.role}</p>
          </div>
          <span className={cn("text-[9px] font-semibold uppercase tracking-[0.18em]", statusStyle[member.status])}>
            {member.status}
          </span>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <span>
              <strong className="block text-lg">{member.assignedSessions}</strong>
              <em className="text-[8px] not-italic uppercase tracking-[0.14em] text-foreground/35">sessoes</em>
            </span>
            <span>
              <strong className="block text-lg">{member.ownedAlerts}</strong>
              <em className="text-[8px] not-italic uppercase tracking-[0.14em] text-foreground/35">alertas</em>
            </span>
            <span>
              <strong className="block text-lg">{member.pendingDecisions}</strong>
              <em className="text-[8px] not-italic uppercase tracking-[0.14em] text-foreground/35">decisoes</em>
            </span>
          </div>
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-foreground/45">
            <ShieldCheck className="size-3.5" />
            {member.permissions.slice(0, 3).join(" / ")}
          </div>
        </div>
      </div>
    </motion.button>
  )
}
