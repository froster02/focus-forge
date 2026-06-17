import { useState, useCallback, useEffect } from 'react'
import type { UserStats } from '../types'
import { store } from '../store/store'

export function useStats() {
  const [stats, setStats] = useState<UserStats>(store.computeStats())

  const refresh = useCallback(() => {
    setStats(store.computeStats())
  }, [])

  useEffect(() => {
    const handle = setInterval(refresh, 10000)
    return () => clearInterval(handle)
  }, [refresh])

  return { stats, refresh }
}
