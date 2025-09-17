// src/components/ChemistryHero.tsx
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, memo, useMemo } from "react";

/* --------------------------- THREE: 3D Chemistry C --------------------------- */
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Chemistry logo C shape */
const CMesh = memo(function CMesh() {
  const geom = useMemo(() => {
    const s = new THREE.Shape();
    
    // Create a C shape using curves
    const outerRadius = 2.5;
    const innerRadius = 1.5;
    const angle = Math.PI * 0.75; // 135 degrees opening
    
    // Outer arc
    s.arc(0, 0, outerRadius, -angle/2, angle/2, false);
    
    // Top flat section
    s.lineTo(outerRadius * Math.cos(angle/2) - 0.5, outerRadius * Math.sin(angle/2));
    s.lineTo(innerRadius * Math.cos(angle/2) - 0.5, innerRadius * Math.sin(angle/2));
    
    // Inner arc (reverse direction)
    s.arc(0, 0, innerRadius, angle/2, -angle/2, true);
    
    // Bottom flat section
    s.lineTo(innerRadius * Math.cos(-angle/2) - 0.5, innerRadius * Math.sin(-angle/2));
    s.lineTo(outerRadius * Math.cos(-angle/2) - 0.5, outerRadius * Math.sin(-angle/2));
    
    s.closePath();

    const g = new THREE.ExtrudeGeometry(s, {
      depth: 1.2,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.03,
      bevelSegments: 2,
    });
    g.center();
    return g;
  }, []);

  return (
    <mesh geometry={geom} castShadow receiveShadow>
      <meshStandardMaterial color="#2563EB" metalness={0.15} roughness={0.35} />
    </mesh>
  );
});

/** Interactive rotating C with mouse controls */
function RotatingC() {
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
      scale={[0.6, -0.6, 0.6]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <CMesh />
    </group>
  );
}

/** Top artwork: standalone 3D C above the wordmark */
const HeroC3D = memo(function HeroC3D() {
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
        <RotatingC />
      </Canvas>
    </div>
  );
});

/* --------------------------------- Hero --------------------------------- */

