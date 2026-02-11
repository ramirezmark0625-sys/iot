import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Shell({ children, title }) {
  return (
    <div className="min-h-screen bg-zinc-950 bg-grid">
      <div className="mx-auto max-w-[1400px] px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
          <Sidebar />
          <div className="glass rounded-3xl overflow-hidden shadow-soft">
            <Topbar title={title} />
            <div className="p-5 lg:p-7">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
