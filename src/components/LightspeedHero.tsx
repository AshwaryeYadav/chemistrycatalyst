import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

export function LightspeedHero() {
  const companyGroups = [
    ["Stripe", "Anthropic", "Anduril"],
    ["Wiz", "Glean", "Rubrik"],
    ["Anduril", "Rubrik", "Mulesoft"],
    ["Snap", "Mulesoft", "Nest"],
    ["AppDynamics", "Nutanix", "UiPath"],
    ["Affirm", "MindBody", "Nicira"]
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

  // Mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x: x * 20, y: y * 20 }); // Scale the movement
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Refined L-to-Campanile morphing with proper tower grouping
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Define the lift variable - extra height when stem scales to 1.15x */
      :root {
        --lift: 24px; /* (1.15 - 1) * 160px = 24px */
      }
      
      /* Tower group starts hidden */
      #tower {
        opacity: 0;
        transform: translateY(0);
        transition: opacity 0.4s ease 0.2s, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      /* Individual tower elements scale in */
      #belfry {
        transform: scaleY(0);
        transform-origin: center bottom;
        transition: transform 0.4s ease 0.15s;
      }
      #clock {
        transform: scale(0);
        transform-origin: center center;
        transition: transform 0.3s ease 0.25s;
      }
      #cap {
        transform: scaleY(0);
        transform-origin: center bottom;
        transition: transform 0.3s ease 0.2s;
      }
      #spire {
        transform: scale(0.8) translateY(10px);
        transform-origin: center bottom;
        transition: transform 0.4s ease 0.3s;
      }
      
      /* L elements that morph smoothly */
      #stem {
        transform-origin: center bottom;
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
      #foot {
        transform-origin: center center; /* Changed to center so it collapses inward */
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      /* Hover states - seamless morphing */
      .hover-campanile-container:hover #stem {
        transform: scaleX(0.8) scaleY(1.15);
      }
      .hover-campanile-container:hover #foot {
        transform: scaleX(0.25) scaleY(0.7); /* Shrinks from center */
      }
      
      /* Tower group moves up to stay on stem top */
      .hover-campanile-container:hover #tower {
        opacity: 1;
        transform: translateY(calc(-1 * var(--lift)));
      }
      
      /* Tower elements scale in */
      .hover-campanile-container:hover #belfry {
        transform: scaleY(1);
      }
      .hover-campanile-container:hover #clock {
        transform: scale(1);
      }
      .hover-campanile-container:hover #cap {
        transform: scaleY(1);
      }
      .hover-campanile-container:hover #spire {
        transform: scale(1) translateY(0);
      }
      
      /* Enhanced shadow effects */
      .hover-campanile-container:hover + .campanile-rest {
        text-shadow: 0 12px 26px rgba(0,0,0,0.45);
        transition: text-shadow 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
      }
      .campanile-rest {
        transition: text-shadow 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
      }
      
      /* Smooth return animation */
      .hover-campanile-container:not(:hover) #stem,
      .hover-campanile-container:not(:hover) #foot {
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.6, 1);
      }
      .hover-campanile-container:not(:hover) #tower {
        transition: opacity 0.3s ease, transform 0.4s cubic-bezier(0.4, 0, 0.6, 1);
      }
      .hover-campanile-container:not(:hover) #belfry,
      .hover-campanile-container:not(:hover) #clock,
      .hover-campanile-container:not(:hover) #cap,
      .hover-campanile-container:not(:hover) #spire {
        transition: transform 0.3s ease;
      }
      
      @media (prefers-reduced-motion: reduce) {
        #stem, #foot, #tower, #belfry, #clock, #cap, #spire, .campanile-rest {
          transition: opacity 0.25s ease !important;
          transform: none !important;
        }
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
      className="min-h-screen bg-gradient-hero flex items-center justify-center relative overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {/* Subtle tech atmosphere with noise texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-blue-500/5 opacity-30" />
      <div className="absolute inset-0 opacity-[0.015] bg-noise" />
      
      <div className="max-w-2xl mx-auto px-8 py-20 text-center relative z-10">
        
        {/* Main Title */}
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
              transformStyle: 'preserve-3d'
            }}
          >
            <span 
              className="relative inline-block hover-campanile-container"
              style={{ 
                perspective: '900px',
                display: 'inline-block',
                width: '0.76em',
                aspectRatio: '5 / 6.2'
              }}
            >
              <svg 
                id="lightspeed-logo"
                width="100%" 
                height="100%" 
                viewBox="0 0 200 220" 
                className="text-white"
                style={{ display: 'block' }}
              >
                {/* Masks for the belfry arches */}
                <defs>
                  <mask id="arches">
                    <rect x="0" y="0" width="200" height="220" fill="white"/>
                    <g fill="black">
                      <rect x="-22" y="58" width="12" height="20" rx="6"/>
                      <rect x="-7" y="58" width="12" height="20" rx="6"/>
                      <rect x="8" y="58" width="12" height="20" rx="6"/>
                      <rect x="23" y="58" width="12" height="20" rx="6"/>
                    </g>
                  </mask>
                </defs>

                {/* Vertical stem of the L -> becomes tower shaft */}
                <rect 
                  id="stem" 
                  x="36" 
                  y="20" 
                  width="34" 
                  height="160" 
                  fill="currentColor"
                  style={{
                    filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.55))'
                  }}
                />

                {/* Horizontal foot of the L -> shrinks from center */}
                <rect 
                  id="foot" 
                  x="36" 
                  y="180" 
                  width="120" 
                  height="34" 
                  fill="currentColor"
                  style={{
                    filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.55))'
                  }}
                />

                {/* Tower group - anchored to stem center (x=53) and top (y=20) */}
                <g id="tower" transform="translate(53,20)">
                  {/* Belfry block with arches - relative to group origin */}
                  <rect 
                    id="belfry" 
                    x="-28" 
                    y="40" 
                    width="68" 
                    height="40"
                    fill="currentColor" 
                    mask="url(#arches)" 
                    style={{
                      filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.55))'
                    }}
                  />

                  {/* Clock face - relative to group origin */}
                  <g 
                    id="clock" 
                    transform="translate(6,70)"
                    style={{
                      filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))'
                    }}
                  >
                    <circle r="9" fill="rgba(0,0,0,0.8)" stroke="currentColor" strokeWidth="3"/>
                    <circle r="1" fill="currentColor"/>
                  </g>

                  {/* Cap below the spire - relative to group origin */}
                  <rect 
                    id="cap" 
                    x="-30" 
                    y="34" 
                    width="72" 
                    height="8" 
                    fill="currentColor" 
                    style={{
                      filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.5))'
                    }}
                  />

                  {/* Spire that grows upward - relative to group origin */}
                  <polygon 
                    id="spire"
                    points="6,5 42,34 -30,34"
                    fill="currentColor" 
                    style={{
                      filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.55))'
                    }}
                  />
                </g>
              </svg>
            </span><span className="campanile-rest transition-all duration-300">IGHTSPEED</span>
            <br />
            <span className="bg-gradient-text bg-clip-text text-transparent">FELLOWS</span>
          </h1>
        </div>

        {/* Description - Typewriter font with cycling effect */}
        <div className="mb-16 opacity-0 animate-[fade-in_0.8s_ease-out_0.6s_forwards] space-y-4">
          <div className="text-lg font-mono text-white/90 leading-relaxed tracking-wide">
            {">"} A year-long fellowship for Berkeley's top{" "}
            <span className="text-white font-medium">
              {descriptions[currentDescription]}
            </span>
            {"."}
          </div>
          <div 
            className="text-base font-mono text-white/60 tracking-wide cursor-pointer transition-colors hover:text-white/80"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {">"} Backed by investors behind{" "}
            <span className="inline-block transition-all duration-500 ease-in-out transform whitespace-nowrap">
              <span className="text-white font-medium">
                {companyGroups[currentGroup][0]}
              </span>
              {", "}
              <span className="text-white font-medium">
                {companyGroups[currentGroup][1]}
              </span>
              {", "}
              <span className="text-white font-medium">
                {companyGroups[currentGroup][2]}
              </span>
            </span>
            .
          </div>
        </div>

        {/* Glowing CTA Button */}
        <div className="opacity-0 animate-[fade-in_0.8s_ease-out_0.8s_forwards]">
          <Button 
            size="xl"
            className="w-80 mx-auto py-6 text-lg font-semibold text-white border border-white/20 rounded-lg backdrop-blur-lg bg-white/10 shadow-button hover:shadow-button-hover hover:bg-white/20 transition-all duration-500"
            onClick={() => window.open('https://form.typeform.com/to/vMxYsW4Y', '_blank')}
          >
            Apply Now
          </Button>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-6 text-center">
        <div className="text-xs font-mono text-white/40">
          LIGHTSPEED © 2025
        </div>
      </footer>
    </div>
  );
}