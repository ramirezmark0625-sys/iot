import React from 'react'
import { motion } from 'framer-motion'
import Button from './Button'
import Badge from './Badge'
import { ArrowRight, Wifi, Activity, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 glass shadow-soft">
      <div className="absolute inset-0 opacity-70"
        style={{ background: 'radial-gradient(800px 400px at 20% 20%, rgba(59,130,246,0.35), transparent 60%), radial-gradient(900px 500px at 80% 20%, rgba(16,185,129,0.25), transparent 60%), radial-gradient(900px 500px at 60% 90%, rgba(244,63,94,0.18), transparent 60%)' }}
      />

      <div className="relative p-8 lg:p-14 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge tone="info" className="mb-4">IoT‑Enabled • Adaptive • Three‑Phase</Badge>
            <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight leading-tight">
              High‑class monitoring & adaptive control for
              <span className="block text-white/80">three‑phase power factor correction</span>
            </h1>
            <p className="mt-4 text-white/70 leading-relaxed max-w-xl">
              A thesis‑grade dashboard for your ESP32‑based PFC prototype: realtime telemetry,
              capacitor step visualization, alerts, analytics, and interactive 3D device preview.
            </p>
          </motion.div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Chip icon={<Wifi size={16} />} label="Realtime IoT" />
            <Chip icon={<Activity size={16} />} label="Adaptive Switching" />
            <Chip icon={<Shield size={16} />} label="22 kW Sensor Limit Guard" />
          </div>

          <div className="mt-8 flex items-center gap-3">
            <Link to="/login"><Button className="gap-2">Open Dashboard <ArrowRight size={16} /></Button></Link>
            <a href="#features"><Button variant="secondary">Explore Features</Button></a>
          </div>

          <div className="mt-6 text-xs text-white/45">
            Designed for residential complexes, small commercial establishments, and light industrial applications.
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[32px] border border-white/10 bg-black/30 overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <div className="text-sm font-semibold">System Snapshot</div>
              <div className="text-xs text-white/50">Panel layout + enclosure preview</div>
            </div>
            <div className="grid grid-cols-2 gap-3 p-5">
              <img className="rounded-2xl border border-white/10 object-cover w-full h-40" src="/assets/panel.png" alt="PFC panel" />
              <img className="rounded-2xl border border-white/10 object-cover w-full h-40" src="/assets/enclosure.png" alt="Device enclosure" />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 hidden lg:block">
            <div className="glass rounded-3xl border border-white/10 px-5 py-4 shadow-soft">
              <div className="text-xs text-white/50">Target</div>
              <div className="text-xl font-semibold">PF → 0.99</div>
              <div className="text-xs text-white/45">Adaptive correction under varying loads</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Chip({ icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-2 text-xs text-white/70">
      {icon}
      <span className="font-semibold">{label}</span>
    </div>
  )
}
