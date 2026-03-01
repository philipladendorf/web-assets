# Web Assets

A skill for generating production-ready visual assets for web projects using AI.

## What It Does

Generates brand-aware images for web projects:
- Logos and wordmarks
- Icons and favicons
- Hero images and banners
- Social media cards (OG, Twitter)
- Illustrations and graphics

The skill analyzes your project to understand:
- **Brand identity** — colors, fonts, style from your config
- **Context** — where the image will be used, dimensions needed
- **Subject matter** — what the image should depict based on nearby content

## Installation

```bash
npx skills add philip-prem/web-assets
```

## Prerequisites

1. **Google API Key** — Required for image generation
   
   Get one at [Google AI Studio](https://aistudio.google.com/apikey)
   
   ```bash
   export GOOGLE_API_KEY=your_key_here
   ```

2. **Dependencies** — Install on first use
   ```bash
   cd .agents/skills/web-assets && pnpm install
   ```

## Usage

Once installed, the skill activates automatically when you ask your AI agent to generate images:

```
"Generate a logo for my startup"
"Create a hero image for the landing page"
"I need an OG image for social sharing"
"Add an illustration to the features section"
```

The agent will:
1. Analyze your project for brand colors and style
2. Detect where the image will be used (dimensions, context)
3. Generate an appropriate image
4. Save it to your project and show how to use it

## Examples

### Logo
```
User: "Generate a logo for TechFlow"

Agent extracts brand colors from tailwind.config.ts,
generates a clean wordmark, saves to public/logo.png
```

### Hero Image
```
User: "Create a hero image for the pricing page"

Agent finds the hero section, reads the heading "Simple Pricing",
detects 16:9 aspect ratio, generates abstract pricing visualization
```

### Social Card
```
User: "I need an OG image for social sharing"

Agent checks meta tags, generates 1200x630 image with 
brand colors and space for title overlay
```

## Skill Structure

```
web-assets/
├── SKILL.md              # Main workflow instructions
├── scripts/
│   └── generate.ts       # Image generation script
└── rules/
    ├── brand-detection.md    # Extract brand from project
    ├── context-analysis.md   # Determine dimensions & subject
    └── prompt-guidelines.md  # Craft effective prompts
```

## Supported Asset Types

| Asset | Aspect Ratio | Use Case |
|-------|-------------|----------|
| Logo | Flexible | Brand identity |
| Favicon | 1:1 | Browser tab, touch icon |
| Hero | 16:9 / 21:9 | Landing page headers |
| OG Image | 1.91:1 | Facebook, LinkedIn |
| Twitter Card | 2:1 | Twitter/X |
| Icon | 1:1 | UI elements |
| Illustration | Varies | Feature sections, content |

## Configuration

### Brand Detection

The skill looks for brand configuration in:

1. `brand.json` or `brand.yaml` — explicit brand config
2. `tailwind.config.ts` — colors, fonts
3. CSS variables — `--color-*`, `--font-*`
4. Existing assets — style consistency

### Example brand.json

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

## Troubleshooting

**"GOOGLE_API_KEY not set"**
- Set the environment variable: `export GOOGLE_API_KEY=your_key`

**"No image data in response"**
- Simplify the prompt — too complex prompts may fail
- Try again — Gemini occasionally returns no image

**Image doesn't match brand**
- Create a `brand.json` file with explicit colors
- Be more specific about colors in your request

## Related Skills

- `image-optimizer` — Compress and resize images with ffmpeg

## License

MIT
