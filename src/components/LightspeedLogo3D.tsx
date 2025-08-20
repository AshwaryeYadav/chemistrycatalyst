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

  // Create the Berkeley Campanile tower geometry
  const createCampanileGeometry = () => {
    const tower = new THREE.Group();
    
    // Stone material for authentic look
    const stoneMaterial = new THREE.MeshPhongMaterial({ 
      color: '#c8c0b0',
      shininess: 10,
      specular: '#999999'
    });
    
    // Main tower body - tall and slender like the real Campanile
    const mainTowerGeometry = new THREE.CylinderGeometry(0.25, 0.28, 5.5, 12);
    const mainTower = new THREE.Mesh(mainTowerGeometry, stoneMaterial);
    mainTower.position.y = 2.75;
    tower.add(mainTower);
    
    // Base section - slightly wider
    const baseGeometry = new THREE.CylinderGeometry(0.32, 0.35, 1, 12);
    const base = new THREE.Mesh(baseGeometry, stoneMaterial);
    base.position.y = 0.5;
    tower.add(base);
    
    // Clock chamber - distinctive square section with arched openings
    const clockChamberGeometry = new THREE.BoxGeometry(0.7, 1.2, 0.7);
    const clockChamber = new THREE.Mesh(clockChamberGeometry, stoneMaterial);
    clockChamber.position.y = 5.8;
    tower.add(clockChamber);
    
    // Clock faces - four sides
    const clockFaceGeometry = new THREE.CircleGeometry(0.2, 16);
    const clockFaceMaterial = new THREE.MeshPhongMaterial({ 
      color: '#ffffff',
      shininess: 50
    });
    
    // Front clock face
    const clockFace1 = new THREE.Mesh(clockFaceGeometry, clockFaceMaterial);
    clockFace1.position.set(0, 5.8, 0.36);
    tower.add(clockFace1);
    
    // Back clock face
    const clockFace2 = new THREE.Mesh(clockFaceGeometry, clockFaceMaterial);
    clockFace2.position.set(0, 5.8, -0.36);
    clockFace2.rotation.y = Math.PI;
    tower.add(clockFace2);
    
    // Bell chamber - arched openings
    const bellChamberGeometry = new THREE.CylinderGeometry(0.4, 0.42, 0.8, 8);
    const bellChamber = new THREE.Mesh(bellChamberGeometry, stoneMaterial);
    bellChamber.position.y = 6.8;
    tower.add(bellChamber);
    
    // Spire - pointed top like the real Campanile
    const spireGeometry = new THREE.ConeGeometry(0.15, 1.5, 8);
    const spire = new THREE.Mesh(spireGeometry, new THREE.MeshPhongMaterial({ 
      color: '#a0a0a0',
      shininess: 30
    }));
    spire.position.y = 8;
    tower.add(spire);
    
    // Finial - small decorative top
    const finialGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const finial = new THREE.Mesh(finialGeometry, new THREE.MeshPhongMaterial({ 
      color: '#888888',
      shininess: 50
    }));
    finial.position.y = 8.8;
    tower.add(finial);
    
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
        
        {/* The Berkeley Campanile tower replacing the vertical part of L */}
        <primitive 
          object={createCampanileGeometry()} 
          position={[-0.75, -1, 0]}
          scale={0.25}
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