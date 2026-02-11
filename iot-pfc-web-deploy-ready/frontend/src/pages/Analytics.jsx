import React, { useMemo, useState } from 'react'
import Shell from '../components/Shell'
import Button from '../components/Button'
import Input from '../components/Input'
import StatCard from '../components/StatCard'
import { Zap, Wallet } from 'lucide-react'

export default function Analytics() {
  const [kw, setKw] = useState(8)
  const [pf1, setPf1] = useState(0.70)
  const [pf2, setPf2] = useState(0.98)
  const [hoursPerDay, setHoursPerDay] = useState(6)
  const [rate, setRate] = useState(12) // PHP/kWh example

  const result = useMemo(() => {
    const P = Math.max(0, Number(kw))
    const pfBefore = clamp(Number(pf1), 0.2, 0.99)
    const pfAfter = clamp(Number(pf2), 0.2, 0.99)
    const hrs = clamp(Number(hoursPerDay), 0, 24)
    const r = Math.max(0, Number(rate))

    // Apparent power S = P / PF, current-related losses scale with S^2 approx; a simple proxy:
    const sBefore = P / pfBefore
    const sAfter = P / pfAfter
    const demandReduction = Math.max(0, sBefore - sAfter) // kVA reduction proxy

    // Energy cost is mostly kWh, but PF can affect penalties and I²R losses.
    // We'll provide a conservative estimated savings using a small factor of demand reduction.
    const dailyKwh = P * hrs
    const baselineCost = dailyKwh * r
    const savingsFactor = 0.02 // 2% conservative proxy for reduced losses/penalties
    const estSavings = baselineCost * savingsFactor * (demandReduction / Math.max(1e-6, sBefore))
    const monthly = estSavings * 30

    return {
      sBefore, sAfter, demandReduction,
      baselineCost, estSavings, monthly
    }
  }, [kw, pf1, pf2, hoursPerDay, rate])

  return (
    <Shell title="Analytics">
      <div>
        <div className="text-xs text-white/50">Estimator</div>
        <div className="text-xl font-semibold">Energy & Cost Impact (Conservative)</div>
        <p className="mt-2 text-sm text-white/65 max-w-3xl leading-relaxed">
          This estimator provides a conservative cost impact proxy based on apparent power reduction and reduced losses/penalties.
          For your defense, you can align the rate and usage with your measured trial results.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-3xl p-5 border border-white/10 shadow-soft">
          <div className="text-sm font-semibold">Inputs</div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Load Active Power (kW)"><Input value={kw} onChange={e => setKw(e.target.value)} /></Field>
            <Field label="Hours per day"><Input value={hoursPerDay} onChange={e => setHoursPerDay(e.target.value)} /></Field>
            <Field label="PF before correction"><Input value={pf1} onChange={e => setPf1(e.target.value)} /></Field>
            <Field label="PF after correction"><Input value={pf2} onChange={e => setPf2(e.target.value)} /></Field>
            <Field label="Electricity rate (PHP/kWh)"><Input value={rate} onChange={e => setRate(e.target.value)} /></Field>
          </div>
          <div className="mt-4 text-xs text-white/45">
            Note: replace this estimator with your measured data tables when available.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard label="Apparent Power (Before)" value={result.sBefore.toFixed(2)} unit="kVA" hint="S = P / PF" icon={<Zap size={18} />} />
          <StatCard label="Apparent Power (After)" value={result.sAfter.toFixed(2)} unit="kVA" hint="Lower current demand" icon={<Zap size={18} />} tone="success" />
          <StatCard label="Daily Energy Cost" value={result.baselineCost.toFixed(2)} unit="PHP" hint="kW × hrs × rate" icon={<Wallet size={18} />} />
          <StatCard label="Est. Monthly Savings" value={result.monthly.toFixed(2)} unit="PHP" hint="Conservative proxy" icon={<Wallet size={18} />} tone="info" />
        </div>
      </div>
    </Shell>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <div className="text-xs text-white/60 mb-1">{label}</div>
      {children}
    </div>
  )
}

function clamp(n, a, b) {
  if (Number.isNaN(n)) return a
  return Math.max(a, Math.min(b, n))
}
