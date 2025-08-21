import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

export function LightspeedHero() {
  const companyGroups = [
    ["Affirm", "Anthropic", "BetterUp"],
    ["Carta", "Epic Games", "Faire"],
    ["Glean", "Mistral", "Pika"],
    ["Snap", "Stripe", "Wiz"],
    ["Abridge", "Anduril", "Calm"],
    ["Databricks", "LMArena", "Rippling"],
    ["Saronic", "Solana", "Thinking Machines"],
    ["xAI", "Affirm", "Anthropic"]
  ];

  const descriptions = ["builders", "founders", "engineers", "hackers"];

  const [currentGroup, setCurrentGroup] = useState(0);
  const [currentDescription, setCurrentDescription] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

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

  // 3D Logo rotation on mouse move (Thrive Capital style)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (logoRef.current) {
        const rect = logoRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate rotation based on mouse position relative to logo center
        const rotateY = ((e.clientX - centerX) / rect.width) * 30; // Max 30 degrees
        const rotateX = -((e.clientY - centerY) / rect.height) * 20; // Max 20 degrees
        
        setRotation({ x: rotateX, y: rotateY });
      }

      // Parallax for other elements
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const offsetX = (e.clientX - centerX) / (rect.width / 2);
        const offsetY = (e.clientY - centerY) / (rect.height / 2);
        
        setMousePosition({
          x: offsetX * 5,
          y: offsetY * 5
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Advanced 3D Logo Styling
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* 3D Logo Container */
      .logo-3d-container {
        transform-style: preserve-3d;
        transition: transform 0.15s ease-out;
        cursor: pointer;
      }
      
      .logo-lightspeed, .logo-fellows {
        transform-style: preserve-3d;
        position: relative;
        transition: transform 0.15s ease-out;
      }
      
      /* LIGHTSPEED text styling */
      .logo-lightspeed {
        font-weight: 300;
        letter-spacing: -0.02em;
        background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 50%, #ED6C5C 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        transform: translateZ(60px);
      }
      
      /* FELLOWS text styling */
      .logo-fellows {
        font-weight: 600;
        letter-spacing: 0.15em;
        background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #ED6C5C 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        transform: translateZ(40px);
      }
      
      /* 3D depth layers */
      .logo-lightspeed::before,
      .logo-lightspeed::after,
      .logo-fellows::before,
      .logo-fellows::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        -webkit-text-fill-color: transparent;
      }
      
      .logo-lightspeed::before {
        transform: translateZ(30px);
        background: linear-gradient(135deg, #353A41 0%, #2A2E34 100%);
        -webkit-background-clip: text;
        background-clip: text;
        opacity: 0.3;
      }
      
      .logo-lightspeed::after {
        transform: translateZ(-30px);
        background: linear-gradient(135deg, #1a1d20 0%, #0f1112 100%);
        -webkit-background-clip: text;
        background-clip: text;
        opacity: 0.2;
      }
      
      .logo-fellows::before {
        transform: translateZ(20px);
        background: linear-gradient(135deg, #353A41 0%, #2A2E34 100%);
        -webkit-background-clip: text;
        background-clip: text;
        opacity: 0.3;
      }
      
      .logo-fellows::after {
        transform: translateZ(-20px);
        background: linear-gradient(135deg, #1a1d20 0%, #0f1112 100%);
        -webkit-background-clip: text;
        background-clip: text;
        opacity: 0.2;
      }
      
      /* Glowing underline */
      .logo-underline {
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%) translateZ(10px);
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
      }
      
      /* Hover effect - enhance 3D */
      .logo-3d-container:hover {
        transform: scale(1.02);
      }
      
      .logo-3d-container:hover .logo-lightspeed {
        transform: translateZ(80px);
      }
      
      .logo-3d-container:hover .logo-fellows {
        transform: translateZ(50px);
      }
      
      /* Reflection */
      .logo-reflection {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        height: 100%;
        background: linear-gradient(180deg, 
          rgba(255,255,255,0.05) 0%, 
          transparent 30%);
        transform: scaleY(-1) translateZ(-50px);
        opacity: 0.2;
        filter: blur(2px);
        pointer-events: none;
      }
      
      /* Description text - prevent wrapping */
      .description-line {
        white-space: nowrap;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      @media (max-width: 640px) {
        .description-line {
          font-size: 0.875rem;
        }
        .description-line-2 {
          font-size: 0.75rem;
        }
      }
      
      @media (prefers-reduced-motion: reduce) {
        .logo-3d-container, .logo-lightspeed, .logo-fellows {
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
      style={{ perspective: '2000px' }}
    >
      {/* Subtle tech atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-blue-500/5 opacity-30" />
      <div className="absolute inset-0 opacity-[0.015] bg-noise" />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center relative z-10">
        
        {/* 3D Rotatable Logo */}
        <div className="mb-12 opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
          <div 
            ref={logoRef}
            className="logo-3d-container relative inline-block"
            style={{
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transformStyle: 'preserve-3d'
            }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display tracking-tight leading-tight relative">
              <div className="flex flex-col items-center">
                <div 
                  className="logo-lightspeed mb-2 sm:mb-4"
                  data-text="LIGHTSPEED"
                  style={{
                    transform: `translateZ(60px) translateX(${mousePosition.x * 0.5}px) translateY(${mousePosition.y * 0.5}px)`
                  }}
                >
                  LIGHTSPEED
                </div>
                <div 
                  className="logo-fellows text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
                  data-text="FELLOWS"
                  style={{
                    transform: `translateZ(40px) translateX(${mousePosition.x * 0.3}px) translateY(${mousePosition.y * 0.3}px)`
                  }}
                >
                  FELLOWS
                </div>
              </div>
              
              {/* Underline with 3D depth */}
              <div className="logo-underline"></div>
              
              {/* 3D Reflection */}
              <div className="logo-reflection"></div>
            </h1>
            
            {/* Side accent lines */}
            <div 
              className="hidden lg:block absolute -left-20 top-1/2 w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{
                transform: `translateY(-50%) translateZ(20px) translateX(${mousePosition.x * -0.2}px)`
              }}
            ></div>
            <div 
              className="hidden lg:block absolute -right-20 top-1/2 w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{
                transform: `translateY(-50%) translateZ(20px) translateX(${mousePosition.x * 0.2}px)`
              }}
            ></div>
          </div>
        </div>

        {/* Description - Fixed height, no wrapping */}
        <div className="mb-12 sm:mb-16 opacity-0 animate-[fade-in_0.8s_ease-out_0.6s_forwards] space-y-3 sm:space-y-4">
          {/* First line - always single line */}
          <div className="font-mono text-white/90 leading-relaxed tracking-wide px-4 sm:px-6 lg:px-0">
            <span className="description-line text-sm sm:text-base lg:text-lg">
              {">"} A year-long fellowship for Berkeley's top{" "}
              <span className="text-white font-medium">
                {descriptions[currentDescription]}
              </span>
              {"."}
            </span>
          </div>
          
          {/* Second line - always single line */}
          <div 
            className="font-mono text-white/60 tracking-wide cursor-pointer transition-colors hover:text-white/80 px-4 sm:px-6 lg:px-0"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <span className="description-line description-line-2 text-xs sm:text-sm lg:text-base">
              {">"} Backed by investors behind{" "}
              <span className="text-white font-medium">
                {companyGroups[currentGroup].join(", ")}
              </span>
              {"."}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="opacity-0 animate-[fade-in_0.8s_ease-out_0.8s_forwards]">
          <Button 
            size="xl"
            className="w-full max-w-xs sm:max-w-sm lg:max-w-md xl:w-80 mx-auto py-4 sm:py-6 text-base sm:text-lg font-semibold text-white border border-white/20 rounded-lg backdrop-blur-lg bg-white/10 shadow-button hover:shadow-button-hover hover:bg-white/20 transition-all duration-500"
            onClick={() => window.open('https://form.typeform.com/to/vMxYsW4Y', '_blank')}
            style={{
              transform: `translateX(${mousePosition.x * 0.2}px) translateY(${mousePosition.y * 0.2}px)`
            }}
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