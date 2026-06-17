import { motion } from 'framer-motion'
import { useTimer } from '../../hooks/useTimer'
import { formatTime } from '../../utils/helpers'

const modeLabels: Record<string, string> = {
  focus: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
}

const modeColors: Record<string, string> = {
  focus: 'text-[#4F8CFF]',
  shortBreak: 'text-[#22C55E]',
  longBreak: 'text-[#22C55E]',
}

const modeRings: Record<string, string> = {
  focus: 'stroke-[#4F8CFF]',
  shortBreak: 'stroke-[#22C55E]',
  longBreak: 'stroke-[#22C55E]',
}

export function Timer() {
  const timer = useTimer()
  const duration = timer.mode === 'focus' ? timer.focusDuration * 60
    : timer.mode === 'shortBreak' ? timer.shortBreakDuration * 60
    : timer.longBreakDuration * 60
  const progress = duration > 0 ? 1 - timer.timeRemaining / duration : 0
  const circumference = 2 * Math.PI * 120
  const offset = circumference * (1 - progress)

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2 mb-8">
        {(['focus', 'shortBreak', 'longBreak'] as const).map((m) => (
          <button
            key={m}
            onClick={() => timer.setMode(m)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              timer.mode === m
                ? 'bg-white/10 text-[#F8FAFC]'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {modeLabels[m]}
          </button>
        ))}
      </div>

      <div className="relative mb-8">
        <svg width="280" height="280" className="transform -rotate-90">
          <circle cx="140" cy="140" r="120" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
          <motion.circle
            cx="140" cy="140" r="120" fill="none"
            className={modeRings[timer.mode]}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={timer.timeRemaining}
            className="text-6xl font-light tracking-tight text-[#F8FAFC]"
            initial={{ opacity: 0.8, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
          >
            {formatTime(timer.timeRemaining)}
          </motion.span>
          <span className={`text-sm mt-2 font-medium ${modeColors[timer.mode]}`}>
            {modeLabels[timer.mode]}
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        {!timer.isRunning ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={timer.start}
            disabled={timer.timeRemaining <= 0}
            className="px-10 py-3 rounded-full bg-[#4F8CFF] text-white font-semibold text-base hover:bg-[#3d7ae8] transition-colors disabled:opacity-30"
          >
            Start
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={timer.pause}
            className="px-10 py-3 rounded-full bg-white/10 text-[#F8FAFC] font-semibold text-base hover:bg-white/15 transition-colors"
          >
            Pause
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={timer.reset}
          className="px-6 py-3 rounded-full bg-white/5 text-white/60 font-medium text-sm hover:bg-white/10 transition-colors"
        >
          Reset
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={timer.skip}
          className="px-6 py-3 rounded-full bg-white/5 text-white/40 font-medium text-sm hover:bg-white/10 transition-colors"
        >
          Skip
        </motion.button>
      </div>
    </div>
  )
}
