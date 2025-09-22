// src/components/ChemistryHero.tsx
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, memo, useMemo } from "react";

/* --------------------------- THREE: 3D Campanile --------------------------- */
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** UC Berkeley Campanile tower - Detailed model based on GrabCAD reference */
const CampanileMesh = memo(function CampanileMesh() {
  const geom = useMemo(() => {
    const group = new THREE.Group();
    
    // Foundation/Base platform (wider and more substantial)
    const foundationGeom = new THREE.BoxGeometry(3.2, 0.4, 3.2);
    const foundationMesh = new THREE.Mesh(foundationGeom);
    foundationMesh.position.y = -3.2;
    group.add(foundationMesh);
    
    // Lower base section
    const lowerBaseGeom = new THREE.BoxGeometry(2.8, 0.6, 2.8);
    const lowerBaseMesh = new THREE.Mesh(lowerBaseGeom);
    lowerBaseMesh.position.y = -2.6;
    group.add(lowerBaseMesh);
    
    // Main tower shaft (taller and more proportioned)
    const shaftGeom = new THREE.BoxGeometry(1.2, 4.5, 1.2);
    const shaftMesh = new THREE.Mesh(shaftGeom);
    shaftMesh.position.y = -0.25;
    group.add(shaftMesh);
    
    // Mid-level detail band
    const midBandGeom = new THREE.BoxGeometry(1.4, 0.2, 1.4);
    const midBandMesh = new THREE.Mesh(midBandGeom);
    midBandMesh.position.y = 1.0;
    group.add(midBandMesh);
    
    // Clock level section
    const clockLevelGeom = new THREE.BoxGeometry(1.3, 0.8, 1.3);
    const clockLevelMesh = new THREE.Mesh(clockLevelGeom);
    clockLevelMesh.position.y = 1.8;
    group.add(clockLevelMesh);
    
    // Add clock faces (simplified as inset rectangles)
    const clockFaceGeom = new THREE.BoxGeometry(0.1, 0.4, 0.4);
    
    // Front clock face
    const frontClockMesh = new THREE.Mesh(clockFaceGeom);
    frontClockMesh.position.set(0.7, 1.8, 0);
    group.add(frontClockMesh);
    
    // Back clock face
    const backClockMesh = new THREE.Mesh(clockFaceGeom);
    backClockMesh.position.set(-0.7, 1.8, 0);
    group.add(backClockMesh);
    
    // Left clock face
    const leftClockGeom = new THREE.BoxGeometry(0.4, 0.4, 0.1);
    const leftClockMesh = new THREE.Mesh(leftClockGeom);
    leftClockMesh.position.set(0, 1.8, 0.7);
    group.add(leftClockMesh);
    
    // Right clock face
    const rightClockMesh = new THREE.Mesh(leftClockGeom);
    rightClockMesh.position.set(0, 1.8, -0.7);
    group.add(rightClockMesh);
    
    // Upper belfry section (with arched openings)
    const belfryGeom = new THREE.BoxGeometry(1.8, 1.2, 1.8);
    const belfryMesh = new THREE.Mesh(belfryGeom);
    belfryMesh.position.y = 3.1;
    group.add(belfryMesh);
    
    // Belfry arched openings (simplified as rectangular cutouts)
    const archGeom = new THREE.BoxGeometry(0.1, 0.8, 0.6);
    
    // Front arch
    const frontArchMesh = new THREE.Mesh(archGeom);
    frontArchMesh.position.set(0.95, 3.1, 0);
    group.add(frontArchMesh);
    
    // Back arch
    const backArchMesh = new THREE.Mesh(archGeom);
    backArchMesh.position.set(-0.95, 3.1, 0);
    group.add(backArchMesh);
    
    // Side arches
    const sideArchGeom = new THREE.BoxGeometry(0.6, 0.8, 0.1);
    const leftArchMesh = new THREE.Mesh(sideArchGeom);
    leftArchMesh.position.set(0, 3.1, 0.95);
    group.add(leftArchMesh);
    
    const rightArchMesh = new THREE.Mesh(sideArchGeom);
    rightArchMesh.position.set(0, 3.1, -0.95);
    group.add(rightArchMesh);
    
    // Crown/cornice section
    const crownGeom = new THREE.BoxGeometry(2.0, 0.3, 2.0);
    const crownMesh = new THREE.Mesh(crownGeom);
    crownMesh.position.y = 3.85;
    group.add(crownMesh);
    
    // Roof structure (pyramidal)
    const roofGeom = new THREE.ConeGeometry(1.1, 0.8, 4);
    const roofMesh = new THREE.Mesh(roofGeom);
    roofMesh.position.y = 4.4;
    roofMesh.rotation.y = Math.PI / 4; // Rotate 45 degrees for square base
    group.add(roofMesh);
    
    // Final spire/finial
    const spireGeom = new THREE.ConeGeometry(0.2, 0.8, 8);
    const spireMesh = new THREE.Mesh(spireGeom);
    spireMesh.position.y = 5.0;
    group.add(spireMesh);
    
    // Convert group to single geometry
    const finalGeom = new THREE.BufferGeometry();
    const vertices: number[] = [];
    const indices: number[] = [];
    let indexOffset = 0;
    
    group.children.forEach((child) => {
      const mesh = child as THREE.Mesh;
      const geom = mesh.geometry as THREE.BufferGeometry;
      geom.computeBoundingBox();
      
      const positions = geom.attributes.position.array;
      const meshIndices = geom.index?.array || [];
      
      // Apply position offset
      for (let i = 0; i < positions.length; i += 3) {
        vertices.push(
          positions[i] + mesh.position.x,
          positions[i + 1] + mesh.position.y,
          positions[i + 2] + mesh.position.z
        );
      }
      
      // Add indices with offset
      for (let i = 0; i < meshIndices.length; i++) {
        indices.push(meshIndices[i] + indexOffset);
      }
      
      indexOffset += positions.length / 3;
    });
    
    finalGeom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    finalGeom.setIndex(indices);
    finalGeom.computeVertexNormals();
    finalGeom.center();
    
    return finalGeom;
  }, []);

  return (
    <mesh geometry={geom} castShadow receiveShadow>
      <meshStandardMaterial 
        color="hsl(35, 25%, 88%)" 
        metalness={0.02} 
        roughness={0.3}
        // Clean light stone color matching the reference
      />
    </mesh>
  );
});

