import { z } from "zod";

export const NamedAPIResourceSchema = z.object({
  name: z.string(),
  url: z.string(),
});

export const PokemonListSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(NamedAPIResourceSchema),
});

export const PokemonTypeSlotSchema = z.object({
  slot: z.number(),
  type: NamedAPIResourceSchema,
});

export const PokemonStatSchema = z.object({
  base_stat: z.number(),
  effort: z.number(),
  stat: NamedAPIResourceSchema,
});

export const PokemonAbilitySchema = z.object({
  ability: NamedAPIResourceSchema,
  is_hidden: z.boolean(),
  slot: z.number(),
});

export const PokemonMoveSchema = z.object({
  move: NamedAPIResourceSchema,
});

export const PokemonSpritesSchema = z.object({
  front_default: z.string().nullable(),
  front_shiny: z.string().nullable(),
  back_default: z.string().nullable(),
  back_shiny: z.string().nullable(),
  other: z
    .object({
      "official-artwork": z
        .object({
          front_default: z.string().nullable(),
          front_shiny: z.string().nullable(),
        })
        .optional(),
    })
    .optional(),
});

export const PokemonCrySchema = z.object({
  latest: z.string().nullable(),
  legacy: z.string().nullable(),
});

export const PokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  height: z.number(),
  weight: z.number(),
  base_experience: z.number().nullable(),
  types: z.array(PokemonTypeSlotSchema),
  stats: z.array(PokemonStatSchema),
  abilities: z.array(PokemonAbilitySchema),
  moves: z.array(PokemonMoveSchema),
  sprites: PokemonSpritesSchema,
  cries: PokemonCrySchema.optional(),
  species: NamedAPIResourceSchema,
});

export type Pokemon = z.infer<typeof PokemonSchema>;

export const PokemonSpeciesSchema = z.object({
  id: z.number(),
  name: z.string(),
  evolution_chain: z.object({ url: z.string() }),
  flavor_text_entries: z
    .array(
      z.object({
        flavor_text: z.string(),
        language: NamedAPIResourceSchema,
        version: NamedAPIResourceSchema,
      }),
    )
    .optional(),
  genera: z
    .array(
      z.object({
        genus: z.string(),
        language: NamedAPIResourceSchema,
      }),
    )
    .optional(),
});

export type PokemonSpecies = z.infer<typeof PokemonSpeciesSchema>;

// Recursive evolution chain node - must use explicit interface
export interface EvolutionNode {
  species: { name: string; url: string };
  evolution_details: {
    min_level: number | null;
    trigger: { name: string; url: string } | null;
    item: { name: string; url: string } | null;
  }[];
  evolves_to: EvolutionNode[];
}

const EvolutionChainNodeSchema: z.ZodType<EvolutionNode> = z.lazy(() =>
  z.object({
    species: NamedAPIResourceSchema,
    evolution_details: z.array(
      z.object({
        min_level: z.number().nullable(),
        trigger: NamedAPIResourceSchema.nullable(),
        item: NamedAPIResourceSchema.nullable(),
      }),
    ),
    evolves_to: z.array(EvolutionChainNodeSchema),
  }),
);

export const EvolutionChainSchema = z.object({
  id: z.number(),
  chain: EvolutionChainNodeSchema,
});

export type EvolutionChain = z.infer<typeof EvolutionChainSchema>;

export const TypeDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  pokemon: z.array(
    z.object({
      pokemon: NamedAPIResourceSchema,
      slot: z.number(),
    }),
  ),
});

export const GenerationSchema = z.object({
  id: z.number(),
  name: z.string(),
  pokemon_species: z.array(NamedAPIResourceSchema),
});

export const BerryListSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(NamedAPIResourceSchema),
});

export const BerryFlavorSchema = z.object({
  potency: z.number(),
  flavor: NamedAPIResourceSchema,
});

export const BerrySchema = z.object({
  id: z.number(),
  name: z.string(),
  growth_time: z.number(),
  max_harvest: z.number(),
  natural_gift_power: z.number(),
  size: z.number(),
  smoothness: z.number(),
  soil_dryness: z.number(),
  firmness: NamedAPIResourceSchema,
  flavors: z.array(BerryFlavorSchema),
  item: NamedAPIResourceSchema,
  natural_gift_type: NamedAPIResourceSchema,
});

export type Berry = z.infer<typeof BerrySchema>;
