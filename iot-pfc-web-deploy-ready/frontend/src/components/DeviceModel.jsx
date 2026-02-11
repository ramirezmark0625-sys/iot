import React, { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html, useGLTF } from '@react-three/drei'
import ErrorBoundary from './ErrorBoundary'

function Placeholder({ capStates }) {
  const caps = useMemo(() => ([
    { name: 'Phase A Bank', pos: [-1.0, 0.0, 0.2], on: capStates?.A },
    { name: 'Phase B Bank', pos: [ 0.0, 0.0, 0.2], on: capStates?.B },
    { name: 'Phase C Bank', pos: [ 1.0, 0.0, 0.2], on: capStates?.C },
  ]), [capStates])

  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.8, 2.2, 2.2]} />
        <meshStandardMaterial color="#2a2a2e" metalness={0.2} roughness={0.7} />
      </mesh>

      <mesh position={[-1.75, 0.0, 0.95]}>
        <boxGeometry args={[0.35, 0.35, 0.15]} />
        <meshStandardMaterial color="#111118" />
      </mesh>

      <mesh position={[0, -0.65, 0]}>
        <boxGeometry args={[3.2, 0.12, 1.6]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {caps.map((c, idx) => (
        <group key={idx} position={c.pos}>
          <mesh position={[0, -0.15, -0.2]}>
            <boxGeometry args={[0.85, 1.25, 0.45]} />
            <meshStandardMaterial
              color={c.on ? '#22c55e' : '#334155'}
              emissive={c.on ? '#16a34a' : '#000000'}
              emissiveIntensity={c.on ? 0.25 : 0.0}
            />
          </mesh>
          <Html center>
            <div className="px-3 py-1 rounded-full text-[11px] font-semibold bg-black/70 border border-white/10 text-white">
              {c.name}
            </div>
          </Html>
        </group>
      ))}
    </group>
  )
}

function GLBModel({ url }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={1.2} />
}

export default function DeviceModel({ capStates }) {
  const url = '/assets/model.glb' // put your exported GLB here: frontend/public/assets/model.glb

  return (
    <div className="glass rounded-3xl p-5 border border-white/10 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">3D Device Visualization</div>
          <div className="text-xs text-white/50">Interactive enclosure preview and capacitor bank indicators</div>
        </div>
        <div className="text-xs text-white/50">GLB auto‑load or fallback</div>
      </div>

      <div className="mt-4 h-[360px] rounded-3xl overflow-hidden border border-white/10 bg-black/30">
        <Canvas camera={{ position: [0, 1.6, 5], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[4, 6, 3]} intensity={0.9} />
          <OrbitControls enablePan={false} />

          <Suspense fallback={<Placeholder capStates={capStates} />}>
            <ErrorBoundary fallback={<Placeholder capStates={capStates} />}>
              <GLBModel url={url} />
            </ErrorBoundary>
          </Suspense>
        </Canvas>
      </div>

      <div className="mt-3 text-xs text-white/45">
        To use your real model: export as <span className="font-semibold text-white/70">model.glb</span> and place it in
        <span className="font-semibold text-white/70"> frontend/public/assets/</span>.
      </div>
    </div>
  )
}
