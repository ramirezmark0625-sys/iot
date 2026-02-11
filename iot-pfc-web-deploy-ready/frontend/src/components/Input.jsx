import React from 'react'
import { cn } from '../lib/utils'

export default function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20',
        className
      )}
      {...props}
    />
  )
}
