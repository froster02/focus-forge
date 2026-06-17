import { useMemo } from 'react'
import { store } from '../../store/store'

function getIntensity(minutes: number): number {
  if (minutes === 0) return 0
  if (minutes < 25) return 1
  if (minutes < 50) return 2
  if (minutes < 100) return 3
  return 4
}

const intensityColors = [
  'bg-[#1a1f2e]',
  'bg-[#1a3a5c]',
  'bg-[#1a5cad]',
  'bg-[#4F8CFF]',
  'bg-[#7dabff]',
]

export function Heatmap() {
  const data = useMemo(() => store.getHeatmapData(), [])
  const weeks: { date: string; minutes: number }[][] = []
  let currentWeek: { date: string; minutes: number }[] = []

  const firstDay = new Date(data[0].date)
  const startPad = firstDay.getDay()
  for (let i = 0; i < startPad; i++) {
    currentWeek.push({ date: '', minutes: -1 })
  }

  data.forEach((d) => {
    currentWeek.push(d)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })
  if (currentWeek.length > 0) weeks.push(currentWeek)

  return (
    <div>
      <h3 className="text-sm font-semibold text-[#F8FAFC] mb-3">Focus Heatmap</h3>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-0.5" style={{ minWidth: 700 }}>
          <div className="flex flex-col gap-0.5 mr-1 pt-5">
            {['Mon', '', 'Wed', '', 'Fri', '', ''].map((d) => (
              <div key={d} className="h-[10px] text-[8px] text-white/30 leading-[10px]">{d}</div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((day, di) => (
                <div
                  key={di}
                  className={`w-[10px] h-[10px] rounded-sm ${
                    day.minutes < 0 ? 'bg-transparent' : intensityColors[getIntensity(day.minutes)]
                  }`}
                  title={day.date ? `${day.date}: ${day.minutes}m` : ''}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1 mt-2 text-[10px] text-white/30">
        <span>Less</span>
        {intensityColors.map((c, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
