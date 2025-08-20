import { Button } from "@/components/ui/button";
import lightspeedLogo from "@/assets/lightspeed-logo.png";

export function LightspeedHero() {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center relative overflow-hidden">
      {/* Dramatic background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-elite-accent/10 via-transparent to-elite-blue/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-elite-accent/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-elite-blue/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="text-center max-w-5xl mx-auto px-8 py-20 relative z-10">
        {/* Lightspeed Branding */}
        <div className="mb-20 opacity-0 animate-[fade-in_0.8s_ease-out_0.2s_forwards]">
          {/* Logo - styled like lsvp.com */}
          <div className="flex items-center justify-center mb-16">
            <img 
              src={lightspeedLogo} 
              alt="Lightspeed" 
              className="h-6 w-auto opacity-60 mr-3"
            />
            <h2 className="text-2xl font-display font-normal tracking-wide text-foreground/80">
              Lightspeed
            </h2>
          </div>
          
          {/* Main Hero Text - inspired by their bold typography */}
          <h1 className="text-7xl md:text-9xl font-display font-black tracking-tight leading-[0.85] mb-8">
            <span className="block bg-gradient-text bg-clip-text text-transparent">
              FELLOWS
            </span>
          </h1>
          
          {/* Subtitle with cool effect */}
          <div className="text-2xl md:text-3xl font-light text-foreground/60 tracking-widest uppercase">
            Elite • Technical • Berkeley
          </div>
        </div>

        {/* Description - more minimal and impactful */}
        <div className="mb-20 opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
          <p className="text-xl text-foreground/70 font-light leading-relaxed max-w-2xl mx-auto mb-8">
            Year-long mentorship from Partners at Lightspeed
          </p>
          
          {/* Company highlights with gradient */}
          <div className="flex flex-wrap justify-center gap-6 text-lg">
            <span className="bg-gradient-elite bg-clip-text text-transparent font-medium">Stripe</span>
            <span className="text-foreground/40">•</span>
            <span className="bg-gradient-elite bg-clip-text text-transparent font-medium">Anthropic</span>
            <span className="text-foreground/40">•</span>
            <span className="bg-gradient-elite bg-clip-text text-transparent font-medium">Anduril</span>
          </div>
        </div>

        {/* CTA - much cooler */}
        <div className="opacity-0 animate-[fade-in_0.8s_ease-out_0.6s_forwards]">
          <Button 
            variant="exclusive" 
            size="xl"
            className="px-16 py-6 text-base font-medium tracking-wider uppercase border-2 border-foreground/20 bg-transparent text-foreground hover:bg-foreground hover:text-background hover:border-foreground hover:shadow-premium transition-all duration-500 hover:scale-105"
            onClick={() => window.open('https://form.typeform.com/to/vMxYsW4Y', '_blank')}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}