# Architecture

## Tech stack

| Layer | Choice |
|---|---|
| Framework | SvelteKit 2 + Svelte 5 runes |
| Language | TypeScript (strict) |
| Styles | Tailwind CSS v4 |
| Deploy adapter | `@sveltejs/adapter-static` (SPA, `fallback: '404.html'`) |
| Data | Native `fetch` + Zod schemas + in-memory Map cache |
| Testing | Vitest (unit) + Playwright (e2e) |

## Route structure

```
/                          → Pokémon list (infinite scroll, filters, sort)
/pokemon/[name]            → Pokémon detail (stats, moves, sprites, cry, evo chain)
/berries                   → Berry list (prerendered at build time)
/berries/[name]            → Berry detail (flavor bars, growth stats)
/favorites                 → User's saved Pokémon (localStorage)
```

## Data flow

```
Browser → cachedFetch(url)
            │
            ├─ cache.has(url)?  → return cached value
            │
            └─ fetch(url)
                  │
                  └─ Zod.parse() → typed domain object → component
```

`cachedFetch` wraps native `fetch` with an in-memory `Map<string, unknown>`. The cache lives for the page session and is cleared on reload. All API responses are validated with Zod schemas before use.

## State management

- **Theme** — `src/lib/stores/theme.svelte.ts`: `$state(isDark)`, persisted in `localStorage`, toggles `.dark` class on `<html>`.
- **Favorites** — `src/lib/stores/favorites.svelte.ts`: `$state<number[]>(ids)`, persisted in `localStorage` as a JSON array.
- **Page-local state** — each route manages its own loading/filter/pagination state using Svelte 5 `$state` and `$derived`.

## Routing model

`adapter-static` with `fallback: '404.html'` enables SPA routing on GitHub Pages. All internal `href` values are prefixed with `base` from `$app/paths` so the app works under the `/pokedex-s46hi-opusadv` subpath.

Dynamic routes (`/pokemon/[name]`, `/berries/[name]`) have `prerender = false` — they fetch data client-side. `/berries` has `prerender = true` and fetches the berry list at build time.

## CSS / theming

Tailwind v4 uses `@import 'tailwindcss'` and requires `@custom-variant dark (&:where(.dark, .dark *));` in the CSS layer for class-based dark mode. The root `<html>` element carries the `dark` class when dark mode is active.
