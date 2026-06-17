import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Reflection } from '../../types'
import { store } from '../../store/store'
import { today } from '../../utils/helpers'

export function Reflections() {
  const [reflections, setReflections] = useState<Reflection[]>(store.getReflections())
  const [note, setNote] = useState('')
  const todayReflection = reflections.find((r) => r.date === today())

  const save = () => {
    if (!note.trim()) return
    const ref: Reflection = {
      date: today(),
      note: note.trim(),
      createdAt: new Date().toISOString(),
    }
    store.addReflection(ref)
    setReflections(store.getReflections())
    setNote('')
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-[#F8FAFC] mb-2">Daily Reflection</h3>
      <p className="text-xs text-white/40 mb-3">What did you build today?</p>
      {todayReflection ? (
        <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]">
          <p className="text-sm text-[#F8FAFC]">{todayReflection.note}</p>
          <p className="text-[10px] text-white/30 mt-2">
            Reflected · {new Date(todayReflection.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && save()}
            placeholder="Built a LeetCode solution today..."
            className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-[#F8FAFC] placeholder-white/30 outline-none focus:border-[#4F8CFF]/50 transition-colors"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={save}
            className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium text-white hover:bg-white/15 transition-colors"
          >
            Log
          </motion.button>
        </div>
      )}
      {reflections.length > 1 && (
        <div className="mt-3 space-y-1 max-h-32 overflow-y-auto">
          {reflections.slice().reverse().slice(0, 5).map((r) => (
            <div key={r.date} className="text-xs text-white/30 py-1 border-t border-white/[0.04]">
              <span className="text-white/50 font-medium">{r.date}:</span> {r.note}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
