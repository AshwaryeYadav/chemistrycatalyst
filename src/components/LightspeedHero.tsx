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

  // Alignment + animation styles (scoped and injected once)
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      /* --- campanile glyph alignment --- */
      .campanile {
        display: inline-block;
        width: 0.74em;            /* visual width of the L (em-based so it scales with the font) */
        height: 1em;              /* lock to line's em box */
        vertical-align: -0.085em; /* baseline nudge (tweak ±0.01em if your font differs) */
        margin-right: 0.025em;    /* right side-bearing so it doesn't crowd the I */
        perspective: 900px;
        overflow: visible;
      }
      @media (min-width: 768px) {
        .campanile { vertical-align: -0.075em; width: 0.76em; }
      }

      /* Ensure nothing clips the spire */
      .hover-campanile-container,
      .glyph-container,
      .glyph-container svg { overflow: visible; }

      /* BODY = stem + foot, local origin: TOP-CENTER of the stem */
      #body { transform-origin: 50% 0%; transition: transform .5s cubic-bezier(.4,0,.2,1); }

      /* stem scales from top-center so its top NEVER moves */
      #stem { transform-origin: 50% 0%; transition: transform .5s cubic-bezier(.4,0,.2,1); }

      /* foot collapses into the stem: left/bottom origin keeps it welded */
      #foot { transform-origin: 0% 100%; transition: transform .5s cubic-bezier(.4,0,.2,1); }

      /* tower pieces above the same origin (negative Y) */
      #tower { opacity: 0; transform: translateY(0) scale(.98); transform-origin: 50% 100%;
               transition: opacity .35s ease .08s, transform .45s cubic-bezier(.2,.7,.2,1) .08s; }
      #belfry,#cap { transform-origin: 50% 100%; transform: scaleY(0); transition: transform .35s ease .12s; }
      #clock       { transform-origin: 50% 50%;  transform: scale(0);   transition: transform .30s ease .18s; }
      #spire       { transform-origin: 50% 100%; transform: translateY(10px) scale(.86); transition: transform .35s ease .18s; }

      /* Hover morph */
      .hover-campanile-container:hover #body { transform: scaleY(1.15); }
      .hover-campanile-container:hover #stem { transform: scaleX(.82); }
      .hover-campanile-container:hover #foot { transform: scaleX(.22) scaleY(.68); }

      .hover-campanile-container:hover #tower { opacity: 1; transform: translateY(0) scale(1); }
      .hover-campanile-container:hover #belfry,
      .hover-campanile-container:hover #cap   { transform: scaleY(1); }
      .hover-campanile-container:hover #clock { transform: scale(1); }
      .hover-campanile-container:hover #spire { transform: translateY(0) scale(1); }

      .glyph-container { transition: transform .6s cubic-bezier(.2,.7,.2,1); }
      .hover-campanile-container:hover .glyph-container { transform: translateY(-4px) rotateY(-8deg) scale(1.03); }

      @media (prefers-reduced-motion: reduce) {
        #body,#stem,#foot,#tower,#belfry,#cap,#clock,#spire,.glyph-container {
          transition: opacity .25s ease !important; transform: none !important;
        }
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
            {/* Interactive “L” locked to baseline */}
            <span className="campanile hover-campanile-container align-baseline">
              <div className="glyph-container" style={{ width: "100%", height: "100%" }}>
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 200 220"
                  preserveAspectRatio="xMidYMax meet"
                  className="text-white"
                  style={{ display: "block" }}
                >
                  {/* Root group puts origin at STEM TOP-CENTER: x=36 + 34/2 = 53, y=20 */}
                  <g id="root" transform="translate(53,20)">
                    {/* BODY (scales as one from top-center) */}
                    <g id="body">
                      {/* Stem: centered on origin, extends downward */}
                      <rect
                        id="stem"
                        x={-17}
                        y={0}
                        width={34}
                        height={160}
                        fill="currentColor"
                        style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,.55))" }}
                      />
                      {/* Foot: starts at centerline and goes right; glued to bottom of stem */}
                      <rect
                        id="foot"
                        x={0}
                        y={160 - 34}
                        width={120}
                        height={34}
                        fill="currentColor"
                        style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,.55))" }}
                      />
                    </g>

                    {/* TOWER (drawn above origin in negative Y) */}
                    <g id="tower">
                      <defs>
                        <mask id="belfryMask" maskUnits="userSpaceOnUse" x={-34} y={-48} width={68} height={40}>
                          <rect x={-34} y={-48} width={68} height={40} fill="white" />
                          <g fill="black">
                            <rect x={-28} y={-42} width={12} height={24} rx={6} />
                            <rect x={-12} y={-42} width={12} height={24} rx={6} />
                            <rect x={4} y={-42} width={12} height={24} rx={6} />
                            <rect x={20} y={-42} width={12} height={24} rx={6} />
                          </g>
                        </mask>
                      </defs>

                      {/* Cap sits on the stem top */}
                      <rect
                        id="cap"
                        x={-36}
                        y={-8}
                        width={72}
                        height={8}
                        fill="currentColor"
                        style={{ filter: "drop-shadow(0 6px 18px rgba(0,0,0,.5))" }}
                      />

                      {/* Belfry just above cap (masked arches) */}
                      <rect
                        id="belfry"
                        x={-34}
                        y={-48}
                        width={68}
                        height={40}
                        fill="currentColor"
                        mask="url(#belfryMask)"
                        style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,.55))" }}
                      />

                      {/* Clock under arches */}
                      <g id="clock" transform="translate(0,-18)" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,.4))" }}>
                        <circle r={9} fill="rgba(0,0,0,.8)" stroke="currentColor" strokeWidth={3} />
                        <circle r={1} fill="currentColor" />
                      </g>

                      {/* Spire */}
                      <polygon
                        id="spire"
                        points={`0,-77 36,-48 -36,-48`}
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth={1}
                        vectorEffect="non-scaling-stroke"
                        style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,.55))" }}
                      />
                    </g>
                  </g>
                </svg>
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
