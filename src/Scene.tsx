import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Core({ animate }: { animate: boolean }) {
  const core = useRef<THREE.Group>(null);
  useFrame(({ clock }, delta) => {
    if (!animate || !core.current) return;
    core.current.rotation.y += Math.min(delta, 0.04) * 0.14;
    core.current.position.y = Math.sin(clock.elapsedTime * 0.6) * 0.08;
  });
  return <group ref={core}>
    <mesh rotation={[0.25, 0.3, 0.15]}>
      <icosahedronGeometry args={[1.15, 0]} />
      <meshStandardMaterial color="#42676f" metalness={0.88} roughness={0.28} flatShading />
    </mesh>
    <mesh rotation={[0.25, 0.3, 0.15]} scale={1.006}>
      <icosahedronGeometry args={[1.15, 0]} />
      <meshBasicMaterial color="#90f5e4" wireframe transparent opacity={0.65} />
    </mesh>
    {[0, 1, 2].map((ring) => <group key={ring} rotation={[0.6 + ring * 0.7, ring * 0.8, ring * 0.55]}>
      <mesh>
        <torusGeometry args={[1.65 + ring * 0.24, ring === 0 ? 0.023 : 0.008, 8, 100]} />
        <meshBasicMaterial color={ring === 0 ? '#9cf4e4' : '#537a87'} transparent opacity={ring === 0 ? 0.9 : 0.55} />
      </mesh>
      <mesh position={[1.65 + ring * 0.24, 0, 0]}>
        <octahedronGeometry args={[ring === 0 ? 0.09 : 0.05]} />
        <meshBasicMaterial color="#c4fff5" />
      </mesh>
    </group>)}
    {Array.from({ length: 12 }, (_, i) => {
      const angle = i / 12 * Math.PI * 2;
      const height = 0.12 + (i % 4) * 0.14;
      return <mesh key={i} position={[Math.cos(angle) * 1.35, -1.65 + height / 2, Math.sin(angle) * 1.35]}>
        <boxGeometry args={[0.18, height, 0.18]} />
        <meshStandardMaterial color={i % 3 === 0 ? '#77cbbd' : '#283a44'} metalness={0.65} roughness={0.45} />
      </mesh>;
    })}
    <mesh position={[0, -1.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.7, 1.9, 64]} />
      <meshBasicMaterial color="#477d83" transparent opacity={0.13} side={THREE.DoubleSide} />
    </mesh>
    <gridHelper args={[5.5, 22, '#29484f', '#18282f']} position={[0, -1.73, 0]} />
  </group>;
}

function RendererHealth({ onReady, onFailure }: { onReady: () => void; onFailure: () => void }) {
  const gl = useThree(state => state.gl);
  useEffect(() => {
    onReady();
    const canvas = gl.domElement;
    const lost = () => onFailure();
    canvas.addEventListener('webglcontextlost', lost);
    return () => canvas.removeEventListener('webglcontextlost', lost);
  }, [gl, onReady, onFailure]);
  return null;
}

export default function Scene({ animate, onReady, onFailure }: { animate: boolean; onReady: () => void; onFailure: () => void }) {
  return <Canvas camera={{ position: [4, 2.4, 6], fov: 38 }} dpr={[1, 1.5]} frameloop={animate ? 'always' : 'demand'} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}>
    <RendererHealth onReady={onReady} onFailure={onFailure} />
    <ambientLight intensity={0.9} />
    <directionalLight position={[3, 5, 4]} color="#c9fff3" intensity={3} />
    <pointLight position={[-4, 1, -2]} color="#537de0" intensity={15} />
    <Suspense fallback={null}><Core animate={animate} /></Suspense>
    <OrbitControls enableZoom={false} enablePan={false} enableDamping={animate} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.7} />
  </Canvas>;
}
