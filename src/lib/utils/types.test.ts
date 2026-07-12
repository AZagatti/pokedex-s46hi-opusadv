import { describe, it, expect } from "vitest";
import { formatName, formatHeight, formatWeight, TYPE_COLORS, ALL_TYPES } from "./types.js";

describe("formatName", () => {
  it("capitalizes single word", () => {
    expect(formatName("pikachu")).toBe("Pikachu");
  });

  it("splits hyphens and capitalizes each part", () => {
    expect(formatName("bulbasaur")).toBe("Bulbasaur");
    expect(formatName("charizard-mega-x")).toBe("Charizard Mega X");
    expect(formatName("special-attack")).toBe("Special Attack");
  });

  it("handles already-capitalized input", () => {
    expect(formatName("Eevee")).toBe("Eevee");
  });
});

describe("formatHeight", () => {
  it("converts decimeters to feet/inches and meters", () => {
    // 7 dm = 70 cm = 2'04" (0.7m)
    expect(formatHeight(7)).toBe("2'04\" (0.7m)");
  });

  it("handles 0", () => {
    expect(formatHeight(0)).toBe("0'00\" (0.0m)");
  });
});

describe("formatWeight", () => {
  it("converts hectograms to lbs and kg", () => {
    // 69 hg = 6.9 kg = 15.2 lbs
    expect(formatWeight(69)).toBe("15.2 lbs (6.9 kg)");
  });

  it("handles 0", () => {
    expect(formatWeight(0)).toBe("0.0 lbs (0.0 kg)");
  });
});

describe("TYPE_COLORS", () => {
  it("has an entry for fire", () => {
    expect(TYPE_COLORS.fire).toBe("#F08030");
  });

  it("has 18 types", () => {
    expect(Object.keys(TYPE_COLORS)).toHaveLength(18);
  });
});

describe("ALL_TYPES", () => {
  it("contains fire and water", () => {
    expect(ALL_TYPES).toContain("fire");
    expect(ALL_TYPES).toContain("water");
  });

  it("matches TYPE_COLORS keys", () => {
    expect(ALL_TYPES).toEqual(Object.keys(TYPE_COLORS));
  });
});
