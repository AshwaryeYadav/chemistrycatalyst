import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

// Lightspeed "L" + Campanile 3D Component
function LightspeedModel() {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle auto-rotation when not being manually controlled
      groupRef.current.rotation.y += 0.003;
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  // Create the "L" shape geometry
  const createLShape = () => {
    const shape = new THREE.Shape();
    // Create an L shape
    shape.moveTo(-1, -2);
    shape.lineTo(-1, 2);
    shape.lineTo(-0.5, 2);
    shape.lineTo(-0.5, -1.5);
    shape.lineTo(1.5, -1.5);
    shape.lineTo(1.5, -2);
    shape.lineTo(-1, -2);
    
    const extrudeSettings = {
      depth: 0.3,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  };

  // Create the Campanile tower geometry
  const createCampanileGeometry = () => {
    const tower = new THREE.Group();
    
    // Main tower body
    const towerGeometry = new THREE.BoxGeometry(0.4, 4, 0.4);
    const tower1 = new THREE.Mesh(towerGeometry, new THREE.MeshPhongMaterial({ 
      color: '#e5e5e5',
      shininess: 30
    }));
    tower1.position.y = 2;
    tower.add(tower1);
    
    // Tower top section
    const topGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.6);
    const towerTop = new THREE.Mesh(topGeometry, new THREE.MeshPhongMaterial({ 
      color: '#f0f0f0',
      shininess: 50
    }));
    towerTop.position.y = 4.4;
    tower.add(towerTop);
    
    // Clock section
    const clockGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 8);
    const clock = new THREE.Mesh(clockGeometry, new THREE.MeshPhongMaterial({ 
      color: '#d0d0d0',
      shininess: 80
    }));
    clock.position.y = 4.6;
    clock.rotation.x = Math.PI / 2;
    tower.add(clock);
    
    return tower;
  };

  const lGeometry = createLShape();
  
  return (
    <group ref={groupRef}>
      <Center>
        {/* The "L" part */}
        <mesh 
          geometry={lGeometry}
          position={[-0.5, -1, 0]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshPhongMaterial 
            color={hovered ? '#ffffff' : '#f0f0f0'}
            shininess={100}
            transparent
            opacity={0.95}
          />
        </mesh>
        
        {/* The Campanile tower replacing the vertical part of L */}
        <primitive 
          object={createCampanileGeometry()} 
          position={[-0.75, 1, 0]}
          scale={0.3}
        />
        
        {/* Subtle glow effect */}
        <pointLight 
          position={[0, 2, 2]} 
          intensity={0.5} 
          color="#ffffff"
          distance={10}
          decay={2}
        />
      </Center>
    </group>
  );
}

interface LightspeedLogo3DProps {
  className?: string;
}

export function LightspeedLogo3D({ className = "" }: LightspeedLogo3DProps) {
  return (
    <div className={`w-full h-64 ${className}`}>
      <Canvas
        camera={{ 
          position: [4, 2, 4], 
          fov: 50,
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        {/* Lighting setup */}
        <ambientLight intensity={0.3} color="#ffffff" />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8} 
          color="#ffffff"
          castShadow
        />
        <directionalLight 
          position={[-5, 3, -5]} 
          intensity={0.4} 
          color="#e0e0e0"
        />
        
        {/* 3D Model */}
        <LightspeedModel />
        
        {/* Interactive controls */}
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          maxPolarAngle={Math.PI / 2}
          minDistance={3}
          maxDistance={8}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}