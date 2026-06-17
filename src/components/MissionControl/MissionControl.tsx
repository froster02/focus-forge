import { useState } from 'react'
import { motion } from 'framer-motion'
import type { UserStats } from '../../types'
import { store } from '../../store/store'
import { getLevel, getLevelTitle, MOTIVATIONAL_MESSAGES } from '../../utils/constants'

interface MissionControlProps {
  stats: UserStats
  onRefresh: () => void
}

export function MissionControl({ stats, onRefresh }: MissionControlProps) {
  const [coffeeInput, setCoffeeInput] = useState('')
  const [goalInput, setGoalInput] = useState('')
  const message = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]
  const { level, currentXp, nextLevelXp } = getLevel(stats.totalXp)
  const xpProgress = Math.min(1, currentXp / nextLevelXp)
  const codingHours = Math.round((stats.totalFocusMinutes / 60) * 10) / 10

  const addCoffee = () => {
    if (!coffeeInput) return
    const n = parseInt(coffeeInput)
    if (isNaN(n) || n < 1) return
    store.setCoffee(store.getCoffee() + n)
    onRefresh()
    setCoffeeInput('')
  }

  const setGoal = () => {
    const n = parseInt(goalInput)
    if (isNaN(n) || n < 1) return
    store.setWeeklyGoal(n)
    onRefresh()
    setGoalInput('')
  }

  const goalProgress = Math.min(1, stats.weeklyFocusMinutes / (stats.weeklyGoal * 25))

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#F8FAFC]">Mission Control</h2>
        <span className="text-xs text-white/30">v1.0</span>
      </div>

      <motion.div
        key={message}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#4F8CFF]/10 to-transparent rounded-xl p-3 border border-[#4F8CFF]/10 mb-4"
      >
        <p className="text-sm text-[#4F8CFF] italic">"{message}"</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
          <div className="flex items-center gap-1 text-xs text-white/40 mb-1">
            <span>☕</span> Coffee Today
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#F8FAFC]">{stats.coffeeConsumed}</span>
            <input
              type="number"
              value={coffeeInput}
              onChange={(e) => setCoffeeInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCoffee()}
              placeholder="+"
              className="w-12 bg-white/[0.05] rounded px-1.5 py-0.5 text-xs text-[#F8FAFC] placeholder-white/20 outline-none border border-white/[0.06]"
            />
            <button onClick={addCoffee} className="text-xs text-[#4F8CFF] hover:text-[#3d7ae8]">Log</button>
          </div>
        </div>
        <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
          <div className="flex items-center gap-1 text-xs text-white/40 mb-1">
            <span>💻</span> Coding Hours
          </div>
          <div className="text-lg font-bold text-[#F8FAFC]">{codingHours}h</div>
        </div>
        <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
          <div className="flex items-center gap-1 text-xs text-white/40 mb-1">
            <span>🔥</span> Focus Streak
          </div>
          <div className="text-lg font-bold text-[#F8FAFC]">{stats.currentStreak} days</div>
        </div>
        <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
          <div className="flex items-center gap-1 text-xs text-white/40 mb-1">
            <span>🎯</span> Weekly Goal
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#F8FAFC]">{stats.weeklyGoal}</span>
            <input
              type="number"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setGoal()}
              placeholder="set"
              className="w-12 bg-white/[0.05] rounded px-1.5 py-0.5 text-xs text-[#F8FAFC] placeholder-white/20 outline-none border border-white/[0.06]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06] mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#F8FAFC]">Level {level}</span>
            <span className="text-[10px] text-white/40 bg-white/[0.06] px-2 py-0.5 rounded-full">{getLevelTitle(level)}</span>
          </div>
          <span className="text-xs text-white/40">{currentXp} / {nextLevelXp} XP</span>
        </div>
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#4F8CFF] to-[#7dabff] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <div className="text-[10px] text-white/30 mt-1">Lifetime XP: {stats.totalXp}</div>
      </div>

      <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-white/40">📈 Focus Trend</span>
          <span className="text-xs text-white/40">{stats.weeklyFocusMinutes}m / {stats.weeklyGoal * 25}m</span>
        </div>
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#22C55E] to-[#4ade80] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, goalProgress * 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  )
}
