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
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragRotation, setDragRotation] = useState({ x: 0, y: 0 });
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

  // Handle mouse down for drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  };

  // Handle mouse move for drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        setDragRotation({
          x: (deltaY / 2) % 360,
          y: (deltaX / 2) % 360
        });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setRotation(prev => ({
          x: (prev.x + dragRotation.x) % 360,
          y: (prev.y + dragRotation.y) % 360
        }));
        setDragRotation({ x: 0, y: 0 });
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
    } else {
      document.body.style.cursor = 'auto';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'auto';
    };
  }, [isDragging, dragStart]);

  // Advanced 3D Logo Styling with depth
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* 3D Logo Container */
      .logo-3d-container {
        transform-style: preserve-3d;
        transition: transform 0.15s ease-out;
        cursor: grab;
        user-select: none;
        -webkit-user-select: none;
      }
      
      .logo-3d-container.dragging {
        cursor: grabbing;
      }
      
      /* Text layers with 3D depth - BOLD */
      .logo-lightspeed {
        font-weight: 800;
        letter-spacing: -0.03em;
        color: #ffffff;
        position: relative;
        display: block;
        transform-style: preserve-3d;
      }
      
      .logo-fellows {
        font-weight: 800;
        letter-spacing: 0.12em;
        color: #ffffff;
        position: relative;
        display: block;
        transform-style: preserve-3d;
      }
      
      /* Create 3D extrusion effect */
      .logo-lightspeed::before,
      .logo-fellows::before {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        color: #353A41;
        z-index: -1;
        transform: translateZ(-1px);
      }
      
      /* Multiple depth layers for 3D effect */
      .logo-depth {
        position: absolute;
        top: 0;
        left: 0;
        color: #2a2e34;
        z-index: -2;
        user-select: none;
      }
      
      /* Shadow layers for depth */
      .text-shadow-3d {
        text-shadow: 
          1px 1px 0 #353A41,
          2px 2px 0 #353A41,
          3px 3px 0 #353A41,
          4px 4px 0 #2a2e34,
          5px 5px 0 #2a2e34,
          6px 6px 0 #2a2e34,
          7px 7px 0 #1a1d20,
          8px 8px 0 #1a1d20,
          9px 9px 0 #1a1d20,
          10px 10px 0 #0f1112,
          11px 11px 0 #0f1112,
          12px 12px 0 #0f1112,
          13px 13px 20px rgba(0,0,0,0.5),
          14px 14px 30px rgba(0,0,0,0.4),
          15px 15px 40px rgba(0,0,0,0.3);
      }
      
      .text-shadow-3d-fellows {
        text-shadow: 
          1px 1px 0 #353A41,
          2px 2px 0 #353A41,
          3px 3px 0 #2a2e34,
          4px 4px 0 #2a2e34,
          5px 5px 0 #1a1d20,
          6px 6px 0 #1a1d20,
          7px 7px 0 #0f1112,
          8px 8px 15px rgba(0,0,0,0.5),
          9px 9px 25px rgba(0,0,0,0.4);
      }
      
      /* Hover rotation effect */
      .logo-3d-container:not(.dragging):hover {
        animation: subtle-rotate 4s ease-in-out infinite;
      }
      
      @keyframes subtle-rotate {
        0%, 100% { transform: rotateX(0deg) rotateY(0deg); }
        25% { transform: rotateX(5deg) rotateY(10deg); }
        50% { transform: rotateX(-5deg) rotateY(-10deg); }
        75% { transform: rotateX(5deg) rotateY(-10deg); }
      }
      
      /* Glowing underline */
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
        box-shadow: 0 0 10px rgba(237, 108, 92, 0.3);
      }
      
      /* Description text - no wrapping */
      .description-line {
        white-space: nowrap;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      @media (max-width: 640px) {
        .text-shadow-3d {
          text-shadow: 
            1px 1px 0 #353A41,
            2px 2px 0 #2a2e34,
            3px 3px 0 #1a1d20,
            4px 4px 0 #0f1112,
            5px 5px 10px rgba(0,0,0,0.5);
        }
        .text-shadow-3d-fellows {
          text-shadow: 
            1px 1px 0 #353A41,
            2px 2px 0 #2a2e34,
            3px 3px 0 #1a1d20,
            4px 4px 8px rgba(0,0,0,0.5);
        }
      }
      
      @media (prefers-reduced-motion: reduce) {
        .logo-3d-container {
          animation: none !important;
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
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ 
        perspective: '2000px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #fbc2eb 75%, #ffecd2 100%)'
      }}
    >
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center relative z-10">
        
        {/* 3D Spinnable Logo */}
        <div className="mb-12 opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
          <div 
            ref={logoRef}
            className={`logo-3d-container relative inline-block ${isDragging ? 'dragging' : ''}`}
            style={{
              transform: `rotateX(${rotation.x + dragRotation.x}deg) rotateY(${rotation.y + dragRotation.y}deg)`,
              transformStyle: 'preserve-3d'
            }}
            onMouseDown={handleMouseDown}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-tight relative">
              <div className="flex flex-col items-center">
                {/* LIGHTSPEED with 3D depth */}
                <div className="relative mb-2 sm:mb-4">
                  <span 
                    className="logo-lightspeed text-shadow-3d font-black"
                    data-text="LIGHTSPEED"
                  >
                    LIGHTSPEED
                  </span>
                </div>
                
                {/* FELLOWS with 3D depth */}
                <div className="relative">
                  <span 
                    className="logo-fellows text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-shadow-3d-fellows font-black"
                    data-text="FELLOWS"
                  >
                    FELLOWS
                  </span>
                </div>
              </div>
              
              {/* Underline */}
              <div className="logo-underline"></div>
            </h1>
            
            {/* Side accent lines that don't rotate */}
            <div className="hidden lg:block absolute -left-20 top-1/2 w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-y-1/2"></div>
            <div className="hidden lg:block absolute -right-20 top-1/2 w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-y-1/2"></div>
          </div>
        </div>

        {/* Description - Fixed, no rotation */}
        <div className="mb-12 sm:mb-16 opacity-0 animate-[fade-in_0.8s_ease-out_0.6s_forwards] space-y-3 sm:space-y-4">
          {/* First line */}
          <div className="font-mono text-white/90 leading-relaxed tracking-wide px-4 sm:px-6 lg:px-0">
            <span className="description-line text-sm sm:text-base lg:text-lg">
              {">"} A year-long fellowship for Berkeley's top{" "}
              <span className="text-white font-medium">
                {descriptions[currentDescription]}
              </span>
              {"."}
            </span>
          </div>
          
          {/* Second line */}
          <div 
            className="font-mono text-white/60 tracking-wide cursor-pointer transition-colors hover:text-white/80 px-4 sm:px-6 lg:px-0"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <span className="description-line text-xs sm:text-sm lg:text-base">
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