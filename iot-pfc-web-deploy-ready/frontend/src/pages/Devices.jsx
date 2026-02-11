import React, { useEffect, useState } from 'react'
import Shell from '../components/Shell'
import Button from '../components/Button'
import Input from '../components/Input'
import api from '../lib/api'
import toast from 'react-hot-toast'
import { Copy, RotateCcw, Plus } from 'lucide-react'

export default function Devices() {
  const [devices, setDevices] = useState([])
  const [name, setName] = useState('PFC Prototype')
  const [location, setLocation] = useState('BSU Laboratory')
  const [loading, setLoading] = useState(false)

  async function load() {
    try {
      const r = await api.get('/devices')
      setDevices(r.data)
    } catch {
      toast.error('Failed to load devices')
    }
  }

  useEffect(() => { load() }, [])

  async function create() {
    setLoading(true)
    try {
      await api.post('/devices', { name, location })
      toast.success('Device created')
      await load()
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Create failed')
    } finally {
      setLoading(false)
    }
  }

  async function rotateKey(id) {
    if (!confirm('Rotate device API key? You must update the ESP32 firmware with the new key.')) return
    try {
      await api.post(`/devices/${id}/rotate_key`)
      toast.success('Key rotated')
      await load()
    } catch {
      toast.error('Rotate failed')
    }
  }

  function copy(text) {
    navigator.clipboard.writeText(text)
    toast.success('Copied')
  }

  return (
    <Shell title="Devices">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-3xl p-5 border border-white/10 shadow-soft">
          <div className="text-sm font-semibold">Add Device</div>
          <div className="mt-4 space-y-3">
            <div>
              <div className="text-xs text-white/60 mb-1">Device name</div>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <div className="text-xs text-white/60 mb-1">Location</div>
              <Input value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <Button disabled={loading} onClick={create} className="gap-2">
              <Plus size={16} /> Create device
            </Button>
          </div>
          <div className="mt-4 text-xs text-white/45">
            Use the generated API key in your ESP32 firmware as `X-DEVICE-KEY`.
          </div>
        </div>

        <div className="glass rounded-3xl p-5 border border-white/10 shadow-soft">
          <div className="text-sm font-semibold">My Devices</div>
          <div className="mt-4 space-y-3">
            {devices.length === 0 ? (
              <div className="text-sm text-white/60">No devices yet.</div>
            ) : devices.map(d => (
              <div key={d.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{d.name}</div>
                    <div className="text-xs text-white/55">{d.location || '—'}</div>
                    <div className="mt-2 text-xs text-white/50">API key</div>
                    <div className="mt-1 font-mono text-xs text-white/80 break-all">{d.api_key}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="secondary" className="gap-2" onClick={() => copy(d.api_key)}>
                      <Copy size={16} /> Copy
                    </Button>
                    <Button variant="secondary" className="gap-2" onClick={() => rotateKey(d.id)}>
                      <RotateCcw size={16} /> Rotate
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  )
}
