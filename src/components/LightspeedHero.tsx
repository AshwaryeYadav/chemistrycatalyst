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
    // Exact Lightspeed L shape from SVG (scaled/centered)
    s.moveTo(2, 2);            // 65.2,65.2
    s.lineTo(-1, 2);           // 32.6,65.2
    s.lineTo(-1, -1);          // 32.6,32.6
    s.lineTo(-3.5, -3.5);      // 0,0 (diagonal cut)
    s.lineTo(-3.5, -1);        // 0,32.6
    s.lineTo(-3.5, 2);         // 0,65.2
    s.lineTo(-3.5, 4);         // 0,97.8
    s.lineTo(-1, 4);           // 32.6,97.8
    s.lineTo(2, 4);            // 65.2,97.8
    s.lineTo(3.5, 4);          // 97.8,97.8
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

/** Interactive rotating L with mouse controls */
function RotatingL() {
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
    setAutoRotate(true);
  };

  return (
    <group
      ref={group}
      scale={[0.6, -0.6, 0.6]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      // cursor via canvas style below
    >
      <LMesh />
    </group>
  );
}

/** Top artwork: standalone 3D L as a free-floating absolute layer (no clipping) */
const HeroL3D = memo(function HeroL3D() {
  return (
    <div
      className="
        pointer-events-auto
        absolute left-1/2 -translate-x-1/2
        top-8 md:top-10
      "
      style={{
        // Make the canvas larger than the visible logo so rotation never touches edges
        width: "min(70vmin, 720px)",
        height: "min(55vmin, 560px)",
        overflow: "visible",
        zIndex: 1, // text container is z-10 (above)
        cursor: "grab",
      }}
      aria-hidden
    >
      <Canvas
        gl={{ alpha: true }}
        dpr={[1, 2]}
        camera={{ position: [6.5, 5.0, 10.0], fov: 22, near: 0.1, far: 1000 }}
        style={{ width: "100%", height: "100%", display: "block" }}
        shadows
        onPointerDown={(e) => {
          // give visual feedback for drag
          const el = e.target as HTMLCanvasElement;
          el.style.cursor = "grabbing";
        }}
        onPointerUp={(e) => {
          const el = e.target as HTMLCanvasElement;
          el.style.cursor = "grab";
        }}
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
  const descriptions = ["builders.", "founders.", "engineers.", "hackers."];

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
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.85; transform: scale(1.02); }
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-hero flex items-center justify-center relative overflow-visible"
      style={{ perspective: "1000px" }}
    >
      {/* background layers (below canvas) */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-[#ED6C5C]/10 opacity-40 z-0" />
      <div className="absolute inset-0 opacity-[0.03] bg-noise z-0" />

      {/* 3D L artwork as a free absolute layer */}
      <HeroL3D />

      {/* content above the 3D canvas */}
      <div className="max-w-2xl mx-auto px-8 py-16 md:py-20 text-center relative z-10">
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
            <span className={`i-slot ${iAsTower ? "on" : ""}`}>
              <span className="i-layer i-text">I</span>
              <span className="i-layer i-tower">
                <svg width="0.35em" height="0.92em" viewBox="0 0 35 92" fill="currentColor" style={{ verticalAlign: "baseline" }}>
                  {/* Campanile */}
                  <rect x="12" y="68" width="11" height="8" fill="currentColor" />
                  <rect x="12" y="25" width="11" height="43" fill="currentColor" />
                  <rect x="10" y="13" width="15" height="12" fill="currentColor" />
                  <path d="M 12 17 Q 14 14 16 17 L 16 22 L 12 22 Z" fill="rgba(0,0,0,0.4)" />
                  <path d="M 17 17 Q 19 14 21 17 L 21 22 L 17 22 Z" fill="rgba(0,0,0,0.4)" />
                  <path d="M 22 17 Q 24 14 26 17 L 26 22 L 22 22 Z" fill="rgba(0,0,0,0.4)" />
                  <rect x="13" y="15" width="1.5" height="3" fill="rgba(0,0,0,0.3)" />
                  <rect x="16" y="15" width="1.5" height="3" fill="rgba(0,0,0,0.3)" />
                  <rect x="19" y="15" width="1.5" height="3" fill="rgba(0,0,0,0.3)" />
                  <rect x="22" y="15" width="1.5" height="3" fill="rgba(0,0,0,0.3)" />
                  <rect x="9" y="11" width="17" height="2" fill="currentColor" />
                  <polygon points="17.5,2 26,11 9,11" fill="currentColor" />
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
            <span className="text-white font-medium relative inline-block min-w-[120px]">
              {typingText}
              <span className="animate-pulse ml-0.5 text-[#ED6C5C]">|</span>
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
            className="w-56 mx-auto py-4 text-base font-bold text-black border border-white/20 rounded-full bg-white/10 backdrop-blur-xl hover:bg-[#ED6C5C]/20 hover:border-[#ED6C5C]/40 hover:text-white hover:shadow-[0_0_30px_rgba(237,108,92,0.8)] hover:scale-105 transform transition-all duration-300"
            style={{ animation: "subtle-pulse 3s ease-in-out infinite" }}
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
