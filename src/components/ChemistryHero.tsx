// src/components/LightspeedHero.tsx
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
      group.current.rotation.y += dt * 0.25;
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
      scale={[0.6, 0.6, 0.6]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <CampanileMesh />
    </group>
  );
}

/** Top artwork: standalone 3D Campanile above the wordmark */
const HeroCampanile3D = memo(function HeroCampanile3D() {
  return (
    <div
      className="mx-auto mb-6 md:mb-8"
      style={{
        width: "320px",
        height: "280px",
        // Much larger container for seamless rotation without clipping
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
  );
});

/* --------------------------------- Hero --------------------------------- */

export function ChemistryHero() {
  const companyGroups = [
    ["Moderna", "Ginkgo Bioworks", "Platform.sh"],
    ["Recursion", "Benchling", "Zymergen"],
    ["Twist Bioscience", "Synthace", "TeselaGen"],
    ["Emerald Cloud Lab", "Strateos", "Transcriptic"],
    ["Zymeworks", "AbCellera", "Adimab"],
    ["Gensyn", "Labguru", "Science Exchange"],
  ];
  const descriptions = ["scientists.", "founders.", "researchers.", "innovators."];

  const [currentGroup, setCurrentGroup] = useState(0);
  const [currentDescription, setCurrentDescription] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [iAsTower, setIAsTower] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Terminal typing states
  const [terminalLine1, setTerminalLine1] = useState("");
  const [terminalLine2, setTerminalLine2] = useState("");
  const [showCursor1, setShowCursor1] = useState(true);
  const [showCursor2, setShowCursor2] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const fullLine1 = "> A year-long fellowship for Berkeley's top ";
  const fullLine2 = "> Backed by investors behind ";

  // Terminal typing animations
  useEffect(() => {
    let timeout1: NodeJS.Timeout;
    
    if (terminalLine1.length < fullLine1.length) {
      timeout1 = setTimeout(() => {
        setTerminalLine1(fullLine1.substring(0, terminalLine1.length + 1));
      }, 50);
    } else {
      setShowCursor1(false);
      
      // Start second line after first is complete
      let timeout2: NodeJS.Timeout;
      if (terminalLine2.length < fullLine2.length) {
        setShowCursor2(true);
        timeout2 = setTimeout(() => {
          setTerminalLine2(fullLine2.substring(0, terminalLine2.length + 1));
        }, 80);
      } else {
        setShowCursor2(false);
      }
      
      return () => clearTimeout(timeout2);
    }
    
    return () => clearTimeout(timeout1);
  }, [terminalLine1, terminalLine2, fullLine1, fullLine2]);

  // cycles
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(
      () => setCurrentGroup((p) => (p + 1) % companyGroups.length),
      2400
    );
    return () => clearInterval(id);
  }, [isPaused, companyGroups.length]);

  // Typing animation effect
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
      }, 80);
    } else {
      if (typingText === currentWord) {
        timeout = setTimeout(() => setIsDeleting(true), 2000);
      } else {
        timeout = setTimeout(() => {
          setTypingText(currentWord.substring(0, typingText.length + 1));
        }, 120);
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

  // mouse tilt (subtle 3D feel on the whole wordmark)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) / r.width;
      const y = (e.clientY - r.top - r.height / 2) / r.height;
      setMousePosition({ x: x * 20, y: y * 20 });
    };
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // morph I
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = setInterval(() => setIAsTower((v) => !v), 6000);
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
        transition: opacity .32s cubic-bezier(.2,.7,.2,1),
                    transform .38s cubic-bezier(.3,.7,.2,1);
      }
      .i-text  { opacity:1;  transform: translateY(0)    scale(1); }
      .i-tower { opacity:0;  transform: translateY(3%)   scale(.985) translateX(var(--towerNudgeX)); }
      .i-slot.on .i-text  { opacity:0; transform: translateY(-3%)  scale(.985); }
      .i-slot.on .i-tower { opacity:1; transform: translateY(0%)   scale(1)    translateX(var(--towerNudgeX)); }
      @media (prefers-reduced-motion: reduce){
        .i-layer{ transition:opacity .2s ease !important; transform:none !important; }
      }
      
      @keyframes subtle-pulse {
        0%, 100% { 
          opacity: 1;
          transform: scale(1);
        }
        50% { 
          opacity: 0.85;
          transform: scale(1.02);
        }
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-hero flex items-center justify-center relative overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-[#ED6C5C]/10 opacity-40" />
      <div className="absolute inset-0 opacity-[0.03] bg-noise" />

      <div className="max-w-2xl mx-auto px-8 py-16 md:py-20 text-center relative z-10">
        {/* 3D Campanile artwork ABOVE the wordmark */}
        <HeroCampanile3D />

        <div className="mb-8 opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
          <h1
            className="text-5xl md:text-7xl font-display font-semibold tracking-tight leading-tight"
            style={{
              display: "inline-block",
              transform: `rotateX(${-mousePosition.y * 0.45}deg) rotateY(${mousePosition.x * 0.45}deg) translateZ(18px)`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* CHEMISTRY with purple-white glow */}
            <div 
              className="text-white bg-gradient-chemistry-glow bg-clip-text"
              style={{
                textShadow: `var(--shadow-chemistry-text)`,
                filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.3))',
                transform: `translateZ(12px) rotateX(${mousePosition.y * 0.2}deg) rotateY(${mousePosition.x * 0.2}deg)`,
              }}
            >
              {/* CHEM + ISTRY with morphing I */}
              <span>CHEM</span>
              <span className={`i-slot ${iAsTower ? 'on' : ''}`}>
                <span className="i-layer i-text">I</span>
                <span className="i-layer i-tower">
                  <svg width="0.35em" height="0.92em" viewBox="0 0 35 92" style={{verticalAlign: 'baseline'}}>
                    {/* Campanile with base aligned to text baseline - teal color */}
                    
                    {/* Base - positioned at text baseline level */}
                    <rect x="12" y="68" width="11" height="8" fill="hsl(180, 75%, 55%)" />
                    
                    {/* Main tower shaft - shortened */}
                    <rect x="12" y="25" width="11" height="43" fill="hsl(180, 75%, 55%)" />
                    
                    {/* Upper belfry section */}
                    <rect x="10" y="13" width="15" height="12" fill="hsl(180, 75%, 55%)" />
                    
                    {/* Gothic arched openings */}
                    <path d="M 12 17 Q 14 14 16 17 L 16 22 L 12 22 Z" fill="rgba(0,0,0,0.4)" />
                    <path d="M 17 17 Q 19 14 21 17 L 21 22 L 17 22 Z" fill="rgba(0,0,0,0.4)" />
                    <path d="M 22 17 Q 24 14 26 17 L 26 22 L 22 22 Z" fill="rgba(0,0,0,0.4)" />
                    
                    {/* Small upper windows */}
                    <rect x="13" y="15" width="1.5" height="3" fill="rgba(0,0,0,0.3)" />
                    <rect x="16" y="15" width="1.5" height="3" fill="rgba(0,0,0,0.3)" />
                    <rect x="19" y="15" width="1.5" height="3" fill="rgba(0,0,0,0.3)" />
                    <rect x="22" y="15" width="1.5" height="3" fill="rgba(0,0,0,0.3)" />
                    
                    {/* Crown/cornice */}
                    <rect x="9" y="11" width="17" height="2" fill="hsl(180, 75%, 55%)" />
                    
                    {/* Detailed spire */}
                    <polygon points="17.5,2 26,11 9,11" fill="hsl(180, 75%, 55%)" />
                  </svg>
                </span>
              </span>
              <span>STRY</span>
            </div>
            {/* FELLOWS with enhanced glow */}
            <div 
              className="text-white bg-gradient-fellows-glow bg-clip-text relative"
              style={{
                textShadow: `var(--shadow-fellows-text)`,
                filter: 'drop-shadow(0 0 15px rgba(20, 184, 166, 0.3))',
                transform: 'translateZ(8px)',
                marginTop: '-0.2em'
              }}
            >
              {/* Background glow layer */}
              <div 
                className="absolute inset-0 text-transparent bg-gradient-fellows-glow bg-clip-text blur-md scale-110 opacity-60"
                style={{
                  filter: 'blur(8px)',
                  zIndex: -1
                }}
              >
                FELLOWS
              </div>
              FELLOWS
            </div>
          </h1>
        </div>

        {/* body */}
        <div className="mb-12 opacity-0 animate-[fade-in_0.8s_ease-out_0.6s_forwards] space-y-4">
          <div className="text-lg font-mono text-white/90 leading-relaxed tracking-wide">
            <span className="inline-block">{terminalLine1}</span>
            {showCursor1 && <span className="typing-cursor text-chemistry-teal">█</span>}
            {!showCursor1 && (
              <span className="text-white font-medium relative inline-block min-w-[160px] text-left">
                {typingText}
                <span className="typing-cursor ml-0.5 text-chemistry-blue">█</span>
              </span>
            )}
          </div>
          <div
            className="text-base font-mono text-white/60 tracking-wide cursor-pointer transition-colors hover:text-white/80"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <span className="inline-block">{terminalLine2}</span>
            {showCursor2 && <span className="typing-cursor text-chemistry-teal">█</span>}
            {!showCursor2 && terminalLine2.length === fullLine2.length && (
              <span className="inline-block transition-all duration-500 ease-in-out transform whitespace-nowrap">
                <span className="text-white font-medium">{companyGroups[currentGroup][0]}</span>
                {", "}
                <span className="text-white font-medium">{companyGroups[currentGroup][1]}</span>
                {", "}
                <span className="text-white font-medium">{companyGroups[currentGroup][2]}</span>
                .
              </span>
            )}
          </div>
        </div>

        <div className="opacity-0 animate-[fade-in_0.8s_ease-out_0.8s_forwards]">
          <Button
            size="xl"
            className="w-56 mx-auto py-4 text-base font-bold text-white border border-[#1e40af]/40 rounded-full bg-[#1e40af]/35 backdrop-blur-xl hover:bg-[#1e40af]/55 hover:border-[#1e40af]/70 hover:text-white hover:shadow-[0_0_30px_rgba(30,64,175,0.8)] hover:scale-105 transform transition-all duration-300"
            style={{
              animation: 'subtle-pulse 3s ease-in-out infinite'
            }}
            onClick={() => window.open("https://form.typeform.com/to/vMxYsW4Y", "_blank")}
          >
            APPLY
          </Button>
        </div>
      </div>

      <footer className="absolute bottom-0 left-0 right-0 p-6 text-center">
        <div className="text-xs font-mono text-white/40">CHEMISTRY VC © 2025</div>
      </footer>
    </div>
  );
}
