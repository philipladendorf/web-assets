# Brand Detection

Extract brand identity from the project to generate consistent, on-brand assets.

## Priority Order

Check these sources in order:

### 1. Explicit Brand Config (Highest Priority)

Look for these files:

```
brand.json
brand.yaml
theme.json
config/brand.json
```

Example `brand.json`:
```json
{
  "name": "Acme Corp",
  "colors": {
    "primary": "#2563EB",
    "secondary": "#10B981",
    "accent": "#F59E0B",
    "background": "#FFFFFF",
    "text": "#1F2937"
  },
  "fonts": {
    "heading": "Inter",
    "body": "Inter"
  },
  "style": "modern minimalist"
}
```

### 2. Tailwind Config

Check `tailwind.config.ts` or `tailwind.config.js`:

```typescript
// Extract from:
theme: {
  extend: {
    colors: {
      brand: {
        primary: '#D74000',  // ← use this
        navy: '#1A2332',
      }
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],  // ← use this
    }
  }
}
```

### 3. CSS Variables

Check global CSS files (`globals.css`, `app.css`):

```css
:root {
  --color-primary: #2563EB;    /* ← use this */
  --color-secondary: #10B981;
  --color-accent: #F59E0B;
  --font-sans: 'Inter', sans-serif;
}

/* Also check dark mode variants */
.dark {
  --color-primary: #3B82F6;
}
```

### 4. Component Library

If using a component library (shadcn, Radix), check:
- `components.json` (shadcn)
- Theme provider config

### 5. Existing Assets (Lowest Priority)

Look at existing images in the project:
- `public/` or `assets/` directories
- Note consistent colors, styles, moods

## What to Extract

### Colors

| Type | Usage in Prompts |
|------|------------------|
| Primary | Main brand color, accents |
| Secondary | Supporting elements |
| Background | Light/dark mode aware |
| Text | For contrast reference |

**Prompt integration:**
```
Use burnt orange (#D74000) as the primary accent color.
Background should be dark navy (#1A2332).
```

### Typography Style

| Style | Keywords |
|-------|----------|
| Sans-serif modern | "clean sans-serif", "modern typography" |
| Serif classic | "elegant serif", "classic typography" |
| Monospace | "technical monospace", "code-style" |
| Rounded | "friendly rounded sans-serif" |
| Condensed | "tight letter-spacing", "condensed font" |

### Aesthetic Keywords

Infer from colors and fonts:

| Brand Signals | Aesthetic Keywords |
|--------------|-------------------|
| Bright colors, rounded fonts | "playful", "friendly", "approachable" |
| Dark colors, sharp fonts | "professional", "sophisticated", "bold" |
| Pastels, light fonts | "soft", "gentle", "calm" |
| Neon, geometric | "futuristic", "tech", "innovative" |
| Earth tones, serif | "natural", "organic", "trustworthy" |

## Fallback: Ask the User

If no brand config is found:

```
I couldn't find brand configuration in your project. 
To generate on-brand assets, please provide:

1. Primary color (hex code, e.g., #2563EB)
2. Secondary/accent color (optional)
3. Style preference:
   - Modern/Minimal
   - Bold/Corporate
   - Friendly/Playful
   - Technical/Futuristic
   - Natural/Organic
```

## Example Extraction

**From tailwind.config.ts:**
```typescript
colors: {
  orange: '#D74000',
  navy: '#1A2332',
  light: '#F0F2F7',
}
```

**Generated brand object:**
```
Brand Colors:
- Primary: burnt orange #D74000
- Background: dark navy #1A2332  
- Light variant: cool gray #F0F2F7

Style: Medical/scientific, professional yet approachable
```

**Prompt usage:**
```
Create a hero image with a dark navy background (#1A2332).
Use burnt orange (#D74000) as an accent color for key elements.
Style should be professional and scientific.
```
