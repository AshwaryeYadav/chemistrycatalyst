import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentGroup((prev) => (prev + 1) % companyGroups.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isPaused, companyGroups.length]);

  useEffect(() => {
    const descInterval = setInterval(() => {
      setCurrentDescription((prev) => (prev + 1) % descriptions.length);
    }, 4000);
    return () => clearInterval(descInterval);
  }, [descriptions.length]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x: x * 20, y: y * 20 });
      }
    };
    const el = containerRef.current;
    if (el) {
      el.addEventListener("mousemove", handleMouseMove);
      return () => el.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  // Scoped styles: two stacked layers, constant spacing, tiny tower alignment knob
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .campanile {
        --width: 0.80em;           /* glyph advance width (fixed) */
        --baseline: -0.11em;       /* baseline nudge */
        --gap: 0.035em;            /* space before "I" (fixed) */
        --towerAlignFix: -3px;     /* <— move Tower layer left/right (− = left, + = right) */
        display: inline-block;
        inline-size: var(--width);
        block-size: 1em;
        vertical-align: var(--baseline);
        margin-right: var(--gap);
        perspective: 900px;
      }

      .campanile-inner {
        position: relative;
        width: 100%;
        height: 1em;               /* lock to line height */
        overflow: visible;
      }

      .layer {
        position: absolute;
        inset: 0;
        will-change: transform, opacity;
        transition: opacity .38s cubic-bezier(.2,.7,.2,1),
                    transform .45s cubic-bezier(.3,.7,.2,1);
      }

      /* Default: show the L; Tower hidden */
      .layer-l    { opacity: 1; transform: translateY(0) scale(1); }
      .layer-tower{ opacity: 0; transform: translateY(6%) scale(.985); }

      /* Hover: crossfade L -> Tower */
      .hover-campanile-container:hover .layer-l     { opacity: 0; transform: translateY(-4%) scale(.985); }
      .hover-campanile-container:hover .layer-tower { opacity: 1; transform: translateY(0)   scale(1); }

      /* Small 3D flourish (optional) */
      .glyph-container { transition: transform .45s cubic-bezier(.2,.7,.2,1); }
      .hover-campanile-container:hover .glyph-container { transform: translateY(-2px) rotateY(-5deg) scale(1.02); }

      /* Tower fine alignment wrapper */
      .tower-align { width: 100%; height: 100%; transform: translateX(var(--towerAlignFix)); }

      @media (prefers-reduced-motion: reduce) {
        .layer, .glyph-container { transition: opacity .25s ease !important; transform: none !important; }
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
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-blue-500/5 opacity-30" />
      <div className="absolute inset-0 opacity-[0.015] bg-noise" />

      <div className="max-w-2xl mx-auto px-8 py-20 text-center relative z-10">
        <div className="mb-12 opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
          <h1
            className="text-5xl md:text-7xl font-display font-semibold tracking-tight leading-tight text-white mb-8 transition-transform duration-200 ease-out"
            style={{
              transform: `rotateX(${-mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg) translateZ(20px)`,
              textShadow: `
                0 1px 0 rgba(255,255,255,0.1),
                0 2px 4px rgba(0,0,0,0.3),
                ${mousePosition.x * 0.5}px ${mousePosition.y * 0.5}px 10px rgba(0,0,0,0.2)
              `,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Two-layer approach: L (layer-l) and Tower (layer-tower) */}
            <span className="campanile hover-campanile-container align-baseline">
              <div className="campanile-inner glyph-container">
                {/* LAYER A: Classic L (thin stem + foot) */}
                <div className="layer layer-l">
                  <svg
                    width="100%" height="100%"
                    viewBox="0 0 200 220"
                    preserveAspectRatio="xMidYMax meet"
                    className="text-white"
                    style={{ display: "block", overflow: "visible" }}
                  >
                    {/* origin at stem top-center (x=53, y=20) */}
                    <g transform="translate(53,20)">
                      {/* thin stem */}
                      <rect
                        x={-17} y={0} width={34} height={160}
                        fill="currentColor"
                        style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,.55))" }}
                      />
                      {/* right foot */}
                      <rect
                        x={0} y={126} width={120} height={34}
                        fill="currentColor"
                        style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,.55))" }}
                      />
                    </g>
                  </svg>
                </div>

                {/* LAYER B: Tower + thick stem perfectly under the head (no foot) */}
                <div className="layer layer-tower">
                  <div className="tower-align">
                    <svg
                      width="100%" height="100%"
                      viewBox="0 0 200 220"
                      preserveAspectRatio="xMidYMax meet"
                      className="text-white"
                      style={{ display: "block", overflow: "visible" }}
                    >
                      {/* same origin so centers match; we can nudge via --towerAlignFix */}
                      <g transform="translate(53,20)">
                        {/* THICK stem: exactly cap width (72px), centered */}
                        <rect
                          x={-36} y={0} width={72} height={175}
                          fill="currentColor"
                          style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,.55))" }}
                        />

                        {/* Cap (72 wide) */}
                        <rect
                          x={-36} y={-8} width={72} height={8}
                          fill="currentColor"
                          style={{ filter: "drop-shadow(0 6px 18px rgba(0,0,0,.5))" }}
                        />

                        {/* Belfry with arches */}
                        <defs>
                          <mask id="belfryMask2" maskUnits="userSpaceOnUse" x={-34} y={-48} width={68} height={40}>
                            <rect x={-34} y={-48} width={68} height={40} fill="white" />
                            <g fill="black">
                              <rect x={-28} y={-42} width={12} height={24} rx={6} />
                              <rect x={-12} y={-42} width={12} height={24} rx={6} />
                              <rect x={4}   y={-42} width={12} height={24} rx={6} />
                              <rect x={20}  y={-42} width={12} height={24} rx={6} />
                            </g>
                          </mask>
                        </defs>
                        <rect
                          x={-34} y={-48} width={68} height={40}
                          fill="currentColor" mask="url(#belfryMask2)"
                          style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,.55))" }}
                        />

                        {/* Clock */}
                        <g transform="translate(0,-18)" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,.4))" }}>
                          <circle r={9} fill="rgba(0,0,0,.8)" stroke="currentColor" strokeWidth={3} />
                          <circle r={1} fill="currentColor" />
                        </g>

                        {/* Spire */}
                        <polygon
                          points={`0,-77 36,-48 -36,-48`}
                          fill="currentColor"
                          stroke="currentColor" strokeWidth={1} vectorEffect="non-scaling-stroke"
                          style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,.55))" }}
                        />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </span>

            <span className="campanile-rest transition-all duration-300">IGHTSPEED</span>
            <br />
            <span className="bg-gradient-text bg-clip-text text-transparent">FELLOWS</span>
          </h1>
        </div>

        <div className="mb-16 opacity-0 animate-[fade-in_0.8s_ease-out_0.6s_forwards] space-y-4">
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
            className="w-80 mx-auto py-6 text-lg font-semibold text-white border border-white/20 rounded-lg backdrop-blur-lg bg-white/10 shadow-button hover:shadow-button-hover hover:bg-white/20 transition-all duration-500"
            onClick={() => window.open("https://form.typeform.com/to/vMxYsW4Y", "_blank")}
          >
            Apply Now
          </Button>
        </div>
      </div>

      <footer className="absolute bottom-0 left-0 right-0 p-6 text-center">
        <div className="text-xs font-mono text-white/40">LIGHTSPEED © 2025</div>
      </footer>
    </div>
  );
}
