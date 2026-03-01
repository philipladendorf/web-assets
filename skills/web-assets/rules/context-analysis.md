# Context Analysis

Analyze where the image will be used to determine:
1. **Structural context** — dimensions, aspect ratio
2. **Semantic context** — what the image should depict

## Structural Context (Dimensions)

### Detection Methods

#### 1. Meta Tags (Social Cards)

```html
<!-- OG Image: 1200x630 (1.91:1) -->
<meta property="og:image" content="...">

<!-- Twitter Card: 1200x600 (2:1) -->
<meta name="twitter:image" content="...">
```

#### 2. CSS Classes

```html
<!-- Common patterns -->
<img class="aspect-video" />     <!-- 16:9 -->
<img class="aspect-square" />    <!-- 1:1 -->
<img class="aspect-[4/3]" />     <!-- 4:3 -->
<img class="aspect-[21/9]" />    <!-- 21:9 -->

<!-- Component hints -->
<img class="hero-image" />       <!-- 16:9 or 21:9 -->
<img class="avatar" />           <!-- 1:1 -->
<img class="card-image" />       <!-- 4:3 or 16:10 -->
<img class="banner" />           <!-- wide (3:1 to 6:1) -->
```

#### 3. Component Location

```tsx
// Hero section → 16:9 or 21:9
<section className="hero">
  <img src="..." />  
</section>

// Logo in nav → flexible, usually horizontal
<nav>
  <img className="logo" />
</nav>

// Favicon → 1:1
<link rel="icon" href="..." />

// Card thumbnail → 4:3 or 16:10
<Card>
  <img className="card-image" />
</Card>
```

#### 4. Framework Conventions

**Next.js:**
```tsx
// Check Image component props
<Image 
  width={1200} 
  height={630}  // → 1.91:1 ratio
/>
```

### Aspect Ratio Reference

| Asset Type | Ratio | Dimensions | Use Case |
|------------|-------|------------|----------|
| OG Image | 1.91:1 | 1200×630 | Facebook, LinkedIn |
| Twitter Card | 2:1 | 1200×600 | Twitter/X |
| Hero (standard) | 16:9 | 1920×1080 | Most hero sections |
| Hero (cinematic) | 21:9 | 2560×1080 | Immersive heroes |
| Card image | 4:3 | 800×600 | Blog cards, features |
| Card image | 16:10 | 960×600 | Product cards |
| Avatar | 1:1 | 400×400 | Profile photos |
| Logo | flexible | varies | Brand mark |
| Favicon | 1:1 | 32×32, 180×180 | Browser tab, touch icon |
| Banner | 3:1 to 6:1 | varies | Email headers, subheaders |

---

## Semantic Context (Subject Matter)

### What to Extract

Understand what the image should depict by analyzing:

#### 1. Section Heading

```html
<section>
  <h2>AI-Powered Analytics</h2>
  <p>Transform your data into actionable insights</p>
  <img src="???" />  <!-- Should show: dashboards, charts, data viz -->
</section>
```

#### 2. Nearby Text Content

```html
<div class="feature-card">
  <h3>Real-time Monitoring</h3>
  <p>Track your metrics as they happen with live updates</p>
  <img src="???" />  <!-- Should show: live charts, monitoring UI -->
</div>
```

#### 3. Component Names

```tsx
// File: TeamSection.tsx
// Images should show: team photos, people collaborating

// File: SecurityFeatures.tsx  
// Images should show: shields, locks, secure systems

// File: PricingComparison.tsx
// Images should show: comparison tables, tiers, value props
```

#### 4. Page Context

Check the page route and meta:

```tsx
// app/about/page.tsx → About company, team, mission
// app/pricing/page.tsx → Plans, value, comparison
// app/features/page.tsx → Product capabilities
// app/blog/page.tsx → Articles, reading, content
```

### Extraction Examples

**Example 1: Hero Section**
```tsx
export function Hero() {
  return (
    <section className="hero">
      <h1>Ship faster with AI</h1>
      <p>Automate your deployment pipeline</p>
      <div className="hero-image">
        <img src="???" />
      </div>
    </section>
  )
}
```
**Extracted context:**
- Subject: deployment automation, shipping code, speed
- Mood: dynamic, fast, modern
- Elements: code, pipelines, rockets, motion

**Example 2: Feature Card**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Secure by Default</CardTitle>
  </CardHeader>
  <CardContent>
    <p>End-to-end encryption for all your data</p>
    <img src="???" />
  </CardContent>
</Card>
```
**Extracted context:**
- Subject: security, encryption, protection
- Mood: trustworthy, solid, protected
- Elements: shields, locks, secure connections

---

## Fallback Chain

When context is unclear:

### 1. Partial Context → Infer + Confirm

```
I found this image will be used in a "Features" section with heading 
"Cloud Infrastructure". Should I generate an image showing:
- Cloud servers/data centers
- Network diagrams
- Abstract cloud visualization
? 
```

### 2. No Context → Ask User

```
I can't determine what this image should depict from the code.
Please describe what you'd like the image to show.
```

---

## Putting It Together

### Example Analysis

**Code:**
```tsx
// app/(marketing)/page.tsx
<section className="py-20 bg-muted">
  <h2 className="text-4xl font-light">Trusted by Industry Leaders</h2>
  <p className="text-lg text-muted-foreground">
    See how companies use our platform to scale
  </p>
  <div className="grid grid-cols-3 gap-6">
    <img src="???" className="aspect-[4/3] rounded-lg" />
  </div>
</section>
```

**Analysis:**
```
Structural:
- Aspect ratio: 4:3 (from class)
- Location: marketing page, grid layout
- Type: case study / testimonial image

Semantic:
- Section theme: trust, enterprise, scale
- Heading: industry leaders, trusted
- Content: companies using the platform
- Mood: professional, corporate, success

Generated prompt guidance:
- Show: abstract representation of success/scale, or placeholder for case study
- Style: professional, corporate
- Colors: match brand (detected separately)
- Composition: 4:3, suitable for grid
```
