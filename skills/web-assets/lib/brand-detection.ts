import * as fs from "fs";
import * as path from "path";
import postcss from "postcss";

export interface BrandColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  foreground?: string;
  muted?: string;
}

export interface BrandConfig {
  name?: string;
  colors: BrandColors;
  fonts?: {
    heading?: string;
    body?: string;
    sans?: string;
    mono?: string;
  };
  style?: string;
  keywords?: string[];
  source: "brand.json" | "tailwind" | "css" | "fallback";
}

const BRAND_CONFIG_FILES = [
  "brand.json",
  "theme.json",
  "config/brand.json",
];

export function detectBrand(projectPath: string): BrandConfig | null {
  // Priority 1: Explicit brand config
  const brandJson = extractFromBrandJson(projectPath);
  if (brandJson) return brandJson;

  // Priority 2: Tailwind config (v3 JS/TS config files)
  const tailwindBrand = extractFromTailwind(projectPath);
  if (tailwindBrand) return tailwindBrand;

  // Priority 3: CSS variables (also handles Tailwind v4 @theme blocks)
  const cssBrand = extractFromCss(projectPath);
  if (cssBrand) return cssBrand;

  return null;
}

function extractFromBrandJson(projectPath: string): BrandConfig | null {
  for (const file of BRAND_CONFIG_FILES) {
    const filePath = path.join(projectPath, file);
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, "utf-8");
        const config = JSON.parse(content);

        return {
          name: config.name,
          colors: {
            primary: config.colors?.primary,
            secondary: config.colors?.secondary,
            accent: config.colors?.accent,
            background: config.colors?.background,
            foreground: config.colors?.foreground,
            muted: config.colors?.muted,
          },
          fonts: {
            heading: config.fonts?.heading,
            body: config.fonts?.body,
          },
          style: config.style,
          keywords: config.keywords,
          source: "brand.json",
        };
      } catch {
        continue;
      }
    }
  }
  return null;
}

function extractFromTailwind(projectPath: string): BrandConfig | null {
  const tailwindPaths = [
    "tailwind.config.ts",
    "tailwind.config.js",
    "tailwind.config.mjs",
  ];

  for (const twFile of tailwindPaths) {
    const filePath = path.join(projectPath, twFile);
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, "utf-8");
        const colors = extractColorsFromTailwindContent(content);
        const fonts = extractFontsFromTailwindContent(content);

        if (Object.keys(colors).length > 0) {
          return {
            colors,
            fonts,
            source: "tailwind",
          };
        }
      } catch {
        continue;
      }
    }
  }
  return null;
}

function extractColorsFromTailwindContent(content: string): BrandColors {
  const colors: BrandColors = {};

  // Match theme.extend.colors patterns
  const colorsMatch = content.match(/colors\s*:\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/s);
  if (!colorsMatch) return colors;

  const colorsBlock = colorsMatch[1];

  // Extract hex colors with their names
  const hexPattern = /["']?(primary|secondary|accent|background|foreground|muted|brand)["']?\s*:\s*["']?(#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3})["']?/g;
  let match;
  while ((match = hexPattern.exec(colorsBlock)) !== null) {
    const [, name, hex] = match;
    if (name === "brand") {
      if (!colors.primary) colors.primary = hex;
      else if (!colors.secondary) colors.secondary = hex;
    } else {
      colors[name as keyof BrandColors] = hex;
    }
  }

  // Handle nested brand object: brand: { primary: "...", secondary: "..." }
  const brandBlockMatch = colorsBlock.match(/brand\s*:\s*\{([^}]+)\}/s);
  if (brandBlockMatch) {
    const brandBlock = brandBlockMatch[1];
    const brandPattern = /["']?(primary|secondary|accent|background|foreground|muted)["']?\s*:\s*["']?(#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3})["']?/g;
    while ((match = brandPattern.exec(brandBlock)) !== null) {
      const [, name, hex] = match;
      colors[name as keyof BrandColors] = hex;
    }
  }

  return colors;
}

function extractFontsFromTailwindContent(content: string): BrandConfig["fonts"] {
  const fonts: BrandConfig["fonts"] = {};

  const fontFamilyMatch = content.match(/fontFamily\s*:\s*\{([^}]+)\}/s);
  if (!fontFamilyMatch) return fonts;

  const fontsBlock = fontFamilyMatch[1];

  const sansMatch = fontsBlock.match(/sans\s*:\s*\[["']([^"']+)["']/);
  if (sansMatch) fonts.sans = sansMatch[1];

  const monoMatch = fontsBlock.match(/mono\s*:\s*\[["']([^"']+)["']/);
  if (monoMatch) fonts.mono = monoMatch[1];

  return fonts;
}

const COLOR_KEYS: (keyof BrandColors)[] = [
  "primary", "secondary", "accent", "background", "foreground", "muted",
];

function extractFromCss(projectPath: string): BrandConfig | null {
  const cssPaths = [
    "globals.css",
    "app/globals.css",
    "styles/globals.css",
    "src/styles/globals.css",
    "index.css",
  ];

  for (const cssFile of cssPaths) {
    const filePath = path.join(projectPath, cssFile);
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, "utf-8");
        const colors = extractColorsFromCssContent(content);
        const fonts = extractFontsFromCssContent(content);

        if (Object.keys(colors).length > 0) {
          return {
            colors,
            fonts,
            source: "css",
          };
        }
      } catch {
        continue;
      }
    }
  }
  return null;
}

function isInRootOrTheme(node: postcss.Declaration): boolean {
  const parent = node.parent;
  if (!parent) return false;

  // Direct :root rule
  if (parent.type === "rule" && (parent as postcss.Rule).selector === ":root") return true;

  // @theme at-rule (Tailwind v4)
  if (parent.type === "atrule" && (parent as postcss.AtRule).name === "theme") return true;

  // :root inside @layer or other at-rules
  if (parent.type === "rule" && (parent as postcss.Rule).selector === ":root") return true;

  return false;
}

function extractColorsFromCssContent(content: string): BrandColors {
  const colors: BrandColors = {};
  const hexPattern = /^#[A-Fa-f0-9]{3,6}$/;

  const root = postcss.parse(content);

  root.walk((node) => {
    if (node.type !== "decl") return;
    if (!isInRootOrTheme(node)) return;

    for (const key of COLOR_KEYS) {
      if (node.prop === `--color-${key}`) {
        const value = node.value.trim();
        if (hexPattern.test(value)) {
          colors[key] = value;
        }
      }
    }
  });

  return colors;
}

function extractFontsFromCssContent(content: string): BrandConfig["fonts"] {
  const fonts: BrandConfig["fonts"] = {};

  const root = postcss.parse(content);

  root.walk((node) => {
    if (node.type !== "decl") return;
    if (!isInRootOrTheme(node)) return;

    if (node.prop === "--font-sans") {
      const firstFont = node.value.split(",")[0].replace(/['"]/g, "").trim();
      if (firstFont) fonts.sans = firstFont;
    }
    if (node.prop === "--font-mono") {
      const firstFont = node.value.split(",")[0].replace(/['"]/g, "").trim();
      if (firstFont) fonts.mono = firstFont;
    }
  });

  return fonts;
}
