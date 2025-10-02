// src/components/ChemistryHero.tsx
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, memo, useMemo } from "react";

/* --------------------------- THREE: 3D Campanile --------------------------- */
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Animated Ellipses - Chemistry Logo Style with Loading Animation */
const AnimatedEllipses = memo(function AnimatedEllipses({ isDragging }: { isDragging: boolean }) {
  const blueRef = useRef<THREE.Mesh>(null);
  const lavenderRef = useRef<THREE.Mesh>(null);
  const greenRef = useRef<THREE.Mesh>(null);
  
  // Optimized geometries with reduced segments for better performance
  const blueGeometry = useMemo(() => new THREE.BoxGeometry(1.2, 1, 0.4, 16, 16, 16), []);
  const lavenderGeometry = useMemo(() => new THREE.BoxGeometry(1.2, 1, 0.4, 16, 16, 16), []);
  const greenGeometry = useMemo(() => new THREE.BoxGeometry(1.8, 1, 0.4, 16, 16, 16), []);
  
  // Memoized materials for better performance
  const blueMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color("hsl(235, 75%, 45%)"),
    transparent: true,
    opacity: 0.95,
    roughness: 0.3,
    metalness: 0.3,
    emissive: new THREE.Color("hsl(235, 75%, 45%)"),
    emissiveIntensity: 0.3,
  }), []);
  
  const lavenderMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color("hsl(260, 50%, 70%)"),
    transparent: true,
    opacity: 0.95,
    roughness: 0.3,
    metalness: 0.3,
    emissive: new THREE.Color("hsl(260, 50%, 70%)"),
    emissiveIntensity: 0.3,
  }), []);
  
  const greenMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color("hsl(85, 95%, 65%)"),
    transparent: true,
    opacity: 0.95,
    roughness: 0.3,
    metalness: 0.3,
    emissive: new THREE.Color("hsl(85, 95%, 65%)"),
    emissiveIntensity: 0.3,
  }), []);
  
  const startTimeRef = useRef<number | null>(null);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    // Initialize start time
    if (startTimeRef.current === null) {
      startTimeRef.current = time;
    }
    
    // 29-second cycle: start → load → rectangle → back to start
    const cycleTime = (time - startTimeRef.current) % 29;
    
    // Pre-calculate common values to reduce per-frame calculations
    const pulse = Math.sin(time * 1.2) * 0.15 + 1;
    const lavenderPulse = Math.sin(time * 1.2 + Math.PI * 0.66) * 0.15 + 1;
    const greenPulse = Math.sin(time * 1.2 + Math.PI * 1.33) * 0.15 + 1;
    
    // Phase 1: Starting state - Interactive rotation (0-8s)
    if (cycleTime < 8) {
      if (!isDragging) {
        if (blueRef.current) {
          blueRef.current.position.set(-1.2, 0, 0);
          blueRef.current.scale.set(pulse, pulse, pulse);
          blueRef.current.rotation.x = time * 0.5;
          blueRef.current.rotation.y = time * 0.4;
        }
        
        if (lavenderRef.current) {
          lavenderRef.current.position.set(0, 0, 0);
          lavenderRef.current.scale.set(lavenderPulse, lavenderPulse, lavenderPulse);
          lavenderRef.current.rotation.x = time * 0.5 + Math.PI * 0.66;
          lavenderRef.current.rotation.y = time * 0.4 + Math.PI * 0.66;
        }
        
        if (greenRef.current) {
          greenRef.current.position.set(1.5, 0, 0);
          greenRef.current.scale.set(greenPulse, greenPulse, greenPulse);
          greenRef.current.rotation.x = time * 0.5 + Math.PI * 1.33;
          greenRef.current.rotation.y = time * 0.4 + Math.PI * 1.33;
        }
      } else {
        if (blueRef.current) blueRef.current.position.set(-1.2, 0, 0);
        if (lavenderRef.current) lavenderRef.current.position.set(0, 0, 0);
        if (greenRef.current) greenRef.current.position.set(1.5, 0, 0);
      }
    }
    // Phase 2: Transition to loading (8-10s) - Smooth spiral down
    else if (cycleTime < 10) {
      const transitionProgress = (cycleTime - 8) * 0.5; // Pre-calculate division
      const oneMinusProg = 1 - transitionProgress;
      const easeOut = 1 - oneMinusProg * oneMinusProg * oneMinusProg;
      const rotDecay = oneMinusProg * oneMinusProg;
      
      if (blueRef.current) {
        const spiralY = Math.sin(transitionProgress * 9.42) * 0.3 * oneMinusProg; // 9.42 ≈ Math.PI * 3
        blueRef.current.position.set(-1.2, spiralY, 0);
        blueRef.current.rotation.x *= rotDecay;
        blueRef.current.rotation.y *= rotDecay;
        const targetScale = 1 + (pulse - 1) * oneMinusProg;
        blueRef.current.scale.set(targetScale, targetScale, targetScale);
      }
      
      if (lavenderRef.current) {
        const spiralY = Math.sin((transitionProgress + 0.1) * 9.42) * 0.3 * oneMinusProg;
        lavenderRef.current.position.set(0, spiralY, 0);
        lavenderRef.current.rotation.x *= rotDecay;
        lavenderRef.current.rotation.y *= rotDecay;
        const targetScale = 1 + (lavenderPulse - 1) * oneMinusProg;
        lavenderRef.current.scale.set(targetScale, targetScale, targetScale);
      }
      
      if (greenRef.current) {
        const spiralY = Math.sin((transitionProgress + 0.2) * 9.42) * 0.3 * oneMinusProg;
        greenRef.current.position.set(1.5, spiralY, 0);
        greenRef.current.rotation.x *= rotDecay;
        greenRef.current.rotation.y *= rotDecay;
        const targetScale = 1 + (greenPulse - 1) * oneMinusProg;
        greenRef.current.scale.set(targetScale, targetScale, targetScale);
      }
    }
    // Phase 3: Loading animation (10-14s) - Sequential bouncing with gaps
    else if (cycleTime < 14) {
      const loadingProgress = cycleTime - 10;
      const bounceFreq = 2.5;
      
      if (blueRef.current) {
        const bouncePhase = Math.max(0, Math.sin(loadingProgress * bounceFreq) * Math.exp(-loadingProgress * 0.3));
        const yPos = bouncePhase * 1.5;
        const scale = 1 + bouncePhase * 0.2;
        blueRef.current.position.set(-1.4, yPos, 0);
        blueRef.current.scale.set(scale, scale, scale);
        blueRef.current.rotation.x = 0;
        blueRef.current.rotation.y = 0;
      }
      
      if (lavenderRef.current) {
        const delay = 0.15;
        const bouncePhase = Math.max(0, Math.sin((loadingProgress - delay) * bounceFreq) * Math.exp(-(loadingProgress - delay) * 0.3));
        const yPos = bouncePhase * 1.5;
        const scale = 1 + bouncePhase * 0.2;
        lavenderRef.current.position.set(0, yPos, 0);
        lavenderRef.current.scale.set(scale, scale, scale);
        lavenderRef.current.rotation.x = 0;
        lavenderRef.current.rotation.y = 0;
      }
      
      if (greenRef.current) {
        const delay = 0.3;
        const bouncePhase = Math.max(0, Math.sin((loadingProgress - delay) * bounceFreq) * Math.exp(-(loadingProgress - delay) * 0.3));
        const yPos = bouncePhase * 1.5;
        const scale = 1 + bouncePhase * 0.2;
        greenRef.current.position.set(1.7, yPos, 0);
        greenRef.current.scale.set(scale, scale, scale);
        greenRef.current.rotation.x = 0;
        greenRef.current.rotation.y = 0;
      }
    }
    // Phase 3.5: Gap closing transition (14-14.5s) - Smoothly close gaps
    else if (cycleTime < 14.5) {
      const transitionProgress = (cycleTime - 14) / 0.5;
      const easeOut = 1 - Math.pow(1 - transitionProgress, 3);
      
      if (blueRef.current) {
        const xPos = -1.4 + (-1.2 - (-1.4)) * easeOut;
        blueRef.current.position.set(xPos, 0, 0);
        blueRef.current.scale.set(1, 1, 1);
        blueRef.current.rotation.x = 0;
        blueRef.current.rotation.y = 0;
      }
      
      if (lavenderRef.current) {
        lavenderRef.current.position.set(0, 0, 0);
        lavenderRef.current.scale.set(1, 1, 1);
        lavenderRef.current.rotation.x = 0;
        lavenderRef.current.rotation.y = 0;
      }
      
      if (greenRef.current) {
        const xPos = 1.7 + (1.5 - 1.7) * easeOut;
        greenRef.current.position.set(xPos, 0, 0);
        greenRef.current.scale.set(1, 1, 1);
        greenRef.current.rotation.x = 0;
        greenRef.current.rotation.y = 0;
      }
    }
    // Phase 4: Rectangle state - Stay stable (14.5-27s)
    else if (cycleTime < 27) {
      if (blueRef.current) {
        blueRef.current.position.set(-1.2, 0, 0);
        blueRef.current.scale.set(1, 1, 1);
        blueRef.current.rotation.x = 0;
        blueRef.current.rotation.y = 0;
      }
      if (lavenderRef.current) {
        lavenderRef.current.position.set(0, 0, 0);
        lavenderRef.current.scale.set(1, 1, 1);
        lavenderRef.current.rotation.x = 0;
        lavenderRef.current.rotation.y = 0;
      }
      if (greenRef.current) {
        greenRef.current.position.set(1.5, 0, 0);
        greenRef.current.scale.set(1, 1, 1);
        greenRef.current.rotation.x = 0;
        greenRef.current.rotation.y = 0;
      }
    }
    // Phase 5: Transition back to starting state (27-29s) - Smooth wake-up
    else {
      const transitionProgress = (cycleTime - 27) / 2;
      const easeInOutSmooth = transitionProgress < 0.5 
        ? 4 * transitionProgress * transitionProgress * transitionProgress
        : 1 - Math.pow(-2 * transitionProgress + 2, 3) / 2;
      
      const rotAcceleration = Math.pow(easeInOutSmooth, 2);
      
      if (blueRef.current) {
        blueRef.current.position.set(-1.2, 0, 0);
        const targetScale = Math.sin(time * 1.2) * 0.15 + 1;
        const currentScale = 1 + (targetScale - 1) * easeInOutSmooth;
        blueRef.current.scale.set(currentScale, currentScale, currentScale);
        blueRef.current.rotation.x = time * 0.5 * rotAcceleration;
        blueRef.current.rotation.y = time * 0.4 * rotAcceleration;
      }
      
      if (lavenderRef.current) {
        lavenderRef.current.position.set(0, 0, 0);
        const targetScale = Math.sin(time * 1.2 + Math.PI * 0.66) * 0.15 + 1;
        const currentScale = 1 + (targetScale - 1) * easeInOutSmooth;
        lavenderRef.current.scale.set(currentScale, currentScale, currentScale);
        lavenderRef.current.rotation.x = (time * 0.5 + Math.PI * 0.66) * rotAcceleration;
        lavenderRef.current.rotation.y = (time * 0.4 + Math.PI * 0.66) * rotAcceleration;
      }
      
      if (greenRef.current) {
        greenRef.current.position.set(1.5, 0, 0);
        const targetScale = Math.sin(time * 1.2 + Math.PI * 1.33) * 0.15 + 1;
        const currentScale = 1 + (targetScale - 1) * easeInOutSmooth;
        greenRef.current.scale.set(currentScale, currentScale, currentScale);
        greenRef.current.rotation.x = (time * 0.5 + Math.PI * 1.33) * rotAcceleration;
        greenRef.current.rotation.y = (time * 0.4 + Math.PI * 1.33) * rotAcceleration;
      }
    }
  });

  return (
    <group>
      {/* Blue box - Left */}
      <mesh 
        ref={blueRef} 
        geometry={blueGeometry} 
        material={blueMaterial}
        position={[-1.2, 0, 0]} 
        castShadow={false}
        frustumCulled={true}
      />

      {/* Lavender box - Center */}
      <mesh 
        ref={lavenderRef} 
        geometry={lavenderGeometry} 
        material={lavenderMaterial}
        position={[0, 0, 0]} 
        castShadow={false}
        frustumCulled={true}
      />

      {/* Green box - Right (longer) */}
      <mesh 
        ref={greenRef} 
        geometry={greenGeometry} 
        material={greenMaterial}
        position={[1.5, 0, 0]} 
        castShadow={false}
        frustumCulled={true}
      />

      {/* Optimized single ambient light */}
      <pointLight
        position={[0, 0, 2]}
        color="#ffffff"
        intensity={0.8}
        distance={8}
      />
    </group>
  );
});

