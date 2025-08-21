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
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isSpinning, setIsSpinning] = useState(false);
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

  // Hover-based 3D rotation system
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const logoElement = containerRef.current.querySelector('.unified-logo');
        
        if (logoElement) {
          const logoRect = logoElement.getBoundingClientRect();
          const centerX = logoRect.left + logoRect.width / 2;
          const centerY = logoRect.top + logoRect.height / 2;
          
          // Enhanced hover rotation with better sensitivity
          const x = (e.clientY - centerY) / logoRect.height * 35;
          const y = (e.clientX - centerX) / logoRect.width * 35;
          
          setRotation({
            x: -x,
            y: y,
            z: (x + y) * 0.15 // More dramatic Z rotation
          });
        }
      }
    };

    const handleMouseLeave = () => {
      // Smooth return to neutral position when mouse leaves
      setRotation({ x: 0, y: 0, z: 0 });
    };

    const handleDoubleClick = () => {
      // Double-click to start continuous spin
      setIsSpinning(true);
      setVelocity({ x: 3, y: 4 });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('dblclick', handleDoubleClick);
      
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('dblclick', handleDoubleClick);
      };
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
        font-weight: 100;
        background: linear-gradient(135deg, #ffffff 0%, #ffffff 85%, #ED6C5C 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 
          0 2px 4px rgba(53, 58, 65, 0.3),
          0 4px 8px rgba(53, 58, 65, 0.2),
          0 8px 16px rgba(53, 58, 65, 0.1);
        filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.1));
      }
      
      .logo-lightspeed::before {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        color: #353A41;
        -webkit-text-fill-color: #353A41;
        transform: translateZ(-12px);
        text-shadow: 
          1px 1px 0 #353A41, 2px 2px 0 #353A41, 3px 3px 0 #353A41,
          4px 4px 0 #353A41, 5px 5px 0 #353A41, 6px 6px 0 #353A41,
          7px 7px 0 #353A41, 8px 8px 0 #353A41, 9px 9px 0 #353A41,
          10px 10px 0 #353A41, 11px 11px 0 #353A41, 12px 12px 0 #353A41;
      }
      
      /* Intermediate depth layer for LIGHTSPEED */
      .logo-lightspeed::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        z-index: -3;
        color: #1A1D21;
        -webkit-text-fill-color: #1A1D21;
        transform: translateZ(-35px);
        text-shadow: 
          1px 1px 0 #1A1D21, 2px 2px 0 #1A1D21, 3px 3px 0 #1A1D21,
          4px 4px 0 #1A1D21, 5px 5px 0 #1A1D21, 6px 6px 0 #1A1D21,
          7px 7px 0 #1A1D21, 8px 8px 0 #1A1D21, 9px 9px 0 #1A1D21,
          10px 10px 0 #1A1D21, 11px 11px 0 #1A1D21, 12px 12px 0 #1A1D21,
          13px 13px 0 #1A1D21, 14px 14px 0 #1A1D21, 15px 15px 0 #1A1D21,
          16px 16px 0 #1A1D21, 17px 17px 0 #1A1D21, 18px 18px 0 #1A1D21,
          19px 19px 0 #1A1D21, 20px 20px 0 #1A1D21, 21px 21px 0 #1A1D21,
          22px 22px 0 #1A1D21, 23px 23px 0 #1A1D21, 24px 24px 0 #1A1D21,
          25px 25px 0 #1A1D21;
      }
      
      .logo-fellows {
        color: #ffffff;
        opacity: 0.95;
        font-weight: 600;
        letter-spacing: 0.15em;
        position: relative;
        background: linear-gradient(135deg, #ED6C5C 0%, #ffffff 30%, #ffffff 70%, #ED6C5C 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 
          0 1px 2px rgba(237, 108, 92, 0.3),
          0 2px 4px rgba(53, 58, 65, 0.3),
          0 4px 8px rgba(237, 108, 92, 0.1);
        filter: drop-shadow(0 0 6px rgba(237, 108, 92, 0.2));
      }
      
      .logo-fellows::before {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        color: #353A41;
        -webkit-text-fill-color: #353A41;
        transform: translateZ(-10px);
        text-shadow: 
          1px 1px 0 #353A41, 2px 2px 0 #353A41, 3px 3px 0 #353A41,
          4px 4px 0 #353A41, 5px 5px 0 #353A41, 6px 6px 0 #353A41,
          7px 7px 0 #353A41, 8px 8px 0 #353A41, 9px 9px 0 #353A41,
          10px 10px 0 #353A41;
      }
      
      /* Intermediate depth layer for FELLOWS */
      .logo-fellows::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        z-index: -2;
        color: #2A2E34;
        -webkit-text-fill-color: #2A2E34;
        transform: translateZ(-20px);
        text-shadow: 
          1px 1px 0 #2A2E34, 2px 2px 0 #2A2E34, 3px 3px 0 #2A2E34,
          4px 4px 0 #2A2E34, 5px 5px 0 #2A2E34, 6px 6px 0 #2A2E34,
          7px 7px 0 #2A2E34, 8px 8px 0 #2A2E34, 9px 9px 0 #2A2E34,
          10px 10px 0 #2A2E34, 11px 11px 0 #2A2E34, 12px 12px 0 #2A2E34,
          13px 13px 0 #2A2E34, 14px 14px 0 #2A2E34, 15px 15px 0 #2A2E34,
          16px 16px 0 #2A2E34, 17px 17px 0 #2A2E34, 18px 18px 0 #2A2E34,
          19px 19px 0 #2A2E34, 20px 20px 0 #2A2E34;
      }

      /* Smooth transitions for hover rotation */
      .unified-logo {
        transform-style: preserve-3d;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
      }
      
      /* Enhanced decorative lines with glow effects */
      .geometric-lines {
        position: absolute;
        width: 24px;
        height: 2px;
        background: linear-gradient(90deg, 
          transparent 0%, 
          rgba(237,108,92,0.3) 20%, 
          rgba(255,255,255,0.8) 50%, 
          rgba(237,108,92,0.3) 80%, 
          transparent 100%);
        border-radius: 1px;
        box-shadow: 
          0 0 8px rgba(237,108,92,0.4),
          0 0 16px rgba(255,255,255,0.2);
        animation: shimmer-lines 4s ease-in-out infinite;
      }
      
      .geometric-lines::before {
        content: '';
        position: absolute;
        top: -4px;
        left: 50%;
        transform: translateX(-50%);
        width: 8px;
        height: 8px;
        border: 1px solid rgba(237,108,92,0.5);
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
        box-shadow: 0 0 6px rgba(237,108,92,0.3);
      }
      
      .geometric-lines::after {
        content: '';
        position: absolute;
        top: 6px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        border: 1px solid rgba(255,255,255,0.4);
        border-radius: 50%;
        background: rgba(255,255,255,0.6);
        box-shadow: 0 0 4px rgba(255,255,255,0.3);
      }
      
      .logo-underline {
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        width: 120%;
        height: 3px;
        background: linear-gradient(90deg, 
          transparent 0%, 
          rgba(237,108,92,0.2) 10%,
          rgba(255,255,255,0.2) 20%, 
          rgba(255,255,255,0.8) 50%, 
          rgba(255,255,255,0.2) 80%, 
          rgba(237,108,92,0.2) 90%,
          transparent 100%);
        border-radius: 2px;
        box-shadow: 
          0 0 8px rgba(255,255,255,0.3),
          0 0 16px rgba(237,108,92,0.1);
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
      
      @keyframes shimmer-lines {
        0%, 100% { 
          opacity: 0.6; 
          transform: scaleX(1); 
          box-shadow: 
            0 0 8px rgba(237,108,92,0.2),
            0 0 16px rgba(255,255,255,0.1);
        }
        50% { 
          opacity: 1; 
          transform: scaleX(1.1); 
          box-shadow: 
            0 0 12px rgba(237,108,92,0.4),
            0 0 24px rgba(255,255,255,0.2);
        }
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
                className="unified-logo"
                style={{
                  transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                <div 
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
            
            {/* Enhanced geometric accent lines */}
            <div className="absolute geometric-lines -left-28 top-1/2 transform -translate-y-1/2"></div>
            <div className="absolute geometric-lines -right-28 top-1/2 transform -translate-y-1/2"></div>
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