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

  // Inject 3D Campanile morphing styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .morph-path {
        --l-path: path("M22 8 L22 112 L88 112 L88 90 L44 90 L44 8 Z");
        --campanile-path: path("M50 16 L36 26 L39 26 L39 30 L41 30 L41 42 L43 42 L43 110 L57 110 L57 42 L59 42 L59 30 L61 30 L61 26 L64 26 Z M46 36 A3 3 0 1 1 52 36 A3 3 0 1 1 46 36 M46 50 A4 4 0 1 1 54 50 A4 4 0 1 1 46 50 M50 48.2 A1.8 1.8 0 1 1 50 51.8 A1.8 1.8 0 1 1 50 48.2");
        d: var(--l-path);
        transition: d 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
      }
      .hover-campanile-container:hover .morph-path {
        d: var(--campanile-path);
      }
      .hover-campanile-container:hover + .campanile-rest {
        text-shadow: 0 12px 26px rgba(0,0,0,0.45) !important;
      }
      @media (prefers-reduced-motion: reduce) {
        .morph-path {
          transition: d 0.25s ease !important;
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
              <svg 
                width="100%" 
                height="100%" 
                viewBox="0 0 100 120" 
                className="text-white"
                style={{ display: 'block' }}
              >
                {/* Morphing path from L to Campanile */}
                <path 
                  className="morph-path fill-current"
                  style={{
                    transformBox: 'fill-box',
                    transformOrigin: '50% 60%',
                    filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.55))'
                  }}
                />
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