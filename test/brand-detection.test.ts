import { describe, it, expect } from "vitest";
import * as path from "path";
import { detectBrand } from "../skills/web-assets/lib/brand-detection.js";

const FIXTURES_DIR = path.join(__dirname, "fixtures");

describe("brand-detection", () => {
  describe("detectBrand", () => {
    it("should return null when no brand config exists", () => {
      const result = detectBrand("/nonexistent/path");
      expect(result).toBeNull();
    });

    it("should detect brand from brand.json", () => {
      const result = detectBrand(FIXTURES_DIR);
      expect(result).not.toBeNull();
      expect(result?.source).toBe("brand.json");
      expect(result?.name).toBe("Acme Corp");
      expect(result?.colors.primary).toBe("#7C3AED");
      expect(result?.colors.secondary).toBe("#EC4899");
      expect(result?.fonts?.heading).toBe("Poppins");
      expect(result?.style).toBe("modern playful");
    });

    it("should prioritize brand.json over tailwind and CSS", () => {
      // FIXTURES_DIR has brand.json, tailwind.config.ts, AND globals.css
      const result = detectBrand(FIXTURES_DIR);
      expect(result?.source).toBe("brand.json");
    });
  });

  describe("tailwind config extraction", () => {
    it("should extract colors from tailwind.config.ts", () => {
      const result = detectBrand(path.join(FIXTURES_DIR, "tailwind-only"));
      expect(result).not.toBeNull();
      expect(result?.source).toBe("tailwind");
      expect(result?.colors.primary).toBe("#D74000");
      expect(result?.colors.secondary).toBe("#1A2332");
      expect(result?.colors.accent).toBe("#F59E0B");
      expect(result?.colors.muted).toBe("#6B7280");
      expect(result?.colors.background).toBe("#FFFFFF");
      expect(result?.colors.foreground).toBe("#1F2937");
    });

    it("should extract fonts from tailwind.config.ts", () => {
      const result = detectBrand(path.join(FIXTURES_DIR, "tailwind-only"));
      expect(result?.fonts?.sans).toBe("Inter");
      expect(result?.fonts?.mono).toBe("JetBrains Mono");
    });
  });

  describe("CSS variables extraction", () => {
    it("should extract colors from :root CSS variables", () => {
      const result = detectBrand(path.join(FIXTURES_DIR, "css-only"));
      expect(result).not.toBeNull();
      expect(result?.source).toBe("css");
      expect(result?.colors.primary).toBe("#2563EB");
      expect(result?.colors.secondary).toBe("#10B981");
      expect(result?.colors.accent).toBe("#F59E0B");
      expect(result?.colors.background).toBe("#FFFFFF");
      expect(result?.colors.foreground).toBe("#1F2937");
      expect(result?.colors.muted).toBe("#6B7280");
    });

    it("should extract fonts from CSS variables", () => {
      const result = detectBrand(path.join(FIXTURES_DIR, "css-only"));
      expect(result?.fonts?.sans).toBe("Inter");
      expect(result?.fonts?.mono).toBe("JetBrains Mono");
    });
  });
});
