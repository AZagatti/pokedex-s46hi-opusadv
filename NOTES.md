# Build Journal

Surprises, rework, and confusion encountered during development.

---

- **2026-07-12** PokemonImage.svelte threw "Expected token >" — caused by `{src}={imgSrc}` (invalid Svelte 5 shorthand syntax when the prop name differs from the variable). Fixed to `src={imgSrc}`.

- **2026-07-12** `let sentinel: HTMLElement;` caused a non-reactive update warning in the IntersectionObserver setup. Changed to `let sentinel = $state<HTMLElement | undefined>(undefined);` to make the binding reactive.

- **2026-07-12** `onMount` return type error: `Promise<() => void>` is not assignable to `void | (() => void)`. Svelte's `onMount` expects a synchronous cleanup function, not an async one. Fixed by wrapping async work in an IIFE inside `onMount` and returning the sync cleanup directly.

- **2026-07-12** `oxlint.config.ts` with ultracite's `defineConfig` export failed — the package exports a JSON object, not a TypeScript module. Replaced with `.oxlintrc.json` (JSON format).

- **2026-07-12** `lefthook install` blocked by npm's script approval requirement. Resolved with `npm approve-scripts lefthook`.

- **2026-07-12** Zod recursive schema for `EvolutionNode` failed with a circular reference error. Required an explicit TypeScript interface and a `z.ZodType<EvolutionNode>` cast on `z.lazy(...)` to break the cycle.

- **2026-07-12** `Cannot find name 'process'` in vite.config.ts — missing `@types/node`. Fixed by installing the package and adding `"types": ["node"]` to tsconfig.json.

- **2026-07-12** Generation/type filters initially only filtered `allLoaded` (the currently scrolled-in pokemon). If the user picked Gen 5 with only Gen 1 loaded, results were empty. Fixed by loading all pokemon belonging to the selected generation when a generation filter is chosen.

- **2026-07-12** Base-stat sort was a silent stub — the sort branch used `a.id - b.id` identical to the default, and `PokemonEntry` didn't carry the stat total. Fixed by computing `total: p.stats.reduce((s, x) => s + x.base_stat, 0)` on load and wiring the sort selector properly.

- **2026-07-12** `parseInt` on the generation select value lacked radix — changed to `parseInt(value, 10)` to satisfy the linter.

- **2026-07-12** `playwright install --with-deps chromium` requires sudo for system packages in WSL2. Removed `--with-deps` since Chromium binaries alone are sufficient in this environment.

- **2026-07-12** Favorites page stored IDs in a `Set<number>` which caused Svelte's `each_key_duplicate` runtime error. Fixed by switching to `number[]` and deduplicating in the derived view with `[...new Set(ids)].sort()`.

- **2026-07-12** lefthook's `{staged_files}` format-check with `oxfmt --check` failed with "Expected at least one target file" when only `.svelte` files were staged. oxfmt silently ignores individual `.svelte` file arguments. Fixed by running `oxfmt --check src/` (directory) instead.

- **2026-07-12** Lighthouse flagged `aria-label="View {name} details"` on PokemonCard `<a>` as a label-content-name-mismatch (visible text "Bulbasaur" didn't match accessible name "View Bulbasaur details"). Removed the aria-label; card content already provides sufficient label.

- **2026-07-12** The remote had an older implementation from a prior session. Had to force-push our complete build to replace it.

- **2026-07-12** Deep links (hard-loading `/pokemon/pikachu`) were blank. Root cause: `adapter-static`'s `404.html` SPA fallback uses absolute `/_app/...` paths when `paths.relative` is `true` (the default). With a project site at `/pokedex-s46hi-opusadv/`, those resolve to the repo root instead of the project subdirectory. Fixed by setting `paths.relative = false` in vite.config.ts, which makes all HTML files (including `404.html`) use absolute paths with the base prefix (`/pokedex-s46hi-opusadv/_app/...`).

- **2026-07-12** `filterLoading` state was reused for both generation and type filter loading, but the UI label hardcoded "Loading generation filter..." — showed wrong copy when a type was selected. Fixed to generic "Loading...".

- **2026-07-12** Playwright's webServer config (`npm run build && npm run preview`) was silently rebuilding the project during the E2E step — WITHOUT `BASE_PATH` — overwriting the correctly-built artifact. The uploaded Pages artifact therefore had `base=""` and `/_app/...` paths in `404.html`. Fixed by splitting into: (1) a no-base build + E2E pass, (2) a separate `BASE_PATH` build for the deploy artifact. Also changed `playwright.config.ts` to only run `npm run preview` in CI (not rebuild).
