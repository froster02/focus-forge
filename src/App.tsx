import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Timer } from './components/Timer/Timer'
import { MissionControl } from './components/MissionControl/MissionControl'
import { Stats } from './components/Stats/Stats'
import { Heatmap } from './components/Heatmap/Heatmap'
import { ProductivityCity } from './components/ProductivityCity/ProductivityCity'
import { Achievements } from './components/Achievements/Achievements'
import { Tasks } from './components/Tasks/Tasks'
import { Reflections } from './components/Reflections/Reflections'
import { Ambient } from './components/Ambient/Ambient'
import { Settings } from './components/Settings/Settings'
import { useTimer } from './hooks/useTimer'
import { useStats } from './hooks/useStats'
import { useAchievements } from './hooks/useAchievements'

type Tab = 'timer' | 'dashboard' | 'city' | 'achievements'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('timer')
  const [showSettings, setShowSettings] = useState(false)
  const [mounted, setMounted] = useState(false)
  const timer = useTimer()
  const { stats, refresh } = useStats()
  const { achievements } = useAchievements(stats)

  useEffect(() => {
    setMounted(true)
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  if (!mounted) return null

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'timer', label: 'Timer', icon: '⏱' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'city', label: 'City', icon: '🏙' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
  ]

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#F8FAFC] font-['Inter',system-ui,sans-serif] pb-24 safe-area-bottom">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-[#F8FAFC] tracking-tight">Focus Forge</h1>
            <p className="text-xs text-white/40 mt-0.5">Forge your focus.</p>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05] text-white/40 hover:text-white/60 hover:bg-white/[0.08] transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 10a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M13.5 8a5.5 5.5 0 01-.3 1.8l1.3 1-1 1.7-1.5-.6a5.5 5.5 0 01-1.6.9L10 14H8l-.4-1.6a5.5 5.5 0 01-1.6-.9l-1.5.6-1-1.7 1.3-1A5.5 5.5 0 014.5 8a5.5 5.5 0 01.3-1.8l-1.3-1 1-1.7 1.5.6a5.5 5.5 0 011.6-.9L8 2h2l.4 1.6a5.5 5.5 0 011.6.9l1.5-.6 1 1.7-1.3 1A5.5 5.5 0 0113.5 8z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </button>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'timer' && (
              <div className="space-y-6">
                <Timer />
                <Ambient />
                <Tasks />
                <Reflections />
              </div>
            )}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <MissionControl stats={stats} onRefresh={refresh} />
                <Stats stats={stats} />
                <Heatmap />
              </div>
            )}
            {activeTab === 'city' && (
              <div className="space-y-6">
                <ProductivityCity />
                <Stats stats={stats} />
              </div>
            )}
            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <Achievements achievements={achievements} />
                <Heatmap />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F17]/90 backdrop-blur-lg border-t border-white/[0.06] safe-area-bottom">
        <div className="max-w-lg mx-auto flex justify-around px-2 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'text-[#4F8CFF]'
                  : 'text-white/30 hover:text-white/50'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {showSettings && (
        <Settings
          focusDuration={timer.focusDuration}
          shortBreakDuration={timer.shortBreakDuration}
          longBreakDuration={timer.longBreakDuration}
          onFocusChange={timer.setFocusDuration}
          onShortBreakChange={timer.setShortBreakDuration}
          onLongBreakChange={timer.setLongBreakDuration}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
