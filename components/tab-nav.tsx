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
        "flex shrink-0 items-center gap-2 px-1.5 py-2 text-[11px] font-medium tracking-[0.16em] transition-colors md:px-2 md:text-xs",
        isActive ? "text-foreground" : "text-foreground/45 hover:text-foreground/80",
      )}
    >
      <item.icon className={cn("size-4 md:size-[18px]", isActive ? "text-foreground" : "text-foreground/45")} strokeWidth={1.5} />
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
    <nav className="bg-[#000000] px-5 pb-4 pt-3 md:grid md:grid-cols-[1fr_120px_1fr] md:px-10 md:pb-5 md:pt-4 lg:grid-cols-[1fr_180px_1fr]">
      <div className="flex items-center gap-5 overflow-x-auto no-scrollbar md:justify-end md:gap-7 md:overflow-visible">
        {leftItems.map((item) => (
          <NavItem key={item.id} item={item} isActive={item.id === active} onNavigate={onNavigate} />
        ))}
        <div className="w-6 shrink-0 md:hidden" />
        {rightItems.map((item) => (
          <NavItem key={item.id} item={item} isActive={item.id === active} onNavigate={onNavigate} />
        ))}
      </div>

      <div className="hidden md:block" />

      <div className="hidden items-center justify-start gap-7 md:flex">
        {rightItems.map((item) => (
          <NavItem key={item.id} item={item} isActive={item.id === active} onNavigate={onNavigate} />
        ))}
      </div>
    </nav>
  )
}
