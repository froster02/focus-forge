export function today(): string {
  return new Date().toISOString().split('T')[0]
}

export function getDaysInRange(days: number): string[] {
  const result: string[] = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    result.push(d.toISOString().split('T')[0])
  }
  return result
}

export function getWeekRange(): string[] {
  const result: string[] = []
  const now = new Date()
  const dayOfWeek = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7))
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    result.push(d.toISOString().split('T')[0])
  }
  return result
}

export function getCurrentStreak(dates: string[]): number {
  if (dates.length === 0) return 0
  const uniqueDates = [...new Set(dates)].sort().reverse()
  let streak = 1
  const today_date = today()
  if (uniqueDates[0] !== today_date && uniqueDates[0] !== getYesterday()) {
    return 0
  }
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1])
    const curr = new Date(uniqueDates[i])
    const diffDays = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
    if (Math.round(diffDays) === 1) {
      streak++
    } else {
      break
    }
  }
  return streak
}

export function getYesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function getMonday(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  date.setDate(diff)
  date.setHours(0, 0, 0, 0)
  return date
}
