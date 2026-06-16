"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { SiteHeader } from "@/components/site-header"
import { TabNav } from "@/components/tab-nav"
import { SplashScreen } from "@/components/screens/splash-screen"
import { DashboardScreen } from "@/components/screens/dashboard-screen"
import { CarouselScreen } from "@/components/screens/carousel-screen"
import { ProfileScreen } from "@/components/screens/profile-screen"
import { CalendarScreen } from "@/components/screens/calendar-screen"
import type { Screen } from "@/lib/nav"

export default function Page() {
  const [screen, setScreen] = useState<Screen>("splash")
  const [athleteId, setAthleteId] = useState("giroud")

  const selectAthlete = (id: string) => {
    setAthleteId(id)
    setScreen("profile")
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <AnimatePresence mode="wait">
        {screen === "splash" ? (
          <SplashScreen key="splash" onEnter={setScreen} />
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SiteHeader />
            <TabNav screen={screen} onNavigate={setScreen} />

            <AnimatePresence mode="wait">
              <motion.div
                key={screen + athleteId}
                initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {screen === "dashboard" && <DashboardScreen onSelectAthlete={selectAthlete} />}
                {screen === "carousel" && <CarouselScreen onSelectAthlete={selectAthlete} />}
                {screen === "profile" && <ProfileScreen athleteId={athleteId} onBack={setScreen} />}
                {screen === "calendar" && <CalendarScreen />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
