<script lang="ts">
	import { onMount } from 'svelte';
	import { Search, X, ChevronDown, SlidersHorizontal } from 'lucide-svelte';
	import PokemonCard from '$lib/components/PokemonCard.svelte';
	import SkeletonCard from '$lib/components/SkeletonCard.svelte';
	import { fetchPokemonList, fetchPokemon, fetchGeneration, fetchType, getPokedexNumber } from '$lib/api/pokeapi.js';
	import { ALL_TYPES, TYPE_COLORS, formatName } from '$lib/utils/types.js';

	const PAGE_SIZE = 30;
	const TOTAL_POKEMON = 1025;

	interface PokemonEntry {
		id: number;
		name: string;
		types: string[];
		total: number;
	}

	let allLoaded = $state<PokemonEntry[]>([]);
	let displayed = $state<PokemonEntry[]>([]);
	let loading = $state(true);
	let loadingMore = $state(false);
	let offset = $state(0);
	let hasMore = $state(true);

	let searchQuery = $state('');
	let selectedGeneration = $state(0);
	let selectedTypes = $state<string[]>([]);
	let sortBy = $state<'id' | 'total'>('id');
	let filterOpen = $state(false);
	let filteredNames = $state<Set<string> | null>(null);
	let filterLoading = $state(false);

	let sentinel = $state<HTMLElement | undefined>(undefined);
	let debounceTimer: ReturnType<typeof setTimeout>;

	function onSearch(e: Event) {
		clearTimeout(debounceTimer);
		searchQuery = (e.target as HTMLInputElement).value;
		debounceTimer = setTimeout(() => applyFilters(), 250);
	}

	async function loadMorePokemon() {
		if (loadingMore || !hasMore) return;
		loadingMore = true;
		try {
			const list = await fetchPokemonList(PAGE_SIZE, offset);
			const entries = await Promise.all(
				list.results.map(async (r) => {
					const id = getPokedexNumber(r.url);
					const p = await fetchPokemon(id);
					return {
						id: p.id,
						name: p.name,
						types: p.types.map((t) => t.type.name),
						total: p.stats.reduce((s, x) => s + x.base_stat, 0)
					};
				})
			);
			allLoaded = [...allLoaded, ...entries];
			offset += PAGE_SIZE;
			hasMore = offset < TOTAL_POKEMON;
			applyFilters();
		} catch {
			// network failure — silently skip batch
		} finally {
			loadingMore = false;
		}
	}

	function applyFilters() {
		let result = [...allLoaded];

		if (filteredNames !== null) {
			result = result.filter((p) => filteredNames!.has(p.name));
		}

		if (searchQuery.trim()) {
			const q = searchQuery.trim().toLowerCase();
			result = result.filter((p) => p.name.includes(q) || p.id.toString() === q);
		}

		if (selectedTypes.length > 0) {
			result = result.filter((p) => selectedTypes.every((t) => p.types.includes(t)));
		}

		result.sort((a, b) => (sortBy === 'total' ? b.total - a.total : a.id - b.id));
		displayed = result;
	}

	async function applyGenerationFilter(gen: number) {
		selectedGeneration = gen;
		if (gen === 0) {
			filteredNames = null;
			applyFilters();
			return;
		}
		filterLoading = true;
		try {
			const g = await fetchGeneration(gen);
			const names = new Set(g.pokemon_species.map((s) => s.name));
			filteredNames = names;
			// Load any pokemon in this gen not already in allLoaded
			const alreadyLoaded = new Set(allLoaded.map((p) => p.name));
			const missing = g.pokemon_species.filter((s) => !alreadyLoaded.has(s.name));
			if (missing.length > 0) {
				const newEntries = (
					await Promise.all(
						missing.map(async (s) => {
							try {
								const p = await fetchPokemon(s.name);
								return {
									id: p.id,
									name: p.name,
									types: p.types.map((t) => t.type.name),
									total: p.stats.reduce((sum, x) => sum + x.base_stat, 0)
								};
							} catch {
								return null;
							}
						})
					)
				).filter((e): e is PokemonEntry => e !== null);
				allLoaded = [...allLoaded, ...newEntries];
			}
		} catch {
			filteredNames = null;
		} finally {
			filterLoading = false;
		}
		applyFilters();
	}

	async function toggleType(type: string) {
		if (selectedTypes.includes(type)) {
			selectedTypes = selectedTypes.filter((t) => t !== type);
		} else {
			selectedTypes = [...selectedTypes, type];
			// Backfill pokemon of this type not yet loaded
			filterLoading = true;
			try {
				const typeData = await fetchType(type);
				const alreadyLoaded = new Set(allLoaded.map((p) => p.name));
				const missing = typeData.pokemon
					.map((tp) => tp.pokemon)
					.filter((s) => !alreadyLoaded.has(s.name));
				if (missing.length > 0) {
					const newEntries = (
						await Promise.all(
							missing.map(async (s) => {
								try {
									const p = await fetchPokemon(s.name);
									return {
										id: p.id,
										name: p.name,
										types: p.types.map((t) => t.type.name),
										total: p.stats.reduce((sum, x) => sum + x.base_stat, 0)
									};
								} catch {
									return null;
								}
							})
						)
					).filter((e): e is PokemonEntry => e !== null);
					allLoaded = [...allLoaded, ...newEntries];
				}
			} catch {
				// ignore type fetch failure
			} finally {
				filterLoading = false;
			}
		}
		applyFilters();
	}

	function clearFilters() {
		searchQuery = '';
		selectedGeneration = 0;
		selectedTypes = [];
		filteredNames = null;
		sortBy = 'id';
		applyFilters();
	}

	const hasFilters = $derived(
		searchQuery !== '' || selectedGeneration !== 0 || selectedTypes.length > 0
	);

	onMount(() => {
		let observer: IntersectionObserver;

		(async () => {
			loading = true;
			await loadMorePokemon();
			loading = false;

			observer = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting && !loadingMore && hasMore) {
						loadMorePokemon();
					}
				},
				{ threshold: 0.1 }
			);
			if (sentinel) observer.observe(sentinel);
		})();

		return () => observer?.disconnect();
	});
