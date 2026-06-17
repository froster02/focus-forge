import type { UserStats } from '../../types'

interface StatsProps {
  stats: UserStats
}

export function Stats({ stats }: StatsProps) {
  const items = [
    { label: "Today's Focus", value: `${stats.todayFocusMinutes}m` },
    { label: 'Weekly Focus', value: `${stats.weeklyFocusMinutes}m` },
    { label: 'Total Sessions', value: stats.totalSessions },
    { label: 'Current Streak', value: `🔥 ${stats.currentStreak} days` },
    { label: 'Longest Streak', value: `🏆 ${stats.longestStreak} days` },
    { label: 'Total XP', value: stats.totalXp },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {items.map((item) => (
        <div key={item.label} className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
          <div className="text-xs font-medium text-white/40 mb-1">{item.label}</div>
          <div className="text-lg font-semibold text-[#F8FAFC]">{item.value}</div>
        </div>
      ))}
    </div>
  )
}
