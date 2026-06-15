"use client"

import { motion } from "framer-motion"
import { Home, Users, User, CalendarDays, FileText, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Screen } from "@/lib/nav"

const items: { id: string; label: string; icon: typeof Home; screen: Screen }[] = [
  { id: "dashboard", label: "DASHBOARD", icon: Home, screen: "dashboard" },
  { id: "equipe", label: "EQUIPE", icon: Users, screen: "dashboard" },
  { id: "atletas", label: "ATLETAS", icon: User, screen: "carousel" },
  { id: "calendario", label: "CALENDÁRIO", icon: CalendarDays, screen: "calendar" },
  { id: "relatorios", label: "RELATÓRIOS", icon: FileText, screen: "dashboard" },
  { id: "alertas", label: "ALERTAS", icon: Bell, screen: "dashboard" },
]

function activeIdFor(screen: Screen) {
  if (screen === "carousel" || screen === "profile") return "atletas"
  if (screen === "calendar") return "calendario"
  return "dashboard"
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
    <nav className="flex items-center justify-center gap-1 overflow-x-auto px-4 py-5 no-scrollbar md:gap-2 md:px-10">
      {items.map((item) => {
        const isActive = item.id === active
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.screen)}
            className={cn(
              "relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium tracking-wide transition-colors",
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/80",
            )}
          >
            <item.icon className="size-[18px]" strokeWidth={1.5} />
            <span>{item.label}</span>
            {isActive && (
              <motion.span
                layoutId="tab-underline"
                className="absolute -bottom-1 left-3 right-3 h-px bg-foreground"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
          </button>
        )
      })}
    </nav>
  )
}
