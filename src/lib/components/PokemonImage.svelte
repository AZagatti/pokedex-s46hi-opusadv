<script lang="ts">
	import { getSpriteUrl } from '$lib/api/pokeapi.js';

	interface Props {
		id: number;
		name: string;
		size?: number;
		artwork?: boolean;
		src?: string | null;
	}

	let { id, name, size = 96, artwork = false, src = null }: Props = $props();

	let imgSrc = $derived(
		src ?? (artwork
			? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
			: getSpriteUrl(id))
	);
	let loaded = $state(false);
	let errored = $state(false);

	function onload() {
		loaded = true;
	}
	function onerror() {
		errored = true;
	}
</script>

<div class="relative" style="width:{size}px;height:{size}px;">
	{#if !loaded && !errored}
		<div class="skeleton absolute inset-0 rounded-full"></div>
	{/if}
	{#if !errored}
		<img
			src={imgSrc}
			alt={name}
			width={size}
			height={size}
			loading="lazy"
			class="object-contain transition-opacity duration-300"
			class:opacity-0={!loaded}
			class:opacity-100={loaded}
			onload={onload}
			onerror={onerror}
		/>
	{:else}
		<div
			class="flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 text-xs"
			style="width:{size}px;height:{size}px;"
		>
			?
		</div>
	{/if}
</div>
