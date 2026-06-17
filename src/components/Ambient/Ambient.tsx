import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { AMBIENT_MODES } from '../../utils/constants'
import { store } from '../../store/store'

export function Ambient() {
  const settings = store.getSettings()
  const [active, setActive] = useState<string | null>(settings.ambientMode)
  const [volume, setVolumeState] = useState(settings.ambientVolume)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const toggle = useCallback((id: string) => {
    if (active === id) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      setActive(null)
      const s = store.getSettings()
      store.setSettings({ ...s, ambientMode: null })
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      const audio = new Audio(`/focus-forge${AMBIENT_MODES.find((m) => m.id === id)!.soundFile}`)
      audio.loop = true
      audio.volume = volume
      audio.play().catch(() => {})
      audioRef.current = audio
      setActive(id)
      const s = store.getSettings()
      store.setSettings({ ...s, ambientMode: id })
    }
  }, [active, volume])

  const setVolume = useCallback((v: number) => {
    setVolumeState(v)
    if (audioRef.current) {
      audioRef.current.volume = v
    }
    const s = store.getSettings()
    store.setSettings({ ...s, ambientVolume: v })
  }, [])

  return (
    <div>
      <h3 className="text-sm font-semibold text-[#F8FAFC] mb-3">Ambient Focus</h3>
      <div className="flex gap-2 flex-wrap">
        {AMBIENT_MODES.map((mode) => (
          <motion.button
            key={mode.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggle(mode.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              active === mode.id
                ? 'bg-[#4F8CFF]/20 text-[#4F8CFF] border border-[#4F8CFF]/30'
                : 'bg-white/[0.04] text-white/60 border border-white/[0.06] hover:bg-white/[0.08]'
            }`}
          >
            <span>{mode.icon}</span>
            <span>{mode.name}</span>
          </motion.button>
        ))}
      </div>
      {active && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-white/40">Volume</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-1 appearance-none bg-white/10 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4F8CFF]"
          />
        </div>
      )}
    </div>
  )
}
