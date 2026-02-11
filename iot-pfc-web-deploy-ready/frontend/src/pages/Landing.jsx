import React from 'react'
import Hero from '../components/Hero'
import FeatureSection from '../components/FeatureSection'
import { Link } from 'react-router-dom'
import Button from '../components/Button'

export default function Landing() {
  return (
    <div className="min-h-screen bg-zinc-950 bg-grid">
      <div className="mx-auto max-w-[1200px] px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-sm font-semibold">IoT Adaptive Three‑Phase PFC</div>
            <div className="text-xs text-white/50">Monitoring • Control • Analytics • 3D Visualization</div>
          </div>
          <div className="flex gap-3">
            <Link to="/login"><Button>Login</Button></Link>
            <Link to="/register"><Button variant="secondary">Create Account</Button></Link>
          </div>
        </div>

        <Hero />
        <FeatureSection />

        <div className="mt-10 glass rounded-[40px] border border-white/10 p-8 lg:p-12 shadow-soft">
          <div className="text-xs text-white/50">Thesis Summary</div>
          <div className="mt-1 text-2xl font-semibold">Adaptive control + realtime insight</div>
          <p className="mt-3 text-white/70 leading-relaxed max-w-3xl">
            This platform complements a low‑cost adaptive three‑phase PFC prototype that monitors each phase independently,
            computes power factor/reactive power, and switches fixed capacitor steps to approach near‑unity PF. The dashboard
            supports remote monitoring, logging, alerts, and analytics for evaluation under laboratory and residential trials.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/dashboard"><Button className="px-6">Open Dashboard</Button></Link>
            <a href="/api/docs" target="_blank" rel="noreferrer"><Button variant="secondary">API Docs</Button></a>
          </div>
        </div>

        <div className="mt-10 text-center text-xs text-white/40">
          © {new Date().getFullYear()} IoT PFC • Built for academic demonstration & prototype evaluation
        </div>
      </div>
    </div>
  )
}
