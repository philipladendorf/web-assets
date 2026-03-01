# Prompt Guidelines

How to craft effective image generation prompts for web assets.

## Core Principles

### 1. Be Specific, Not Verbose

❌ **Too vague:**
```
a nice logo
```

✅ **Specific:**
```
Clean modern wordmark logo for "Acme" in bold sans-serif font.
Letters in dark navy (#1A2332) on white background.
Minimal, geometric, tech company aesthetic.
```

### 2. Include Technical Specs

Always specify:
- **Dimensions/aspect ratio** — "16:9 widescreen", "square format"
- **Resolution** — "high resolution", "crisp edges"
- **Background** — "white background", "transparent background", "dark navy (#1A2332)"

### 3. Describe the Mood

Use 1-2 mood keywords:
- Professional, corporate, enterprise
- Friendly, approachable, warm
- Modern, sleek, minimalist
- Playful, fun, energetic
- Technical, scientific, precise
- Natural, organic, earthy

### 4. Mention What to Avoid

If relevant:
- "No text" (for icons/illustrations)
- "No people" (for abstract visuals)
- "No gradients" (for flat design)
- "No shadows" (for clean graphics)

---

## Asset-Specific Guidelines

### Logos

**Requirements:**
- Scalable (works at 32px and 1000px)
- Clean edges (no blur, no effects)
- Works on light AND dark backgrounds (generate two versions if needed)

**Prompt template:**
```
[Logo type: wordmark/monogram/icon] for "[Brand name]"
[Typography: font style, weight, spacing]
[Colors: specific hex codes]
[Background: solid color]
[Style keywords]
No icons/symbols, just typography. High resolution, crisp edges.
```

**Example:**
```
Wordmark logo for "TECHFLOW" on white background.
Letters "TECH" in burnt orange (#D74000), "FLOW" in dark navy (#1A2332).
Bold, tight letter-spacing (-0.5px), modern sans-serif font.
Clean, minimal, tech startup aesthetic. No icons, just the wordmark.
High resolution, crisp vector-style edges.
```

---

### Icons / Favicons

**Requirements:**
- Simple shapes
- Recognizable at 32×32 pixels
- Limited detail
- Single color or simple palette

**Prompt template:**
```
[Icon type: app icon/favicon/monogram]
[Subject: what it represents]
[Colors: 1-2 colors max]
[Background: solid color]
Simple, [style] design. Must be recognizable at small sizes (32x32).
No fine details, no text, no gradients.
```

**Example:**
```
Square app icon / favicon featuring monogram "TF" 
in burnt orange (#D74000) centered on dark navy (#1A2332) background.
Bold sans-serif, geometric, modern tech style.
Must be recognizable at 32x32 pixels.
Clean, minimal, no effects.
```

---

### Hero Images

**Requirements:**
- 16:9 or 21:9 aspect ratio
- Leave space for text overlay (typically left or center)
- High visual impact
- Matches page theme

**Prompt template:**
```
[Subject: main visual element]
[Composition: where subject is placed, where text will go]
[Colors: brand colors + accent]
[Background: gradient/solid/pattern]
[Mood/atmosphere]
16:9 aspect ratio. Leave [left third/center area] clear for text overlay.
High resolution, cinematic quality.
```

**Example:**
```
Abstract 3D visualization of interconnected data nodes and streams
in burnt orange (#D74000) and electric blue, flowing dynamically.
Dark navy (#1A2332) background with subtle depth.
Modern tech aesthetic, sense of motion and connectivity.
16:9 aspect ratio. Leave left third clear for headline text.
Cinematic lighting, high resolution render.
```

---

### Social Cards (OG / Twitter)

**Requirements:**
- OG: 1200×630 (1.91:1)
- Twitter: 1200×600 (2:1)
- Center-weighted composition (safe zones for cropping)
- Readable when small in feeds
- Brand-forward

**Prompt template:**
```
Social media card for [brand/product name].
[Visual: background pattern/product image/abstract]
[Text area: where logo/headline will go]
[Colors: brand colors]
[Style]
1.91:1 aspect ratio (1200x630). Center-safe composition.
Clean, professional, works as link preview thumbnail.
```

**Example:**
```
LinkedIn banner / Open Graph image for "TechFlow".
Dark navy (#1A2332) background with subtle geometric pattern.
Abstract network visualization in burnt orange (#D74000) on right side.
Clean minimal aesthetic, professional tech company.
1.91:1 aspect ratio. Center-left area should be relatively clear 
for logo and tagline text overlay.
```

---

### Illustrations

**Requirements:**
- Match brand style
- Consistent with existing illustrations
- Appropriate complexity for context
- Scalable

**Prompt template:**
```
[Type: spot illustration/scene/character]
[Subject: what to depict]
[Style: flat/3D/hand-drawn/isometric]
[Colors: brand palette]
[Context: where it will be used]
[Detail level: simple/moderate/complex]
```

**Example:**
```
Isometric illustration of a modern office workspace
with people collaborating around screens showing dashboards.
Flat design style with soft shadows.
Use brand colors: navy (#1A2332), orange (#D74000), light gray (#F0F2F7).
Friendly, professional tech company aesthetic.
For use in "About our team" section. Clean lines, moderate detail.
```

---

## Combining Brand + Context + Specs

### The Formula

```
[SUBJECT from semantic context]
[STYLE from brand detection]
[SPECS from structural context]
[CONSTRAINTS for asset type]
```

### Full Example

**Detected context:**
- Location: Hero section on pricing page
- Heading: "Simple, transparent pricing"
- Brand: Navy #1A2332, Orange #D74000, minimal style
- Dimensions: 16:9

**Final prompt:**
```
Abstract illustration representing simplicity and transparency
— geometric shapes, clean lines, balanced composition.
Primary colors: dark navy (#1A2332) background with 
burnt orange (#D74000) accent elements and soft white highlights.
Minimal, modern, tech company aesthetic.
16:9 aspect ratio. Leave left third clear for pricing headline.
High resolution, clean vector-style illustration.
```

---

## Common Mistakes to Avoid

| Mistake | Fix |
|---------|-----|
| "Make it look good" | Specify what "good" means for this brand |
| Forgetting aspect ratio | Always include dimensions in prompt |
| Too many colors | Limit to brand palette (2-4 colors) |
| Complex for icons | Simplify for small sizes |
| No background spec | Always specify background color/transparency |
| Text in image | Say "no text" unless text is the point (logo) |
| Wrong mood | Check brand personality before prompting |

---

## Quick Prompt Checklist

Before generating, ensure prompt includes:

- [ ] Subject matter (what)
- [ ] Style/mood (how)
- [ ] Colors (brand palette)
- [ ] Background (color/pattern)
- [ ] Aspect ratio/dimensions
- [ ] Composition notes (text overlay space)
- [ ] Constraints (no text, simple, etc.)
- [ ] Quality markers (high resolution, crisp edges)