/** Interactive rotating Campanile with mouse controls */
function RotatingCampanile() {
  const group = useRef<THREE.Group>(null!);
  const [isDragging, setIsDragging] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 });

  useFrame((_s, dt) => {
    if (group.current && autoRotate && !isDragging) {
      group.current.rotation.y += dt * 0.15; // Slow 8-12s rotation
    }
  });

  const handlePointerDown = (event: any) => {
    setIsDragging(true);
    setAutoRotate(false);
    setPreviousMousePosition({ x: event.clientX, y: event.clientY });
    event.target.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: any) => {
    if (!isDragging || !group.current) return;
    
    const deltaMove = {
      x: event.clientX - previousMousePosition.x,
      y: event.clientY - previousMousePosition.y
    };

    group.current.rotation.y += deltaMove.x * 0.01;
    group.current.rotation.x += deltaMove.y * 0.01;
    
    setPreviousMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    // Resume auto-rotation immediately
    setAutoRotate(true);
  };

  return (
    <group 
      ref={group} 
      scale={[0.7, 0.7, 0.7]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <CampanileMesh />
    </group>
  );
}

/* --------------------------------- Hero --------------------------------- */

export function ChemistryHero() {
  const companyGroups = [
    ["Bridge", "Decagon", "Intercom"],
    ["LaunchDarkly", "Manychat", "PagerDuty"],
    ["Pave", "Persona", "Pilot"],
    ["Plaid", "TRM", "Twitch"],
    ["Stripe", "Figma", "Linear"],
    ["Notion", "Airtable", "Webflow"],
  ];
  const descriptions = ["entrepreneurs.", "founders.", "builders.", "innovators."];

  const [currentGroup, setCurrentGroup] = useState(0);
  const [currentDescription, setCurrentDescription] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [iAsTower, setIAsTower] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // cycles
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(
      () => setCurrentGroup((p) => (p + 1) % companyGroups.length),
      2400
    );
    return () => clearInterval(id);
  }, [isPaused, companyGroups.length]);

  // Typing animation effect - slower and more tasteful
  useEffect(() => {
    const currentWord = descriptions[currentDescription];
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setTypingText(currentWord.substring(0, typingText.length - 1));
        if (typingText === "") {
          setIsDeleting(false);
          setCurrentDescription((p) => (p + 1) % descriptions.length);
        }
      }, 60); // Faster deletion
    } else {
      if (typingText === currentWord) {
        timeout = setTimeout(() => setIsDeleting(true), 2000);
      } else {
        timeout = setTimeout(() => {
          setTypingText(currentWord.substring(0, typingText.length + 1));
        }, 35); // 30-40ms/char as specified
      }
    }

    return () => clearTimeout(timeout);
  }, [typingText, isDeleting, currentDescription, descriptions]);

  // Initialize first word
  useEffect(() => {
    if (typingText === "" && !isDeleting) {
      setTypingText(descriptions[0].substring(0, 1));
    }
  }, []);

  // morph I - slower animation
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = setInterval(() => setIAsTower((v) => !v), 8000); // Slower transition
    return () => clearInterval(id);
  }, []);

  // CSS for tighter IN-SLOT morph (unchanged)
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .i-slot{
        --iWidth: 0.35em;
        --iHeight: 0.92em;
        --iBaseline: -0.15em;
        --towerNudgeX: 0px;
        position: relative; display:inline-block;
        inline-size: var(--iWidth);
        block-size: var(--iHeight);
        vertical-align: var(--iBaseline);
        overflow: hidden;
        text-align: center;
      }
      .i-layer{
        position:absolute; inset:0; display:flex; align-items:flex-end; justify-content:center;
        will-change: opacity, transform;
        transition: opacity .4s cubic-bezier(.2,.7,.2,1),
                    transform .45s cubic-bezier(.3,.7,.2,1);
      }
      .i-text  { opacity:1;  transform: translateY(0)    scale(1); }
      .i-tower { opacity:0;  transform: translateY(3%)   scale(.985) translateX(var(--towerNudgeX)); }
      .i-slot.on .i-text  { opacity:0; transform: translateY(-3%)  scale(.985); }
      .i-slot.on .i-tower { opacity:1; transform: translateY(0%)   scale(1)    translateX(var(--towerNudgeX)); }
      @media (prefers-reduced-motion: reduce){
        .i-layer{ transition:opacity .2s ease !important; transform:none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-hero flex items-center justify-center relative overflow-hidden"
    >
      {/* Grain/noise overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.12]" />
      
      <div className="w-full max-w-7xl mx-auto px-8 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          
          {/* LEFT: 3D Campanile */}
          <div className="flex items-center justify-center lg:justify-start order-2 lg:order-1">
            <div
              className="relative"
              style={{
                width: "400px",
                height: "400px",
              }}
              aria-hidden
            >
              <Canvas
                dpr={[1, 2]}
                camera={{ position: [8.0, 6.0, 12.0], fov: 20 }}
                style={{ width: "100%", height: "100%", display: "block" }}
                shadows
              >
                <ambientLight intensity={0.25} />
                <directionalLight
                  position={[3, 6, 5]}
                  castShadow
                  intensity={1.1}
                  shadow-mapSize={[1024, 1024]}
                />
                <hemisphereLight args={["#ffffff", "#222222", 0.35]} />
                <RotatingCampanile />
              </Canvas>
            </div>
          </div>

          {/* RIGHT: Stacked Typography */}
          <div className="space-y-16 order-1 lg:order-2">
            
            {/* Hero Title - Huge breathing room */}
            <div 
              className="opacity-0 animate-[fade-in_0.45s_ease-out_0.1s_forwards]" 
              style={{ 
                marginTop: "max(14vh, 2rem)", 
                marginBottom: "max(8vh, 2rem)",
                maxWidth: "70ch" 
              }}
            >
              <div className="space-y-4 text-center lg:text-left">
                {/* CHEMISTRY */}
                <h1 
                  className="text-6xl xl:text-8xl font-display font-medium tracking-tight leading-none"
                  style={{
                    letterSpacing: "-1%",
                    fontWeight: 500,
                  }}
                >
                  <div 
                    className="relative"
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 50%, #d1d5db 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 0 20px rgba(229, 231, 235, 0.3)'
                    }}
                  >
                    {/* CHEM + ISTRY with morphing I */}
                    <span>CHEM</span>
                    <span className={`i-slot ${iAsTower ? 'on' : ''}`}>
                      <span 
                        className="i-layer i-text"
                        style={{
                          background: 'linear-gradient(135deg, #c084fc 0%, #e879f9 50%, #f0abfc 100%)',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          textShadow: '0 0 25px rgba(192, 132, 252, 0.6)'
                        }}
                      >
                        I
                      </span>
                      <span className="i-layer i-tower">
                        <svg width="0.35em" height="0.92em" viewBox="0 0 35 92" style={{verticalAlign: 'baseline'}}>
                          {/* Campanile with light purple gradient */}
                          <defs>
                            <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#c084fc" />
                              <stop offset="50%" stopColor="#e879f9" />
                              <stop offset="100%" stopColor="#f0abfc" />
                            </linearGradient>
                          </defs>
                          <rect x="12" y="68" width="11" height="8" fill="url(#purpleGradient)" />
                          <rect x="12" y="25" width="11" height="43" fill="url(#purpleGradient)" />
                          <rect x="10" y="13" width="15" height="12" fill="url(#purpleGradient)" />
                          <path d="M 12 17 Q 14 14 16 17 L 16 22 L 12 22 Z" fill="rgba(0,0,0,0.4)" />
                          <path d="M 17 17 Q 19 14 21 17 L 21 22 L 17 22 Z" fill="rgba(0,0,0,0.4)" />
                          <path d="M 22 17 Q 24 14 26 17 L 26 22 L 22 22 Z" fill="rgba(0,0,0,0.4)" />
                          <rect x="13" y="15" width="1.5" height="3" fill="rgba(0,0,0,0.3)" />
                          <rect x="16" y="15" width="1.5" height="3" fill="rgba(0,0,0,0.3)" />
                          <rect x="19" y="15" width="1.5" height="3" fill="rgba(0,0,0,0.3)" />
                          <rect x="22" y="15" width="1.5" height="3" fill="rgba(0,0,0,0.3)" />
                          <rect x="9" y="11" width="17" height="2" fill="url(#purpleGradient)" />
                          <polygon points="17.5,2 26,11 9,11" fill="url(#purpleGradient)" />
                        </svg>
                      </span>
                    </span>
                    <span>STRY</span>
                  </div>
                </h1>
                
                {/* FELLOWS with purple glow behind */}
                <h1 
                  className="text-6xl xl:text-8xl font-display font-medium tracking-tight leading-none relative"
                  style={{
                    letterSpacing: "-1%",
                    fontWeight: 500,
                    background: 'linear-gradient(135deg, #ffffff 0%, #9ca3af 50%, #6b7280 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 30px rgba(156, 163, 175, 0.5)',
                    marginTop: '10px',
                    display: 'block'
                  }}
                >
                  {/* Purple glow behind */}
                  <div 
                    className="absolute inset-0 -z-10"
                    style={{
                      background: 'radial-gradient(ellipse 120% 80% at 50% 50%, hsl(var(--electric-purple) / 0.15) 0%, transparent 60%)',
                      filter: 'blur(40px)',
                    }}
                  />
                  FELLOWS
                </h1>
              </div>
            </div>

            {/* Terminal Lines */}
            <div className="space-y-6 opacity-0 animate-[fade-in_0.8s_ease-out_0.6s_forwards]">
              
              {/* First terminal line */}
              <div 
                className="font-mono text-lg leading-relaxed text-center lg:text-left" 
                style={{ lineHeight: 1.6, maxWidth: "70ch" }}
              >
                <span className="text-acid-green mr-3">{">"}</span>
                <span className="text-soft-gray">
                  A year-long fellowship for Berkeley's top{" "}
                  <span className="text-white font-medium relative inline-block min-w-[160px] text-left">
                    {typingText}
                    <span 
                      className="animate-pulse ml-0.5" 
                      style={{ 
                        color: 'hsl(var(--acid-green))',
                        animationDuration: '1s' 
                      }}
                    >
                      |
                    </span>
                  </span>
                </span>
              </div>

              {/* Second terminal line */}
              <div
                className="font-mono text-lg leading-relaxed cursor-pointer transition-colors hover:text-white/90 text-center lg:text-left"
                style={{ lineHeight: 1.6, maxWidth: "70ch" }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <span className="text-acid-green mr-3">{">"}</span>
                <span className="text-soft-gray">
                  Backed by the investors behind{" "}
                  <span className="text-white">
                    {companyGroups[currentGroup].join(", ")}
                  </span>
                  .
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="opacity-0 animate-[fade-in_0.8s_ease-out_0.8s_forwards] text-center lg:text-left">
              <Button
                size="xl"
                className="px-12 py-6 text-lg font-bold bg-gradient-green-cta border-0 rounded-full text-black hover:scale-105 transform transition-all duration-300 shadow-green-glow hover:shadow-button-glow"
                onClick={() => window.open("https://form.typeform.com/to/vMxYsW4Y", "_blank")}
              >
                APPLY
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-6 text-center">
        <div className="text-xs font-mono text-soft-gray/60">CHEMISTRY VC © 2025</div>
      </footer>
    </div>
  );
}
