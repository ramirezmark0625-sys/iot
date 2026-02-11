import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { setToken } from '../lib/auth'
import toast from 'react-hot-toast'
import Button from '../components/Button'
import Input from '../components/Input'

export default function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState('admin@pfc.local')
  const [password, setPassword] = useState('admin123!')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const form = new URLSearchParams()
      form.append('username', email)
      form.append('password', password)
      const res = await api.post('/auth/login', form, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
      setToken(res.data.access_token)
      toast.success('Welcome back')
      nav('/dashboard')
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 bg-grid flex items-center justify-center px-4">
      <div className="w-full max-w-md glass rounded-[40px] border border-white/10 p-8 shadow-soft">
        <div className="text-xs text-white/50">Secure Access</div>
        <div className="mt-1 text-2xl font-semibold">Login</div>
        <p className="mt-2 text-sm text-white/60">Access the dashboard, devices, analytics and alerts.</p>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <div>
            <div className="text-xs text-white/60 mb-1">Email</div>
            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <div className="text-xs text-white/60 mb-1">Password</div>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button disabled={loading} className="w-full">{loading ? 'Signing in…' : 'Sign in'}</Button>
        </form>

        <div className="mt-5 text-sm text-white/60">
          No account? <Link className="text-white font-semibold hover:underline" to="/register">Create one</Link>
        </div>

        <div className="mt-6 text-xs text-white/40">
          Demo credentials are prefilled for Docker quickstart.
        </div>
      </div>
    </div>
  )
}
