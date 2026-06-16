"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { athletes } from "@/lib/data"

const staff = [
  { name: "R. Mancini", role: "Treinador", photo: "/athletes/hero-profile.png" },
  { name: "A. Sampaio", role: "Preparação física", photo: "/athletes/player-4.png" },
  { name: "L. Duarte", role: "Fisiologia", photo: "/athletes/player-5.png" },
  { name: "M. Paiva", role: "Análise", photo: "/athletes/player-6.png" },
]

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.42, delay },
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
              className="group overflow-hidden rounded-2xl bg-card/35"
            >
              <div className="relative h-28 sm:h-32">
                <Image src={member.photo} alt={member.name} fill className="object-cover object-top opacity-85" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
              </div>
              <div className="px-3 pb-3">
                <span className="block text-xs font-semibold text-foreground">{member.name}</span>
                <span className="mt-0.5 block text-[9px] uppercase tracking-[0.14em] text-foreground/45">
                  {member.role}
                </span>
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
              className="group overflow-hidden rounded-2xl bg-card/35"
            >
              <div className="relative h-28 sm:h-32">
                <Image src={a.photo || "/placeholder.svg"} alt={`${a.firstName} ${a.lastName}`} fill className="object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <span className="absolute left-2 top-2 text-[10px] font-bold text-foreground">{a.number}</span>
                <span className="absolute right-2 top-2 text-[9px] font-medium text-foreground/45">{a.positionShort}</span>
              </div>
              <div className="px-3 pb-3">
                <span className="block text-xs font-semibold text-foreground">
                  {a.firstName[0]}. {a.lastName}
                </span>
                <span className="mt-0.5 block text-[9px] uppercase tracking-[0.14em] text-foreground/45">
                  {a.distance} km · zona {a.zone}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}
