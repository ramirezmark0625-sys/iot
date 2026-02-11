import React from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

export default function TelemetryChart({ title, data, dataKey, unit }) {
  return (
    <div className="glass rounded-3xl p-5 border border-white/10 shadow-soft">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="t" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: 'rgba(24,24,27,0.95)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 16 }} />
            <Line type="monotone" dataKey={dataKey} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-xs text-white/45">Unit: {unit}</div>
    </div>
  )
}
