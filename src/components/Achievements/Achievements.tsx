import type { Achievement } from '../../types'

interface AchievementsProps {
  achievements: Achievement[]
}

export function Achievements({ achievements }: AchievementsProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[#F8FAFC] mb-3">Achievements</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {achievements.map((a) => (
          <div
            key={a.id}
            className={`rounded-xl p-3 border transition-all duration-300 ${
              a.unlockedAt
                ? 'bg-white/[0.04] border-white/[0.08]'
                : 'bg-white/[0.02] border-white/[0.04] opacity-40'
            }`}
          >
            <div className="text-xl mb-1">{a.icon}</div>
            <div className="text-xs font-semibold text-[#F8FAFC]">{a.title}</div>
            <div className="text-[10px] text-white/40 mt-0.5">{a.description}</div>
            {a.unlockedAt && (
              <div className="text-[9px] text-[#22C55E] mt-1">
                {new Date(a.unlockedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
