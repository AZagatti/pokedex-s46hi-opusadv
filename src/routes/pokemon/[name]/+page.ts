export const prerender = false;

import type { PageLoad } from "./$types";
import { fetchPokemon, fetchPokemonSpecies, fetchEvolutionChain } from "$lib/api/pokeapi.js";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ params }) => {
  try {
    const pokemon = await fetchPokemon(params.name);
    const species = await fetchPokemonSpecies(pokemon.id);
    const evoChain = await fetchEvolutionChain(species.evolution_chain.url);
    return { pokemon, species, evoChain };
  } catch {
    error(404, `Pokémon "${params.name}" not found`);
  }
};
