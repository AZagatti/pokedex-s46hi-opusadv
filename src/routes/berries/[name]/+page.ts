export const prerender = false;

import type { PageLoad } from "./$types";
import { fetchBerry } from "$lib/api/pokeapi.js";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ params }) => {
  try {
    const berry = await fetchBerry(params.name);
    return { berry };
  } catch {
    error(404, `Berry "${params.name}" not found`);
  }
};