/** Interactive rotating ellipses with mouse controls */
function RotatingEllipses() {
  const group = useRef<THREE.Group>(null!);
  const [isDragging, setIsDragging] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 });

  useFrame((_s, dt) => {
    if (group.current && autoRotate && !isDragging) {
      group.current.rotation.y += dt * 0.5;
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
    setAutoRotate(true);
  };

  return (
    <group 
      ref={group} 
      scale={[1.2, 1.2, 1.2]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <AnimatedEllipses isDragging={isDragging} />
    </group>
  );
}

/** Top artwork: animated 3D ellipses above the wordmark */
const HeroEllipses3D = memo(function HeroEllipses3D() {
  return (
    <div
      className="mx-auto mb-2 md:mb-4 w-full max-w-[320px] sm:max-w-[420px] md:max-w-[480px]"
      style={{
        height: "280px",
      }}
      aria-hidden
    >
      <Canvas
        dpr={[1, 1.5]}
        frameloop="always"
        camera={{ position: [0, 0, 8], fov: 35 }}
        style={{ width: "100%", height: "100%", display: "block" }}
        flat
        gl={{ 
          antialias: false, 
          alpha: true, 
          powerPreference: "high-performance",
          stencil: false,
          depth: false
        }}
        performance={{ min: 0.5, max: 1, debounce: 200 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2}
        />
        <RotatingEllipses />
      </Canvas>
    </div>
  );
});

/* --------------------------------- Hero --------------------------------- */

export function ChemistryHero() {
  const companyGroups = [
    ["Bridge", "Decagon", "Intercom"],
    ["LaunchDarkly", "PagerDuty", "Pave"],
    ["Persona", "Pilot", "Plaid"],
    ["Twitch", "Assort Health", "Bridge"],
    ["Decagon", "Intercom", "LaunchDarkly"],
    ["PagerDuty", "Pave", "Persona"],
    ["Pilot", "Plaid", "Twitch"],
    ["Assort Health", "Bridge", "Decagon"],
    ["Intercom", "LaunchDarkly", "PagerDuty"],
  ];
  const descriptions = ["pioneers.", "founders.", "trailblazers.", "innovators."];

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
        --iBaseline: -0.18em;
        --towerNudgeX: 0px;
        position: relative; display:inline-block;
        inline-size: var(--iWidth);
        block-size: var(--iHeight);
        vertical-align: var(--iBaseline);
        overflow: hidden;
        text-align: center;
      }
      @media (min-width: 768px) {
        .i-slot {
          --iBaseline: -0.15em;
        }
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
      
      @keyframes gradient-shift {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
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

      <div className="w-full mx-auto px-4 py-16 md:py-20 text-center relative z-10">
        {/* 3D Ellipses artwork ABOVE the wordmark */}
        <HeroEllipses3D />

        <div className="mb-8 opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
          <h1
            className="text-5xl md:text-7xl font-display font-semibold tracking-tight leading-tight"
            style={{
              display: "inline-block",
              transform: `rotateX(${-mousePosition.y * 0.45}deg) rotateY(${mousePosition.x * 0.45}deg) translateZ(18px)`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* CHEMISTRY with Pantone color glow */}
            <div 
              className="text-white/90 bg-gradient-chemistry-glow bg-clip-text"
              style={{
                textShadow: `0 0 20px hsl(260 50% 70% / 0.3), 0 0 40px hsl(85 95% 65% / 0.2)`,
                filter: 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.2))',
                transform: `translateZ(12px) rotateX(${mousePosition.y * 0.2}deg) rotateY(${mousePosition.x * 0.2}deg)`,
              }}
            >
              CHEM
              <span className={`i-slot ${iAsTower ? "on" : ""}`}>
                <span className="i-layer i-text">I</span>
                <span className="i-layer i-tower">
                  <svg width="0.35em" height="0.92em" viewBox="0 0 35 92" style={{verticalAlign: 'baseline'}}>
                    {/* Gradient definitions */}
                    <defs>
                      <linearGradient id="campanileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#c6e2ff" />
                        <stop offset="100%" stopColor="#99f859" />
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
              STRY
            </div>
            {/* CATALYST */}
            <div 
              className="text-white/85"
              style={{
                transform: 'translateZ(8px)',
                marginTop: '-0.2em'
              }}
            >
              CATALYST
            </div>
          </h1>
        </div>

        {/* body */}
        <div className="mb-12 opacity-0 animate-[fade-in_0.8s_ease-out_0.6s_forwards] space-y-4">
          <div className="text-lg font-mono text-white/90 leading-relaxed tracking-wide">
            <span style={{ color: 'hsl(85, 95%, 65%)' }}>{">"}</span> A tight-knit community for Berkeley's top{" "}
            <span className="text-white font-medium relative inline-block min-w-[160px] text-left">
              {typingText}
              <span style={{ color: 'hsl(85, 95%, 65%)' }} className="animate-pulse ml-0.5">|</span>
            </span>
          </div>
          <div
            className="text-sm md:text-base font-mono text-white/50 tracking-wide cursor-pointer transition-colors hover:text-white/70 max-w-2xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="mb-1">
              <span style={{ color: 'hsl(85, 95%, 65%)' }}>{">"}</span> In partnership with Chemistry, an early-stage venture firm
            </div>
            <div className="pl-4">
              led by investors who have backed companies such as{" "}
              <span className="inline-block transition-all duration-500 ease-in-out transform md:whitespace-nowrap">
                <span className="text-white/90 font-medium">{companyGroups[currentGroup][0]}</span>
                {", "}
                <span className="text-white/90 font-medium">{companyGroups[currentGroup][1]}</span>
                {", "}
                <span className="text-white/90 font-medium">{companyGroups[currentGroup][2]}</span>
              </span>
              .
            </div>
          </div>
        </div>

        <div className="opacity-0 animate-[fade-in_0.8s_ease-out_0.8s_forwards]">
          <Button
            size="xl"
            className="w-56 mx-auto py-4 text-base font-bold rounded-full backdrop-blur-xl hover:scale-105 transform transition-all duration-300 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsl(260, 50%, 75%) 0%, hsl(235, 75%, 65%) 50%, hsl(85, 95%, 70%) 100%)',
              backgroundSize: '200% 200%',
              color: 'hsl(235, 75%, 15%)',
              border: '2px solid hsl(260, 50%, 85%)',
              boxShadow: '0 0 30px hsl(260, 50%, 70% / 0.6), 0 0 60px hsl(85, 95%, 65% / 0.4), inset 0 1px 0 hsl(260, 50%, 90%)',
              animation: 'subtle-pulse 3s ease-in-out infinite, gradient-shift 4s ease infinite'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 45px hsl(260, 50%, 70% / 0.9), 0 0 80px hsl(85, 95%, 65% / 0.6), inset 0 1px 0 hsl(260, 50%, 95%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px hsl(260, 50%, 70% / 0.6), 0 0 60px hsl(85, 95%, 65% / 0.4), inset 0 1px 0 hsl(260, 50%, 90%)';
            }}
            onClick={() => window.open("https://form.typeform.com/to/iETE0PZy", "_blank")}
          >
            APPLY
          </Button>
        </div>
      </div>

    </div>
  );
}
