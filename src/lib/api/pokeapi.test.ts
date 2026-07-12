import { describe, it, expect } from "vitest";
import { getPokedexNumber, getSpriteUrl, getArtworkUrl } from "./pokeapi.js";

describe("getPokedexNumber", () => {
  it("extracts dex number from pokemon URL", () => {
    expect(getPokedexNumber("https://pokeapi.co/api/v2/pokemon/25/")).toBe(25);
  });

  it("extracts dex number from pokemon-species URL", () => {
    expect(getPokedexNumber("https://pokeapi.co/api/v2/pokemon-species/1/")).toBe(1);
  });

  it("extracts number without trailing slash", () => {
    expect(getPokedexNumber("https://pokeapi.co/api/v2/pokemon/150")).toBe(150);
  });

  it("returns 0 for unrecognized URL", () => {
    expect(getPokedexNumber("https://pokeapi.co/api/v2/berry/1/")).toBe(0);
  });
});

describe("getSpriteUrl", () => {
  it("returns correct sprite URL for bulbasaur", () => {
    expect(getSpriteUrl(1)).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    );
  });
});

describe("getArtworkUrl", () => {
  it("returns correct official-artwork URL", () => {
    expect(getArtworkUrl(6)).toBe(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
    );
  });
});
