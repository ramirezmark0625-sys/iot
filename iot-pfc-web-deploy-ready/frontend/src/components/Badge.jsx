import React from 'react'
import { cn } from '../lib/utils'

export default function Badge({ children, tone='zinc', className }) {
  const tones = {
    zinc: 'bg-white/10 text-white border-white/10',
    info: 'bg-sky-500/15 text-sky-200 border-sky-500/20',
    warning: 'bg-amber-500/15 text-amber-200 border-amber-500/20',
    critical: 'bg-rose-500/15 text-rose-200 border-rose-500/20',
    success: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/20',
  }
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', tones[tone] || tones.zinc, className)}>
      {children}
    </span>
  )
}
