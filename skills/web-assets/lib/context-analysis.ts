export interface StructuralContext {
  aspectRatio: string | null;
  assetType: "hero" | "logo" | "icon" | "og-image" | "twitter-card" | "card" | "background" | "illustration" | "unknown";
  width?: number;
  height?: number;
}

export interface SemanticContext {
  subject: string | null;
  mood: string[];
  nearbyText: string[];
  componentType: string | null;
}

export interface AssetContext {
  structural: StructuralContext;
  semantic: SemanticContext;
}

// Aspect ratio patterns to detect in code
const ASPECT_RATIO_PATTERNS: Record<string, RegExp> = {
  "1:1": /aspect-square|avatar|favicon|icon/i,
  "16:9": /aspect-video|hero|banner/i,
  "21:9": /aspect-\[21\/?9\]|ultrawide|cinematic/i,
  "4:3": /aspect-\[4\/?3\]|card-image/i,
  "3:4": /aspect-\[3\/?4\]|portrait/i,
  "1.91:1": /og:image|open.?graph|1200.*630/i,
  "2:1": /twitter.*card|twitter:image|1200.*600/i,
};

const ASSET_TYPE_PATTERNS: Record<StructuralContext["assetType"], RegExp> = {
  hero: /hero|banner|landing/i,
  logo: /logo|brand.?mark|wordmark/i,
  icon: /icon|favicon|app.?icon|touch.?icon/i,
  "og-image": /og:image|open.?graph/i,
  "twitter-card": /twitter:image|twitter:card/i,
  card: /card|thumbnail|preview/i,
  background: /background|bg-image|hero-bg/i,
  illustration: /illustration|graphic|visual/i,
  unknown: /.*/,
};

const MOOD_KEYWORDS: Record<string, string[]> = {
  professional: ["enterprise", "corporate", "business", "professional", "trusted"],
  friendly: ["friendly", "approachable", "warm", "welcoming"],
  modern: ["modern", "sleek", "contemporary", "cutting-edge"],
  playful: ["playful", "fun", "energetic", "vibrant"],
  technical: ["technical", "engineering", "scientific", "precision"],
  minimal: ["minimal", "clean", "simple", "elegant"],
  bold: ["bold", "powerful", "strong", "impactful"],
};

export function detectStructuralContext(code: string): StructuralContext {
  const aspectRatio = detectAspectRatio(code);
  const assetType = detectAssetType(code);
  const dimensions = detectDimensions(code);

  return {
    aspectRatio,
    assetType,
    ...dimensions,
  };
}

export function detectSemanticContext(
  code: string,
  nearbyContent: string[] = []
): SemanticContext {
  const nearbyText = extractNearbyText(code).concat(nearbyContent);
  const subject = inferSubject(nearbyText);
  const mood = inferMood(nearbyText);
  const componentType = detectComponentType(code);

  return {
    subject,
    mood,
    nearbyText,
    componentType,
  };
}

export function analyzeAssetContext(
  code: string,
  nearbyContent: string[] = []
): AssetContext {
  return {
    structural: detectStructuralContext(code),
    semantic: detectSemanticContext(code, nearbyContent),
  };
}

