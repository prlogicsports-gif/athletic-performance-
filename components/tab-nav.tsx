"use client"

import { Activity, Bell, CalendarDays, FileText, Home, User, Users } from "lucide-react"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Screen } from "@/lib/nav"
import { spring, staggerContainer, staggerItem } from "@/lib/motion"

type NavEntry = { id: string; label: string; icon: LucideIcon; screen: Screen }

const leftItems: NavEntry[] = [
  { id: "dashboard", label: "DASHBOARD", icon: Home, screen: "dashboard" },
  { id: "equipe", label: "EQUIPE", icon: Users, screen: "team" },
  { id: "atletas", label: "ATLETAS", icon: User, screen: "carousel" },
]

const rightItems: NavEntry[] = [
  { id: "sessoes", label: "SESSÕES", icon: Activity, screen: "dashboard" },
  { id: "calendario", label: "CALENDÁRIO", icon: CalendarDays, screen: "calendar" },
  { id: "relatorios", label: "RELATÓRIOS", icon: FileText, screen: "reports" },
  { id: "alertas", label: "ALERTAS", icon: Bell, screen: "dashboard" },
]

const items = [...leftItems, ...rightItems]

function activeIdFor(screen: Screen) {
  if (screen === "carousel" || screen === "profile") return "atletas"
  if (screen === "team") return "equipe"
  if (screen === "calendar") return "calendario"
  if (screen === "reports") return "relatorios"
  return "dashboard"
}

function NavItem({
  item,
  isActive,
  onNavigate,
}: {
  item: (typeof items)[number]
  isActive: boolean
  onNavigate: (s: Screen) => void
}) {
  return (
    <motion.button
      onClick={() => onNavigate(item.screen)}
      variants={staggerItem}
      whileHover={{ y: -2, scale: 1.02 }}
      transition={spring}
      className={cn(
        "flex shrink-0 items-center gap-2 px-1 py-1.5 text-[9px] font-medium leading-none tracking-[0.16em] transition-colors md:px-2 md:py-1.5 md:text-[10px]",
        isActive ? "text-foreground" : "text-foreground/45 hover:text-foreground/80",
      )}
    >
      <item.icon className={cn("size-3.5 md:size-4", isActive ? "text-foreground" : "text-foreground/45")} strokeWidth={1.5} />
      <span>{item.label}</span>
    </motion.button>
  )
}

export function TabNav({
  screen,
  onNavigate,
}: {
  screen: Screen
  onNavigate: (s: Screen) => void
}) {
  const active = activeIdFor(screen)
  return (
    <motion.nav
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="safe-x -mt-1 w-full max-w-full overflow-x-hidden overflow-y-visible bg-[#000000] px-4 pb-3 pt-0 md:grid md:grid-cols-[minmax(0,1fr)_150px_minmax(0,1fr)] md:px-8 md:pb-4 md:pt-0 lg:grid-cols-[minmax(0,1fr)_220px_minmax(0,1fr)]"
    >
      <motion.div className="flex min-w-0 items-center gap-5 overflow-x-auto no-scrollbar md:justify-end md:gap-7 md:overflow-visible">
        {leftItems.map((item) => (
          <NavItem key={item.id} item={item} isActive={item.id === active} onNavigate={onNavigate} />
        ))}
        <div className="w-4 shrink-0 md:hidden" />
        <div className="flex items-center gap-4 md:hidden">
          {rightItems.map((item) => (
            <NavItem key={item.id} item={item} isActive={item.id === active} onNavigate={onNavigate} />
          ))}
        </div>
      </motion.div>

      <div className="hidden md:block" />

      <motion.div className="hidden min-w-0 items-center justify-start gap-7 md:flex">
        {rightItems.map((item) => (
          <NavItem key={item.id} item={item} isActive={item.id === active} onNavigate={onNavigate} />
        ))}
      </motion.div>
    </motion.nav>
  )
}
