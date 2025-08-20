export function ExclusiveDetails() {
  return (
    <div className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Scarcity Section */}
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-8 text-elite-silver">
            Twelve. No More.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We select exactly twelve exceptional Berkeley students each year. 
            Each fellow receives direct 1:1 mentorship from Lightspeed partners who have invested in
            the world's most valuable companies.
          </p>
        </div>

        {/* What You Get */}
        <div className="grid md:grid-cols-2 gap-16 mb-24">
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-medium mb-3 text-elite-gold">Direct Partner Access</h3>
              <p className="text-muted-foreground leading-relaxed">
                Work directly with partners who have led investments in Stripe, Snapchat, 
                and hundreds of other category-defining companies.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-3 text-elite-gold">Inner Circle Network</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect with founders, executives, and technical leaders across 
                Lightspeed's portfolio and extended network.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-medium mb-3 text-elite-gold">Exclusive Opportunities</h3>
              <p className="text-muted-foreground leading-relaxed">
                First access to internships and full-time roles at portfolio companies, 
                plus introductions to founding opportunities.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-3 text-elite-gold">Lifetime Membership</h3>
              <p className="text-muted-foreground leading-relaxed">
                Once a fellow, always a fellow. Join an exclusive alumni network 
                that opens doors throughout your career.
              </p>
            </div>
          </div>
        </div>

        {/* Selection Process */}
        <div className="text-center">
          <h2 className="text-2xl font-light tracking-tight mb-6 text-elite-silver">
            Selection Process
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Applications are reviewed holistically. We look for exceptional technical ability, 
            intellectual curiosity, and the potential to build category-defining companies. 
            Most applicants are declined.
          </p>
        </div>
      </div>
    </div>
  );
}