</script>

<svelte:head>
	<title>Pokédex — All Pokémon</title>
	<meta name="description" content="Browse all 1000+ Pokémon with sprites, types, and stats." />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-6">
	<!-- Sticky toolbar -->
	<div class="sticky top-14 z-40 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur pb-4 pt-2 -mx-4 px-4 border-b border-gray-100 dark:border-gray-800 mb-6">
		<div class="flex gap-3 flex-wrap items-center">
			<div class="relative flex-1 min-w-48">
				<Search size={16} class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
				<input
					type="search"
					placeholder="Search Pokémon..."
					value={searchQuery}
					oninput={onSearch}
					aria-label="Search Pokémon by name or number"
					class="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div class="relative">
				<select
					value={selectedGeneration}
					onchange={(e) => applyGenerationFilter(parseInt((e.target as HTMLSelectElement).value, 10))}
					aria-label="Filter by generation"
					class="appearance-none pl-3 pr-8 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value={0}>All Gens</option>
					{#each Array.from({ length: 9 }, (_, i) => i + 1) as gen (gen)}
						<option value={gen}>Gen {gen}</option>
					{/each}
				</select>
				<ChevronDown size={14} class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true" />
			</div>

			<div class="relative">
				<select
					value={sortBy}
					onchange={(e) => { sortBy = (e.target as HTMLSelectElement).value as 'id' | 'total'; applyFilters(); }}
					aria-label="Sort Pokémon"
					class="appearance-none pl-3 pr-8 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="id">By Dex #</option>
					<option value="total">By Base Stat Total</option>
				</select>
				<ChevronDown size={14} class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true" />
			</div>

			<button
				onclick={() => (filterOpen = !filterOpen)}
				aria-expanded={filterOpen}
				aria-controls="type-filters"
				class="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
			>
				<SlidersHorizontal size={16} aria-hidden="true" />
				<span>Types{selectedTypes.length > 0 ? ` (${selectedTypes.length})` : ''}</span>
			</button>

			{#if hasFilters}
				<button
					onclick={clearFilters}
					class="flex items-center gap-1 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
					aria-label="Clear all filters"
				>
					<X size={14} aria-hidden="true" /> Clear
				</button>
			{/if}
		</div>

		{#if filterOpen}
			<div id="type-filters" class="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Filter by type">
				{#each ALL_TYPES as type (type)}
					{@const selected = selectedTypes.includes(type)}
					{@const color = TYPE_COLORS[type] ?? '#A8A878'}
					<button
						onclick={() => toggleType(type)}
						aria-pressed={selected}
						class="px-2.5 py-1 rounded-full text-xs font-semibold border-2 transition-all capitalize text-white"
						style="background-color:{selected ? color : 'transparent'}; border-color:{color}; color:{selected ? 'white' : color};"
					>
						{formatName(type)}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	{#if filterLoading}
		<p class="text-center text-gray-500 py-4" aria-live="polite">Loading generation filter...</p>
	{/if}

	{#if loading}
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
			{#each Array(12) as _, i (`sk-${i}`)}
				<SkeletonCard />
			{/each}
		</div>
	{:else if displayed.length === 0}
		<div class="flex flex-col items-center justify-center py-24 gap-4" aria-live="polite">
			<span class="text-6xl" aria-hidden="true">🔍</span>
			<p class="text-lg font-semibold text-gray-700 dark:text-gray-300">No Pokémon found</p>
			<p class="text-sm text-gray-500">Try adjusting your search or filters</p>
			<button onclick={clearFilters} class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm hover:bg-blue-600 transition-colors">
				Clear filters
			</button>
		</div>
	{:else}
		<div
			class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
			aria-label="Pokémon list"
		>
			{#each displayed as pokemon (pokemon.id)}
				<PokemonCard id={pokemon.id} name={pokemon.name} types={pokemon.types} />
			{/each}
			{#if loadingMore}
				{#each Array(6) as _, i (`loading-${i}`)}
					<SkeletonCard />
				{/each}
			{/if}
		</div>

		{#if !hasMore && !hasFilters}
			<p class="text-center text-sm text-gray-500 py-4">All {TOTAL_POKEMON} Pokémon loaded</p>
		{/if}
	{/if}

	<!-- Sentinel always mounted so IntersectionObserver stays wired after zero-result filter states -->
	<div bind:this={sentinel} class="h-8 mt-4" aria-hidden="true" role="presentation"></div>
</div>
