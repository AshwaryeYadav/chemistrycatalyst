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

  // Advanced 3D Logo Styling
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .logo-3d {
        position: relative;
        display: inline-block;
        transform-style: preserve-3d;
        transition: transform 0.2s ease-out;
        font-weight: 900;
        letter-spacing: -0.02em;
      }
      
      .logo-lightspeed {
        color: #ffffff;
        position: relative;
        text-shadow: 
          0 2px 4px rgba(0,0,0,0.3),
          0 4px 8px rgba(0,0,0,0.2),
          0 8px 16px rgba(0,0,0,0.1);
      }
      
      .logo-lightspeed::before {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        color: #6b7280;
        transform: translateZ(-10px);
        text-shadow: 
          1px 1px 0 #4b5563,
          2px 2px 0 #4b5563,
          3px 3px 0 #6b7280,
          4px 4px 0 #6b7280,
          5px 5px 0 #9ca3af,
          6px 6px 0 #9ca3af,
          7px 7px 0 #d1d5db,
          8px 8px 0 #d1d5db;
      }
      
      .logo-lightspeed::after {
        display: none;
      }
      
      .logo-fellows {
        color: #9ca3af;
        opacity: 1;
        font-weight: 600;
        letter-spacing: 0.15em;
        position: relative;
        text-shadow: 
          0 1px 2px rgba(0,0,0,0.4),
          0 2px 4px rgba(0,0,0,0.3);
      }
      
      .logo-fellows::before {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        color: #6b7280;
        transform: translateZ(-5px);
        text-shadow: 
          1px 1px 0 #4b5563,
          2px 2px 0 #4b5563,
          3px 3px 0 #6b7280,
          4px 4px 0 #6b7280;
      }
      
      .logo-fellows::after {
        display: none;
      }
      
      .logo-underline {
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        width: 120%;
        height: 2px;
        background: linear-gradient(90deg, 
          transparent 0%, 
          rgba(255,255,255,0.2) 20%, 
          rgba(255,255,255,0.6) 50%, 
          rgba(255,255,255,0.2) 80%, 
          transparent 100%);
        border-radius: 1px;
        box-shadow: 
          0 0 5px rgba(255,255,255,0.2),
          0 0 10px rgba(255,255,255,0.1);
        animation: glow-pulse 3s ease-in-out infinite;
      }
      
      .logo-reflection {
        position: absolute;
        bottom: -100px;
        left: 0;
        right: 0;
        height: 50px;
        background: linear-gradient(180deg, 
          rgba(255,255,255,0.03) 0%, 
          transparent 100%);
        transform: scaleY(-1);
        opacity: 0.3;
        filter: blur(1px);
      }
      
      @keyframes iridescent {
        0% { 
          background: linear-gradient(45deg, 
            rgba(59,130,246,0.1) 0%,
            rgba(147,51,234,0.1) 33%,
            rgba(6,182,212,0.1) 66%,
            rgba(59,130,246,0.1) 100%);
        }
        33% { 
          background: linear-gradient(45deg, 
            rgba(147,51,234,0.1) 0%,
            rgba(6,182,212,0.1) 33%,
            rgba(59,130,246,0.1) 66%,
            rgba(147,51,234,0.1) 100%);
        }
        66% { 
          background: linear-gradient(45deg, 
            rgba(6,182,212,0.1) 0%,
            rgba(59,130,246,0.1) 33%,
            rgba(147,51,234,0.1) 66%,
            rgba(6,182,212,0.1) 100%);
        }
        100% { 
          background: linear-gradient(45deg, 
            rgba(59,130,246,0.1) 0%,
            rgba(147,51,234,0.1) 33%,
            rgba(6,182,212,0.1) 66%,
            rgba(59,130,246,0.1) 100%);
        }
      }
      
      @keyframes shimmer {
        0%, 100% { opacity: 0.1; transform: scale(1); }
        50% { opacity: 0.3; transform: scale(1.05); }
      }
      
      @keyframes glow-pulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
      
      @media (prefers-reduced-motion: reduce) {
        .logo-3d, .logo-lightspeed::after, .logo-underline, .logo-fellows {
          animation: none !important;
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
        
        {/* Premium 3D Logo */}
        <div className="mb-12 opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
          <div 
            className="perspective-[2000px] transform-gpu relative"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <h1 className="text-6xl md:text-8xl font-display tracking-tight leading-tight mb-8 relative">
              <div 
                className="logo-3d logo-lightspeed mb-4"
                data-text="LIGHTSPEED"
                style={{
                  transform: `rotateX(${-mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg) translateZ(60px)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                LIGHTSPEED
              </div>
              <div 
                className="logo-3d logo-fellows text-4xl md:text-6xl"
                data-text="FELLOWS"
                style={{
                  transform: `rotateX(${-mousePosition.y * 0.3}deg) rotateY(${mousePosition.x * 0.3}deg) translateZ(30px)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                FELLOWS
              </div>
              
              {/* Glowing underline */}
              <div className="logo-underline"></div>
              
              {/* Reflection effect */}
              <div className="logo-reflection"></div>
            </h1>
            
            {/* Geometric accent lines */}
            <div className="absolute -left-20 top-1/2 w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-y-1/2"></div>
            <div className="absolute -right-20 top-1/2 w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-y-1/2"></div>
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