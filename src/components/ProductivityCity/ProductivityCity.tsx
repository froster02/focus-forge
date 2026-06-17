import { useMemo } from 'react'
import { store } from '../../store/store'
import { getCityStage } from '../../utils/constants'

const COLORS = {
  bg: '#0D1117',
  ground: '#1a2332',
  buildings: ['#1e3a5f', '#2d4a7a', '#3d5a8a', '#4d6a9a', '#5d7aaa'],
  windows: ['#4F8CFF', '#22C55E', '#F59E0B'],
  roof: '#0f1a2e',
  cloud: 'rgba(255,255,255,0.03)',
}

function Building({ x, w, h, color, level }: { x: number; w: number; h: number; color: string; level: number }) {
  const windowRows = Math.floor(h / 14)
  const windowCols = Math.max(1, Math.floor(w / 10))
  return (
    <g>
      <rect x={x} y={200 - h} width={w} height={h} fill={color} rx={1} />
      {level > 1 && (
        <>
          <rect x={x + 2} y={200 - h} width={w - 4} height={4} fill={COLORS.roof} rx={1} />
          {Array.from({ length: windowRows }).map((_, ri) =>
            Array.from({ length: windowCols }).map((_, ci) => {
              const wx = x + 4 + ci * (w - 8) / windowCols
              const wy = 200 - h + 8 + ri * 14
              const lit = Math.random() > 0.4
              return (
                <rect
                  key={`${ri}-${ci}`}
                  x={wx}
                  y={wy}
                  width={Math.max(2, (w - 8) / windowCols - 2)}
                  height={6}
                  fill={lit ? COLORS.windows[Math.floor(Math.random() * COLORS.windows.length)] : 'rgba(255,255,255,0.05)'}
                  rx={0.5}
                  opacity={lit ? 0.8 : 0.3}
                />
              )
            })
          )}
        </>
      )}
    </g>
  )
}

function Tree({ x }: { x: number }) {
  return (
    <g>
      <rect x={x - 1} y={185} width={2} height={15} fill="#2d4a2d" />
      <circle cx={x} cy={180} r={8} fill="#1a4a1a" opacity={0.7} />
    </g>
  )
}

export function ProductivityCity() {
  const sessions = store.getSessions().length
  const { name, stage } = getCityStage(sessions)

  const buildings = useMemo(() => {
    const count = Math.min(stage * 8 + 4, 40)
    const list: { x: number; w: number; h: number; color: string; level: number }[] = []
    for (let i = 0; i < count; i++) {
      const w = 12 + Math.random() * 16
      const h = 30 + Math.random() * (stage * 35)
      const x = i * (600 / count) + (600 / count - w) / 2
      const color = COLORS.buildings[Math.floor(Math.random() * COLORS.buildings.length)]
      list.push({ x, w: Math.max(8, w), h: Math.max(20, h), color, level: stage })
    }
    return list
  }, [stage])

  const trees = useMemo(() => {
    const count = Math.max(0, 6 - stage * 2)
    return Array.from({ length: count }).map(() => 20 + Math.random() * 560)
  }, [stage])

  return (
    <div>
      <h3 className="text-sm font-semibold text-[#F8FAFC] mb-1">Productivity City</h3>
      <p className="text-xs text-white/40 mb-3">{name} · {sessions} sessions</p>
      <svg viewBox="0 0 600 200" className="w-full h-auto rounded-xl bg-[#0D1117]">
        <rect x="0" y="0" width="600" height="200" fill={COLORS.bg} />
        {trees.map((x, i) => <Tree key={i} x={x} />)}
        {buildings.map((b, i) => <Building key={i} {...b} />)}
        <rect x="0" y="195" width="600" height="5" fill={COLORS.ground} />
        {stage >= 4 && (
          <>
            <circle cx="550" cy="30" r="20" fill="rgba(255,255,255,0.02)" />
            <circle cx="550" cy="30" r="15" fill="rgba(255,255,255,0.03)" />
          </>
        )}
      </svg>
    </div>
  )
}
