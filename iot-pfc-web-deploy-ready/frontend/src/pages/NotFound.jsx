import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 bg-grid flex items-center justify-center px-4">
      <div className="glass rounded-[40px] border border-white/10 p-10 shadow-soft text-center">
        <div className="text-2xl font-semibold">404</div>
        <div className="mt-2 text-white/70">Page not found.</div>
        <div className="mt-6">
          <Link to="/"><Button>Go home</Button></Link>
        </div>
      </div>
    </div>
  )
}
