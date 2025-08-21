import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, memo, Suspense } from "react";

/* --------------------------- THREE: 3D Lightspeed L --------------------------- */
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/** Extruded L built from the flat shape you sent, colored #ED6C5C */
function LMesh() {
  // L shape (same silhouette you showed)
  const s = new THREE.Shape();
  // points (in px) – looks like a tall stem with a foot stepping right
  // feel free to tweak these if you want the knees/angles different
  s.moveTo(-1.5, 3.5);
  s.lineTo(-1.5, -3.5);
  s.lineTo(1.8, -3.5);
  s.lineTo(0.0, -1.7);
  s.lineTo(-0.6, -1.7);
  s.lineTo(-0.6, 3.5);
  s.closePath();

  const geom = new THREE.ExtrudeGeometry(s, {
    depth: 0.6, // thickness
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.08,
    bevelSegments: 4,
    curveSegments: 12,
  });
  geom.center();

  return (
    <mesh geometry={geom} castShadow receiveShadow>
      <meshStandardMaterial
        color={"#ED6C5C"}
        metalness={0.15}
        roughness={0.35}
      />
    </mesh>
  );
}

/** Rotator + lights + subtle auto-rotate */
const Lightspeed3DIcon = memo(function Lightspeed3DIcon() {
  const group = useRef<THREE.Group>(null!);
  // idle auto-rotate
  useFrame((_state, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.25;
  });

  return (
    <div className="mx-auto mb-10" style={{ width: 112, height: 112 }}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [2.5, 2.2, 3.4], fov: 38 }}
        shadows
      >
        <ambientLight intensity={0.25} />
        <directionalLight
          position={[3, 6, 5]}
          castShadow
          intensity={1.1}
          shadow-mapSize={[1024, 1024]}
        />
        <hemisphereLight color={"#ffffff"} groundColor={"#222222"} intensity={0.35} />
        <group ref={group}>
          <LMesh />
        </group>
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

  // CSS for contained I morph
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .i-slot{
        --iWidth: 0.34em;
        --iBaseline: -0.02em;
        --towerNudgeX: 0px;
        position: relative; display:inline-block;
        inline-size: var(--iWidth); block-size: 1em;
        vertical-align: var(--iBaseline);
        overflow: hidden; /* safe */
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
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      <div className="max-w-2xl mx-auto px-8 py-20 text-center relative z-10">
        {/* ---- 3D LIGHTSPEED ICON (rotatable) ---- */}
        <Suspense fallback={<div className="mb-16 h-[112px]" />}>
          <Lightspeed3DIcon />
        </Suspense>

        {/* ---- LIGHTSPEED FELLOWS with outline style ---- */}
        <div className="mb-12 opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
          <h1
            className="text-6xl md:text-8xl font-display font-bold tracking-wider leading-tight"
            style={{
              color: "transparent",
              WebkitTextStroke: "2px #ffffff",
              transform: `rotateX(${-mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg) translateZ(20px)`,
              transformStyle: "preserve-3d",
            }}
          >
            <span className={`i-slot ${iAsTower ? "on" : ""}`}>
              {/* block I – fully inside slot */}
              <span className="i-layer i-text">
                <svg width="100%" height="100%" viewBox="0 0 72 220" preserveAspectRatio="xMidYMax meet" style={{ color: "transparent", stroke: "#ffffff", strokeWidth: "8px", fill: "none" }}>
                  <g transform="translate(36,0)">
                    <rect x={-36} y={40} width={72} height={170} />
                  </g>
                </svg>
              </span>
              {/* campanile I – also fully contained */}
              <span className="i-layer i-tower">
                <svg width="100%" height="100%" viewBox="0 0 72 220" preserveAspectRatio="xMidYMax meet" style={{ color: "transparent", stroke: "#ffffff", strokeWidth: "8px", fill: "none" }}>
                  <g transform="translate(36,0)">
                    <rect x={-36} y={40} width={72} height={170} />
                    <rect x={-36} y={32} width={72} height={8} />
                    <defs>
                      <mask id="iBelfryMask" maskUnits="userSpaceOnUse" x={-34} y={0} width={68} height={32}>
                        <rect x={-34} y={0} width={68} height={32} fill="white" />
                        <g fill="black">
                          <rect x={-28} y={6} width={12} height={22} rx={6} />
                          <rect x={-12} y={6} width={12} height={22} rx={6} />
                          <rect x={4}   y={6} width={12} height={22} rx={6} />
                          <rect x={20}  y={6} width={12} height={22} rx={6} />
                        </g>
                      </mask>
                    </defs>
                    <rect x={-34} y={0} width={68} height={32} mask="url(#iBelfryMask)" />
                    <g transform="translate(0,20)">
                      <circle r={9} fill="rgba(0,0,0,.8)" strokeWidth={3} />
                      <circle r={1} />
                    </g>
                    <polygon points="0,0 36,32 -36,32" strokeWidth={1} vectorEffect="non-scaling-stroke" />
                  </g>
                </svg>
              </span>
            </span>
            <span>GHTSPEED</span>
            <br />
            <span>FELLOWS</span>
          </h1>
        </div>

        {/* Decorative dots pattern */}
        <div className="mb-16 opacity-0 animate-[fade-in_0.8s_ease-out_0.6s_forwards]">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-6 h-0.5 bg-white"></div>
            <div className="w-4 h-0.5 bg-white"></div>
          </div>
        </div>

        <div className="opacity-0 animate-[fade-in_0.8s_ease-out_0.8s_forwards]">
          <Button
            size="xl"
            className="w-32 mx-auto py-3 text-lg font-bold text-white border-2 border-white rounded-none bg-transparent hover:bg-white hover:text-black transition-all uppercase tracking-wider"
            onClick={() => window.open("https://form.typeform.com/to/vMxYsW4Y", "_blank")}
          >
            APPLY
          </Button>
        </div>
      </div>
    </div>
  );
}
