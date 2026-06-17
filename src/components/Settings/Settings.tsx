import { useState } from 'react'
import { motion } from 'framer-motion'
import { store } from '../../store/store'

interface SettingsProps {
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  onFocusChange: (v: number) => void
  onShortBreakChange: (v: number) => void
  onLongBreakChange: (v: number) => void
  onClose: () => void
}

export function Settings({
  focusDuration, shortBreakDuration, longBreakDuration,
  onFocusChange, onShortBreakChange, onLongBreakChange, onClose,
}: SettingsProps) {
  const [importText, setImportText] = useState('')
  const [message, setMessage] = useState('')

  const handleExport = () => {
    const data = store.exportAll()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `focus-forge-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMessage('Data exported')
    setTimeout(() => setMessage(''), 2000)
  }

  const handleImport = () => {
    if (!importText.trim()) return
    const ok = store.importAll(importText)
    setMessage(ok ? 'Data imported successfully! Refresh to see changes.' : 'Invalid data')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleReset = () => {
    if (window.confirm('Are you sure? This will delete ALL your data.')) {
      store.resetAll()
      setMessage('Data reset. Refreshing...')
      setTimeout(() => window.location.reload(), 1000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#0B0F17] border border-white/[0.08] rounded-2xl p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#F8FAFC]">Settings</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white/60 text-xl">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-white/40 block mb-2">Focus Duration (min)</label>
            <input
              type="range"
              min="5"
              max="90"
              step="5"
              value={focusDuration}
              onChange={(e) => onFocusChange(parseInt(e.target.value))}
              className="w-full h-1 appearance-none bg-white/10 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4F8CFF]"
            />
            <span className="text-sm text-[#F8FAFC]">{focusDuration} min</span>
          </div>

          <div>
            <label className="text-xs font-medium text-white/40 block mb-2">Short Break (min)</label>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={shortBreakDuration}
              onChange={(e) => onShortBreakChange(parseInt(e.target.value))}
              className="w-full h-1 appearance-none bg-white/10 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#22C55E]"
            />
            <span className="text-sm text-[#F8FAFC]">{shortBreakDuration} min</span>
          </div>

          <div>
            <label className="text-xs font-medium text-white/40 block mb-2">Long Break (min)</label>
            <input
              type="range"
              min="5"
              max="45"
              step="5"
              value={longBreakDuration}
              onChange={(e) => onLongBreakChange(parseInt(e.target.value))}
              className="w-full h-1 appearance-none bg-white/10 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#22C55E]"
            />
            <span className="text-sm text-[#F8FAFC]">{longBreakDuration} min</span>
          </div>

          <div className="border-t border-white/[0.08] pt-4">
            <h4 className="text-xs font-semibold text-white/40 mb-3">Data</h4>
            <div className="flex gap-2 mb-3">
              <button onClick={handleExport} className="flex-1 px-3 py-2 bg-white/10 rounded-lg text-xs font-medium text-white hover:bg-white/15 transition-colors">
                Export JSON
              </button>
              <button onClick={handleReset} className="flex-1 px-3 py-2 bg-red-500/10 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors">
                Reset Data
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste JSON to import..."
                className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-[#F8FAFC] placeholder-white/30 outline-none"
              />
              <button onClick={handleImport} className="px-3 py-2 bg-white/10 rounded-lg text-xs font-medium text-white hover:bg-white/15 transition-colors">
                Import
              </button>
            </div>
          </div>

          {message && (
            <div className="text-xs text-center text-[#22C55E] py-2 bg-[#22C55E]/10 rounded-lg">
              {message}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
