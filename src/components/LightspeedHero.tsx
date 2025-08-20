import { Button } from "@/components/ui/button";
import lightspeedLogo from "@/assets/lightspeed-logo.png";

export function LightspeedHero() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-8 py-20 text-center">
        {/* Logo/Mark - small at top */}
        <div className="mb-16 opacity-0 animate-[fade-in_0.8s_ease-out_0.2s_forwards]">
          <img 
            src={lightspeedLogo} 
            alt="Lightspeed" 
            className="h-4 w-auto mx-auto opacity-40"
          />
        </div>
        
        {/* Main Title */}
        <div className="mb-12 opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-tight text-white mb-8">
            LIGHTSPEED
            <br />
            FELLOWS
          </h1>
        </div>

        {/* Description */}
        <div className="mb-16 opacity-0 animate-[fade-in_0.8s_ease-out_0.6s_forwards] space-y-4">
          <p className="text-xl text-white/80 leading-relaxed">
            A year-long fellowship for Berkeley's top builders.
          </p>
          <p className="text-lg text-white/60">
            Backed by the investors behind Stripe, Anthropic, and Anduril.
          </p>
        </div>

        {/* Full Width CTA */}
        <div className="opacity-0 animate-[fade-in_0.8s_ease-out_0.8s_forwards]">
          <Button 
            size="xl"
            className="w-full py-6 text-lg font-bold bg-white text-black hover:bg-white/90 transition-all duration-300"
            onClick={() => window.open('https://form.typeform.com/to/vMxYsW4Y', '_blank')}
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}