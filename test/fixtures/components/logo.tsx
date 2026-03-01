export function Logo() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="flex items-center gap-2">
        <img 
          src="/logo.svg" 
          alt="TechFlow Logo"
          className="h-8 w-auto"
        />
        <span className="font-bold text-xl">TechFlow</span>
      </div>
      <div className="flex items-center gap-6">
        <a href="/features" className="text-muted-foreground hover:text-foreground">
          Features
        </a>
        <a href="/pricing" className="text-muted-foreground hover:text-foreground">
          Pricing
        </a>
        <button className="px-4 py-2 bg-brand-primary text-white rounded-lg">
          Sign Up
        </button>
      </div>
    </nav>
  );
}

export function Favicon() {
  return (
    <>
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    </>
  );
}
