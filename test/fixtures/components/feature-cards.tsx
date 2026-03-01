export function FeatureCards() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything you need to succeed
        </h2>
        <div className="grid grid-cols-3 gap-6">
          <FeatureCard
            title="Real-time Monitoring"
            description="Track your metrics as they happen with live updates"
            image="/feature-monitoring.png"
          />
          <FeatureCard
            title="Advanced Analytics"
            description="Deep dive into your data with powerful visualization tools"
            image="/feature-analytics.png"
          />
          <FeatureCard
            title="Team Collaboration"
            description="Work together seamlessly with shared dashboards"
            image="/feature-collaboration.png"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ 
  title, 
  description, 
  image 
}: { 
  title: string; 
  description: string; 
  image: string;
}) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
