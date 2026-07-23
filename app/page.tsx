"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { TabNav } from "@/components/tab-nav"
import { SplashScreen } from "@/components/screens/splash-screen"
import { DashboardScreen } from "@/components/screens/dashboard-screen"
import { TeamScreen } from "@/components/screens/team-screen"
import { CarouselScreen } from "@/components/screens/carousel-screen"
import { ProfileScreen } from "@/components/screens/profile-screen"
import { CalendarScreen } from "@/components/screens/calendar-screen"
import { ReportsScreen } from "@/components/screens/reports-screen"
import { MorningBriefScreen } from "@/components/screens/morning-brief-screen"
import { SettingsScreen } from "@/components/screens/settings-screen"
import { SessionsScreen } from "@/components/screens/sessions-screen"
import { LiveViewScreen } from "@/components/screens/live-view-screen"
import { usePlatformSettings } from "@/hooks/use-platform-settings"
import type { Screen } from "@/lib/nav"
import { pageTransition, spring } from "@/lib/motion"

export default function Page() {
  const [screen, setScreen] = useState<Screen>("splash")
  const [athleteId, setAthleteId] = useState("giroud")
  const { settings } = usePlatformSettings()

  const selectAthlete = (id: string) => {
    setAthleteId(id)
    setScreen("profile")
  }

  const navigate = (nextScreen: Screen) => {
    setScreen(nextScreen)
  }

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden bg-background text-foreground">
      <AnimatePresence mode="wait">
        {screen === "splash" ? (
          <SplashScreen key="splash" onEnter={navigate} />
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={spring}
          >
            <SiteHeader />
            <TabNav screen={screen} onNavigate={navigate} />

            <AnimatePresence mode="wait">
              <motion.div
                key={screen + athleteId}
                {...pageTransition}
                transition={spring}
              >
                {screen === "dashboard" && <DashboardScreen onSelectAthlete={selectAthlete} />}
                {screen === "briefing" && (
                  settings.morningBriefEnabled ? (
                    <MorningBriefScreen
                      onOpenDashboard={() => navigate("dashboard")}
                      onOpenSettings={() => navigate("settings")}
                      onSelectAthlete={selectAthlete}
                    />
                  ) : (
                    <DashboardScreen onSelectAthlete={selectAthlete} />
                  )
                )}
                {screen === "team" && <TeamScreen />}
                {screen === "carousel" && <CarouselScreen onSelectAthlete={selectAthlete} />}
                {screen === "profile" && <ProfileScreen athleteId={athleteId} onBack={navigate} />}
                {screen === "sessions" && <SessionsScreen onOpenLive={() => navigate("live")} />}
                {screen === "live" && <LiveViewScreen />}
                {screen === "calendar" && <CalendarScreen />}
                {screen === "reports" && <ReportsScreen />}
                {screen === "settings" && <SettingsScreen />}
              </motion.div>
            </AnimatePresence>
            <SiteFooter />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
