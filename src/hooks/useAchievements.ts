import { useState, useEffect, useCallback } from 'react'
import type { Achievement, UserStats } from '../types'
import { ACHIEVEMENTS } from '../utils/constants'
import { today } from '../utils/helpers'

function checkCondition(achievementId: string, stats: UserStats): boolean {
  switch (achievementId) {
    case 'first_focus': return stats.totalSessions >= 1
    case 'deep_worker': return stats.totalSessions >= 10
    case 'weekend_warrior': {
      const now = new Date()
      const day = now.getDay()
      if (day !== 0 && day !== 6) return false
      const sessions = JSON.parse(localStorage.getItem('focusforge_sessions') || '[]') as { date: string }[]
      const todayStr = today()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      const otherDay = day === 0 ? yesterdayStr : (new Date(now.getTime() - 2 * 86400000)).toISOString().split('T')[0]
      return sessions.some((s) => s.date === todayStr) && sessions.some((s) => s.date === otherDay)
    }
    case 'streak_7': return stats.longestStreak >= 7
    case 'streak_30': return stats.longestStreak >= 30
    case 'sessions_100': return stats.totalSessions >= 100
    case 'coffee_powered': return stats.coffeeConsumed >= 10
    case 'leetcode_monk': return stats.totalSessions >= 500
    default: return false
  }
}

export function useAchievements(stats: UserStats) {
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('focusforge_achievements')
    if (saved) {
      const parsed: Achievement[] = JSON.parse(saved)
      return ACHIEVEMENTS.map((a) => {
        const existing = parsed.find((p) => p.id === a.id)
        return {
          ...a,
          condition: () => false,
          unlockedAt: existing?.unlockedAt || null,
        }
      })
    }
    return ACHIEVEMENTS.map((a) => ({
      ...a,
      condition: () => false,
      unlockedAt: null,
    }))
  })

  const check = useCallback(() => {
    const saved = localStorage.getItem('focusforge_achievements')
    let unlocked: string[] = []
    if (saved) {
      unlocked = JSON.parse(saved).filter((a: Achievement) => a.unlockedAt).map((a: Achievement) => a.id)
    }
    let changed = false
    const updated = achievements.map((a) => {
      if (a.unlockedAt) return a
      if (checkCondition(a.id, stats)) {
        changed = true
        unlocked.push(a.id)
        return { ...a, unlockedAt: new Date().toISOString() }
      }
      return a
    })
    if (changed) {
      setAchievements(updated)
      localStorage.setItem('focusforge_achievements', JSON.stringify(updated.map(({ condition: _, ...rest }) => rest)))
    }
  }, [achievements, stats])

  useEffect(() => {
    check()
  }, [stats.totalSessions, stats.longestStreak, stats.coffeeConsumed])

  return { achievements, check }
}
