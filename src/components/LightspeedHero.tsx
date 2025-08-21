// src/components/LightspeedHero.tsx
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, memo, useMemo } from "react";

/* --------------------------- THREE: 3D Lightspeed L --------------------------- */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Extruded L built from the flat silhouette; exact color #ED6C5C */
const LMesh = memo(function LMesh() {
  const geom = useMemo(() => {
    const s = new THREE.Shape();
    // silhouette: tall stem + right foot
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
      <meshStandardMaterial color="#ED6C5C" metalness={0.15} roughness={0.35} />
    </mesh>
  );
});

/** Continuous rotator + expose ref so camera can frame it */
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

/** Fit the camera to the object once (and on resize) so it never crops */
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
    const fov = persp.fov * (Math.PI / 180);
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

/** Top artwork: standalone 3D L above the wordmark; transparent bg; auto-fit; no clipping */
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

  // CSS: regular I + tall Campanile state (taller than wordmark, Berkeley-esque)
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .i-slot{
        --iWidth: 0.26em;        /* slender look */
        --iHeight: 0.96em;       /* regular I height */
        --iBaseline: -0.06em;    /* baseline tweak */
        position: relative;
        display:inline-block;
        inline-size: var(--iWidth);
        block-size: var(--iHeight);
        vertical-align: var(--iBaseline);
        overflow: visible;       /* allow tower to rise above line */
        will-change: inline-size, block-size, transform;
        transition: block-size .35s cubic-bezier(.3,.7,.2,1),
                    inline-size .35s cubic-bezier(.3,.7,.2,1);
      }
      /* When morphed to the Campanile, make it taller so it stands above LIGHTSPEED */
      .i-slot.on{
        --iHeight: 1.36em;       /* grows taller than the cap height */
      }
      .i-layer{
        position:absolute; inset:0;
        display:flex; align-items:flex-end; justify-content:center;
        will-change: opacity, transform;
        transition: opacity .28s cubic-bezier(.2,.7,.2,1),
                    transform .34s cubic-bezier(.3,.7,.2,1);
        pointer-events:none;
      }
      .i-text  { opacity:1;  transform: translateY(0)    scale(1); }
      .i-tower { opacity:0;  transform: translateY(6%)   scale(.98); }
      .i-slot.on .i-text  { opacity:0; transform: translateY(-4%) scale(.985); }
      .i-slot.on .i-tower { opacity:1; transform: translateY(0%)  scale(1); }

      @media (prefers-reduced-motion: reduce){
        .i-layer{ transition:opacity .2s ease !important; transform:none !important; }
        .i-slot{ transition:none !important; }
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

            {/* Regular I ↔ Tall Campanile */}
            <span className={`i-slot ${iAsTower ? "on" : ""}`}>
              {/* Regular slim I (kept slightly shorter) */}
              <span className="i-layer i-text">
                <svg width="100%" height="100%" viewBox="0 0 72 220" preserveAspectRatio="xMidYMax meet" className="text-white">
                  <g transform="translate(36,0)">
                    <rect x={-21} y={72} width={42} height={138} fill="currentColor" />
                  </g>
                </svg>
              </span>

              {/* TALL, Berkeley-esque Campanile */}
              <span className="i-layer i-tower">
                <svg width="100%" height="100%" viewBox="0 0 72 260" preserveAspectRatio="xMidYMax meet" className="text-white">
                  <g transform="translate(36,0)">
                    {/* shaft (tall & slender) */}
                    <rect x={-21} y={58} width={42} height={170} fill="currentColor" />

                    {/* projecting cornice below belfry */}
                    <rect x={-24} y={50} width={48} height={8} fill="currentColor" />

                    {/* belfry band with arched openings */}
                    <defs>
                     <mask id="campBelfryMask" maskUnits="userSpaceOnUse" x={-24} y={26} width={48} height={26}>
  <rect x={-24} y={26} width={48} height={26} fill="white" />
  <g fill="black">
    {/* four arches (Berkeley-esque) */}
    <path d="M-18,52 v-12 a6 6 0 0 1 12 0 v12 z" />
    <path d="M-6,52  v-12 a6 6 0 0 1 12 0 v12 z" />
    <path d="M6,52   v-12 a6 6 0 0 1 12 0 v12 z" />
    <path d="M18,52  v-12 a6 6 0 0 1 12 0 v12 z" />
  </g>
</mask>

                    </defs>
                    <rect x={-24} y={26} width={48} height={26} fill="currentColor" mask="url(#campBelfryMask)" />

                    {/* larger clock centered (Berkeley vibe) */}
                    <g transform="translate(0,44)">
                      <circle r={9.5} fill="rgba(0,0,0,.85)" stroke="currentColor" strokeWidth={3} />
                      <circle r={1.2} fill="currentColor" />
                    </g>

                    {/* pyramidal roof with tiny finial */}
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
        <RotatingTextBlocks
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

/** Extracted body text block */
function RotatingTextBlocks({
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
