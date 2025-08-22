// src/components/LightspeedHero.tsx
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, memo, useMemo } from "react";

/* --------------------------- THREE: 3D Lightspeed L --------------------------- */
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Lightspeed logo L with diagonal cut corners */
const LMesh = memo(function LMesh() {
  const geom = useMemo(() => {
    const s = new THREE.Shape();
    // L shape matching the reference - proper cuts
    s.moveTo(-2, 2);           // Top left
    s.lineTo(-1, 3);           // Diagonal cut top left  
    s.lineTo(0, 3);            // Top right of vertical stem
    s.lineTo(0, 0);            // Down to corner junction
    s.lineTo(3, 0);            // Right across horizontal foot
    s.lineTo(3, -2);           // Straight down (no diagonal)
    s.lineTo(1, -2);           // Left to start triangle cut
    s.lineTo(0, -1);           // Triangle point
    s.lineTo(-2, -2);          // Bottom left
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
      <meshStandardMaterial color="#ED6C5C" metalness={0.15} roughness={0.35} />
    </mesh>
  );
});

/** Rotator lives *inside* <Canvas>, so we can safely use useFrame */
function RotatingL() {
  const group = useRef<THREE.Group>(null!);
  useFrame((_s, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.25;
  });
  return (
    <group ref={group} scale={0.6}>
      <LMesh />
    </group>
  );
}

/** Top artwork: standalone 3D L above the wordmark */
const HeroL3D = memo(function HeroL3D() {
  return (
    <div
      className="mx-auto mb-6 md:mb-8 pointer-events-none"
      style={{
        width: "180px",
        height: "180px",
        // Compact container with distant camera to prevent clipping
      }}
      aria-hidden
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [5.5, 4.0, 8.0], fov: 25 }}
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
        <RotatingL />
      </Canvas>
    </div>
  );
});

/* --------------------------------- Hero --------------------------------- */
export function LightspeedHero() {
  const companyGroups = [
    ["Stripe", "Anthropic", "Anduril"],
    ["Wiz", "Glean", "Rubrik"],
    ["Anduril", "Rubrik", "Mulesoft"],
    ["Snap", "Mulesoft", "Nest"],
    ["AppDynamics", "Nutanix", "UiPath"],
    ["Affirm", "MindBody", "Nicira"],
  ];
  const descriptions = ["builders", "founders", "engineers", "hackers"];

  const [currentGroup, setCurrentGroup] = useState(0);
  const [currentDescription, setCurrentDescription] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [iAsTower, setIAsTower] = useState(false);
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

  useEffect(() => {
    const id = setInterval(
      () => setCurrentDescription((p) => (p + 1) % descriptions.length),
      3600
    );
    return () => clearInterval(id);
  }, [descriptions.length]);

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
        --iBaseline: 0em;
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
        {/* 3D L artwork ABOVE the wordmark */}
        <HeroL3D />

        <div className="mb-8 opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
          <h1
            className="text-5xl md:text-7xl font-display font-semibold tracking-tight leading-tight text-white"
            style={{
              display: "inline-block",
              transform: `rotateX(${-mousePosition.y * 0.45}deg) rotateY(${mousePosition.x * 0.45}deg) translateZ(18px)`,
              textShadow: `
                0 1px 0 rgba(255,255,255,0.1),
                0 2px 4px rgba(0,0,0,0.35),
                ${mousePosition.x * 0.5}px ${mousePosition.y * 0.5}px 14px rgba(0,0,0,0.25)
              `,
              transformStyle: "preserve-3d",
            }}
          >
            {/* L + IGHTSPEED with morphing I */}
            <span>L</span>
            <span className={`i-slot ${iAsTower ? 'on' : ''}`}>
              <span className="i-layer i-text">I</span>
              <span className="i-layer i-tower">
                <svg width="0.35em" height="0.92em" viewBox="0 0 35 92" fill="currentColor">
                  {/* Berkeley Sather Tower (Campanile) structure */}
                  
                  {/* Base/foundation - wider and more substantial */}
                  <rect x="6" y="78" width="23" height="14" fill="currentColor" />
                  
                  {/* Main tower shaft - tall and elegant */}
                  <rect x="12" y="20" width="11" height="58" fill="currentColor" />
                  
                  {/* Clock/belfry section - distinctive Berkeley style */}
                  <rect x="8" y="12" width="19" height="8" fill="currentColor" />
                  
                  {/* Arched openings in belfry - Gothic style */}
                  <path d="M 10 14 Q 12 12 14 14 L 14 18 L 10 18 Z" fill="rgba(0,0,0,0.4)" />
                  <path d="M 15.5 14 Q 17.5 12 19.5 14 L 19.5 18 L 15.5 18 Z" fill="rgba(0,0,0,0.4)" />
                  <path d="M 21 14 Q 23 12 25 14 L 25 18 L 21 18 Z" fill="rgba(0,0,0,0.4)" />
                  
                  {/* Clock face - centered */}
                  <circle cx="17.5" cy="16" r="2.5" fill="rgba(255,255,255,0.9)" />
                  <circle cx="17.5" cy="16" r="0.3" fill="currentColor" />
                  
                  {/* Crown/cornice */}
                  <rect x="6" y="10" width="23" height="2" fill="currentColor" />
                  
                  {/* Pointed spire - Berkeley style pyramid */}
                  <polygon points="17.5,2 28,10 7,10" fill="currentColor" />
                  
                  {/* Finial/lightning rod */}
                  <rect x="17" y="0" width="1" height="4" fill="currentColor" />
                </svg>
              </span>
            </span>
            <span>GHTSPEED</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              FELLOWS
            </span>
          </h1>
        </div>

        {/* body */}
        <div className="mb-12 opacity-0 animate-[fade-in_0.8s_ease-out_0.6s_forwards] space-y-4">
          <div className="text-lg font-mono text-white/90 leading-relaxed tracking-wide">
            {">"} A year-long fellowship for Berkeley's top{" "}
            <span className="text-white font-medium">{descriptions[currentDescription]}</span>.
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
            className="w-56 mx-auto py-4 text-base font-semibold text-white border border-white/15 rounded-full backdrop-blur-lg bg-white/5 hover:bg-white/10 transition-all"
            onClick={() => window.open("https://form.typeform.com/to/vMxYsW4Y", "_blank")}
          >
            APPLY
          </Button>
        </div>
      </div>

      <footer className="absolute bottom-0 left-0 right-0 p-6 text-center">
        <div className="text-xs font-mono text-white/40">LIGHTSPEED © 2025</div>
      </footer>
    </div>
  );
}
