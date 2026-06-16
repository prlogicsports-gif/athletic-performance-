"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { athletes } from "@/lib/data"

const staff = [
  { name: "R. Mancini", role: "Treinador", photo: "/athletes/hero-profile.png", focus: "Modelo tático", load: "92%", status: "Campo" },
  { name: "A. Sampaio", role: "Preparação física", photo: "/athletes/player-4.png", focus: "Carga externa", load: "88%", status: "GPS" },
  { name: "L. Duarte", role: "Fisiologia", photo: "/athletes/player-5.png", focus: "Recuperação", load: "81%", status: "Apolo" },
  { name: "M. Paiva", role: "Análise", photo: "/athletes/player-6.png", focus: "Vídeo e dados", load: "96%", status: "Live" },
]

const spring = {
  type: "spring",
  stiffness: 180,
  damping: 22,
  mass: 0.9,
} as const

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { ...spring, delay },
})

export function TeamScreen() {
  return (
    <div className="px-4 pb-14 pt-1 md:px-8">
      <motion.div {...fade(0)} className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground">Equipe</h2>
          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-foreground/45">
            Comissão técnica e elenco monitorado
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em] text-foreground/45">
          {athletes.length + staff.length} perfis
        </span>
      </motion.div>

      <motion.section {...fade(0.06)} className="mt-6">
        <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/55">
          Comissão técnica
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {staff.map((member, i) => (
            <motion.div
              key={member.name}
              {...fade(0.08 + i * 0.03)}
              whileHover={{ y: -8, scale: 1.025 }}
              transition={spring}
              className="group overflow-hidden rounded-2xl bg-card/35 will-change-transform"
            >
              <div className="relative h-28 sm:h-32">
                <motion.div className="absolute inset-0" whileHover={{ scale: 1.06 }} transition={spring}>
                  <Image src={member.photo} alt={member.name} fill className="object-cover object-top opacity-85" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
                <span className="absolute right-2 top-2 text-[8px] font-semibold uppercase tracking-[0.14em] text-foreground/55">
                  {member.status}
                </span>
              </div>
              <div className="px-3 pb-3 pt-1">
                <span className="block text-xs font-semibold text-foreground">{member.name}</span>
                <span className="mt-0.5 block text-[9px] uppercase tracking-[0.14em] text-foreground/45">
                  {member.role}
                </span>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <span className="text-[8px] uppercase tracking-[0.12em] text-foreground/35">{member.focus}</span>
                  <span className="font-mono text-[10px] text-foreground/70">{member.load}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section {...fade(0.12)} className="mt-7">
        <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/55">
          Jogadores
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {athletes.map((a, i) => (
            <motion.div
              key={a.id}
              {...fade(0.14 + i * 0.025)}
              whileHover={{ y: -8, scale: 1.025 }}
              transition={spring}
              className="group overflow-hidden rounded-2xl bg-card/35 will-change-transform"
            >
              <div className="relative h-28 sm:h-32">
                <motion.div className="absolute inset-0" whileHover={{ scale: 1.06 }} transition={spring}>
                  <Image src={a.photo || "/placeholder.svg"} alt={`${a.firstName} ${a.lastName}`} fill className="object-cover object-top" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <span className="absolute left-2 top-2 text-[10px] font-bold text-foreground">{a.number}</span>
                <span className="absolute right-2 top-2 text-[9px] font-medium text-foreground/45">{a.positionShort}</span>
              </div>
              <div className="px-3 pb-3 pt-1">
                <span className="block text-xs font-semibold text-foreground">
                  {a.firstName[0]}. {a.lastName}
                </span>
                <span className="mt-0.5 block text-[9px] uppercase tracking-[0.14em] text-foreground/45">
                  {a.distance} km · zona {a.zone}
                </span>
                <div className="mt-3 grid grid-cols-2 gap-2 text-[8px] uppercase tracking-[0.12em] text-foreground/35">
                  <span>{a.height}</span>
                  <span className="text-right">{a.weight}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}
