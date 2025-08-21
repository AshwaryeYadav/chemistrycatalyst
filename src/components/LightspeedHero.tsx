// src/components/LightspeedHero.tsx
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, memo, Suspense } from "react";

/* --------------------------- THREE: 3D Lightspeed L --------------------------- */
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/** Extruded L built from the flat silhouette; exact color #ED6C5C */
function LMesh() {
  // Build the L shape (units are arbitrary; we center it after extrusion)
  const s = new THREE.Shape();
  // A tall stem with a right “foot”, matching the reference silhouette
  s.moveTo(-1.5, 3.5);
  s.lineTo(-1.5, -3.5);
  s.lineTo(1.8, -3.5);
  s.lineTo(0.0, -1.7);
  s.lineTo(-0.6, -1.7);
  s.lineTo(-0.6, 3.5);
  s.closePath();

  const geom = new THREE.ExtrudeGeometry(s, {
    depth: 0.6,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.08,
    bevelSegments: 4,
    curveSegments: 12,
  });
  geom.center();

  return (
    <mesh geometry={geom} castShadow receiveShadow>
      <meshStandardMaterial color={"#ED6C5C"} metalness={0.15} roughness={0.35} />
    </mesh>
  );
}

/** Component that handles the rotating group - must be inside Canvas */
function RotatingLMesh() {
  const group = useRef<THREE.Group>(null!);
  useFrame((_state, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.25;
  });

  return (
    <group ref={group}>
      <LMesh />
    </group>
  );
}

/** 3D icon wrapper: gentle auto-rotate + drag orbit (no zoom/pan) */
const Lightspeed3DIcon = memo(function Lightspeed3DIcon() {
  return (
    <div className="mx-auto mb-10" style={{ width: 128, height: 128 }}>
      <Canvas dpr={[1, 2]} camera={{ position: [2.5, 2.2, 3.4], fov: 38 }} shadows>
        <ambientLight intensity={0.25} />
        <directionalLight
          position={[3, 6, 5]}
          castShadow
          intensity={1.1}
          shadow-mapSize={[1024, 1024]}
        />
        {/* TS fix: use args instead of skyColor/groundColor */}
        <hemisphereLight args={["#ffffff", "#222222", 0.35]} />
        <RotatingLMesh />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          rotateSpeed={0.7}
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.8}
        />
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

  // cycle investors
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(
      () => setCurrentGroup((p) => (p + 1) % companyGroups.length),
      2400
    );
    return () => clearInterval(id);
  }, [isPaused, companyGroups.length]);

  // cycle descriptor
  useEffect(() => {
    const id = setInterval(
      () => setCurrentDescription((p) => (p + 1) % descriptions.length),
      3600
    );
    return () => clearInterval(id);
  }, [descriptions.length]);

  // mouse tilt
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

  // CSS for contained I morph (fix cleanup return type)
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .i-slot{
        --iWidth: 0.28em;
        --iBaseline: -0.02em;
        --towerNudgeX: 0px;
        position: relative; display:inline-block;
        inline-size: var(--iWidth); block-size: 1em;
        vertical-align: var(--iBaseline);
        overflow: hidden; /* safe, everything fits in slot */
      }
      .i-layer{ position:absolute; inset:0; display:flex;
        align-items:flex-end; justify-content:center;
        will-change: opacity, transform;
        transition: opacity .36s cubic-bezier(.2,.7,.2,1),
                    transform .42s cubic-bezier(.3,.7,.2,1); }
      .i-text  { opacity:1;  transform: translateY(0) scale(1); }
      .i-tower { opacity:0;  transform: translateY(6%) scale(.985) translateX(var(--towerNudgeX)); }
      .i-slot.on .i-text  { opacity:0; transform: translateY(-4%) scale(.985); }
      .i-slot.on .i-tower { opacity:1; transform: translateY(0)   scale(1)    translateX(var(--towerNudgeX)); }
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
        {/* ---- 3D LIGHTSPEED ICON (rotatable) ---- */}
        <Suspense fallback={<div className="mb-10 h-[128px] w-[128px] mx-auto" />}>
          <Lightspeed3DIcon />
        </Suspense>

        {/* ---- wordmark with contained I morph ---- */}
        <div className="mb-10 opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
          <h1
            className="text-5xl md:text-7xl font-display font-semibold tracking-tight leading-tight text-white"
            style={{
              transform: `rotateX(${-mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg) translateZ(20px)`,
              textShadow: `
                0 1px 0 rgba(255,255,255,0.1),
                0 2px 4px rgba(0,0,0,0.35),
                ${mousePosition.x * 0.5}px ${mousePosition.y * 0.5}px 14px rgba(0,0,0,0.25)
              `,
              transformStyle: "preserve-3d",
            }}
          >
            L<span className={`i-slot ${iAsTower ? "on" : ""}`}>
              {/* block I – fully inside slot */}
              <span className="i-layer i-text">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 32 220"
                  preserveAspectRatio="xMidYMax meet"
                  className="text-white"
                >
                  <g transform="translate(16,0)">
                    <rect x={-16} y={40} width={32} height={170} fill="currentColor" />
                  </g>
                </svg>
              </span>

              {/* campanile I – also fully contained */}
              <span className="i-layer i-tower">
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 32 220"
                  preserveAspectRatio="xMidYMax meet"
                  className="text-white"
                >
                  <g transform="translate(16,0)">
                    <rect x={-16} y={40} width={32} height={170} fill="currentColor" />
                    <rect x={-16} y={32} width={32} height={8} fill="currentColor" />
                    <defs>
                      <mask id="iBelfryMask" maskUnits="userSpaceOnUse" x={-14} y={0} width={28} height={32}>
                        <rect x={-14} y={0} width={28} height={32} fill="white" />
                        <g fill="black">
                          <rect x={-10} y={6} width={6} height={22} rx={3} />
                          <rect x={-2} y={6} width={6} height={22} rx={3} />
                          <rect x={6}   y={6} width={6} height={22} rx={3} />
                        </g>
                      </mask>
                    </defs>
                    <rect x={-14} y={0} width={28} height={32} fill="currentColor" mask="url(#iBelfryMask)" />
                    <g transform="translate(0,20)">
                      <circle r={6} fill="rgba(0,0,0,.8)" stroke="currentColor" strokeWidth={2} />
                      <circle r={1} fill="currentColor" />
                    </g>
                    <polygon
                      points="0,0 16,32 -16,32"
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

        {/* ---- body ---- */}
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
            className="w-56 mx-auto py-4 text-base font-semibold text-white border border-white/15 rounded-full backdrop-blur-lg bg-white/5 hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(237,108,92,0.5)] hover:border-[#ED6C5C]/30"
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
