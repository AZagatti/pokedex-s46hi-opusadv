export const prerender = true;

import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { fetchBerryList } from "$lib/api/pokeapi.js";

export const load: PageLoad = async () => {
  try {
    const list = await fetchBerryList(64, 0);
    return { berries: list.results };
  } catch {
    error(503, "Could not load berry list — PokeAPI may be unavailable");
  }
};
