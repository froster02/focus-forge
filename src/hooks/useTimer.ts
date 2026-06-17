import { useState, useRef, useCallback, useEffect } from 'react'
import type { TimerMode, Session } from '../types'
import { store } from '../store/store'
import { XP_PER_SESSION } from '../utils/constants'
import { today } from '../utils/helpers'

interface UseTimerReturn {
  mode: TimerMode
  isRunning: boolean
  timeRemaining: number
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  completedSessions: number
  setMode: (m: TimerMode) => void
  setFocusDuration: (d: number) => void
  setShortBreakDuration: (d: number) => void
  setLongBreakDuration: (d: number) => void
  start: () => void
  pause: () => void
  reset: () => void
  skip: () => void
}

export function useTimer(): UseTimerReturn {
  const settings = store.getSettings()
  const savedState = store.getTimerState()

  const [mode, setModeState] = useState<TimerMode>((savedState.mode as TimerMode) || 'focus')
  const [isRunning, setIsRunning] = useState(savedState.isRunning || false)
  const [timeRemaining, setTimeRemaining] = useState(savedState.timeRemaining ?? settings.focusDuration * 60)
  const [focusDuration, setFocusDurationState] = useState(settings.focusDuration)
  const [shortBreakDuration, setShortBreakDurationState] = useState(settings.shortBreakDuration)
  const [longBreakDuration, setLongBreakDurationState] = useState(settings.longBreakDuration)
  const [completedSessions, setCompletedSessions] = useState(0)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const endTimestampRef = useRef<number | null>(savedState.endTimestamp || null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const syncTimer = useCallback(() => {
    if (endTimestampRef.current && isRunning) {
      const remaining = Math.max(0, Math.floor((endTimestampRef.current - Date.now()) / 1000))
      setTimeRemaining(remaining)
      if (remaining <= 0) {
        setIsRunning(false)
        endTimestampRef.current = null
        clearTimer()
        const durations = {
          focus: focusDuration * 60,
          shortBreak: shortBreakDuration * 60,
          longBreak: longBreakDuration * 60,
        }
        setTimeRemaining(durations[mode])
        store.setTimerState({ isRunning: false, timeRemaining: durations[mode], endTimestamp: null, mode })
      }
    }
  }, [isRunning, mode, focusDuration, shortBreakDuration, longBreakDuration, clearTimer])

  useEffect(() => {
    syncTimer()
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') syncTimer()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      clearTimer()
    }
  }, [syncTimer, clearTimer])

  const getDuration = useCallback(
    (m: TimerMode) => {
      switch (m) {
        case 'focus': return focusDuration * 60
        case 'shortBreak': return shortBreakDuration * 60
        case 'longBreak': return longBreakDuration * 60
      }
    },
    [focusDuration, shortBreakDuration, longBreakDuration]
  )

  const setMode = useCallback(
    (m: TimerMode) => {
      clearTimer()
      setIsRunning(false)
      endTimestampRef.current = null
      setModeState(m)
      setTimeRemaining(getDuration(m))
      store.setTimerState({ mode: m, isRunning: false, timeRemaining: getDuration(m), endTimestamp: null })
    },
    [clearTimer, getDuration]
  )

  const start = useCallback(() => {
    if (timeRemaining <= 0) return
    setIsRunning(true)
    endTimestampRef.current = Date.now() + timeRemaining * 1000
    store.setTimerState({ isRunning: true, timeRemaining, endTimestamp: endTimestampRef.current, mode })

    intervalRef.current = setInterval(() => {
      if (endTimestampRef.current) {
        const remaining = Math.max(0, Math.floor((endTimestampRef.current - Date.now()) / 1000))
        setTimeRemaining(remaining)
        if (remaining <= 0) {
          clearTimer()
          setIsRunning(false)
          endTimestampRef.current = null
          if (mode === 'focus') {
            const session: Session = {
              date: today(),
              duration: focusDuration * 60,
              mode: 'focus',
              completedAt: new Date().toISOString(),
              xp: XP_PER_SESSION,
            }
            store.addSession(session)
            setCompletedSessions((c) => c + 1)
            if (settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
              new Notification('Focus session complete!', { body: 'Time for a break.', icon: '/focus-forge/icons/icon-192.svg' })
            }
          }
          const nextMode: TimerMode = mode === 'focus'
            ? (completedSessions % 4 === 3 ? 'longBreak' : 'shortBreak')
            : 'focus'
          const nextDuration = getDuration(nextMode)
          setModeState(nextMode)
          setTimeRemaining(nextDuration)
          store.setTimerState({ mode: nextMode, isRunning: false, timeRemaining: nextDuration, endTimestamp: null })
        }
      }
    }, 250)
  }, [timeRemaining, mode, focusDuration, shortBreakDuration, longBreakDuration, completedSessions, settings.notificationsEnabled, clearTimer, getDuration])

  const pause = useCallback(() => {
    clearTimer()
    setIsRunning(false)
    endTimestampRef.current = null
    store.setTimerState({ isRunning: false, timeRemaining, endTimestamp: null, mode })
  }, [clearTimer, timeRemaining, mode])

  const reset = useCallback(() => {
    clearTimer()
    setIsRunning(false)
    endTimestampRef.current = null
    const dur = getDuration(mode)
    setTimeRemaining(dur)
    store.setTimerState({ isRunning: false, timeRemaining: dur, endTimestamp: null, mode })
  }, [clearTimer, mode, getDuration])

  const skip = useCallback(() => {
    clearTimer()
    setIsRunning(false)
    endTimestampRef.current = null
    if (mode === 'focus') {
      const nextMode: TimerMode = completedSessions % 4 === 3 ? 'longBreak' : 'shortBreak'
      const dur = getDuration(nextMode)
      setModeState(nextMode)
      setTimeRemaining(dur)
      store.setTimerState({ mode: nextMode, isRunning: false, timeRemaining: dur, endTimestamp: null })
    } else {
      const dur = getDuration('focus')
      setModeState('focus')
      setTimeRemaining(dur)
      store.setTimerState({ mode: 'focus', isRunning: false, timeRemaining: dur, endTimestamp: null })
    }
  }, [clearTimer, mode, completedSessions, getDuration])

  const setFocusDuration = useCallback((d: number) => {
    setFocusDurationState(d)
    const s = store.getSettings()
    store.setSettings({ ...s, focusDuration: d })
  }, [])

  const setShortBreakDuration = useCallback((d: number) => {
    setShortBreakDurationState(d)
    const s = store.getSettings()
    store.setSettings({ ...s, shortBreakDuration: d })
  }, [])

  const setLongBreakDuration = useCallback((d: number) => {
    setLongBreakDurationState(d)
    const s = store.getSettings()
    store.setSettings({ ...s, longBreakDuration: d })
  }, [])

  return {
    mode, isRunning, timeRemaining, focusDuration, shortBreakDuration, longBreakDuration, completedSessions,
    setMode, setFocusDuration, setShortBreakDuration, setLongBreakDuration,
    start, pause, reset, skip,
  }
}
