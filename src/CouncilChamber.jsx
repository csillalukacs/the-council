// CouncilChamber.jsx
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Float, Sparkles } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

const CouncilMember = ({ position, color, active }) => {
  const mesh = useRef()
  useFrame((state, delta) => {
    mesh.current.rotation.y += delta * 0.2
  })

  return (
    <group position={position}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[0.4, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={active ? color : 'blue'}
          emissiveIntensity={active ? 1.5 : 0.2}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      {active && (
        <Html position={[0, 0.8, 0]} center>
          <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '4px 8px',
              borderRadius: '6px',
              color: 'white',
              fontSize: '12px',
              backdropFilter: 'blur(4px)',
            }}
          >
            “Opinion incoming...”
          </div>
        </Html>
      )}
    </group>
  )
}

export default function CouncilChamber() {
  const members = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2
    const radius = 4
    return [
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius,
    ]
  })

  return (
    <div style={{ height: '100vh', width: '100vw', background: 'radial-gradient(circle at center, #111, #000)' }}>
      <Canvas camera={{ position: [0, 3, 8], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 5, 0]} intensity={2} color="#8ff" />
        <Sparkles count={80} scale={10} size={2} color="#66ccff" speed={0.5} />
        <Float>
          {members.map((pos, i) => (
            <CouncilMember
              key={i}
              position={pos}
              color={`hsl(${(i / 8) * 360}, 80%, 60%)`}
              active={i === 0} // simulate one "speaking"
            />
          ))}
        </Float>

        {/* Central altar / input placeholder */}
        <Html center position={[0, -1, 0]}>
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#fff',
              minWidth: '300px',
              textAlign: 'center',
              backdropFilter: 'blur(6px)',
            }}
          >
            <input
              type="text"
              placeholder="Ask the council..."
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: 'white',
                outline: 'none',
                textAlign: 'center',
                fontSize: '16px',
              }}
            />
          </div>
        </Html>

        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  )
}
