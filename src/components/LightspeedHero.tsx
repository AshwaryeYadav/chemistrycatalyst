import { Button } from "@/components/ui/button";
import lightspeedLogo from "@/assets/lightspeed-logo.png";

export function LightspeedHero() {
  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
      <div className="text-center max-w-3xl mx-auto px-6">
        {/* Logo */}
        <div className="mb-12 opacity-0 animate-[fade-in_0.8s_ease-out_0.2s_forwards]">
          <img 
            src={lightspeedLogo} 
            alt="Lightspeed" 
            className="h-8 w-auto mx-auto mb-8"
          />
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">
            <span className="bg-gradient-elite bg-clip-text text-transparent">
              Lightspeed Fellows
            </span>
          </h1>
        </div>

        {/* Description */}
        <div className="mb-12 opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
          <p className="text-xl text-muted-foreground/80 font-light leading-relaxed mb-8">
            Elite technical fellowship for Berkeley students.
          </p>
          
          <p className="text-lg text-muted-foreground/70 font-light leading-relaxed mb-6">
            1:1 mentorship from Partners at Lightspeed, backers of companies like{" "}
            <span className="text-foreground font-medium">Stripe</span>,{" "}
            <span className="text-foreground font-medium">Anthropic</span>, and{" "}
            <span className="text-foreground font-medium">Anduril</span>.
          </p>
          
          <p className="text-lg text-muted-foreground/70 font-light">
            Year-long program.
          </p>
        </div>

        {/* CTA */}
        <div className="opacity-0 animate-[fade-in_0.8s_ease-out_0.6s_forwards]">
          <Button 
            variant="exclusive" 
            size="lg"
            className="shadow-elite hover:shadow-glow"
            onClick={() => window.open('https://form.typeform.com/to/vMxYsW4Y', '_blank')}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}