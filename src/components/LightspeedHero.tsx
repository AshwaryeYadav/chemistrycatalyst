// src/components/LightspeedHero.tsx
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, memo, useMemo } from "react";

/* --------------------------- THREE: 3D Lightspeed L --------------------------- */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Extruded L built from a flat silhouette; exact color #ED6C5C */
const LMesh = memo(function LMesh() {
  const geom = useMemo(() => {
    const s = new THREE.Shape();
    // silhouette: tall stem + longer, more symmetrical foot
    s.moveTo(-1.5, 3.5);
    s.lineTo(-1.5, -3.5);
    s.lineTo(2.6, -3.5); // <- extended from 1.8 to 2.6 for a longer base
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
      <meshStandardMaterial color="#ED6C5C" metalness={0.15} roughness={0.35} />
    </mesh>
  );
});

/** Continuous rotator */
function SpinningL({ groupRef }: { groupRef: React.RefObject<THREE.Group> }) {
  useFrame((_s, dt) => {
    if (groupRef.current) groupRef.current.rotation.y += dt * 0.45;
  });
  return (
    <group ref={groupRef}>
      <LMesh />
    </group>
  );
}

/** Auto-fit camera to target so canvas never crops the mesh */
function FitCameraToObject({
  target,
  padding = 1.35,
}: {
  target: React.RefObject<THREE.Object3D>;
  padding?: number;
}) {
  const { camera, size } = useThree();
  useEffect(() => {
    if (!target.current) return;
    const box = new THREE.Box3().setFromObject(target.current);
    const sizeV = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(sizeV);
    box.getCenter(center);

    const persp = camera as THREE.PerspectiveCamera;
    const fov = (persp.fov * Math.PI) / 180;
    const maxDim = Math.max(sizeV.x, sizeV.y, sizeV.z);
    const dist = (maxDim / (2 * Math.tan(fov / 2))) * padding;

    const dir = new THREE.Vector3(0, 0, 1);
    camera.getWorldDirection(dir);
    persp.position.copy(center.clone().add(dir.multiplyScalar(-dist)));
    persp.near = dist / 20;
    persp.far = dist * 20;
    persp.updateProjectionMatrix();
    camera.lookAt(center);
  }, [camera, size.width, size.height, target, padding]);

  return null;
}

/** 3D L artwork above the wordmark (transparent bg, auto-fit, continuous spin) */
const HeroL3D = memo(function HeroL3D() {
  const groupRef = useRef<THREE.Group>(null!);
  return (
    <div
      className="mx-auto mb-6 md:mb-8"
      style={{ width: "200px", height: "200px", overflow: "visible" }}
      aria-hidden
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [2.6, 2.2, 3.9], fov: 40, near: 0.1, far: 100 }}
        shadows
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)} // transparent
        style={{ width: "100%", height: "100%", display: "block", overflow: "visible", background: "transparent" }}
      >
        <ambientLight intensity={0.28} />
        <hemisphereLight args={["#ffffff", "#222222", 0.35]} />
        <directionalLight
          position={[3, 6, 5]}
          castShadow
          intensity={1.1}
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0005}
        />
        <FitCameraToObject target={groupRef} padding={1.35} />
        <SpinningL groupRef={groupRef} />
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
  const [iAsTower, setIAsTower] = useState(false);

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

  // morph I (every 6s), disabled for reduced motion
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = setInterval(() => setIAsTower((v) => !v), 6000);
    return () => clearInterval(id);
  }, []);

  // CSS: cap-height “I” + Berkeley Campanile morph WITHOUT layout shift
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .i-slot{
        --iWidth: 0.26em;        /* slender */
        --iHeight: 0.96em;       /* cap-height; constant to avoid reflow */
        --iBaseline: -0.06em;    /* align with text baseline */
        position: relative;
        display:inline-block;
        inline-size: var(--iWidth);
        block-size: var(--iHeight);
        vertical-align: var(--iBaseline);
        overflow: visible;       /* tower can rise above without affecting layout */
      }
      .i-layer{
        position:absolute; inset:0;
        display:flex; align-items:flex-end; justify-content:center;
        will-change: opacity, transform;
        transition: opacity .28s cubic-bezier(.2,.7,.2,1),
                    transform .34s cubic-bezier(.3,.7,.2,1);
        pointer-events:none;
      }
      /* Base “I”: visible; Tower: hidden & slightly compressed */
      .i-text  { opacity:1;  transform: translateY(0%)    scale(1); }
      .i-tower { opacity:0;  transform: translateY(0%)    scale(0.96); }

      /* Morph to Campanile: fade/scale only. NO size change of the slot, so no layout shift. */
      .i-slot.on .i-text  { opacity:0; transform: translateY(0%)   scale(0.98); }
      .i-slot.on .i-tower { opacity:1; transform: translateY(-26%) scale(1.06); } /* rise above line visually */
      
      @media (prefers-reduced-motion: reduce){
        .i-layer{ transition:opacity .2s ease !important; transform:none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-[#ED6C5C]/10 opacity-40" />
      <div className="absolute inset-0 opacity-[0.03] bg-noise" />

      <div className="max-w-2xl mx-auto px-8 py-16 md:py-20 text-center relative z-10">
        {/* 3D L artwork ABOVE the wordmark (auto-fit, continuous spin) */}
        <HeroL3D />

        <div className="mb-8 opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
          <h1
            className="text-5xl md:text-7xl font-display font-semibold tracking-tight leading-tight text-white"
            style={{
              display: "inline-block",
              textShadow: "0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.35)",
            }}
          >
            <span>L</span>

            {/* Cap-height I ↔ Tall Campanile with no reflow */}
            <span className={`i-slot ${iAsTower ? "on" : ""}`}>
              {/* Cap-height I (uniform width) */}
              <span className="i-layer i-text">
                <svg width="100%" height="100%" viewBox="0 0 72 220" preserveAspectRatio="xMidYMax meet" className="text-white">
                  <g transform="translate(36,0)">
                    {/* centered slim stem at cap-height */}
                    <rect x={-21} y={72} width={42} height={138} fill="currentColor" />
                  </g>
                </svg>
              </span>

              {/* Berkeley-esque Campanile (taller but rendered via transform so line height doesn't change) */}
              <span className="i-layer i-tower">
                <svg width="100%" height="100%" viewBox="0 0 72 260" preserveAspectRatio="xMidYMax meet" className="text-white">
                  <g transform="translate(36,0)">
                    {/* shaft (slender) */}
                    <rect x={-21} y={58} width={42} height={170} fill="currentColor" />
                    {/* projecting cornice */}
                    <rect x={-24} y={50} width={48} height={8} fill="currentColor" />
                    {/* belfry with arched openings */}
                    <defs>
                      <mask id="campBelfryMask" maskUnits="userSpaceOnUse" x={-24} y={26} width={48} height={26}>
                        <rect x={-24} y={26} width={48} height={26} fill="white" />
                        <g fill="black">
                          {/* three arches */}
                          <path d="M-18,52 v-12 a6 6 0 0 1 12 0 v12 z" />
                          <path d="M-6,52  v-12 a6 6 0 0 1 12 0 v12 z" />
                          <path d="M6,52   v-12 a6 6 0 0 1 12 0 v12 z" />
                        </g>
                      </mask>
                    </defs>
                    <rect x={-24} y={26} width={48} height={26} fill="currentColor" mask="url(#campBelfryMask)" />
                    {/* larger clock */}
                    <g transform="translate(0,44)">
                      <circle r={9} fill="rgba(0,0,0,.85)" stroke="currentColor" strokeWidth={3} />
                      <circle r={1.2} fill="currentColor" />
                    </g>
                    {/* pyramidal roof + finial */}
                    <polygon
                      points="0,18 24,50 -24,50"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth={1}
                      vectorEffect="non-scaling-stroke"
                    />
                    <rect x={-1.2} y={14} width={2.4} height={4} fill="currentColor" rx={1.2} />
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
        <BodyCopy
          descriptions={descriptions}
          companyGroups={companyGroups}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          currentDescription={currentDescription}
          currentGroup={currentGroup}
        />

        <div className="opacity-0 animate-[fade-in_0.8s_ease-out_0.8s_forwards]">
          <Button
            size="xl"
            className="w-56 mx-auto py-4 text-base font-semibold text-white border border-white/15 rounded-full backdrop-blur-lg
                       bg-white/5 hover:bg-[#ED6C5C]/10
                       transition-all duration-300
                       hover:shadow-[0_0_26px_6px_rgba(237,108,92,0.38)]
                       focus-visible:ring-2 focus-visible:ring-[#ED6C5C]/60 focus-visible:outline-none"
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

/** Extracted body to keep top tidy */
function BodyCopy({
  descriptions,
  companyGroups,
  isPaused,
  setIsPaused,
  currentDescription,
  currentGroup,
}: {
  descriptions: string[];
  companyGroups: string[][];
  isPaused: boolean;
  setIsPaused: (v: boolean) => void;
  currentDescription: number;
  currentGroup: number;
}) {
  return (
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
  );
}
