"use client"

import { Activity, Bell, CalendarDays, FileText, Home, User, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Screen } from "@/lib/nav"

type NavEntry = { id: string; label: string; icon: LucideIcon; screen: Screen }

const leftItems: NavEntry[] = [
  { id: "dashboard", label: "DASHBOARD", icon: Home, screen: "dashboard" },
  { id: "equipe", label: "EQUIPE", icon: Users, screen: "dashboard" },
  { id: "atletas", label: "ATLETAS", icon: User, screen: "carousel" },
]

const rightItems: NavEntry[] = [
  { id: "sessoes", label: "SESSÕES", icon: Activity, screen: "dashboard" },
  { id: "calendario", label: "CALENDÁRIO", icon: CalendarDays, screen: "calendar" },
  { id: "relatorios", label: "RELATÓRIOS", icon: FileText, screen: "dashboard" },
  { id: "alertas", label: "ALERTAS", icon: Bell, screen: "dashboard" },
]

const items = [...leftItems, ...rightItems]

function activeIdFor(screen: Screen) {
  if (screen === "carousel" || screen === "profile") return "atletas"
  if (screen === "calendar") return "calendario"
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
    <button
      onClick={() => onNavigate(item.screen)}
      className={cn(
        "flex shrink-0 items-center gap-1.5 px-1 py-1.5 text-[9px] font-medium tracking-[0.14em] transition-colors md:px-1.5 md:text-[10px]",
        isActive ? "text-foreground" : "text-foreground/45 hover:text-foreground/80",
      )}
    >
      <item.icon className={cn("size-3.5 md:size-4", isActive ? "text-foreground" : "text-foreground/45")} strokeWidth={1.5} />
      <span>{item.label}</span>
    </button>
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
    <nav className="bg-[#000000] px-4 pb-3 pt-2 md:grid md:grid-cols-[1fr_100px_1fr] md:px-8 md:pb-4 md:pt-3 lg:grid-cols-[1fr_150px_1fr]">
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar md:justify-end md:gap-5 md:overflow-visible">
        {leftItems.map((item) => (
          <NavItem key={item.id} item={item} isActive={item.id === active} onNavigate={onNavigate} />
        ))}
        <div className="w-6 shrink-0 md:hidden" />
        {rightItems.map((item) => (
          <NavItem key={item.id} item={item} isActive={item.id === active} onNavigate={onNavigate} />
        ))}
      </div>

      <div className="hidden md:block" />

      <div className="hidden items-center justify-start gap-5 md:flex">
        {rightItems.map((item) => (
          <NavItem key={item.id} item={item} isActive={item.id === active} onNavigate={onNavigate} />
        ))}
      </div>
    </nav>
  )
}
