import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedSphere = () => {
  const sphereRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });
  
  return (
    <Sphere ref={sphereRef} args={[1, 100, 200]} scale={2}>
      <MeshDistortMaterial
        color="#8b5cf6"
        attach="material"
        distort={0.5}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
};

const FloatingParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  useEffect(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position;
      const count = positions.count;
      
      // Store original positions
      const originalPositions = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) {
        originalPositions[i] = positions.array[i];
      }
      
      // @ts-ignore
      particlesRef.current.userData.originalPositions = originalPositions;
    }
  }, []);
  
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position;
      const count = positions.count;
      const originalPositions = particlesRef.current.userData.originalPositions;
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const time = clock.getElapsedTime();
        
        // Apply sine wave movement
        positions.array[i3] = originalPositions[i3] + Math.sin(time * 0.5 + i * 0.1) * 0.2;
        positions.array[i3 + 1] = originalPositions[i3 + 1] + Math.cos(time * 0.5 + i * 0.1) * 0.2;
        positions.array[i3 + 2] = originalPositions[i3 + 2] + Math.sin(time * 0.5 + i * 0.05) * 0.2;
      }
      
      positions.needsUpdate = true;
    }
  });
  
  const particleCount = 500;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 10;
    positions[i3 + 1] = (Math.random() - 0.5) * 10;
    positions[i3 + 2] = (Math.random() - 0.5) * 10;
  }
  
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="#4c1d95"
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
};

const ThreeScene: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
      
      <AnimatedSphere />
      <FloatingParticles />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        enableRotate={true}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
};

export default ThreeScene;