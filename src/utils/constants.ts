import type { Achievement, AmbientMode, AppSettings } from '../types'

export const DEFAULT_SETTINGS: AppSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  soundEnabled: true,
  notificationsEnabled: true,
  theme: 'dark',
  ambientMode: null,
  ambientVolume: 0.5,
}

export const AMBIENT_MODES: AmbientMode[] = [
  { id: 'rain', name: 'Rain', icon: '🌧', soundFile: '/sounds/rain.mp3' },
  { id: 'coffee', name: 'Coffee Shop', icon: '☕', soundFile: '/sounds/coffee.mp3' },
  { id: 'forest', name: 'Forest', icon: '🌲', soundFile: '/sounds/forest.mp3' },
  { id: 'night', name: 'Night Coding', icon: '🌙', soundFile: '/sounds/night.mp3' },
  { id: 'library', name: 'Library', icon: '📚', soundFile: '/sounds/library.mp3' },
]

export const ACHIEVEMENTS: Omit<Achievement, 'condition'>[] = [
  { id: 'first_focus', title: 'First Focus', description: 'Complete your first focus session', icon: '🎯', unlockedAt: null },
  { id: 'deep_worker', title: 'Deep Worker', description: 'Complete 10 focus sessions', icon: '🧠', unlockedAt: null },
  { id: 'weekend_warrior', title: 'Weekend Warrior', description: 'Focus on both Saturday and Sunday', icon: '⚔️', unlockedAt: null },
  { id: 'streak_7', title: '7 Day Streak', description: 'Maintain a 7 day focus streak', icon: '🔥', unlockedAt: null },
  { id: 'streak_30', title: '30 Day Streak', description: 'Maintain a 30 day focus streak', icon: '💎', unlockedAt: null },
  { id: 'sessions_100', title: '100 Sessions', description: 'Complete 100 focus sessions', icon: '💯', unlockedAt: null },
  { id: 'coffee_powered', title: 'Coffee Powered', description: 'Log 10 coffees', icon: '☕', unlockedAt: null },
  { id: 'leetcode_monk', title: 'LeetCode Monk', description: 'Complete 500 focus sessions', icon: '🧘', unlockedAt: null },
]

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Intern',
  5: 'Engineer',
  10: 'Senior Engineer',
  20: 'Architect',
  50: 'Principal',
  100: 'Legend',
}

export const MOTIVATIONAL_MESSAGES = [
  'One session closer to your next offer.',
  'Consistency compounds.',
  'Ship before perfect.',
  'Focus is a competitive advantage.',
  'Deep work is a superpower.',
  'Progress > perfection.',
  'Build the thing.',
  'Your future self is watching.',
  'Small steps, big impact.',
  'Be the engineer you admire.',
]

export const XP_PER_SESSION = 25

export function getLevelTitle(level: number): string {
  const thresholds = Object.keys(LEVEL_TITLES).map(Number).sort((a, b) => b - a)
  for (const t of thresholds) {
    if (level >= t) return LEVEL_TITLES[t]
  }
  return 'Intern'
}

export function getLevel(xp: number): { level: number; currentXp: number; nextLevelXp: number } {
  const level = Math.floor(Math.sqrt(xp / 25)) + 1
  const nextLevelXp = Math.pow(level, 2) * 25
  const currentXp = xp
  return { level, currentXp, nextLevelXp }
}

export function getCityStage(sessions: number): { name: string; stage: number } {
  if (sessions >= 250) return { name: 'Mega Tech City', stage: 5 }
  if (sessions >= 100) return { name: 'Metro', stage: 4 }
  if (sessions >= 50) return { name: 'City', stage: 3 }
  if (sessions >= 10) return { name: 'Town', stage: 2 }
  return { name: 'Tiny Village', stage: 1 }
}
