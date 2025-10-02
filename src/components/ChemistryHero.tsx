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
  
  // Rectangular geometries - green is longer
  const blueGeometry = useMemo(() => new THREE.BoxGeometry(1.2, 1, 0.4, 32, 32, 32), []);
  const lavenderGeometry = useMemo(() => new THREE.BoxGeometry(1.2, 1, 0.4, 32, 32, 32), []);
  const greenGeometry = useMemo(() => new THREE.BoxGeometry(1.8, 1, 0.4, 32, 32, 32), []);
  const startTimeRef = useRef<number | null>(null);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    
    // Initialize start time
    if (startTimeRef.current === null) {
      startTimeRef.current = time;
    }
    
    // 25-second cycle with seamless transition
    const cycleTime = (time - startTimeRef.current) % 25;
    
    // Phase 1: Loading animation (0-4s) - Sequential bouncing dots
    if (cycleTime < 4) {
      const loadingProgress = cycleTime;
      const bounceFreq = 2.5;
      
      // Blue box (left) - bounces first
      if (blueRef.current) {
        const bouncePhase = Math.max(0, Math.sin(loadingProgress * bounceFreq) * Math.exp(-loadingProgress * 0.3));
        const yPos = bouncePhase * 1.5;
        const scale = 1 + bouncePhase * 0.2;
        
        blueRef.current.position.set(-1.2, yPos, 0);
        blueRef.current.scale.set(scale, scale, scale);
        blueRef.current.rotation.x = 0;
        blueRef.current.rotation.y = 0;
      }
      
      // Lavender box (center) - bounces with delay
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
      
      // Green box (right) - bounces last
      if (greenRef.current) {
        const delay = 0.3;
        const bouncePhase = Math.max(0, Math.sin((loadingProgress - delay) * bounceFreq) * Math.exp(-(loadingProgress - delay) * 0.3));
        const yPos = bouncePhase * 1.5;
        const scale = 1 + bouncePhase * 0.2;
        
        greenRef.current.position.set(1.5, yPos, 0);
        greenRef.current.scale.set(scale, scale, scale);
        greenRef.current.rotation.x = 0;
        greenRef.current.rotation.y = 0;
      }
    }
    // Phase 2: Transition to stable state (4-5s)
    else if (cycleTime < 5) {
      const transitionProgress = (cycleTime - 4) / 1;
      const easeOut = 1 - Math.pow(1 - transitionProgress, 3);
      
      [blueRef, lavenderRef, greenRef].forEach((ref, idx) => {
        if (ref.current) {
          const targetY = 0;
          const currentY = ref.current.position.y;
          ref.current.position.y = currentY * (1 - easeOut) + targetY * easeOut;
          
          // Smooth scale transition
          const targetScale = 1;
          const currentScale = ref.current.scale.x;
          const newScale = currentScale * (1 - easeOut) + targetScale * easeOut;
          ref.current.scale.set(newScale, newScale, newScale);
        }
      });
    }
    // Phase 3: Interactive rotation state (5-23s)
    else if (cycleTime < 23) {
      // Only rotate if not being dragged by user
      if (!isDragging) {
        const pulse = Math.sin(time * 1.2) * 0.15 + 1;
        
        // Blue box (left)
        if (blueRef.current) {
          blueRef.current.position.set(-1.2, 0, 0);
          blueRef.current.scale.set(pulse, pulse, pulse);
          blueRef.current.rotation.x = time * 0.2;
          blueRef.current.rotation.y = time * 0.3;
        }
        
        // Lavender box (center)
        if (lavenderRef.current) {
          const lavenderPulse = Math.sin(time * 1.2 + Math.PI * 0.66) * 0.15 + 1;
          lavenderRef.current.position.set(0, 0, 0);
          lavenderRef.current.scale.set(lavenderPulse, lavenderPulse, lavenderPulse);
          lavenderRef.current.rotation.x = time * 0.2 + Math.PI * 0.66;
          lavenderRef.current.rotation.y = time * 0.3 + Math.PI * 0.66;
        }
        
        // Green box (right)
        if (greenRef.current) {
          const greenPulse = Math.sin(time * 1.2 + Math.PI * 1.33) * 0.15 + 1;
          greenRef.current.position.set(1.5, 0, 0);
          greenRef.current.scale.set(greenPulse, greenPulse, greenPulse);
          greenRef.current.rotation.x = time * 0.2 + Math.PI * 1.33;
          greenRef.current.rotation.y = time * 0.3 + Math.PI * 1.33;
        }
      } else {
        // When dragging, maintain positions
        if (blueRef.current) blueRef.current.position.set(-1.2, 0, 0);
        if (lavenderRef.current) lavenderRef.current.position.set(0, 0, 0);
        if (greenRef.current) greenRef.current.position.set(1.5, 0, 0);
      }
    }
    // Phase 4: Slowly separate and prepare for loop (23-25s)
    else {
      const transitionProgress = (cycleTime - 23) / 2;
      const easeOut = 1 - Math.pow(1 - transitionProgress, 3);
      
      // Slowly decrease rotation speed (damping)
      const rotationDamping = 1 - easeOut;
      const slowTime = time * rotationDamping * 0.1;
      
      if (blueRef.current) {
        blueRef.current.position.set(-1.2, 0, 0);
        blueRef.current.scale.set(1, 1, 1);
        blueRef.current.rotation.x = slowTime * 0.2;
        blueRef.current.rotation.y = slowTime * 0.3;
      }
      
      if (lavenderRef.current) {
        lavenderRef.current.position.set(0, 0, 0);
        lavenderRef.current.scale.set(1, 1, 1);
        lavenderRef.current.rotation.x = slowTime * 0.2;
        lavenderRef.current.rotation.y = slowTime * 0.3;
      }
      
      if (greenRef.current) {
        greenRef.current.position.set(1.5, 0, 0);
        greenRef.current.scale.set(1, 1, 1);
        greenRef.current.rotation.x = slowTime * 0.2;
        greenRef.current.rotation.y = slowTime * 0.3;
      }
    }
  });

  return (
    <group>
      {/* Blue box - Left */}
      <mesh 
        ref={blueRef} 
        geometry={blueGeometry} 
        position={[-1.2, 0, 0]} 
        castShadow 
        receiveShadow
      >
        <meshPhysicalMaterial
          color="hsl(235, 75%, 45%)"
          transparent={true}
          opacity={0.95}
          roughness={0.2}
          metalness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive="hsl(235, 75%, 45%)"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Lavender box - Center */}
      <mesh 
        ref={lavenderRef} 
        geometry={lavenderGeometry} 
        position={[0, 0, 0]} 
        castShadow 
        receiveShadow
      >
        <meshPhysicalMaterial
          color="hsl(260, 50%, 70%)"
          transparent={true}
          opacity={0.95}
          roughness={0.2}
          metalness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive="hsl(260, 50%, 70%)"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Green box - Right (longer) */}
      <mesh 
        ref={greenRef} 
        geometry={greenGeometry} 
        position={[1.5, 0, 0]} 
        castShadow 
        receiveShadow
      >
        <meshPhysicalMaterial
          color="hsl(85, 95%, 65%)"
          transparent={true}
          opacity={0.95}
          roughness={0.2}
          metalness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive="hsl(85, 95%, 65%)"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Glow lights */}
      <pointLight
        position={[-1.2, 0, 0]}
        color="hsl(235, 75%, 45%)"
        intensity={1.2}
        distance={5}
      />
      <pointLight
        position={[0, 0, 0]}
        color="hsl(260, 50%, 70%)"
        intensity={1.2}
        distance={5}
      />
      <pointLight
        position={[1.5, 0, 0]}
        color="hsl(85, 95%, 65%)"
        intensity={1.2}
        distance={5}
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
        dpr={[2, 2]}
        frameloop="always"
        camera={{ position: [0, 0, 8], fov: 35 }}
        style={{ width: "100%", height: "100%", display: "block" }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          castShadow
          intensity={1.5}
          shadow-mapSize={[1024, 1024]}
        />
        <hemisphereLight args={["#ffffff", "#000000", 0.5]} />
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
              CHEMISTRY
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
            className="text-base font-mono text-white/60 tracking-wide cursor-pointer transition-colors hover:text-white/80"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <span style={{ color: 'hsl(85, 95%, 65%)' }}>{">"}</span> In partnership with Chemistry, an early-stage venture firm led by investors who have backed companies such as{" "}
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
            className="w-56 mx-auto py-4 text-base font-bold rounded-full backdrop-blur-xl hover:scale-105 transform transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, hsl(85, 95%, 65%) 0%, hsl(85, 95%, 75%) 100%)',
              color: 'hsl(235, 75%, 25%)',
              border: '2px solid hsl(85, 95%, 75%)',
              boxShadow: '0 0 25px hsl(85, 95%, 65% / 0.5), inset 0 1px 0 hsl(85, 95%, 85%)',
              animation: 'subtle-pulse 3s ease-in-out infinite'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 40px hsl(85, 95%, 65% / 0.8), inset 0 1px 0 hsl(85, 95%, 85%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 25px hsl(85, 95%, 65% / 0.5), inset 0 1px 0 hsl(85, 95%, 85%)';
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
