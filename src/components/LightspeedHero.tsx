import { Button } from "@/components/ui/button";
import lightspeedLogo from "@/assets/lightspeed-logo.png";

export function LightspeedHero() {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-elite-gold/5 via-transparent to-elite-accent/5 opacity-50" />
      
      <div className="text-center max-w-2xl mx-auto px-8 py-20 relative z-10">
        {/* Logo */}
        <div className="mb-16 opacity-0 animate-[fade-in_0.8s_ease-out_0.2s_forwards]">
          <img 
            src={lightspeedLogo} 
            alt="Lightspeed Venture Partners" 
            className="h-10 w-auto mx-auto mb-12 opacity-80"
          />
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            <span className="bg-gradient-elite bg-clip-text text-transparent">
              Lightspeed Fellows
            </span>
          </h1>
        </div>

        {/* Description */}
        <div className="mb-16 opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards] space-y-6">
          <p className="text-2xl md:text-3xl text-foreground/90 font-light leading-relaxed">
            An elite year-long fellowship for Berkeley's top technical minds
          </p>
          
          <p className="text-lg text-muted-foreground/80 leading-relaxed max-w-xl mx-auto">
            1:1 mentorship from Partners at Lightspeed — investors behind{" "}
            <span className="text-foreground font-semibold bg-gradient-elite bg-clip-text text-transparent">Stripe</span>,{" "}
            <span className="text-foreground font-semibold bg-gradient-elite bg-clip-text text-transparent">Anthropic</span>, and{" "}
            <span className="text-foreground font-semibold bg-gradient-elite bg-clip-text text-transparent">Anduril</span>
          </p>
        </div>

        {/* CTA */}
        <div className="opacity-0 animate-[fade-in_0.8s_ease-out_0.6s_forwards]">
          <Button 
            variant="exclusive" 
            size="xl"
            className="px-12 py-4 text-lg font-semibold shadow-premium hover:shadow-glow hover:scale-105 transition-all duration-300 hover:bg-gradient-elite hover:text-primary-foreground"
            onClick={() => window.open('https://form.typeform.com/to/vMxYsW4Y', '_blank')}
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
}