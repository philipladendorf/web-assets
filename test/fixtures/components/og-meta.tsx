export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>TechFlow - AI-Powered Analytics</title>
        <meta name="description" content="Transform your data into actionable insights" />
        
        {/* Open Graph */}
        <meta property="og:title" content="TechFlow - AI-Powered Analytics" />
        <meta property="og:description" content="Transform your data into actionable insights" />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TechFlow - AI-Powered Analytics" />
        <meta name="twitter:description" content="Transform your data into actionable insights" />
        <meta name="twitter:image" content="/twitter-card.png" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
