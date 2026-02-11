import React, { useEffect, useState } from 'react'
import Shell from '../components/Shell'
import api from '../lib/api'
import toast from 'react-hot-toast'
import Badge from '../components/Badge'
import Button from '../components/Button'

export default function Alerts() {
  const [devices, setDevices] = useState([])
  const [deviceId, setDeviceId] = useState(null)
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    api.get('/devices')
      .then(r => {
        setDevices(r.data)
        if (r.data?.length) setDeviceId(r.data[0].id)
      })
      .catch(() => toast.error('Failed to load devices'))
  }, [])

  async function load() {
    if (!deviceId) return
    try {
      const r = await api.get('/alerts', { params: { device_id: deviceId, limit: 200 } })
      setAlerts(r.data)
    } catch {
      toast.error('Failed to load alerts')
    }
  }

  useEffect(() => { load() }, [deviceId])

  async function ack(id) {
    try {
      await api.post(`/alerts/${id}/ack`, null, { params: { device_id: deviceId } })
      toast.success('Acknowledged')
      load()
    } catch {
      toast.error('Failed to acknowledge')
    }
  }

  return (
    <Shell title="Alerts">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs text-white/50">Monitoring</div>
          <div className="text-xl font-semibold">System Alerts</div>
        </div>

        <select
          className="rounded-2xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none"
          value={deviceId || ''}
          onChange={(e) => setDeviceId(Number(e.target.value))}
        >
          {devices.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      <div className="mt-6 glass rounded-3xl border border-white/10 p-5 shadow-soft">
        {alerts.length === 0 ? (
          <div className="text-sm text-white/60">No alerts yet. Start telemetry ingestion or enable the simulator.</div>
        ) : (
          <div className="space-y-3">
            {alerts.map(a => (
              <div key={a.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge tone={a.severity === 'critical' ? 'critical' : a.severity === 'warning' ? 'warning' : 'info'}>
                        {a.severity.toUpperCase()}
                      </Badge>
                      {a.is_ack ? <Badge tone="success">ACK</Badge> : null}
                    </div>
                    <div className="mt-2 text-sm font-semibold">{a.title}</div>
                    <div className="mt-1 text-sm text-white/70 leading-relaxed">{a.message}</div>
                    <div className="mt-2 text-xs text-white/45">{new Date(a.created_at).toLocaleString()}</div>
                  </div>
                  {!a.is_ack ? <Button variant="secondary" onClick={() => ack(a.id)}>Acknowledge</Button> : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Shell>
  )
}
