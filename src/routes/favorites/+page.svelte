<script lang="ts">
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { Star } from 'lucide-svelte';
	import PokemonCard from '$lib/components/PokemonCard.svelte';
	import { favorites } from '$lib/stores/favorites.svelte.js';
	import { fetchPokemon } from '$lib/api/pokeapi.js';

	interface PokemonEntry {
		id: number;
		name: string;
		types: string[];
	}

	let pokemonData = $state<Map<number, PokemonEntry>>(new Map());
	let loading = $state(true);
	let mounted = $state(false);

	// Derive a stable sorted list from the favorites ids array
	// Using the index as part of a compound key prevents duplicate-key errors
	const favIds = $derived([...new Set(favorites.ids)].sort((a, b) => a - b));

	async function loadFavorites(ids: number[]) {
		loading = true;
		await Promise.all(
			ids
				.filter((id) => !pokemonData.has(id))
				.map(async (id) => {
					try {
						const p = await fetchPokemon(id);
						pokemonData.set(id, { id: p.id, name: p.name, types: p.types.map((t) => t.type.name) });
						pokemonData = new Map(pokemonData);
					} catch {
						// ignore
					}
				})
		);
		loading = false;
	}

	$effect(() => {
		if (mounted && favIds.length > 0) {
			loadFavorites(favIds);
		} else if (mounted) {
			loading = false;
		}
	});

	onMount(() => {
		mounted = true;
		if (favorites.ids.length === 0) loading = false;
	});
</script>

<svelte:head>
	<title>My Favorites — Pokédex</title>
	<meta name="description" content="Your favorited Pokémon collection." />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8">
	<div class="flex items-center gap-3 mb-8">
		<Star size={32} class="text-yellow-400" aria-hidden="true" />
		<div>
			<h1 class="text-2xl font-bold">My Favorites</h1>
			<p class="text-sm text-gray-500">{favIds.length} saved</p>
		</div>
	</div>

	{#if !mounted || loading}
		<p class="text-center text-gray-500 py-16" aria-live="polite">Loading...</p>
	{:else if favIds.length === 0}
		<div class="flex flex-col items-center justify-center py-24 gap-4 text-center">
			<span class="text-6xl" aria-hidden="true">💔</span>
			<p class="text-lg font-semibold text-gray-700 dark:text-gray-300">No favorites yet</p>
			<p class="text-sm text-gray-500">Tap the heart on any Pokémon card to save it here</p>
			<a
				href="{base}/"
				class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm hover:bg-blue-600 transition-colors"
			>
				Browse Pokémon
			</a>
		</div>
	{:else}
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
			{#each favIds as id (id)}
				{@const entry = pokemonData.get(id)}
				{#if entry}
					<PokemonCard id={entry.id} name={entry.name} types={entry.types} />
				{/if}
			{/each}
		</div>
	{/if}
</div>
