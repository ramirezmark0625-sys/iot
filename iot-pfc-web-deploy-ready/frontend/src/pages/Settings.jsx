import React, { useEffect, useState } from 'react'
import Shell from '../components/Shell'
import api from '../lib/api'
import toast from 'react-hot-toast'

export default function Settings() {
  const [me, setMe] = useState(null)

  useEffect(() => {
    api.get('/auth/me')
      .then(r => setMe(r.data))
      .catch(() => toast.error('Failed to load profile'))
  }, [])

  return (
    <Shell title="Settings">
      <div className="glass rounded-3xl border border-white/10 p-6 shadow-soft">
        <div className="text-sm font-semibold">Profile</div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Email" value={me?.email || '—'} />
          <Field label="Full name" value={me?.full_name || '—'} />
          <Field label="Role" value={me?.is_admin ? 'Admin' : 'User'} />
          <Field label="Member since" value={me?.created_at ? new Date(me.created_at).toLocaleDateString() : '—'} />
        </div>
        <div className="mt-6 text-xs text-white/45">
          For public deployments, enable HTTPS and set a strong SECRET_KEY in your .env.
        </div>
      </div>
    </Shell>
  )
}

function Field({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  )
}
