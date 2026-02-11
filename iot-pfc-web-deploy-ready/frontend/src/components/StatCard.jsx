import React from 'react'
import { cn, fmt } from '../lib/utils'

export default function StatCard({ label, value, unit, hint, icon, tone='zinc' }) {
  const tones = {
    zinc: 'border-white/10',
    info: 'border-sky-500/20',
    success: 'border-emerald-500/20',
    warning: 'border-amber-500/20',
    critical: 'border-rose-500/20',
  }
  return (
    <div className={cn('glass rounded-3xl p-4 border shadow-soft', tones[tone] || tones.zinc)}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-white/55">{label}</div>
          <div className="mt-1 text-2xl font-semibold">
            {value}
            {unit ? <span className="ml-1 text-sm text-white/60 font-medium">{unit}</span> : null}
          </div>
          {hint ? <div className="mt-1 text-xs text-white/45">{hint}</div> : null}
        </div>
        {icon ? <div className="text-white/70">{icon}</div> : null}
      </div>
    </div>
  )
}
