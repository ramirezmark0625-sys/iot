import React from 'react'
import Badge from './Badge'
import { fmt } from '../lib/utils'

export default function PhasePanel({ title, data }) {
  const pf = data?.pf ?? null
  let tone = 'info'
  if (pf !== null) {
    if (pf < 0.60) tone = 'warning'
    if (pf < 0.40) tone = 'critical'
    if (pf >= 0.95) tone = 'success'
  }

  return (
    <div className="glass rounded-3xl p-5 border border-white/10 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">{title}</div>
        <Badge tone={tone}>PF {fmt(pf, 3)}</Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Row k="Voltage" v={`${fmt(data?.voltage)} V`} />
        <Row k="Current" v={`${fmt(data?.current)} A`} />
        <Row k="Active" v={`${fmt(data?.kw)} kW`} />
        <Row k="Reactive" v={`${fmt(data?.kvar)} kVAR`} />
        <Row k="Apparent" v={`${fmt(data?.kva)} kVA`} />
        <Row k="Capacitor Step" v={data?.cap_step || 'OFF'} />
      </div>
    </div>
  )
}

function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-3 py-2">
      <div className="text-white/60 text-xs">{k}</div>
      <div className="font-semibold">{v}</div>
    </div>
  )
}
