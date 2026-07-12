# Decisions

Key technology choices and their rationale.

---

## SvelteKit 2 + Svelte 5 runes

Svelte 5 runes (`$state`, `$derived`, `$effect`, `$props`) replace the options API and bring reactivity closer to JavaScript primitives. Runes are enforced globally via `compilerOptions.runes` in vite.config.ts — this prevents accidental mixing of the legacy component API with the new rune API.

## TypeScript strict mode

Strict mode catches null-safety issues and accidental `any` types at compile time. Combined with Zod runtime validation at API boundaries, this ensures the entire data path from network to UI is type-safe.

## Tailwind CSS v4

v4 moves to CSS-native imports and removes the PostCSS plugin requirement. The dark mode variant requires `@custom-variant dark (&:where(.dark, .dark *));` in the CSS layer — without this, `dark:` utilities are no-ops when toggling a class on `<html>`.

## @sveltejs/adapter-static (SPA mode)

GitHub Pages serves static files only. `fallback: '404.html'` turns the site into a SPA — GitHub Pages redirects unmatched paths to 404.html, which loads the full SvelteKit app and client-side routing takes over. This makes dynamic routes (`/pokemon/[name]`) work after hard reloads.

## Native fetch + Zod + in-memory Map cache

No third-party data-fetching library needed. `cachedFetch` wraps `fetch` with a `Map<string, unknown>` keyed by URL. The cache is session-scoped (cleared on reload), which keeps the implementation minimal while eliminating redundant API calls during a session. Zod validates every response shape — unknown fields are stripped, missing required fields throw at parse time.

## oxlint + oxfmt (not ESLint + Prettier)

oxlint is ~100× faster than ESLint for the rule set used here and is zero-config for browser/TypeScript targets. oxfmt provides deterministic formatting with no configuration file required. Both are pinned via ultracite.

## lefthook (not husky + lint-staged)

lefthook is a single binary with native parallel execution for pre-commit checks. Configuration is declarative (YAML) and supports `staged_files` filtering out of the box. pre-commit runs lint, format-check, and typecheck in parallel; pre-push runs unit tests.

## `/berries` — prerender: true (known limitation)

The berry list page prerenders at build time for fast initial load, since the full list of 64 berries is stable. The trade-off: if PokeAPI is rate-limited or unreachable during the CI build, the build fails. This is accepted because berry data is stable and PokeAPI is generally reliable. Berry detail pages (`/berries/[name]`) remain client-rendered (`prerender = false`) to avoid build time explosion.

## Generation filter — loads on demand

When a user selects a generation filter, the app fetches the generation's Pokémon species list and then loads any Pokémon not already in memory. This ensures filtering works correctly even if the user selects a generation before scrolling that far in the infinite list. The trade-off is a batch of parallel API calls on first generation selection, mitigated by the session cache (subsequent visits to the same generation are instant).

## Favorites stored as `number[]`

Favorites are stored as a `number[]` (not `Set<number>`) in the Svelte store. Svelte's `{#each}` requires serializable, comparable keys. A `Set` is not directly reactive and caused `each_key_duplicate` errors in early development. The deduplication is applied at read time: `[...new Set(ids)].sort()`.
