import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, memo } from "react";

/* ---------- Plain isometric L (wireframe, orange) above the word ---------- */
const WireIsoL = memo(function WireIsoL({
  x = 0,
  y = 0,
  size = 1,
}: { x?: number; y?: number; size?: number }) {
  const rotX = -y * 0.4;
  const rotY = x * 0.6;
  return (
    <div
      aria-hidden
      className="mx-auto mb-8 text-[color:#FF7A1A]"
      style={{
        width: "110px",
        height: "110px",
        transformStyle: "preserve-3d",
        transform: `translateZ(25px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${size})`,
      }}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        {/* a simple stepped L made of 2 extruded boxes; tweak points as needed */}
        <g fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
          {/* top faces */}
          <polygon points="40,40 95,15 150,40 95,65" />
          <polygon points="95,65 150,40 150,95 95,120" />
          {/* vertical edges */}
          <line x1="40" y1="40" x2="40" y2="140" />
          <line x1="95" y1="65" x2="95" y2="170" />
          <line x1="150" y1="40" x2="150" y2="95" />
          {/* base face to make the L foot */}
          <polyline points="40,140 95,170 150,145" />
          <polyline points="40,140 80,120 95,120" />
          {/* outer silhouette to emphasize the L */}
          <polyline points="40,40 95,15 150,40 150,95 95,120 95,170" />
        </g>
      </svg>
    </div>
  );
});

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

  useEffect(() => {
    if (!isPaused) {
      const id = setInterval(
        () => setCurrentGroup((p) => (p + 1) % companyGroups.length),
        2400
      );
      return () => clearInterval(id);
    }
  }, [isPaused, companyGroups.length]);

  useEffect(() => {
    const id = setInterval(
      () => setCurrentDescription((p) => (p + 1) % descriptions.length),
      3600
    );
    return () => clearInterval(id);
  }, [descriptions.length]);

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

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    const id = setInterval(() => setIAsTower((v) => !v), 6000);
    return () => clearInterval(id);
  }, []);

  /* --- styles for IN-SLOT morph (fits inside 1em; no overflow) --- */
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .i-slot{
        --iWidth: 0.34em;        /* visually matches tower stem/cap */
        --iBaseline: -0.02em;
        --towerNudgeX: 0px;
        position: relative; display:inline-block;
        inline-size: var(--iWidth); block-size: 1em; /* <= whole tower fits inside */
        vertical-align: var(--iBaseline); overflow: hidden; /* hidden is SAFE now */
      }
      .i-layer{ position:absolute; inset:0; display:flex; align-items:flex-end; justify-content:center;
        will-change: opacity, transform;
        transition: opacity .36s cubic-bezier(.2,.7,.2,1), transform .42s cubic-bezier(.3,.7,.2,1); }
      .i-text  { opacity:1;  transform: translateY(0) scale(1); }
      .i-tower { opacity:0;  transform: translateY(6%) scale(.985) translateX(var(--towerNudgeX)); }
      .i-slot.on .i-text  { opacity:0; transform: translateY(-4%) scale(.985); }
      .i-slot.on .i-tower { opacity:1; transform: translateY(0)   scale(1)    translateX(var(--towerNudgeX)); }
      @media (prefers-reduced-motion: reduce){
        .i-layer{ transition:opacity .2s ease !important; transform:none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-hero flex items-center justify-center relative overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-orange-500/10 opacity-40" />
      <div className="absolute inset-0 opacity-[0.03] bg-noise" />

      <div className="max-w-2xl mx-auto px-8 py-20 text-center relative z-10">
        {/* Orange wireframe L above the word */}
        <WireIsoL x={mousePosition.x} y={mousePosition.y} />

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
            {/* L is now above; start directly with the morphing I */}
            <span className={`i-slot ${iAsTower ? "on" : ""}`}>
              {/* Layer A: block “I” (fits INSIDE slot) */}
              <span className="i-layer i-text">
                <svg width="100%" height="100%" viewBox="0 0 72 220" preserveAspectRatio="xMidYMax meet" className="text-white">
                  <g transform="translate(36,0)">
                    {/* stem (inside 1em box, y:40..210) */}
                    <rect x={-36} y={40} width={72} height={170} fill="currentColor" />
                  </g>
                </svg>
              </span>

              {/* Layer B: Campanile (fully contained in the same 0..220 viewBox) */}
              <span className="i-layer i-tower">
                <svg width="100%" height="100%" viewBox="0 0 72 220" preserveAspectRatio="xMidYMax meet" className="text-white">
                  <g transform="translate(36,0)">
                    {/* same stem */}
                    <rect x={-36} y={40} width={72} height={170} fill="currentColor" />
                    {/* cap just above the stem */}
                    <rect x={-36} y={32} width={72} height={8} fill="currentColor" />
                    {/* belfry with arches (masked) */}
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
                    <rect x={-34} y={0} width={68} height={32} fill="currentColor" mask="url(#iBelfryMask)" />
                    {/* clock */}
                    <g transform="translate(0,20)">
                      <circle r={9} fill="rgba(0,0,0,.8)" stroke="currentColor" strokeWidth={3} />
                      <circle r={1} fill="currentColor" />
                    </g>
                    {/* spire (stays inside 0..32 band) */}
                    <polygon
                      points="0,0 36,32 -36,32"
                      fill="currentColor"
                      stroke="currentColor" strokeWidth={1} vectorEffect="non-scaling-stroke"
                    />
                  </g>
                </svg>
              </span>
            </span>

            {/* finish the word + the rest */}
            <span>GHTSPEED</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">FELLOWS</span>
          </h1>
        </div>

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
            className="w-48 mx-auto py-3 text-base font-semibold text-white border border-white/20 rounded-full backdrop-blur-lg bg-white/10 shadow-button hover:shadow-button-hover hover:bg-white/20 transition-all duration-500"
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