function detectAspectRatio(code: string): string | null {
  // Check for explicit aspect ratio classes
  for (const [ratio, pattern] of Object.entries(ASPECT_RATIO_PATTERNS)) {
    if (pattern.test(code)) {
      return ratio;
    }
  }

  // Check for width/height props (Next.js Image, etc.) - handle JSX {800} and HTML "800"
  const widthMatch = code.match(/width[=:\s]+\{?["']?(\d+)["']?\}?/);
  const heightMatch = code.match(/height[=:\s]+\{?["']?(\d+)["']?\}?/);

  if (widthMatch && heightMatch) {
    const width = parseInt(widthMatch[1]);
    const height = parseInt(heightMatch[1]);
    return calculateAspectRatio(width, height);
  }

  return null;
}

function detectAssetType(code: string): StructuralContext["assetType"] {
  for (const [type, pattern] of Object.entries(ASSET_TYPE_PATTERNS)) {
    if (type !== "unknown" && pattern.test(code)) {
      return type as StructuralContext["assetType"];
    }
  }
  return "unknown";
}

function detectDimensions(code: string): { width?: number; height?: number } {
  // Handle JSX props: width={800} and HTML props: width="800" or width=800
  const widthMatch = code.match(/width[=:\s]+\{?["']?(\d+)["']?\}?/);
  const heightMatch = code.match(/height[=:\s]+\{?["']?(\d+)["']?\}?/);

  const result: { width?: number; height?: number } = {};
  if (widthMatch) result.width = parseInt(widthMatch[1]);
  if (heightMatch) result.height = parseInt(heightMatch[1]);
  return result;
}

function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  const w = width / divisor;
  const h = height / divisor;

  // Normalize common ratios
  if (w === 1200 && h === 630) return "1.91:1";
  if (w === 1200 && h === 600) return "2:1";
  if (w === 1920 && h === 1080) return "16:9";
  if (w === 2560 && h === 1080) return "21:9";

  return `${w}:${h}`;
}

function extractNearbyText(code: string): string[] {
  const texts: string[] = [];

  // Extract text from JSX
  const jsxTextPattern = />([^<>{]+)</g;
  let match;
  while ((match = jsxTextPattern.exec(code)) !== null) {
    const text = match[1].trim();
    if (text && text.length > 2) {
      texts.push(text);
    }
  }

  // Extract alt text
  const altPattern = /alt=["']([^"']+)["']/g;
  while ((match = altPattern.exec(code)) !== null) {
    texts.push(match[1]);
  }

  // Extract aria-label
  const ariaPattern = /aria-label=["']([^"']+)["']/g;
  while ((match = ariaPattern.exec(code)) !== null) {
    texts.push(match[1]);
  }

  // Extract heading content
  const headingPattern = /<h[1-6][^>]*>([^<]+)</gi;
  while ((match = headingPattern.exec(code)) !== null) {
    texts.push(match[1].trim());
  }

  return texts;
}

function inferSubject(texts: string[]): string | null {
  // Look for descriptive content
  const descriptiveTexts = texts.filter(
    (t) => t.length > 10 && !t.match(/^(sign|get|click|learn|read)/i)
  );

  if (descriptiveTexts.length > 0) {
    // Return the first substantial text as subject indicator
    return descriptiveTexts[0];
  }

  return null;
}

function inferMood(texts: string[]): string[] {
  const moods: Set<string> = new Set();
  const combinedText = texts.join(" ").toLowerCase();

  for (const [mood, keywords] of Object.entries(MOOD_KEYWORDS)) {
    for (const keyword of keywords) {
      if (combinedText.includes(keyword)) {
        moods.add(mood);
        break;
      }
    }
  }

  return Array.from(moods);
}

function detectComponentType(code: string): string | null {
  // Check for component/function names - match "export function Name" or "function Name" or "const Name ="
  const functionMatch = code.match(/(?:export\s+)?function\s+(\w+)/);
  if (functionMatch) {
    return functionMatch[1];
  }

  const constMatch = code.match(/(?:export\s+)?const\s+(\w+)\s*=/);
  if (constMatch) {
    return constMatch[1];
  }

  // Check for section/class names
  const classMatch = code.match(/className=["']([^"']+)["']/);
  if (classMatch) {
    const classes = classMatch[1].split(/\s+/);
    const significantClass = classes.find(
      (c) => c.match(/hero|section|card|feature|team|about|pricing/i)
    );
    if (significantClass) return significantClass;
  }

  return null;
}

// Aspect ratio to pixel dimensions mapping
export const ASPECT_RATIO_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "1:1": { width: 1024, height: 1024 },
  "16:9": { width: 1920, height: 1080 },
  "21:9": { width: 2560, height: 1080 },
  "4:3": { width: 1600, height: 1200 },
  "3:4": { width: 1200, height: 1600 },
  "1.91:1": { width: 1200, height: 630 },
  "2:1": { width: 1200, height: 600 },
};
