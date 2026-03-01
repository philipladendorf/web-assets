---
name: web-assets
description: "Generate production-ready visual assets (logos, icons, hero images, social cards, illustrations) for web projects using Google Gemini. Triggers on: generate a logo, hero image, og:image, social card, favicon, app icon, illustration, brand assets, visual assets. Requires GOOGLE_API_KEY."
---

# Web Assets Generator

Generate production-ready visual assets for web projects — logos, icons, hero images, social cards, and illustrations — that match your brand identity.

## Prerequisites

1. **Google API Key** — Copy `.env.example` to `.env` and add your key:
   ```bash
   cp .env.example .env
   # Edit .env and set your key
   ```
   Get one at [Google AI Studio](https://aistudio.google.com/apikey)

2. **Dependencies** — Install when first using the skill
   ```bash
   cd skills/web-assets && pnpm install
   ```

## Workflow

When generating assets, follow this sequence:

### 1. Understand the Request

Identify what the user needs:
- **Asset type**: logo, icon, hero, social card, illustration, background
- **Usage context**: where will it be placed in the project
- **Quantity**: single asset or multiple

### 2. Analyze Context

Read the rules in `rules/context-analysis.md` for details.

**Structural context** (dimensions):
- Look at where the image will be used
- Check CSS classes, meta tags, component structure
- Determine aspect ratio and size

**Semantic context** (subject matter):
- Read nearby headings, paragraphs, component names
- Understand what the image should depict
- If unclear, ask the user to describe

### 3. Detect Brand

Read `rules/brand-detection.md` for details.

Extract brand identity from:
- `tailwind.config.ts` — colors, fonts, theme
- CSS variables — `--color-*`, `--font-*`
- `brand.json` / `theme.json` — explicit brand config
- Existing assets — style consistency

If no brand config exists, ask the user for:
- Primary/secondary colors
- Font style (modern, classic, playful)
- Overall aesthetic (minimal, bold, friendly, corporate)

### 4. Craft the Prompt

Read `rules/prompt-guidelines.md` for details.

Build a prompt that combines:
- **Brand**: colors, fonts, style keywords
- **Context**: subject matter from semantic analysis
- **Specs**: aspect ratio, composition needs
- **Asset type**: logo vs hero vs icon have different requirements

### 5. Generate

Run the generation script:

```bash
npx tsx --env-file=.env skills/web-assets/scripts/generate.ts \
  --prompt "your crafted prompt here" \
  --output "public/images/hero-homepage" \
  --aspect-ratio "16:9"
```

**Options:**
- `--prompt` (required): The image generation prompt
- `--output` (required): Output path without extension
- `--aspect-ratio` (optional): e.g., "16:9", "1:1", "4:3" — inferred if not provided

### 6. Integrate

After generation:
1. Show the user the generated file path
2. Provide code snippet to use the asset
3. Suggest alt text based on the image content

## Quick Reference

| Asset Type | Typical Aspect Ratio | Key Considerations |
|------------|---------------------|-------------------|
| Logo | Flexible | Scalable, clean edges, works on light/dark |
| Favicon | 1:1 | Simple, recognizable at 32x32 |
| Hero | 16:9 or 21:9 | Leave space for text overlay |
| OG Image | 1.91:1 (1200x630) | Safe zones for title/description |
| Twitter Card | 2:1 (1200x600) | Center-weighted composition |
| Icon | 1:1 | Simple shapes, limited detail |
| Illustration | Varies | Match brand style, consistent mood |

## Example Usage

```
User: "Generate a hero image for the landing page"

Agent:
1. Finds hero section in code, detects 16:9 ratio
2. Reads heading "AI-Powered Analytics" + subheading
3. Extracts brand colors from tailwind.config.ts (navy + orange)
4. Crafts prompt incorporating brand + subject
5. Runs: npx tsx skills/web-assets/scripts/generate.ts \
   --prompt "Modern dashboard visualization..." \
   --output "public/images/hero-landing" \
   --aspect-ratio "16:9"
6. Shows result and code to integrate
```

## Troubleshooting

**"GOOGLE_API_KEY not set"**
- Set the environment variable before running

**"No image data in response"**
- Prompt may be too complex — simplify
- Try again — Gemini occasionally returns no image

**Image doesn't match brand**
- Be more explicit about colors in prompt (use hex codes)
- Reference the brand-detection rules for better extraction
