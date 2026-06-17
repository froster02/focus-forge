export type TimerMode = 'focus' | 'shortBreak' | 'longBreak'

export interface TimerState {
  mode: TimerMode
  isRunning: boolean
  timeRemaining: number
  endTimestamp: number | null
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  completedSessions: number
}

export interface Session {
  date: string
  duration: number
  mode: TimerMode
  completedAt: string
  xp: number
}

export interface DayStats {
  date: string
  totalFocusMinutes: number
  sessions: number
}

export interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: string
  linkedSession?: string
}

export interface Reflection {
  date: string
  note: string
  createdAt: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string | null
  condition: (stats: UserStats) => boolean
}

export interface UserStats {
  totalSessions: number
  totalFocusMinutes: number
  todayFocusMinutes: number
  weeklyFocusMinutes: number
  currentStreak: number
  longestStreak: number
  totalXp: number
  level: number
  coffeeConsumed: number
  weeklyGoal: number
  tasksCompleted: number
}

export interface AmbientMode {
  id: string
  name: string
  icon: string
  soundFile: string
}

export interface AppSettings {
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  soundEnabled: boolean
  notificationsEnabled: boolean
  theme: 'dark' | 'light'
  ambientMode: string | null
  ambientVolume: number
}
