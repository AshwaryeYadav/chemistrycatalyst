import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

export function LightspeedHero() {
  const companyGroups = [
    ["Stripe", "Anthropic", "Anduril"],
    ["Wiz", "Glean", "Rubrik"],
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

  // Refined L-to-Campanile morphing with better positioning and seamless transformation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Set all Campanile elements to start hidden/collapsed */
      #belfry {
        opacity: 0;
        transform: scaleY(0);
        transform-origin: center bottom;
        transition: opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s;
      }
      #clock {
        opacity: 0;
        transform: scale(0);
        transform-origin: center center;
        transition: opacity 0.3s ease 0.25s, transform 0.3s ease 0.25s;
      }
      #cap {
        opacity: 0;
        transform: scaleY(0);
        transform-origin: center bottom;
        transition: opacity 0.3s ease 0.2s, transform 0.3s ease 0.2s;
      }
      #spire {
        opacity: 0;
        transform: scale(0.8) translateY(10px);
        transform-origin: center bottom;
        transition: opacity 0.4s ease 0.3s, transform 0.4s ease 0.3s;
      }
      
      /* L elements that morph smoothly */
      #stem {
        transform-origin: center bottom;
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
      #foot {
        transform-origin: left bottom;
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      /* Better positioning - align with text baseline */
      .glyph-container {
        transform: translateY(8px); /* Move down to align morphed tower with baseline */
        transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
      }
      
      /* Hover states - seamless morphing */
      .hover-campanile-container:hover #stem {
        transform: scaleX(0.8) scaleY(1.15) translateX(1px) translateY(-4px);
      }
      .hover-campanile-container:hover #foot {
        transform: scaleX(0.22) scaleY(0.6) translateX(2px);
      }
      .hover-campanile-container:hover #belfry {
        opacity: 1;
        transform: scaleY(1);
      }
      .hover-campanile-container:hover #clock {
        opacity: 1;
        transform: scale(1);
      }
      .hover-campanile-container:hover #cap {
        opacity: 1;
        transform: scaleY(1);
      }
      .hover-campanile-container:hover #spire {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
      
      /* Enhanced 3D container effects with better positioning */
      .hover-campanile-container:hover .glyph-container {
        transform: translateY(-1px) rotateY(-8deg) scale(1.03);
      }
      
      .hover-campanile-container:hover + .campanile-rest {
        text-shadow: 0 12px 26px rgba(0,0,0,0.45);
        transition: text-shadow 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
      }
      .campanile-rest {
        transition: text-shadow 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
      }
      
      /* Smooth return animation */
      .hover-campanile-container:not(:hover) #stem {
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.6, 1);
      }
      .hover-campanile-container:not(:hover) #foot {
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.6, 1);
      }
      .hover-campanile-container:not(:hover) #belfry,
      .hover-campanile-container:not(:hover) #clock,
      .hover-campanile-container:not(:hover) #cap,
      .hover-campanile-container:not(:hover) #spire {
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      
      @media (prefers-reduced-motion: reduce) {
        #stem, #foot, #belfry, #clock, #cap, #spire, .glyph-container, .campanile-rest {
          transition: opacity 0.25s ease !important;
          transform: none !important;
        }
        .hover-campanile-container:hover .glyph-container {
          transform: translateY(2px) !important;
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
        
        {/* Main Title - Less Nike-like */}
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
              <div className="glyph-container" style={{ width: '100%', height: '100%' }}>
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
                        <rect x="70" y="118" width="16" height="26" rx="8"/>
                        <rect x="90" y="118" width="16" height="26" rx="8"/>
                        <rect x="110" y="118" width="16" height="26" rx="8"/>
                        <rect x="130" y="118" width="16" height="26" rx="8"/>
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

                  {/* Horizontal foot of the L -> slims into the shaft */}
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

                  {/* Belfry block with arches */}
                  <rect 
                    id="belfry" 
                    x="60" 
                    y="100" 
                    width="100" 
                    height="50"
                    fill="currentColor" 
                    mask="url(#arches)" 
                    style={{
                      filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.55))'
                    }}
                  />

                  {/* Clock face */}
                  <g 
                    id="clock" 
                    transform="translate(110,135)"
                    style={{
                      filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))'
                    }}
                  >
                    <circle r="9" fill="rgba(0,0,0,0.8)" stroke="currentColor" strokeWidth="3"/>
                    <circle r="1" fill="currentColor"/>
                  </g>

                  {/* Cap below the spire */}
                  <rect 
                    id="cap" 
                    x="56" 
                    y="94" 
                    width="108" 
                    height="8" 
                    fill="currentColor" 
                    style={{
                      filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.5))'
                    }}
                  />

                  {/* Spire that grows upward */}
                  <polygon 
                    id="spire"
                    points="100,60 164,94 36,94"
                    fill="currentColor" 
                    style={{
                      filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.55))'
                    }}
                  />
                </svg>
              </div>
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