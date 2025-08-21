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
  padding = 1.25,
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

    // compute distance from size & FOV to fit height, then pad
    const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
    const maxDim = Math.max(sizeV.x, sizeV.y, sizeV.z);
    const dist = (maxDim / (2 * Math.tan(fov / 2))) * padding;

    // place camera on its current direction at the computed distance
    const dir = new THREE.Vector3(0, 0, 1);
    camera.getWorldDirection(dir); // current forward
    (camera as THREE.PerspectiveCamera).position.copy(center.clone().add(dir.multiplyScalar(-dist)));
    (camera as THREE.PerspectiveCamera).near = dist / 20;
    (camera as THREE.PerspectiveCamera).far = dist * 20;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
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
      style={{
        width: "200px",          // tweak size freely
        height: "200px",
        overflow: "visible",     // never crop
      }}
      aria-hidden
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [2.6, 2.2, 3.9], fov: 40, near: 0.1, far: 100 }}
        shadows
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)} // transparent
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          overflow: "visible",
          background: "transparent",
        }}
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

        {/* auto-fit the camera so the mesh fully fits, then spin it */}
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

  // CSS: slightly slimmer slot and **extra headroom** so nothing clips
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .i-slot{
        --iWidth: 0.26em;       /* slimmer than default */
        --iHeight: 1.02em;      /* a bit taller for headroom */
        --iBaseline: -0.06em;   /* align with text baseline */
        --towerNudgeX: 0px;
        position: relative; display:inline-block;
        inline-size: var(--iWidth);
        block-size: var(--iHeight);
        vertical-align: var(--iBaseline);
        overflow: hidden;       /* keep morph contained (we gave headroom) */
      }
      .i-layer{
        position:absolute; inset:0; display:flex; align-items:flex-end; justify-content:center;
        will-change: opacity, transform;
        transition: opacity .28s cubic-bezier(.2,.7,.2,1),
                    transform .34s cubic-bezier(.3,.7,.2,1);
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
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-[#ED6C5C]/10 opacity-40" />
      <div className="absolute inset-0 opacity-[0.03] bg-noise" />

      <div className="max-w-2xl mx-auto px-8 py-16 md:py-20 text-center relative z-10">
        {/* 3D L artwork ABOVE the wordmark (auto-fit, continuous spin) */}
        <HeroL3D />

        <div className="mb-8 opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
          <h1
            className="text-5xl md:text-7xl font-display font-semibold tracking-tight leading-tight text-white"
            /* No parallax — just a light shadow */
            style={{
              display: "inline-block",
              textShadow: "0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.35)",
            }}
          >
            <span>L</span>

            {/* Slim, safe-fitting I / Campanile (all elements shifted DOWN to avoid clipping) */}
            <span className={`i-slot ${iAsTower ? "on" : ""}`}>
              {/* Block I */}
              <span className="i-layer i-text">
                <svg width="100%" height="100%" viewBox="0 0 72 220" preserveAspectRatio="xMidYMax meet" className="text-white">
                  <g transform="translate(36,0)">
                    {/* start lower (y=68) so there is top headroom */}
                    <rect x={-21} y={68} width={42} height={142} fill="currentColor" />
                  </g>
                </svg>
              </span>

              {/* Campanile I */}
              <span className="i-layer i-tower">
                <svg width="100%" height="100%" viewBox="0 0 72 220" preserveAspectRatio="xMidYMax meet" className="text-white">
                  <g transform="translate(36,0)">
                    {/* stem lowered to y=68, height 142 (same visual as text variant) */}
                    <rect x={-21} y={68} width={42} height={142} fill="currentColor" />
                    {/* cornice lowered (y=62) */}
                    <rect x={-23} y={62} width={46} height={8} fill="currentColor" />
                    <defs>
                      {/* Belfry band lowered and shortened to leave headroom */}
                      <mask id="iBelfryMask" maskUnits="userSpaceOnUse" x={-23} y={36} width={46} height={24}>
                        <rect x={-23} y={36} width={46} height={24} fill="white" />
                        <g fill="black">
                          <rect x={-18} y={40} width={8} height={16} rx={4} />
                          <rect x={-6}  y={40} width={8} height={16} rx={4} />
                          <rect x={6}   y={40} width={8} height={16} rx={4} />
                          <rect x={18}  y={40} width={8} height={16} rx={4} />
                        </g>
                      </mask>
                    </defs>
                    <rect x={-23} y={36} width={46} height={24} fill="currentColor" mask="url(#iBelfryMask)" />
                    {/* small clock inside the belfry band */}
                    <g transform="translate(0,48)">
                      <circle r={7} fill="rgba(0,0,0,.8)" stroke="currentColor" strokeWidth={3} />
                      <circle r={1} fill="currentColor" />
                    </g>
                    {/* Spire apex at y=34 (lower than before) with margin to top */}
                    <polygon
                      points="0,34 23,62 -23,62"
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

/** Extracted body text block to keep file tidy */
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
