import { Button } from "@/components/ui/button";
import lightspeedLogo from "@/assets/lightspeed-logo.png";

export function LightspeedHero() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
      <div className="text-center max-w-4xl mx-auto px-6">
        {/* Logo */}
        <div className="mb-8 opacity-0 animate-[fade-in_0.8s_ease-out_0.2s_forwards]">
          <img 
            src={lightspeedLogo} 
            alt="Lightspeed Fellows" 
            className="h-20 mx-auto mb-4 filter brightness-0 invert opacity-90"
          />
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6 opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
          LIGHTSPEED
          <br />
          <span className="bg-gradient-elite bg-clip-text text-transparent">
            FELLOWS
          </span>
        </h1>

        {/* Exclusive Description */}
        <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed mb-8 max-w-2xl mx-auto opacity-0 animate-[fade-in_0.8s_ease-out_0.6s_forwards]">
          An intimate fellowship for the top 1% of technical minds at Berkeley.
          <br />
          Direct access to Lightspeed partners and their network of industry titans.
        </p>

        {/* Elite Stats */}
        <div className="flex justify-center items-center gap-8 mb-12 text-sm text-elite-silver font-medium tracking-widest opacity-0 animate-[fade-in_0.8s_ease-out_0.8s_forwards]">
          <span>12 SELECTED</span>
          <span className="w-1 h-1 bg-elite-silver rounded-full"></span>
          <span>$2B+ PORTFOLIO</span>
          <span className="w-1 h-1 bg-elite-silver rounded-full"></span>
          <span>BERKELEY ONLY</span>
        </div>

        {/* Exclusive CTA */}
        <div className="opacity-0 animate-[fade-in_0.8s_ease-out_1s_forwards]">
          <Button 
            variant="exclusive" 
            size="xl"
            className="shadow-elite hover:shadow-glow"
            onClick={() => window.open('https://form.typeform.com/to/vMxYsW4Y', '_blank')}
          >
            Request Consideration
          </Button>
          
          <p className="text-xs text-muted-foreground/60 mt-4 tracking-wide">
            Applications reviewed by invitation only
          </p>
        </div>
      </div>
    </div>
  );
}