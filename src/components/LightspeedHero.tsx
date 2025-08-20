import { Button } from "@/components/ui/button";
import lightspeedLogo from "@/assets/lightspeed-logo.png";
import { useEffect, useState } from "react";

export function LightspeedHero() {
  const [times, setTimes] = useState({
    berkeley: '',
    newYork: '',
    london: ''
  });

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      setTimes({
        berkeley: now.toLocaleTimeString('en-US', { 
          timeZone: 'America/Los_Angeles', 
          hour12: true, 
          hour: 'numeric', 
          minute: '2-digit' 
        }),
        newYork: now.toLocaleTimeString('en-US', { 
          timeZone: 'America/New_York', 
          hour12: true, 
          hour: 'numeric', 
          minute: '2-digit' 
        }),
        london: now.toLocaleTimeString('en-US', { 
          timeZone: 'Europe/London', 
          hour12: true, 
          hour: 'numeric', 
          minute: '2-digit' 
        })
      });
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle relative">
      {/* Global Time Display */}
      <div className="absolute top-8 left-0 right-0 flex justify-between px-8 text-xs text-elite-silver/60 font-medium tracking-[0.2em] uppercase">
        <span>Berkeley {times.berkeley}</span>
        <span>New York {times.newYork}</span>
        <span>London {times.london}</span>
      </div>

      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-5xl mx-auto px-6 py-20">
        {/* Logo */}
        <div className="mb-8 opacity-0 animate-[fade-in_0.8s_ease-out_0.2s_forwards]">
          <img 
            src={lightspeedLogo} 
            alt="Lightspeed Fellows" 
            className="h-20 mx-auto mb-4 filter brightness-0 invert opacity-90"
          />
        </div>

        {/* Main Title */}
        <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-12 opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
          LIGHTSPEED
          <br />
          <span className="bg-gradient-elite bg-clip-text text-transparent">
            FELLOWS
          </span>
        </h1>

        {/* Exclusive Description */}
        <p className="text-lg md:text-xl text-muted-foreground/80 font-light leading-relaxed mb-16 max-w-3xl mx-auto opacity-0 animate-[fade-in_0.8s_ease-out_0.6s_forwards]">
          Elite technical fellowship at Berkeley. Direct partner access. 
          <br />
          Never raised outside capital, exclusive by design.
        </p>

        {/* Elite Stats */}
        <div className="flex justify-center items-center gap-12 mb-20 text-xs text-elite-silver/70 font-medium tracking-[0.3em] uppercase opacity-0 animate-[fade-in_0.8s_ease-out_0.8s_forwards]">
          <span>Twelve Selected</span>
          <span className="w-0.5 h-0.5 bg-elite-silver/50 rounded-full"></span>
          <span>$2B+ Under Management</span>
          <span className="w-0.5 h-0.5 bg-elite-silver/50 rounded-full"></span>
          <span>Berkeley Exclusive</span>
        </div>

        {/* Exclusive CTA */}
        <div className="opacity-0 animate-[fade-in_0.8s_ease-out_1s_forwards]">
          <Button 
            variant="exclusive" 
            size="xl"
            className="shadow-elite hover:shadow-glow mb-8"
            onClick={() => window.open('https://form.typeform.com/to/vMxYsW4Y', '_blank')}
          >
            Request Consideration →
          </Button>
          
          <p className="text-xs text-muted-foreground/50 tracking-[0.2em] uppercase">
            Invitation Only
          </p>
        </div>
        
        {/* Bottom Navigation */}
        <div className="absolute bottom-8 left-8 right-8 flex justify-between text-xs text-elite-silver/40 font-medium tracking-[0.2em] uppercase">
          <span>Lightspeed Venture Partners</span>
          <span>© 2024</span>
        </div>
      </div>
      </div>
    </div>
  );
}