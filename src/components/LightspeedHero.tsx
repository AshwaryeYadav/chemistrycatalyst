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
            <span className="relative inline-block group">
              <span className="group-hover:opacity-0 transition-opacity duration-300">L</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg 
                  width="40" 
                  height="60" 
                  viewBox="0 0 40 60" 
                  className="text-white fill-current"
                >
                  {/* Campanile base */}
                  <rect x="8" y="45" width="24" height="15" fill="currentColor" opacity="0.9" />
                  
                  {/* Main tower */}
                  <rect x="12" y="15" width="16" height="30" fill="currentColor" opacity="0.8" />
                  
                  {/* Clock chamber */}
                  <rect x="10" y="12" width="20" height="8" fill="currentColor" opacity="0.9" />
                  
                  {/* Clock face */}
                  <circle cx="20" cy="16" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.7" />
                  <circle cx="20" cy="16" r="0.5" fill="currentColor" opacity="0.7" />
                  
                  {/* Spire */}
                  <polygon points="20,2 14,12 26,12" fill="currentColor" opacity="0.95" />
                  
                  {/* Architectural details */}
                  <rect x="11" y="20" width="18" height="1" fill="currentColor" opacity="0.6" />
                  <rect x="11" y="30" width="18" height="1" fill="currentColor" opacity="0.6" />
                  <rect x="11" y="40" width="18" height="1" fill="currentColor" opacity="0.6" />
                  
                  {/* Windows */}
                  <rect x="15" y="25" width="2" height="3" fill="currentColor" opacity="0.4" />
                  <rect x="23" y="25" width="2" height="3" fill="currentColor" opacity="0.4" />
                  <rect x="15" y="35" width="2" height="3" fill="currentColor" opacity="0.4" />
                  <rect x="23" y="35" width="2" height="3" fill="currentColor" opacity="0.4" />
                </svg>
              </div>
            </span>IGHTSPEED
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