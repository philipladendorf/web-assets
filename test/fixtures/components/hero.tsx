export function Hero() {
  return (
    <section className="relative py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-5xl font-bold text-foreground">
              AI-Powered Analytics
            </h1>
            <p className="text-xl text-muted mt-4">
              Transform your data into actionable insights with our platform
            </p>
            <button className="mt-8 px-6 py-3 bg-brand-primary text-white rounded-lg">
              Get Started
            </button>
          </div>
          <div className="aspect-video rounded-lg overflow-hidden">
            <img 
              src="/placeholder-hero.png" 
              alt="Analytics dashboard"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
