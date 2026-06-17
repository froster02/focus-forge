import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Task } from '../../types'
import { store } from '../../store/store'
import { generateId } from '../../utils/helpers'

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(store.getTasks())
  const [input, setInput] = useState('')

  const save = (updated: Task[]) => {
    setTasks(updated)
    store.setTasks(updated)
  }

  const add = () => {
    if (!input.trim()) return
    const task: Task = {
      id: generateId(),
      text: input.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    }
    save([...tasks, task])
    setInput('')
  }

  const toggle = (id: string) => {
    save(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const remove = (id: string) => {
    save(tasks.filter((t) => t.id !== id))
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-[#F8FAFC] mb-3">Tasks</h3>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Add a task..."
          className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-[#F8FAFC] placeholder-white/30 outline-none focus:border-[#4F8CFF]/50 transition-colors"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={add}
          className="px-4 py-2 bg-[#4F8CFF] rounded-lg text-sm font-medium text-white hover:bg-[#3d7ae8] transition-colors"
        >
          Add
        </motion.button>
      </div>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-white/[0.03] group"
            >
              <button
                onClick={() => toggle(task.id)}
                className={`w-4 h-4 rounded border flex-shrink-0 transition-colors ${
                  task.completed
                    ? 'bg-[#22C55E] border-[#22C55E]'
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                {task.completed && (
                  <svg viewBox="0 0 16 16" className="w-full h-full text-white">
                    <path d="M13 4L6 11L3 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              <span className={`flex-1 text-sm transition-colors ${task.completed ? 'text-white/30 line-through' : 'text-[#F8FAFC]'}`}>
                {task.text}
              </span>
              <button onClick={() => remove(task.id)} className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-xs">
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
