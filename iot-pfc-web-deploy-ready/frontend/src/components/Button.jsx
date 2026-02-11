import React from 'react'
import { cn } from '../lib/utils'

export default function Button({ children, variant='primary', className, ...props }) {
  const base = 'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-white text-zinc-900 hover:bg-zinc-100 shadow-soft',
    secondary: 'bg-white/10 text-white hover:bg-white/15 border border-white/10',
    ghost: 'bg-transparent text-white hover:bg-white/10',
    danger: 'bg-rose-500 text-white hover:bg-rose-400'
  }
  return (
    <button className={cn(base, variants[variant] || variants.primary, className)} {...props}>
      {children}
    </button>
  )
}
