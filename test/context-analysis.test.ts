import { describe, it, expect } from "vitest";
import {
  detectStructuralContext,
  detectSemanticContext,
  analyzeAssetContext,
  ASPECT_RATIO_DIMENSIONS,
} from "../skills/web-assets/lib/context-analysis.js";
import * as fs from "fs";
import * as path from "path";

const FIXTURES_DIR = path.join(__dirname, "fixtures/components");

describe("context-analysis", () => {
  describe("detectStructuralContext", () => {
    describe("aspect ratio detection", () => {
      it("should detect 16:9 from aspect-video class", () => {
        const code = `<div className="aspect-video"><img src="..." /></div>`;
        const result = detectStructuralContext(code);
        expect(result.aspectRatio).toBe("16:9");
      });

      it("should detect 1:1 from aspect-square class", () => {
        const code = `<img className="aspect-square rounded-full" />`;
        const result = detectStructuralContext(code);
        expect(result.aspectRatio).toBe("1:1");
      });

      it("should detect 4:3 from explicit class", () => {
        const code = `<div className="aspect-[4/3]"><img src="..." /></div>`;
        const result = detectStructuralContext(code);
        expect(result.aspectRatio).toBe("4:3");
      });

      it("should detect 1.91:1 from OG image meta tag", () => {
        const code = `<meta property="og:image" content="/og.png" />`;
        const result = detectStructuralContext(code);
        expect(result.aspectRatio).toBe("1.91:1");
      });

      it("should detect 2:1 from Twitter card meta tag", () => {
        const code = `<meta name="twitter:image" content="/twitter.png" />`;
        const result = detectStructuralContext(code);
        expect(result.aspectRatio).toBe("2:1");
      });

      it("should detect aspect ratio from width/height props", () => {
        const code = `<Image width={1200} height={630} src="/og.png" />`;
        const result = detectStructuralContext(code);
        expect(result.aspectRatio).toBe("1.91:1");
      });

      it("should return null when no aspect ratio found", () => {
        const code = `<img src="/image.png" />`;
        const result = detectStructuralContext(code);
        expect(result.aspectRatio).toBeNull();
      });
    });

    describe("asset type detection", () => {
      it("should detect hero asset type", () => {
        const code = `<section className="hero"><img src="..." /></section>`;
        const result = detectStructuralContext(code);
        expect(result.assetType).toBe("hero");
      });

      it("should detect logo asset type", () => {
        const code = `<img className="logo" src="/logo.svg" />`;
        const result = detectStructuralContext(code);
        expect(result.assetType).toBe("logo");
      });

      it("should detect icon/favicon asset type", () => {
        const code = `<link rel="icon" href="/favicon.ico" />`;
        const result = detectStructuralContext(code);
        expect(result.assetType).toBe("icon");
      });

      it("should detect OG image asset type", () => {
        const code = `<meta property="og:image" content="/og.png" />`;
        const result = detectStructuralContext(code);
        expect(result.assetType).toBe("og-image");
      });

      it("should detect card asset type", () => {
        const code = `<div className="card"><img src="..." /></div>`;
        const result = detectStructuralContext(code);
        expect(result.assetType).toBe("card");
      });

      it("should return unknown for unrecognized types", () => {
        const code = `<img src="/random.png" />`;
        const result = detectStructuralContext(code);
        expect(result.assetType).toBe("unknown");
      });
    });

    describe("dimension detection", () => {
      it("should extract width and height from props", () => {
        const code = `<Image width={800} height={600} src="/image.png" />`;
        const result = detectStructuralContext(code);
        expect(result.width).toBe(800);
        expect(result.height).toBe(600);
      });
    });
  });

  describe("detectSemanticContext", () => {
    it("should extract nearby text from JSX", () => {
      const code = `
        <section>
          <h1>AI-Powered Analytics</h1>
          <p>Transform your data into insights</p>
          <img src="/hero.png" alt="Analytics dashboard" />
        </section>
      `;
      const result = detectSemanticContext(code);
      expect(result.nearbyText).toContain("AI-Powered Analytics");
      expect(result.nearbyText).toContain("Transform your data into insights");
      expect(result.nearbyText).toContain("Analytics dashboard");
    });

    it("should infer subject from text content", () => {
      const code = `
        <div>
          <h2>Real-time Monitoring</h2>
          <p>Track your metrics as they happen with live updates</p>
          <img src="/feature.png" />
        </div>
      `;
      const result = detectSemanticContext(code);
      expect(result.subject).toBeTruthy();
    });

    it("should detect mood from keywords", () => {
      const code = `
        <section className="professional-enterprise">
          <h1>Enterprise Solutions</h1>
          <p>Trusted by leading corporations</p>
        </section>
      `;
      const result = detectSemanticContext(code);
      expect(result.mood.length).toBeGreaterThan(0);
    });

    it("should detect component type from function name", () => {
      const code = `
        export function HeroSection() {
          return <img src="/hero.png" />;
        }
      `;
      const result = detectSemanticContext(code);
      expect(result.componentType).toBe("HeroSection");
    });
  });

  describe("analyzeAssetContext", () => {
    it("should combine structural and semantic analysis", () => {
      const code = `
        <section className="hero">
          <h1>AI-Powered Analytics</h1>
          <div className="aspect-video">
            <img src="/hero.png" alt="Dashboard visualization" />
          </div>
        </section>
      `;
      const result = analyzeAssetContext(code);

      expect(result.structural.aspectRatio).toBe("16:9");
      expect(result.structural.assetType).toBe("hero");
      expect(result.semantic.nearbyText.length).toBeGreaterThan(0);
    });

    it("should analyze hero component fixture", () => {
      const heroCode = fs.readFileSync(path.join(FIXTURES_DIR, "hero.tsx"), "utf-8");
      const result = analyzeAssetContext(heroCode);

      expect(result.structural.assetType).toBe("hero");
      expect(result.structural.aspectRatio).toBe("16:9");
      expect(result.semantic.nearbyText).toContain("AI-Powered Analytics");
      expect(result.semantic.componentType).toBe("Hero");
    });

    it("should analyze OG meta fixture", () => {
      const ogCode = fs.readFileSync(path.join(FIXTURES_DIR, "og-meta.tsx"), "utf-8");
      const result = analyzeAssetContext(ogCode);

      // Should detect an aspect ratio (file has both og:image and icon patterns)
      expect(result.structural.aspectRatio).not.toBeNull();
      // Asset type depends on which pattern matches first
      expect(["og-image", "twitter-card", "icon"]).toContain(result.structural.assetType);
    });

    it("should analyze feature cards fixture", () => {
      const featureCode = fs.readFileSync(path.join(FIXTURES_DIR, "feature-cards.tsx"), "utf-8");
      const result = analyzeAssetContext(featureCode);

      expect(result.structural.aspectRatio).toBe("4:3");
      expect(result.structural.assetType).toBe("card");
      // Text content from the section heading and paragraph
      expect(result.semantic.nearbyText).toContain("Everything you need to succeed");
    });

    it("should analyze logo component fixture", () => {
      const logoCode = fs.readFileSync(path.join(FIXTURES_DIR, "logo.tsx"), "utf-8");
      const result = analyzeAssetContext(logoCode);

      expect(result.structural.assetType).toBe("logo");
    });
  });

  describe("calculateAspectRatio via width/height props", () => {
    it("should calculate 1.91:1 from 1200x630 dimensions", () => {
      const code = `<Image width={1200} height={630} src="/og.png" />`;
      const result = detectStructuralContext(code);
      expect(result.aspectRatio).toBe("1.91:1");
    });

    it("should calculate 2:1 from 1200x600 dimensions", () => {
      const code = `<Image width={1200} height={600} src="/twitter.png" />`;
      const result = detectStructuralContext(code);
      expect(result.aspectRatio).toBe("2:1");
    });

    it("should calculate 16:9 from 1920x1080 dimensions", () => {
      const code = `<img width="1920" height="1080" src="/banner.png" />`;
      const result = detectStructuralContext(code);
      expect(result.aspectRatio).toBe("16:9");
    });

    it("should calculate 1:1 from equal dimensions", () => {
      const code = `<Image width={500} height={500} src="/avatar.png" />`;
      const result = detectStructuralContext(code);
      expect(result.aspectRatio).toBe("1:1");
    });

    it("should return reduced ratio for non-standard dimensions", () => {
      // 700x500 = 7:5, which doesn't match any known ratio
      const code = `<Image width={700} height={500} src="/custom.png" />`;
      const result = detectStructuralContext(code);
      expect(result.aspectRatio).toBe("7:5");
    });
  });

  describe("JSX expression attribute extraction", () => {
    it("should extract alt text from JSX expression strings", () => {
      const code = `<img alt={"Dashboard overview"} src="/img.png" />`;
      const result = detectSemanticContext(code);
      expect(result.nearbyText).toContain("Dashboard overview");
    });

    it("should extract title attributes", () => {
      const code = `<img title="Product screenshot" src="/img.png" />`;
      const result = detectSemanticContext(code);
      expect(result.nearbyText).toContain("Product screenshot");
    });
  });

  describe("ASPECT_RATIO_DIMENSIONS", () => {
    it("should have standard dimensions for common ratios", () => {
      expect(ASPECT_RATIO_DIMENSIONS["1:1"]).toEqual({ width: 1024, height: 1024 });
      expect(ASPECT_RATIO_DIMENSIONS["16:9"]).toEqual({ width: 1920, height: 1080 });
      expect(ASPECT_RATIO_DIMENSIONS["1.91:1"]).toEqual({ width: 1200, height: 630 });
      expect(ASPECT_RATIO_DIMENSIONS["2:1"]).toEqual({ width: 1200, height: 600 });
    });
  });
});
