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
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isSpinning, setIsSpinning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lightspeedRef = useRef<HTMLDivElement>(null);
  const fellowsRef = useRef<HTMLDivElement>(null);

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

  // Individual text element hover-based 3D rotation system
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent, element: HTMLDivElement) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Smooth hover rotation based on mouse position relative to the specific element
      const x = (e.clientY - centerY) / rect.height * 25;
      const y = (e.clientX - centerX) / rect.width * 25;
      
      setRotation({
        x: -x,
        y: y,
        z: (x + y) * 0.1 // Subtle Z rotation based on position
      });
    };

    const handleMouseLeave = () => {
      // Return to neutral position when mouse leaves either element
      setRotation({ x: 0, y: 0, z: 0 });
    };

    const handleDoubleClick = () => {
      // Double-click to start continuous spin
      setIsSpinning(true);
      setVelocity({ x: 2, y: 3 });
    };

    const lightspeedElement = lightspeedRef.current;
    const fellowsElement = fellowsRef.current;

    // Add event listeners to both text elements
    if (lightspeedElement) {
      const lightspeedMouseMove = (e: MouseEvent) => handleMouseMove(e, lightspeedElement);
      lightspeedElement.addEventListener('mousemove', lightspeedMouseMove);
      lightspeedElement.addEventListener('mouseleave', handleMouseLeave);
      lightspeedElement.addEventListener('dblclick', handleDoubleClick);
      
      // Store cleanup functions for lightspeed element
      const cleanupLightspeed = () => {
        lightspeedElement.removeEventListener('mousemove', lightspeedMouseMove);
        lightspeedElement.removeEventListener('mouseleave', handleMouseLeave);
        lightspeedElement.removeEventListener('dblclick', handleDoubleClick);
      };

      if (fellowsElement) {
        const fellowsMouseMove = (e: MouseEvent) => handleMouseMove(e, fellowsElement);
        fellowsElement.addEventListener('mousemove', fellowsMouseMove);
        fellowsElement.addEventListener('mouseleave', handleMouseLeave);
        fellowsElement.addEventListener('dblclick', handleDoubleClick);
        
        return () => {
          cleanupLightspeed();
          fellowsElement.removeEventListener('mousemove', fellowsMouseMove);
          fellowsElement.removeEventListener('mouseleave', handleMouseLeave);
          fellowsElement.removeEventListener('dblclick', handleDoubleClick);
        };
      }
      
      return cleanupLightspeed;
    }
  }, []);

  // Momentum and continuous rotation system
  useEffect(() => {
    if (isSpinning) {
      const animationFrame = requestAnimationFrame(() => {
        setRotation(prev => ({
          x: prev.x + velocity.x,
          y: prev.y + velocity.y,
          z: prev.z + velocity.y * 0.1 // Add subtle Z rotation during spin
        }));
        
        // Gradually reduce velocity (friction)
        setVelocity(prev => {
          const newVelX = prev.x * 0.98;
          const newVelY = prev.y * 0.98;
          
          // Stop spinning when velocity is very low
          if (Math.abs(newVelX) < 0.1 && Math.abs(newVelY) < 0.1) {
            setIsSpinning(false);
            return { x: 0, y: 0 };
          }
          
          return { x: newVelX, y: newVelY };
        });
      });
      
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isSpinning, velocity]);

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
      
      .unified-logo {
        transform-style: preserve-3d;
        transition: transform 0.1s ease-out;
        cursor: grab;
      }
      
      .unified-logo:active {
        cursor: grabbing;
      }
      
      .logo-lightspeed {
        color: #ffffff;
        position: relative;
        font-weight: 300;
        background: linear-gradient(135deg, #e5e7eb 0%, #e5e7eb 70%, #ED6C5C 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 
          0 2px 4px rgba(53, 58, 65, 0.4),
          0 4px 8px rgba(53, 58, 65, 0.3),
          0 8px 16px rgba(53, 58, 65, 0.2);
      }
      
      .logo-lightspeed::before {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        color: #353A41;
        -webkit-text-fill-color: #353A41;
        transform: translateZ(-15px);
        text-shadow: 
          1px 1px 0 #353A41,
          2px 2px 0 #353A41,
          3px 3px 0 #353A41,
          4px 4px 0 #353A41,
          5px 5px 0 #353A41,
          6px 6px 0 #353A41,
          7px 7px 0 #353A41,
          8px 8px 0 #353A41,
          9px 9px 0 #353A41,
          10px 10px 0 #353A41;
      }
      
      .logo-fellows {
        color: #ffffff
        opacity: 0.9;
        font-weight: 600;
        letter-spacing: 0.15em;
        position: relative;
        background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #ED6C5C 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 
          0 1px 2px rgba(53, 58, 65, 0.4),
          0 2px 4px rgba(53, 58, 65, 0.3);
      }
      
      .logo-fellows::before {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        color: #353A41;
        -webkit-text-fill-color: #353A41;
        transform: translateZ(-8px);
        text-shadow: 
          1px 1px 0 #353A41,
          2px 2px 0 #353A41,
          3px 3px 0 #353A41,
          4px 4px 0 #353A41,
          5px 5px 0 #353A41;
      }

      /* Enhanced 3D Fill Layers */
      .logo-lightspeed::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        z-index: -2;
        color: #2A2E34;
        -webkit-text-fill-color: #2A2E34;
        transform: translateZ(-30px);
        text-shadow: 
          1px 1px 0 #2A2E34, 2px 2px 0 #2A2E34, 3px 3px 0 #2A2E34,
          4px 4px 0 #2A2E34, 5px 5px 0 #2A2E34, 6px 6px 0 #2A2E34,
          7px 7px 0 #2A2E34, 8px 8px 0 #2A2E34, 9px 9px 0 #2A2E34,
          10px 10px 0 #2A2E34, 11px 11px 0 #2A2E34, 12px 12px 0 #2A2E34,
          13px 13px 0 #2A2E34, 14px 14px 0 #2A2E34, 15px 15px 0 #2A2E34,
          16px 16px 0 #2A2E34, 17px 17px 0 #2A2E34, 18px 18px 0 #2A2E34,
          19px 19px 0 #2A2E34, 20px 20px 0 #2A2E34;
      }

      .logo-fellows::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        z-index: -2;
        color: #2A2E34;
        -webkit-text-fill-color: #2A2E34;
        transform: translateZ(-16px);
        text-shadow: 
          1px 1px 0 #2A2E34, 2px 2px 0 #2A2E34, 3px 3px 0 #2A2E34,
          4px 4px 0 #2A2E34, 5px 5px 0 #2A2E34, 6px 6px 0 #2A2E34,
          7px 7px 0 #2A2E34, 8px 8px 0 #2A2E34, 9px 9px 0 #2A2E34,
          10px 10px 0 #2A2E34;
      }

      /* Smooth transitions for hover rotation */
      .unified-logo {
        transform-style: preserve-3d;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
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
        overflow: hidden;
      }
      
      .logo-underline::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
          transparent 0%, 
          rgba(237, 108, 92, 0.4) 20%, 
          rgba(237, 108, 92, 0.8) 50%, 
          rgba(237, 108, 92, 0.4) 80%, 
          transparent 100%);
        animation: orange-sweep 2s linear infinite;
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
      
      @keyframes orange-sweep {
        0% { left: -100%; }
        100% { left: 100%; }
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
                className="unified-logo"
                style={{
                  transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                <div 
                  ref={lightspeedRef}
                  className="logo-3d logo-lightspeed mb-4"
                  data-text="LIGHTSPEED"
                  style={{
                    transform: 'translateZ(40px)',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  LIGHTSPEED
                </div>
                <div 
                  ref={fellowsRef}
                  className="logo-3d logo-fellows text-4xl md:text-6xl"
                  data-text="FELLOWS"
                  style={{
                    transform: 'translateZ(20px)',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  FELLOWS
                </div>
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