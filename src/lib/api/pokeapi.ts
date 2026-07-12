import { cachedFetch } from "./cache.js";
import {
  BerryListSchema,
  BerrySchema,
  EvolutionChainSchema,
  GenerationSchema,
  PokemonListSchema,
  PokemonSchema,
  PokemonSpeciesSchema,
  TypeDetailSchema,
} from "./schemas.js";

const BASE = "https://pokeapi.co/api/v2";

export async function fetchPokemonList(limit: number, offset: number) {
  const data = await cachedFetch<unknown>(`${BASE}/pokemon?limit=${limit}&offset=${offset}`);
  return PokemonListSchema.parse(data);
}

export async function fetchPokemon(nameOrId: string | number) {
  const data = await cachedFetch<unknown>(`${BASE}/pokemon/${nameOrId}`);
  return PokemonSchema.parse(data);
}

export async function fetchPokemonSpecies(nameOrId: string | number) {
  const data = await cachedFetch<unknown>(`${BASE}/pokemon-species/${nameOrId}`);
  return PokemonSpeciesSchema.parse(data);
}

export async function fetchEvolutionChain(url: string) {
  const data = await cachedFetch<unknown>(url);
  return EvolutionChainSchema.parse(data);
}

export async function fetchType(name: string) {
  const data = await cachedFetch<unknown>(`${BASE}/type/${name}`);
  return TypeDetailSchema.parse(data);
}

export async function fetchGeneration(id: number) {
  const data = await cachedFetch<unknown>(`${BASE}/generation/${id}`);
  return GenerationSchema.parse(data);
}

export async function fetchBerryList(limit = 64, offset = 0) {
  const data = await cachedFetch<unknown>(`${BASE}/berry?limit=${limit}&offset=${offset}`);
  return BerryListSchema.parse(data);
}

export async function fetchBerry(nameOrId: string | number) {
  const data = await cachedFetch<unknown>(`${BASE}/berry/${nameOrId}`);
  return BerrySchema.parse(data);
}

export function getPokedexNumber(url: string): number {
  const match = url.match(/\/pokemon(?:-species)?\/(\d+)\/?$/);
  return match ? parseInt(match[1], 10) : 0;
}

export function getSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
