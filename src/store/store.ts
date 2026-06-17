import type { AppSettings, Session, Task, Reflection, UserStats, TimerState } from '../types'
import { DEFAULT_SETTINGS, getLevel } from '../utils/constants'
import { today, getWeekRange, getCurrentStreak, getDaysInRange } from '../utils/helpers'

function load<T>(key: string, fallback: T): T {
  try {
    const d = localStorage.getItem(`focusforge_${key}`)
    return d ? (JSON.parse(d) as T) : fallback
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(`focusforge_${key}`, JSON.stringify(value))
}

export const store = {
  getSettings(): AppSettings {
    return load('settings', DEFAULT_SETTINGS)
  },
  setSettings(s: AppSettings): void {
    save('settings', s)
  },

  getSessions(): Session[] {
    return load<Session[]>('sessions', [])
  },
  addSession(s: Session): void {
    const sessions = this.getSessions()
    sessions.push(s)
    save('sessions', sessions)
  },
  clearSessions(): void {
    save('sessions', [])
  },

  getTasks(): Task[] {
    return load<Task[]>('tasks', [])
  },
  setTasks(t: Task[]): void {
    save('tasks', t)
  },

  getReflections(): Reflection[] {
    return load<Reflection[]>('reflections', [])
  },
  addReflection(r: Reflection): void {
    const reflections = this.getReflections()
    const idx = reflections.findIndex((ref) => ref.date === r.date)
    if (idx >= 0) {
      reflections[idx] = r
    } else {
      reflections.push(r)
    }
    save('reflections', reflections)
  },

  getCoffee(): number {
    return load<number>('coffee', 0)
  },
  setCoffee(n: number): void {
    save('coffee', n)
  },

  getWeeklyGoal(): number {
    return load<number>('weeklyGoal', 10)
  },
  setWeeklyGoal(n: number): void {
    save('weeklyGoal', n)
  },

  getTimerState(): Partial<TimerState> {
    return load<Partial<TimerState>>('timer', {})
  },
  setTimerState(t: Partial<TimerState>): void {
    save('timer', t)
  },

  exportAll(): string {
    return JSON.stringify({
      sessions: this.getSessions(),
      tasks: this.getTasks(),
      reflections: this.getReflections(),
      settings: this.getSettings(),
      coffee: this.getCoffee(),
      weeklyGoal: this.getWeeklyGoal(),
      exportedAt: new Date().toISOString(),
    })
  },

  importAll(json: string): boolean {
    try {
      const data = JSON.parse(json)
      if (data.sessions) save('sessions', data.sessions)
      if (data.tasks) save('tasks', data.tasks)
      if (data.reflections) save('reflections', data.reflections)
      if (data.settings) save('settings', data.settings)
      if (typeof data.coffee === 'number') save('coffee', data.coffee)
      if (data.weeklyGoal) save('weeklyGoal', data.weeklyGoal)
      return true
    } catch {
      return false
    }
  },

  resetAll(): void {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('focusforge_'))
    keys.forEach((k) => localStorage.removeItem(k))
  },

  computeStats(): UserStats {
    const sessions = this.getSessions()
    const todayStr = today()
    const todaySessions = sessions.filter((s) => s.date === todayStr)
    const weekDates = getWeekRange()
    const weekSessions = sessions.filter((s) => weekDates.includes(s.date))
    const sessionDates = [...new Set(sessions.map((s) => s.date))]
    const streak = getCurrentStreak(sessionDates)
    const allStreaks = this.calculateAllStreaks(sessionDates)
    const totalXp = sessions.reduce((sum, s) => sum + s.xp, 0)
    const { level } = getLevel(totalXp)
    const tasks = this.getTasks()
    const tasksCompleted = tasks.filter((t) => t.completed).length

    return {
      totalSessions: sessions.length,
      totalFocusMinutes: Math.round(sessions.reduce((sum, s) => sum + s.duration / 60, 0)),
      todayFocusMinutes: Math.round(todaySessions.reduce((sum, s) => sum + s.duration / 60, 0)),
      weeklyFocusMinutes: Math.round(weekSessions.reduce((sum, s) => sum + s.duration / 60, 0)),
      currentStreak: streak,
      longestStreak: allStreaks,
      totalXp,
      level,
      coffeeConsumed: this.getCoffee(),
      weeklyGoal: this.getWeeklyGoal(),
      tasksCompleted,
    }
  },

  calculateAllStreaks(dates: string[]): number {
    if (dates.length === 0) return 0
    const unique = [...new Set(dates)].sort().reverse()
    let maxStreak = 1
    let current = 1
    for (let i = 1; i < unique.length; i++) {
      const prev = new Date(unique[i - 1])
      const curr = new Date(unique[i])
      const diffDays = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
      if (Math.round(diffDays) === 1) {
        current++
        maxStreak = Math.max(maxStreak, current)
      } else {
        current = 1
      }
    }
    return maxStreak
  },

  getHeatmapData(): { date: string; minutes: number }[] {
    const sessions = this.getSessions()
    const days = getDaysInRange(365)
    return days.map((date) => {
      const daySessions = sessions.filter((s) => s.date === date)
      const minutes = Math.round(daySessions.reduce((sum, s) => sum + s.duration / 60, 0))
      return { date, minutes }
    })
  },
}
