import React from 'react'
import { Cpu, Wifi, Bell, LineChart, Layers, Gauge } from 'lucide-react'

const features = [
  {
    icon: <Cpu size={18} />,
    title: 'ESP32‑Optimized Control',
    desc: 'Designed around efficient microcontroller telemetry, near‑real‑time computation, and adaptive switching logic.'
  },
  {
    icon: <Wifi size={18} />,
    title: 'Cloud‑Ready Monitoring',
    desc: 'Remote configuration and visualization through a clean single‑origin web app (`/api` + `/ws`).'
  },
  {
    icon: <Gauge size={18} />,
    title: 'Three‑Phase Independent Tracking',
    desc: 'Phase A/B/C presented separately for voltage, current, PF, kW, kVAR, kVA and capacitor step status.'
  },
  {
    icon: <Layers size={18} />,
    title: 'Capacitor Step Visualization',
    desc: 'Shows which capacitor banks are active. Built for series/parallel fixed‑step switching.'
  },
  {
    icon: <Bell size={18} />,
    title: 'Predictive Alerts',
    desc: 'Flags low PF behavior and enforces the 22 kW sensor safety boundary during testing.'
  },
  {
    icon: <LineChart size={18} />,
    title: 'Analytics & Savings',
    desc: 'Energy trend charts plus a cost‑savings estimator to support evaluation and presentation.'
  },
]

export default function FeatureSection() {
  return (
    <div id="features" className="mt-10">
      <div className="text-xs text-white/50">Features</div>
      <div className="mt-1 text-2xl font-semibold">Everything your defense demo needs</div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <div key={i} className="glass rounded-3xl p-5 border border-white/10 shadow-soft">
            <div className="h-10 w-10 rounded-2xl bg-white text-zinc-900 flex items-center justify-center">{f.icon}</div>
            <div className="mt-4 text-sm font-semibold">{f.title}</div>
            <div className="mt-1 text-sm text-white/65 leading-relaxed">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
