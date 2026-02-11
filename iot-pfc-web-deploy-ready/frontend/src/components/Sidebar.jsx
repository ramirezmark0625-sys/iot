import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Activity, Bell, Box, Gauge, LineChart, LogOut, Settings, Cpu } from 'lucide-react'
import { clearToken } from '../lib/auth'

const Item = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
        isActive ? 'bg-white text-zinc-900' : 'text-white/80 hover:bg-white/10'
      }`
    }
  >
    <Icon size={18} />
    <span>{label}</span>
  </NavLink>
)

export default function Sidebar() {
  const nav = useNavigate()
  return (
    <aside className="glass rounded-3xl p-4 shadow-soft">
      <div className="flex items-center gap-3 px-3 py-3">
        <div className="h-10 w-10 rounded-2xl bg-white text-zinc-900 flex items-center justify-center shadow-soft">
          <Cpu size={20} />
        </div>
        <div>
          <div className="text-sm font-semibold">IoT PFC</div>
          <div className="text-xs text-white/60">Adaptive 3‑Phase</div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Item to="/dashboard" icon={Gauge} label="Dashboard" />
        <Item to="/analytics" icon={LineChart} label="Analytics" />
        <Item to="/devices" icon={Box} label="Devices" />
        <Item to="/alerts" icon={Bell} label="Alerts" />
        <Item to="/settings" icon={Settings} label="Settings" />
      </div>

      <div className="mt-6 border-t border-white/10 pt-4">
        <button
          onClick={() => { clearToken(); nav('/login'); }}
          className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 transition"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      <div className="mt-6 px-3 text-xs text-white/50 leading-relaxed">
        Realtime monitoring • Adaptive switching • 22 kW sensor limit protection
      </div>
    </aside>
  )
}
