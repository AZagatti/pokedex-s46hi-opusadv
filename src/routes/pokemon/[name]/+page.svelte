<script lang="ts">
	import { base } from '$app/paths';
	import { ArrowLeft, Volume2 } from 'lucide-svelte';
	import TypeBadge from '$lib/components/TypeBadge.svelte';
	import StatBar from '$lib/components/StatBar.svelte';
	import FavoriteButton from '$lib/components/FavoriteButton.svelte';
	import { formatName, formatHeight, formatWeight, TYPE_COLORS } from '$lib/utils/types.js';
	import { getArtworkUrl, getSpriteUrl, getPokedexNumber } from '$lib/api/pokeapi.js';
	import type { PageData } from './$types';
	import type { EvolutionNode } from '$lib/api/schemas.js';

	interface Props { data: PageData }
	let { data }: Props = $props();

	let { pokemon, species, evoChain } = $derived(data);

	const primaryType = $derived(pokemon.types[0]?.type.name ?? 'normal');
	const primaryColor = $derived(TYPE_COLORS[primaryType] ?? '#A8A878');

	// Sprite switcher
	type SpriteKey = 'front' | 'back' | 'front_shiny' | 'back_shiny';
	let selectedSprite = $state<SpriteKey>('front');

	const spriteMap: Record<SpriteKey, (id: number) => string> = {
		front: (id) => getSpriteUrl(id),
		back: (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`,
		front_shiny: (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`,
		back_shiny: (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/${id}.png`
	};

	const currentSprite = $derived(spriteMap[selectedSprite](pokemon.id));

	// Flavor text
	const flavorText = $derived(
		species.flavor_text_entries?.find((e) => e.language.name === 'en')?.flavor_text.replace(/\f/g, ' ') ?? ''
	);

	// Evolution chain (flatten to stages)
	function flattenEvolution(node: EvolutionNode): { name: string; id: number; minLevel: number | null }[][] {
		const stages: { name: string; id: number; minLevel: number | null }[][] = [];
		function walk(n: EvolutionNode, depth: number) {
			if (!stages[depth]) stages[depth] = [];
			const id = getPokedexNumber(n.species.url);
			stages[depth].push({ name: n.species.name, id, minLevel: n.evolution_details[0]?.min_level ?? null });
			for (const next of n.evolves_to) walk(next, depth + 1);
		}
		walk(node, 0);
		return stages;
	}
	const evoStages = $derived(flattenEvolution(evoChain.chain));

	// Cry audio
	function playCry() {
		const url = pokemon.cries?.latest ?? pokemon.cries?.legacy;
		if (!url) return;
		const audio = new Audio(url);
		audio.play().catch(() => {});
	}

	// Moves (show first 8)
	const moves = $derived(pokemon.moves.slice(0, 8).map((m) => m.move.name));
</script>

<svelte:head>
	<title>{formatName(pokemon.name)} — Pokédex</title>
	<meta name="description" content="View {formatName(pokemon.name)}'s stats, abilities, and evolution chain." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-6">
	<!-- Back button -->
	<a
		href="{base}/"
		class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
	>
		<ArrowLeft size={16} aria-hidden="true" /> Back to Pokédex
	</a>

	<!-- Hero section -->
	<div
		class="rounded-3xl p-8 mb-8 relative overflow-hidden"
		style="background: linear-gradient(135deg, {primaryColor}33 0%, {primaryColor}11 100%);"
	>
		<div class="flex flex-col sm:flex-row items-center gap-8">
			<!-- Artwork + cry button -->
			<div class="relative shrink-0 flex flex-col items-center gap-4">
				<div class="page-enter">
					<img
						src={getArtworkUrl(pokemon.id)}
						alt={formatName(pokemon.name)}
						width="200"
						height="200"
						class="object-contain drop-shadow-2xl"
						style="filter: drop-shadow(0 8px 24px {primaryColor}66);"
					/>
				</div>
				{#if pokemon.cries?.latest || pokemon.cries?.legacy}
					<button
						onclick={playCry}
						class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-all hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
						style="background-color:{primaryColor};"
						aria-label="Play {formatName(pokemon.name)}'s cry"
					>
						<Volume2 size={16} aria-hidden="true" /> Play Cry
					</button>
				{/if}
			</div>

			<!-- Info -->
			<div class="flex-1 text-center sm:text-left">
				<p class="text-sm text-gray-500 dark:text-gray-400 font-mono mb-1">
					#{pokemon.id.toString().padStart(4, '0')}
				</p>
				<div class="flex items-center justify-center sm:justify-start gap-3 mb-3">
					<h1 class="text-3xl font-bold text-gray-900 dark:text-white">{formatName(pokemon.name)}</h1>
					<FavoriteButton id={pokemon.id} size={24} />
				</div>

				<div class="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
					{#each pokemon.types as slot (slot.slot)}
						<TypeBadge type={slot.type.name} />
					{/each}
				</div>

				{#if flavorText}
					<p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 max-w-sm">{flavorText}</p>
				{/if}

				<div class="flex gap-6 justify-center sm:justify-start text-sm">
					<div>
						<p class="text-gray-500 dark:text-gray-400 text-xs">Height</p>
						<p class="font-semibold">{formatHeight(pokemon.height)}</p>
					</div>
					<div>
						<p class="text-gray-500 dark:text-gray-400 text-xs">Weight</p>
						<p class="font-semibold">{formatWeight(pokemon.weight)}</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="grid md:grid-cols-2 gap-6">
		<!-- Base Stats -->
		<section class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
			<h2 class="font-bold text-lg mb-4">Base Stats</h2>
			<div class="flex flex-col gap-3">
				{#each pokemon.stats as stat (stat.stat.name)}
					<StatBar name={stat.stat.name} value={stat.base_stat} />
				{/each}
				<div class="pt-2 border-t border-gray-100 dark:border-gray-700">
					<div class="flex items-center gap-3">
						<span class="text-xs font-semibold text-gray-500 dark:text-gray-400 w-8 text-right shrink-0">TOT</span>
						<span class="text-sm font-bold">
							{pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0)}
						</span>
					</div>
				</div>
			</div>
		</section>

		<!-- Abilities + Moves -->
		<div class="flex flex-col gap-6">
			<section class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
				<h2 class="font-bold text-lg mb-3">Abilities</h2>
				<div class="flex flex-wrap gap-2">
					{#each pokemon.abilities as ability (ability.slot)}
						<span
							class="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700"
							class:ring-2={ability.is_hidden}
							class:ring-purple-400={ability.is_hidden}
						>
							{formatName(ability.ability.name)}
							{#if ability.is_hidden}
								<span class="ml-1 text-xs text-purple-500">(Hidden)</span>
							{/if}
						</span>
					{/each}
				</div>
			</section>

			<section class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
				<h2 class="font-bold text-lg mb-3">Sample Moves</h2>
				<div class="flex flex-wrap gap-2">
					{#each moves as move (move)}
						<span class="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 capitalize">
							{formatName(move)}
						</span>
					{/each}
				</div>
			</section>
		</div>
	</div>

	<!-- Sprite Variants -->
	<section class="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
		<h2 class="font-bold text-lg mb-4">Sprite Variants</h2>
		<div class="flex items-center gap-4 flex-wrap">
			<div class="flex gap-2 flex-wrap">
				{#each ([['front', 'Front'], ['back', 'Back'], ['front_shiny', 'Shiny'], ['back_shiny', 'Shiny Back']] as const) as [key, label] (key)}
					<button
						onclick={() => (selectedSprite = key)}
						class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
						class:bg-gray-900={selectedSprite === key}
						class:dark:bg-white={selectedSprite === key}
						class:text-white={selectedSprite === key}
						class:dark:text-gray-900={selectedSprite === key}
						class:bg-gray-100={selectedSprite !== key}
						class:dark:bg-gray-700={selectedSprite !== key}
						aria-pressed={selectedSprite === key}
					>
						{label}
					</button>
				{/each}
			</div>
			<img
				src={currentSprite}
				alt="{formatName(pokemon.name)} {selectedSprite} sprite"
				width="96"
				height="96"
				class="object-contain"
			/>
		</div>
	</section>

	<!-- Evolution Chain -->
	{#if evoStages.length > 1}
		<section class="mt-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
			<h2 class="font-bold text-lg mb-4">Evolution Chain</h2>
			<div class="flex items-center gap-2 flex-wrap justify-center">
				{#each evoStages as stage, i (i)}
					{#if i > 0}
						<div class="flex flex-col items-center text-gray-400">
							<span class="text-2xl">→</span>
							{#if stage[0]?.minLevel}
								<span class="text-xs">Lv.{stage[0].minLevel}</span>
							{/if}
						</div>
					{/if}
					<div class="flex flex-col gap-2">
						{#each stage as evo (evo.name)}
							<a
								href="{base}/pokemon/{evo.name}"
								class="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
								class:ring-2={evo.name === pokemon.name}
								class:ring-offset-2={evo.name === pokemon.name}
								style="--tw-ring-color: {primaryColor};"
								aria-current={evo.name === pokemon.name ? 'page' : undefined}
							>
								{#if evo.id > 0}
									<img
										src={getSpriteUrl(evo.id)}
										alt={formatName(evo.name)}
										width="64"
										height="64"
										loading="lazy"
										class="object-contain group-hover:scale-110 transition-transform"
									/>
								{/if}
								<span class="text-xs font-medium capitalize">{formatName(evo.name)}</span>
							</a>
						{/each}
					</div>
				{/each}
			</div>
		</section>
	{/if}
</div>
