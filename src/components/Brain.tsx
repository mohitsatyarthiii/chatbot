// BrainEnergyEffect.tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMemo } from 'react';

export default function BrainEnergyEffect() {
  const meshRef = useRef<THREE.Mesh>(null);

  const gradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 256, 0);
      gradient.addColorStop(0, '#00AEEE');
      gradient.addColorStop(0.505, '#47BC87');
      gradient.addColorStop(1, '#97C93C');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 1);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(clock.elapsedTime * 2) * 0.05;
      meshRef.current.scale.set(scale, scale, scale);
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1 + Math.sin(clock.elapsedTime * 3) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} scale={1.2} position={[0, 0, 0]}>
      <sphereGeometry args={[1.2, 64, 64]} />
      <meshStandardMaterial
        emissiveMap={gradientTexture}
        emissiveIntensity={1.5}
        emissive={new THREE.Color('#ffffff')}
        roughness={0.2}
        metalness={1.0}
        toneMapped={false}
      />
    </mesh>
  );
}
