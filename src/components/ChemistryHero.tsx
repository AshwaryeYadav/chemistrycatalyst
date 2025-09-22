// src/components/LightspeedHero.tsx
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, memo, useMemo } from "react";

/* --------------------------- THREE: 3D Campanile --------------------------- */
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Loading Bar with Bouncing Segments */
const FrostedColumn = memo(function FrostedColumn() {
  const groupRef = useRef<THREE.Group>(null);
  const segment1Ref = useRef<THREE.Mesh>(null);
  const segment2Ref = useRef<THREE.Mesh>(null);
  const segment3Ref = useRef<THREE.Mesh>(null);
  
  const segmentGeometry = useMemo(() => {
    // Long, skinny rectangular segments
    return new THREE.BoxGeometry(1.5, 0.4, 0.4);
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Animation cycle: 4 seconds total
    const cycle = (time % 4.0) / 4.0;
    
    if (cycle < 0.6) {
      // Phase 1: Bouncing segments (0-2.4s)
      const bounceTime = cycle * 6.67; // Scale to make bouncing faster
      
      if (segment1Ref.current) {
        const bounce1 = Math.sin(bounceTime * 2) * 0.3;
        segment1Ref.current.position.set(-2.0, bounce1, 0);
      }
      
      if (segment2Ref.current) {
        const bounce2 = Math.sin((bounceTime - 0.3) * 2) * 0.3;
        segment2Ref.current.position.set(0, bounce2, 0);
      }
      
      if (segment3Ref.current) {
        const bounce3 = Math.sin((bounceTime - 0.6) * 2) * 0.3;
        segment3Ref.current.position.set(2.0, bounce3, 0);
      }
    } else if (cycle < 0.8) {
      // Phase 2: Join together (2.4-3.2s)
      const joinProgress = (cycle - 0.6) / 0.2;
      const easeJoin = 1 - Math.pow(1 - joinProgress, 3);
      
      if (segment1Ref.current) {
        const yPos = (1 - easeJoin) * (Math.sin((cycle - 0.6) * 20) * 0.3);
        segment1Ref.current.position.set(-2.0, yPos, 0);
      }
      
      if (segment2Ref.current) {
        const yPos = (1 - easeJoin) * (Math.sin((cycle - 0.6 - 0.3) * 20) * 0.3);
        segment2Ref.current.position.set(0, yPos, 0);
      }
      
      if (segment3Ref.current) {
        const yPos = (1 - easeJoin) * (Math.sin((cycle - 0.6 - 0.6) * 20) * 0.3);
        segment3Ref.current.position.set(2.0, yPos, 0);
      }
    } else {
      // Phase 3: Rotate as one unit (3.2-4s)
      if (segment1Ref.current) segment1Ref.current.position.set(-2.0, 0, 0);
      if (segment2Ref.current) segment2Ref.current.position.set(0, 0, 0);
      if (segment3Ref.current) segment3Ref.current.position.set(2.0, 0, 0);
      
      if (groupRef.current) {
        const rotateProgress = (cycle - 0.8) / 0.2;
        groupRef.current.rotation.x = rotateProgress * Math.PI * 2;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Green segment */}
      <mesh 
        ref={segment1Ref} 
        geometry={segmentGeometry} 
        position={[-2.0, 0, 0]} 
        castShadow 
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#99f859" // Bright green
          transparent={true}
          opacity={0.85}
          roughness={0.8}
          metalness={0.2}
          transmission={0.4}
          thickness={0.3}
          clearcoat={0.4}
          clearcoatRoughness={0.6}
          emissive="#99f859"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Purple segment */}
      <mesh 
        ref={segment2Ref} 
        geometry={segmentGeometry} 
        position={[0, 0, 0]} 
        castShadow 
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#7459f8" // Regular purple
          transparent={true}
          opacity={0.85}
          roughness={0.8}
          metalness={0.2}
          transmission={0.4}
          thickness={0.3}
          clearcoat={0.4}
          clearcoatRoughness={0.6}
          emissive="#7459f8"
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Soft purple segment */}
      <mesh 
        ref={segment3Ref} 
        geometry={segmentGeometry} 
        position={[2.0, 0, 0]} 
        castShadow 
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#c6e2ff" // Soft purple
          transparent={true}
          opacity={0.85}
          roughness={0.8}
          metalness={0.2}
          transmission={0.4}
          thickness={0.3}
          clearcoat={0.4}
          clearcoatRoughness={0.6}
          emissive="#c6e2ff"
          emissiveIntensity={0.06}
        />
      </mesh>

      {/* Glow lights for each segment */}
      <pointLight
        position={[-2.0, 0, 0]}
        color="#99f859"
        intensity={0.4}
        distance={3}
      />
      <pointLight
        position={[0, 0, 0]}
        color="#7459f8"
        intensity={0.4}
        distance={3}
      />
      <pointLight
        position={[2.0, 0, 0]}
        color="#c6e2ff"
        intensity={0.3}
        distance={3}
      />
    </group>
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
      group.current.rotation.x += dt * 0.5; // X-axis rotation for frosted column
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

    group.current.rotation.x += deltaMove.y * 0.01;
    group.current.rotation.z += deltaMove.x * 0.01;
    
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
      <FrostedColumn />
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
                    {/* Gradient definitions */}
                    <defs>
                      <linearGradient id="campanileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--campanile-gradient-start))" />
                        <stop offset="100%" stopColor="hsl(var(--campanile-gradient-end))" />
                      </linearGradient>
                    </defs>
                    
                    {/* Campanile with base aligned to text baseline - light purple to green gradient */}
                    
                    {/* Base - positioned at text baseline level */}
                    <rect x="12" y="68" width="11" height="8" fill="url(#campanileGradient)" />
                    
                    {/* Main tower shaft - shortened */}
                    <rect x="12" y="25" width="11" height="43" fill="url(#campanileGradient)" />
                    
                    {/* Upper belfry section */}
                    <rect x="10" y="13" width="15" height="12" fill="url(#campanileGradient)" />
                    
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
                    <rect x="9" y="11" width="17" height="2" fill="url(#campanileGradient)" />
                    
                    {/* Detailed spire */}
                    <polygon points="17.5,2 26,11 9,11" fill="url(#campanileGradient)" />
                  </svg>
                </span>
              </span>
              <span>STRY</span>
            </div>
            {/* FELLOWS with teal-blue glow */}
            <div 
              className="text-white bg-gradient-fellows-glow bg-clip-text"
              style={{
                textShadow: `var(--shadow-fellows-text)`,
                filter: 'drop-shadow(0 0 15px rgba(20, 184, 166, 0.3))',
                transform: 'translateZ(8px)',
                marginTop: '-0.2em'
              }}
            >
              FELLOWS
            </div>
          </h1>
        </div>

        {/* body */}
        <div className="mb-12 opacity-0 animate-[fade-in_0.8s_ease-out_0.6s_forwards] space-y-4">
          <div className="text-lg font-mono text-white/90 leading-relaxed tracking-wide">
            <span style={{ color: 'hsl(96, 92%, 66%)' }}>{">"}</span> A year-long fellowship for Berkeley's top{" "}
            <span className="text-white font-medium relative inline-block min-w-[160px] text-left">
              {typingText}
              <span style={{ color: 'hsl(96, 92%, 66%)' }} className="animate-pulse ml-0.5">|</span>
            </span>
          </div>
          <div
            className="text-base font-mono text-white/60 tracking-wide cursor-pointer transition-colors hover:text-white/80"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <span style={{ color: 'hsl(96, 92%, 66%)' }}>{">"}</span> Backed by investors behind{" "}
            <span className="inline-block transition-all duration-500 ease-in-out transform whitespace-nowrap">
              <span className="text-white font-medium">{companyGroups[currentGroup][0]}</span>
              {", "}
              <span className="text-white font-medium">{companyGroups[currentGroup][1]}</span>
              {", "}
              <span className="text-white font-medium">{companyGroups[currentGroup][2]}</span>
            </span>
            .
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
