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
        setMousePosition({ x: x * 35, y: y * 35 }); // Enhanced sensitivity for premium 3D rotation
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Premium 3D Logo Styling with LSVP Colors
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .logo-3d {
        position: relative;
        display: inline-block;
        transform-style: preserve-3d;
        transition: transform 0.15s ease-out;
        font-weight: 900;
        letter-spacing: -0.02em;
        cursor: pointer;
      }
      
      .logo-lightspeed {
        background: linear-gradient(135deg, 
          #ffffff 0%,
          #f8fafc 20%,
          #FFD166 40%,
          #FFB347 60%,
          #ffffff 80%,
          #f1f5f9 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        position: relative;
        filter: brightness(1.1) contrast(1.1);
        text-shadow: 
          0 0 20px rgba(255, 209, 102, 0.3),
          0 0 40px rgba(255, 179, 71, 0.2);
      }
      
      .logo-lightspeed::before {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        color: #1a1a1a;
        transform: translateZ(-15px) translate(2px, 2px);
        text-shadow: 
          1px 1px 0 #0f0f0f,
          2px 2px 0 #1a1a1a,
          3px 3px 0 #262626,
          4px 4px 0 #333333,
          5px 5px 0 #404040,
          6px 6px 0 #4d4d4d,
          7px 7px 0 #595959,
          8px 8px 0 #666666,
          9px 9px 0 #737373,
          10px 10px 0 #808080,
          0 0 30px rgba(0,0,0,0.8);
      }
      
      .logo-lightspeed::after {
        content: '';
        position: absolute;
        top: -5px;
        left: 0;
        right: 0;
        height: 30%;
        background: linear-gradient(180deg, 
          rgba(255,255,255,0.4) 0%,
          rgba(255,255,255,0.2) 50%,
          transparent 100%);
        border-radius: 4px;
        z-index: 1;
        pointer-events: none;
      }
      
      .logo-fellows {
        background: linear-gradient(135deg, 
          #e0e0e0 0%,
          #c0c0c0 25%,
          #a8a8a8 50%,
          #7a7a7a 75%,
          #969696 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        opacity: 1;
        font-weight: 700;
        letter-spacing: 0.15em;
        position: relative;
        filter: brightness(1.05) contrast(1.15);
      }
      
      .logo-fellows::before {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        color: #2a2a2a;
        transform: translateZ(-12px) translate(1.5px, 1.5px);
        text-shadow: 
          1px 1px 0 #1f1f1f,
          2px 2px 0 #2a2a2a,
          3px 3px 0 #353535,
          4px 4px 0 #404040,
          5px 5px 0 #4b4b4b,
          6px 6px 0 #565656,
          7px 7px 0 #616161,
          8px 8px 0 #6c6c6c,
          0 0 25px rgba(0,0,0,0.6);
      }
      
      .logo-fellows::after {
        content: '';
        position: absolute;
        top: -3px;
        left: 0;
        right: 0;
        height: 25%;
        background: linear-gradient(180deg, 
          rgba(224,224,224,0.3) 0%,
          rgba(192,192,192,0.2) 50%,
          transparent 100%);
        border-radius: 3px;
        z-index: 1;
        pointer-events: none;
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
          rgba(255,209,102,0.3) 20%, 
          rgba(255,179,71,0.8) 50%, 
          rgba(255,209,102,0.3) 80%, 
          transparent 100%);
        border-radius: 2px;
        box-shadow: 
          0 0 15px rgba(255,209,102,0.4),
          0 0 30px rgba(255,179,71,0.2);
        animation: glow-pulse 4s ease-in-out infinite;
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
                className="logo-3d logo-lightspeed mb-6"
                data-text="LIGHTSPEED"
                style={{
                  transform: `rotateX(${-mousePosition.y * 0.8}deg) rotateY(${mousePosition.x * 0.8}deg) translateZ(80px)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                LIGHTSPEED
              </div>
              <div 
                className="logo-3d logo-fellows text-4xl md:text-6xl"
                data-text="FELLOWS"
                style={{
                  transform: `rotateX(${-mousePosition.y * 0.8}deg) rotateY(${mousePosition.x * 0.8}deg) translateZ(60px)`,
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