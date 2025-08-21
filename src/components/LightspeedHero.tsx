// src/components/LightspeedHero.tsx
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, memo } from "react";

/* --------------------------- THREE: 3D Lightspeed L --------------------------- */
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { memo, useMemo, useRef } from "react";

/** Extruded L built from the flat silhouette; exact color #ED6C5C */
const LMesh = memo(function LMesh() {
  const geom = useMemo(() => {
    const s = new THREE.Shape();
    // silhouette: tall stem + right foot (edit points if you need a different knee)
    s.moveTo(-1.5, 3.5);
    s.lineTo(-1.5, -3.5);
    s.lineTo(1.8, -3.5);
    s.lineTo(0.0, -1.7);
    s.lineTo(-0.6, -1.7);
    s.lineTo(-0.6, 3.5);
    s.closePath();

    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.6,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.08,
      bevelSegments: 4,
      curveSegments: 12,
    });
    g.center();
    return g;
  }, []);

  return (
    <mesh geometry={geom} castShadow receiveShadow>
      <meshStandardMaterial color={"#ED6C5C"} metalness={0.15} roughness={0.35} />
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
    <group ref={group}>
      <LMesh />
    </group>
  );
}

/** Inline 3D L slot sized in ems so it sits like a glyph */
export const Inline3DL = memo(function Inline3DL() {
  return (
    <span
      className="inline-block"
      style={{
        // width ≈ cap-width, height a hair taller than line box so bevel isn’t clipped
        width: "0.92em",
        height: "1.18em",
        // Raise/align to cap height; tweak here if you still see drift
        transform: "translateY(-0.12em)",
        verticalAlign: "-0.08em",
        overflow: "visible",
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [2.5, 2.2, 3.4], fov: 38 }}
        style={{ width: "100%", height: "100%", display: "block", overflow: "visible" as any }}
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

        {/* Rotation happens here, inside the Canvas tree */}
        <RotatingL />
      </Canvas>
    </span>
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

  // mouse tilt (kept for subtle 3D feel on the whole wordmark)
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

  // CSS for tighter IN-SLOT morph (shorter so nothing overflows)
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .i-slot{
        --iWidth: 0.30em;       /* slightly narrower to match your mock */
        --iHeight: 0.92em;      /* shorter than line box so the cap/head never touches */
        --iBaseline: -0.04em;   /* baseline tweak to align with text */
        --towerNudgeX: 0px;
        position: relative; display:inline-block;
        inline-size: var(--iWidth);
        block-size: var(--iHeight);
        vertical-align: var(--iBaseline);
        overflow: hidden;       /* safe: both states live inside this box */
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
    return () => {
      if (style.parentNode) style.parentNode.removeChild(style);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-hero flex items-center justify-center relative overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-[#ED6C5C]/10 opacity-40" />
      <div className="absolute inset-0 opacity-[0.03] bg-noise" />

      <div className="max-w-2xl mx-auto px-8 py-20 text-center relative z-10">
        <div className="mb-10 opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
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
            {/* Inline 3D L (aligned & raised to avoid clipping) */}
            <Inline3DL />

            {/* Morphing I (shorter; fully contained) */}
            <span className={`i-slot ${iAsTower ? "on" : ""}`}>
              {/* Block I (fits inside 0..220 viewBox scaled into 0.92em) */}
              <span className="i-layer i-text">
                <svg width="100%" height="100%" viewBox="0 0 72 220" preserveAspectRatio="xMidYMax meet" className="text-white">
                  <g transform="translate(36,0)">
                    {/* stem placed lower so top headroom remains */}
                    <rect x={-36} y={60} width={72} height={150} fill="currentColor" />
                  </g>
                </svg>
              </span>

              {/* Campanile I (all elements inside the slot) */}
              <span className="i-layer i-tower">
                <svg width="100%" height="100%" viewBox="0 0 72 220" preserveAspectRatio="xMidYMax meet" className="text-white">
                  <g transform="translate(36,0)">
                    <rect x={-36} y={60} width={72} height={150} fill="currentColor" />
                    <rect x={-36} y={52} width={72} height={8} fill="currentColor" />
                    <defs>
                      <mask id="iBelfryMask" maskUnits="userSpaceOnUse" x={-34} y={24} width={68} height={28}>
                        <rect x={-34} y={24} width={68} height={28} fill="white" />
                        <g fill="black">
                          <rect x={-28} y={28} width={12} height={18} rx={5} />
                          <rect x={-12} y={28} width={12} height={18} rx={5} />
                          <rect x={4}   y={28} width={12} height={18} rx={5} />
                          <rect x={20}  y={28} width={12} height={18} rx={5} />
                        </g>
                      </mask>
                    </defs>
                    <rect x={-34} y={24} width={68} height={28} fill="currentColor" mask="url(#iBelfryMask)" />
                    {/* small clock kept inside the belfry band */}
                    <g transform="translate(0,36)">
                      <circle r={8} fill="rgba(0,0,0,.8)" stroke="currentColor" strokeWidth={3} />
                      <circle r={1} fill="currentColor" />
                    </g>
                    {/* Spire kept within the 24..52 band */}
                    <polygon
                      points="0,24 36,52 -36,52"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth={1}
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>
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
