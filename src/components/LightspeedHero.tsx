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

  // Enhanced mouse tracking for 3D rotation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x: x * 30, y: y * 30 }); // Increased sensitivity for dramatic 3D effect
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // 3D Text Styling
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .text-3d {
        position: relative;
        display: inline-block;
        transform-style: preserve-3d;
        transition: transform 0.1s ease-out;
      }
      
      .text-3d::before {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        color: inherit;
        z-index: -1;
        text-shadow: 
          1px 1px 0 rgba(0,0,0,0.8),
          2px 2px 0 rgba(0,0,0,0.7),
          3px 3px 0 rgba(0,0,0,0.6),
          4px 4px 0 rgba(0,0,0,0.5),
          5px 5px 0 rgba(0,0,0,0.4),
          6px 6px 0 rgba(0,0,0,0.3),
          7px 7px 0 rgba(0,0,0,0.2),
          8px 8px 0 rgba(0,0,0,0.1),
          0 0 40px rgba(255,255,255,0.1);
      }
      
      .text-3d-fellows {
        background: linear-gradient(135deg, 
          hsl(var(--primary)) 0%, 
          hsl(var(--primary-glow)) 50%, 
          hsl(var(--accent)) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .text-3d-fellows::before {
        background: linear-gradient(135deg, 
          rgba(255,255,255,0.8) 0%, 
          rgba(255,255,255,0.6) 50%, 
          rgba(255,255,255,0.4) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      @media (prefers-reduced-motion: reduce) {
        .text-3d {
          transform: none !important;
          transition: none !important;
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
        
        {/* Main Title - 3D Interactive Text */}
        <div className="mb-12 opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
          <div 
            className="perspective-[2000px] transform-gpu"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-tight mb-8">
              <div 
                className="text-3d text-white"
                data-text="LIGHTSPEED"
                style={{
                  transform: `rotateX(${-mousePosition.y * 0.8}deg) rotateY(${mousePosition.x * 0.8}deg) translateZ(50px)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                LIGHTSPEED
              </div>
              <br />
              <div 
                className="text-3d text-3d-fellows"
                data-text="FELLOWS"
                style={{
                  transform: `rotateX(${-mousePosition.y * 0.6}deg) rotateY(${mousePosition.x * 0.6}deg) translateZ(30px)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                FELLOWS
              </div>
            </h1>
          </div>
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