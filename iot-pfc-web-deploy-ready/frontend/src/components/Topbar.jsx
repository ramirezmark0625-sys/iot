import React from 'react'
import Badge from './Badge'
import { Sparkles } from 'lucide-react'

export default function Topbar({ title }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 px-5 lg:px-7 py-4">
      <div>
        <div className="text-xs text-white/50">IoT Dashboard</div>
        <div className="text-lg font-semibold">{title}</div>
      </div>
      <Badge tone="info" className="gap-2">
        <Sparkles size={14} />
        Thesis‑grade UI
      </Badge>
    </div>
  )
}
