import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import toast from 'react-hot-toast'
import Button from '../components/Button'
import Input from '../components/Input'

export default function Register() {
  const nav = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/register', { email, password, full_name: fullName || null })
      toast.success('Account created. Please login.')
      nav('/login')
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 bg-grid flex items-center justify-center px-4">
      <div className="w-full max-w-md glass rounded-[40px] border border-white/10 p-8 shadow-soft">
        <div className="text-xs text-white/50">Get Started</div>
        <div className="mt-1 text-2xl font-semibold">Create Account</div>
        <p className="mt-2 text-sm text-white/60">Create a user to manage devices and view telemetry.</p>

        <form className="mt-6 space-y-3" onSubmit={onSubmit}>
          <div>
            <div className="text-xs text-white/60 mb-1">Full name (optional)</div>
            <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <div className="text-xs text-white/60 mb-1">Email</div>
            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <div className="text-xs text-white/60 mb-1">Password</div>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" />
          </div>
          <Button disabled={loading} className="w-full">{loading ? 'Creating…' : 'Create account'}</Button>
        </form>

        <div className="mt-5 text-sm text-white/60">
          Already have an account? <Link className="text-white font-semibold hover:underline" to="/login">Login</Link>
        </div>
      </div>
    </div>
  )
}
