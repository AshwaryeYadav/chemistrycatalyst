import { Button } from "@/components/ui/button";
import lightspeedLogo from "@/assets/lightspeed-logo.png";

export function LightspeedHero() {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center relative overflow-hidden">
      {/* Subtle tech atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-blue-500/5 opacity-30" />
      
      <div className="max-w-2xl mx-auto px-8 py-20 text-center relative z-10">
        {/* Logo/Mark - small at top */}
        <div className="mb-16 opacity-0 animate-[fade-in_0.8s_ease-out_0.2s_forwards]">
          <img 
            src={lightspeedLogo} 
            alt="Lightspeed" 
            className="h-4 w-auto mx-auto opacity-40"
          />
        </div>
        
        {/* Main Title - Less Nike-like */}
        <div className="mb-12 opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
          <h1 className="text-5xl md:text-7xl font-display font-semibold tracking-tight leading-tight text-white mb-8">
            LIGHTSPEED
            <br />
            <span className="bg-gradient-text bg-clip-text text-transparent">FELLOWS</span>
          </h1>
        </div>

        {/* Description - Typewriter font */}
        <div className="mb-16 opacity-0 animate-[fade-in_0.8s_ease-out_0.6s_forwards] space-y-4">
          <p className="text-lg font-mono text-white/90 leading-relaxed tracking-wide">
            {">"} A year-long fellowship for Berkeley's top builders.
          </p>
          <p className="text-base font-mono text-white/60 tracking-wide">
            {">"} Backed by the investors behind Stripe, Anthropic, and Anduril.
          </p>
        </div>

        {/* Glowing CTA Button */}
        <div className="opacity-0 animate-[fade-in_0.8s_ease-out_0.8s_forwards]">
          <Button 
            size="xl"
            className="w-full py-6 text-lg font-semibold bg-gradient-button text-black shadow-button hover:shadow-button-hover transition-all duration-500 hover:scale-[1.02] hover:bg-white border-0 rounded-lg"
            onClick={() => window.open('https://form.typeform.com/to/vMxYsW4Y', '_blank')}
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}