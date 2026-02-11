import React, { useEffect, useMemo, useState } from 'react'
import Shell from '../components/Shell'
import StatCard from '../components/StatCard'
import PhasePanel from '../components/PhasePanel'
import DeviceModel from '../components/DeviceModel'
import TelemetryChart from '../components/Charts/TelemetryChart'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { makeWsUrl } from '../lib/ws'
import { Activity, Zap, Timer, Gauge } from 'lucide-react'

export default function Dashboard() {
  const [devices, setDevices] = useState([])
  const [deviceId, setDeviceId] = useState(null)
  const [live, setLive] = useState(null)
  const [series, setSeries] = useState([])

  useEffect(() => {
    api.get('/devices')
      .then(r => {
        setDevices(r.data)
        if (r.data?.length) setDeviceId(r.data[0].id)
      })
      .catch(() => toast.error('Failed to load devices'))
  }, [])

  useEffect(() => {
    if (!deviceId) return
    let ws
    const url = makeWsUrl(`/ws/live?device_id=${deviceId}`)
    ws = new WebSocket(url)
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data)
      setLive(msg)
      // build rolling series
      setSeries(prev => {
        const t = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        const next = [...prev, { t, kw: msg.total_kw, pf: msg.avg_pf, kvar: msg.total_kvar }]
        return next.slice(-90)
      })
    }
    ws.onerror = () => {}
    return () => { try { ws?.close() } catch {} }
  }, [deviceId])

  const payload = live?.payload
  const capStates = useMemo(() => ({
    A: (payload?.phaseA?.cap_step || 'OFF') !== 'OFF',
    B: (payload?.phaseB?.cap_step || 'OFF') !== 'OFF',
    C: (payload?.phaseC?.cap_step || 'OFF') !== 'OFF',
  }), [payload])

  const totalKW = live?.total_kw ?? null
  const avgPF = live?.avg_pf ?? null
  const totalKvar = live?.total_kvar ?? null

  return (
    <Shell title="Dashboard">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        <div>
          <div className="text-xs text-white/50">Realtime Overview</div>
          <div className="text-xl font-semibold">Adaptive Three‑Phase PFC Monitoring</div>
        </div>

        <div className="flex items-center gap-2">
          <select
            className="rounded-2xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none"
            value={deviceId || ''}
            onChange={(e) => setDeviceId(Number(e.target.value))}
          >
            {devices.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <div className="text-xs text-white/50">{payload?.meta?.mode === 'demo' ? 'Demo stream' : 'Live stream'}</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Average Power Factor" value={avgPF ?? '—'} unit="" hint="Near‑unity target across phases" icon={<Gauge size={18} />} tone={avgPF !== null && avgPF >= 0.95 ? 'success' : 'info'} />
        <StatCard label="Total Active Power" value={totalKW ?? '—'} unit="kW" hint="Sensor safe limit: 22 kW" icon={<Zap size={18} />} tone={totalKW !== null && totalKW > 22 ? 'critical' : 'info'} />
        <StatCard label="Total Reactive Power" value={totalKvar ?? '—'} unit="kVAR" hint="Inductive load correction indicator" icon={<Activity size={18} />} tone="info" />
        <StatCard label="Update Rate" value="1.0" unit="s" hint="WebSocket realtime updates" icon={<Timer size={18} />} tone="zinc" />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <PhasePanel title="Phase A" data={payload?.phaseA} />
        <PhasePanel title="Phase B" data={payload?.phaseB} />
        <PhasePanel title="Phase C" data={payload?.phaseC} />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TelemetryChart title="Active Power Trend" data={series} dataKey="kw" unit="kW" />
        <TelemetryChart title="Power Factor Trend" data={series} dataKey="pf" unit="PF" />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TelemetryChart title="Reactive Power Trend" data={series} dataKey="kvar" unit="kVAR" />
        <DeviceModel capStates={capStates} />
      </div>
    </Shell>
  )
}
