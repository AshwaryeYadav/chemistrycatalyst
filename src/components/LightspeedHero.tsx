import { Button } from "@/components/ui/button";

export function LightspeedHero() {
  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-6">
        {/* Logo */}
        <div className="mb-16 opacity-0 animate-[fade-in_0.8s_ease-out_0.2s_forwards]">
          <h2 className="text-2xl font-normal tracking-wide text-foreground">
            Lightspeed
          </h2>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-16 opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
          <span className="bg-gradient-elite bg-clip-text text-transparent">
            FELLOWS
          </span>
        </h1>

        {/* Exclusive Description */}
        <p className="text-lg text-muted-foreground/70 font-light leading-relaxed mb-20 max-w-2xl mx-auto opacity-0 animate-[fade-in_0.8s_ease-out_0.6s_forwards]">
          Elite technical fellowship at Berkeley.
        </p>

        {/* Exclusive CTA */}
        <div className="opacity-0 animate-[fade-in_0.8s_ease-out_0.8s_forwards]">
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