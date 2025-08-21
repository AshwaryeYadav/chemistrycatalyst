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

  // 3D Logo and animation styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* 3D L Logo Container */
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
      
      /* 3D L Icon */
      .l-icon-3d {
        width: 120px;
        height: 120px;
        margin: 0 auto 2rem;
        transform-style: preserve-3d;
        animation: float-rotate 8s ease-in-out infinite;
      }
      
      @keyframes float-rotate {
        0%, 100% { 
          transform: translateY(0px) rotateX(25deg) rotateY(45deg);
        }
        25% { 
          transform: translateY(-10px) rotateX(25deg) rotateY(135deg);
        }
        50% { 
          transform: translateY(0px) rotateX(25deg) rotateY(225deg);
        }
        75% { 
          transform: translateY(-10px) rotateX(25deg) rotateY(315deg);
        }
      }
      
      .l-face {
        position: absolute;
        opacity: 0.95;
      }
      
      /* L shape faces */
      .l-front {
        width: 120px;
        height: 120px;
        background: linear-gradient(135deg, #ED6C5C 0%, #ff8a75 100%);
        clip-path: polygon(0 0, 40% 0, 40% 60%, 100% 60%, 100% 100%, 0 100%);
        transform: translateZ(20px);
      }
      
      .l-back {
        width: 120px;
        height: 120px;
        background: linear-gradient(135deg, #c44d3f 0%, #ED6C5C 100%);
        clip-path: polygon(0 0, 40% 0, 40% 60%, 100% 60%, 100% 100%, 0 100%);
        transform: translateZ(-20px) rotateY(180deg);
      }
      
      /* Side faces for depth */
      .l-side-1 {
        width: 40px;
        height: 120px;
        background: linear-gradient(to bottom, #d45547 0%, #a63e32 100%);
        transform: translateX(20px) rotateY(90deg);
        left: -20px;
      }
      
      .l-side-2 {
        width: 40px;
        height: 40px;
        background: #b84436;
        transform: translateX(80px) translateY(80px) rotateY(90deg);
        left: 20px;
      }
      
      .l-side-3 {
        width: 120px;
        height: 40px;
        background: linear-gradient(to right, #c44d3f 0%, #d45547 100%);
        transform: translateY(100px) rotateX(90deg);
        top: -20px;
      }
      
      .l-side-4 {
        width: 80px;
        height: 40px;
        background: #d45547;
        transform: translateX(40px) translateY(60px) translateZ(0) rotateX(90deg);
        top: 20px;
      }
      
      /* Text with animated gradient */
      .logo-text {
        font-weight: 900;
        background: linear-gradient(270deg, #ffffff, #e5e7eb, #ED6C5C, #ffffff);
        background-size: 400% 400%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradient-shift 6s ease infinite;
        position: relative;
        display: inline-block;
        letter-spacing: -0.03em;
      }
      
      .logo-text-fellows {
        font-weight: 800;
        letter-spacing: 0.12em;
        background: linear-gradient(270deg, #ffffff, #f1f5f9, #ED6C5C, #ffffff);
        background-size: 400% 400%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradient-shift 6s ease infinite;
        animation-delay: 0.5s;
      }
      
      @keyframes gradient-shift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      
      /* Depth shadow for text */
      .text-depth {
        position: absolute;
        top: 2px;
        left: 2px;
        z-index: -1;
        color: rgba(0,0,0,0.1);
        font-weight: inherit;
        letter-spacing: inherit;
      }
      
      /* Glowing underline */
      .logo-underline {
        height: 2px;
        background: linear-gradient(90deg, 
          transparent 0%, 
          rgba(237, 108, 92, 0.3) 20%, 
          rgba(237, 108, 92, 0.8) 50%, 
          rgba(237, 108, 92, 0.3) 80%, 
          transparent 100%);
        animation: underline-glow 3s ease-in-out infinite;
        margin: 1rem auto;
        width: 200px;
      }
      
      @keyframes underline-glow {
        0%, 100% { opacity: 0.5; transform: scaleX(0.8); }
        50% { opacity: 1; transform: scaleX(1); }
      }
      
      /* Hover pause animation */
      .logo-3d-container:hover .l-icon-3d {
        animation-play-state: paused;
      }
      
      /* Description text - no wrapping */
      .description-line {
        white-space: nowrap;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      @media (max-width: 640px) {
        .l-icon-3d {
          width: 80px;
          height: 80px;
        }
        .l-front, .l-back {
          width: 80px;
          height: 80px;
        }
        .l-side-1 {
          width: 30px;
          height: 80px;
        }
      }
      
      @media (prefers-reduced-motion: reduce) {
        .l-icon-3d,
        .logo-text,
        .logo-text-fellows,
        .logo-underline {
          animation: none !important;
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #fbc2eb 75%, #ffecd2 100%)'
      }}
    >
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center relative z-10">
        
        {/* 3D L Logo and Text */}
        <div className="mb-12 opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
          <div 
            ref={logoRef}
            className={`logo-3d-container relative inline-block ${isDragging ? 'dragging' : ''}`}
            style={{
              transform: `rotateX(${rotation.x + dragRotation.x}deg) rotateY(${rotation.y + dragRotation.y}deg)`,
              transformStyle: 'preserve-3d'
            }}
            onMouseDown={handleMouseDown}
          >
            {/* 3D L Icon */}
            <div className="l-icon-3d relative">
              <div className="l-face l-front"></div>
              <div className="l-face l-back"></div>
              <div className="l-face l-side-1"></div>
              <div className="l-face l-side-2"></div>
              <div className="l-face l-side-3"></div>
              <div className="l-face l-side-4"></div>
            </div>
            
            {/* Animated Text */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight leading-tight">
              <div className="flex flex-col items-center">
                {/* LIGHTSPEED */}
                <div className="relative mb-2 sm:mb-4">
                  <span className="text-depth">LIGHTSPEED</span>
                  <span className="logo-text">
                    LIGHTSPEED
                  </span>
                </div>
                
                {/* FELLOWS */}
                <div className="relative">
                  <span className="text-depth text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">FELLOWS</span>
                  <span className="logo-text-fellows text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                    FELLOWS
                  </span>
                </div>
              </div>
              
              {/* Animated underline */}
              <div className="logo-underline"></div>
            </h1>
          </div>
        </div>

        {/* Description - Fixed, no rotation */}
        <div className="mb-12 sm:mb-16 opacity-0 animate-[fade-in_0.8s_ease-out_0.6s_forwards] space-y-3 sm:space-y-4">
          <div className="font-mono text-white/90 leading-relaxed tracking-wide px-4 sm:px-6 lg:px-0">
            <span className="description-line text-sm sm:text-base lg:text-lg">
              {">"} A year-long fellowship for Berkeley's top{" "}
              <span className="text-white font-medium">
                {descriptions[currentDescription]}
              </span>
              {"."}
            </span>
          </div>
          
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