export function ChemistryHero() {
  const companyGroups = [
    ["Moderna", "Ginkgo", "Zymergen"],
    ["Recursion", "Insitro", "Relay"],
    ["Synthetic", "Benchling", "Twist"],
    ["Corteva", "Syngenta", "BASF"],
    ["Dow Chemical", "DuPont", "3M"],
    ["Merck", "Pfizer", "Roche"],
  ];
  const descriptions = ["chemists.", "scientists.", "researchers.", "innovators."];

  const [currentGroup, setCurrentGroup] = useState(0);
  const [currentDescription, setCurrentDescription] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cAsMolecule, setCAsMovie] = useState(false);
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

  // morph C
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = setInterval(() => setCAsMovie((v) => !v), 6000);
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
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-[#2563EB]/10 opacity-40" />
      <div className="absolute inset-0 opacity-[0.03] bg-noise" />

      <div className="max-w-2xl mx-auto px-8 py-16 md:py-20 text-center relative z-10">
        {/* 3D C artwork ABOVE the wordmark */}
        <HeroC3D />

        <div className="mb-8 opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
          <h1
            className="text-5xl md:text-7xl font-display font-semibold tracking-tight leading-tight"
            style={{
              display: "inline-block",
              transform: `rotateX(${-mousePosition.y * 0.45}deg) rotateY(${mousePosition.x * 0.45}deg) translateZ(18px)`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* CHEMISTRY with enhanced 3D effects */}
            <div 
              className="text-white"
              style={{
                textShadow: `
                  0 1px 0 rgba(255,255,255,0.3),
                  0 2px 0 rgba(255,255,255,0.2),
                  0 3px 0 rgba(0,0,0,0.1),
                  0 4px 2px rgba(0,0,0,0.2),
                  0 6px 4px rgba(0,0,0,0.3),
                  0 8px 8px rgba(0,0,0,0.4),
                  0 12px 16px rgba(0,0,0,0.3),
                  ${mousePosition.x * 0.8}px ${mousePosition.y * 0.8}px 20px rgba(0,0,0,0.4)
                `,
                filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.5))',
                transform: `translateZ(12px) rotateX(${mousePosition.y * 0.2}deg) rotateY(${mousePosition.x * 0.2}deg)`,
              }}
            >
              {/* C + HEMISTRY with morphing H */}
              <span>C</span>
              <span className={`i-slot ${cAsMolecule ? 'on' : ''}`}>
                <span className="i-layer i-text">H</span>
                <span className="i-layer i-tower">
                  <svg width="0.35em" height="0.92em" viewBox="0 0 35 92" fill="currentColor" style={{verticalAlign: 'baseline'}}>
                    {/* Molecular structure with H-C bonds */}
                    
                    {/* Central carbon atom */}
                    <circle cx="17.5" cy="46" r="4" fill="currentColor" />
                    
                    {/* Hydrogen atoms positioned around carbon */}
                    <circle cx="8" cy="30" r="2.5" fill="currentColor" />
                    <circle cx="27" cy="30" r="2.5" fill="currentColor" />
                    <circle cx="8" cy="62" r="2.5" fill="currentColor" />
                    <circle cx="27" cy="62" r="2.5" fill="currentColor" />
                    
                    {/* Bonds connecting atoms */}
                    <line x1="17.5" y1="46" x2="8" y2="30" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="17.5" y1="46" x2="27" y2="30" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="17.5" y1="46" x2="8" y2="62" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="17.5" y1="46" x2="27" y2="62" stroke="currentColor" strokeWidth="1.5" />
                    
                    {/* Atom labels */}
                    <text x="8" y="30" fontSize="6" fill="white" textAnchor="middle" dy="2">H</text>
                    <text x="27" y="30" fontSize="6" fill="white" textAnchor="middle" dy="2">H</text>
                    <text x="17.5" y="46" fontSize="6" fill="white" textAnchor="middle" dy="2">C</text>
                    <text x="8" y="62" fontSize="6" fill="white" textAnchor="middle" dy="2">H</text>
                    <text x="27" y="62" fontSize="6" fill="white" textAnchor="middle" dy="2">H</text>
                  </svg>
                </span>
              </span>
              <span>EMISTRY</span>
            </div>
            {/* FELLOWS with grey color and glow */}
            <div 
              className="text-gray-400"
              style={{
                textShadow: `
                  0 1px 0 rgba(255,255,255,0.1),
                  0 2px 4px rgba(156, 163, 175, 0.4),
                  0 4px 8px rgba(156, 163, 175, 0.3),
                  0 8px 16px rgba(156, 163, 175, 0.2)
                `,
                filter: 'drop-shadow(0 4px 8px rgba(156, 163, 175, 0.3))',
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
            {">"} A year-long fellowship for Berkeley's top{" "}
            <span className="text-white font-medium relative inline-block min-w-[160px] text-left">
              {typingText}
              <span className="animate-pulse ml-0.5 text-[#2563EB]">|</span>
            </span>
          </div>
          <div
            className="text-base font-mono text-white/60 tracking-wide cursor-pointer transition-colors hover:text-white/80"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {">"} Backed by investors behind{" "}
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
            className="w-56 mx-auto py-4 text-base font-bold text-white border border-[#2563EB]/40 rounded-full bg-[#2563EB]/35 backdrop-blur-xl hover:bg-[#2563EB]/55 hover:border-[#2563EB]/70 hover:text-white hover:shadow-[0_0_30px_rgba(37,99,235,0.8)] hover:scale-105 transform transition-all duration-300"
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
        <div className="text-xs font-mono text-white/40">CHEMISTRY © 2025</div>
      </footer>
    </div>
  );
}
