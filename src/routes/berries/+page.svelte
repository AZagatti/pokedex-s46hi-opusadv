<script lang="ts">
	import { base } from '$app/paths';
	import { Cherry } from 'lucide-svelte';
	import { formatName } from '$lib/utils/types.js';
	import type { PageData } from './$types';

	interface Props { data: PageData }
	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Berries — Pokédex</title>
	<meta name="description" content="Browse all Pokémon berries with their flavors, firmness, and growth time." />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8">
	<div class="flex items-center gap-3 mb-8">
		<Cherry size={32} class="text-red-400" aria-hidden="true" />
		<div>
			<h1 class="text-2xl font-bold">Berries</h1>
			<p class="text-sm text-gray-500">{data.berries.length} berries</p>
		</div>
	</div>

	<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
		{#each data.berries as berry (berry.name)}
			<a
				href="{base}/berries/{berry.name}"
				class="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
				aria-label="View {formatName(berry.name)} berry details"
			>
				<span class="text-4xl" aria-hidden="true">🍒</span>
				<span class="text-sm font-semibold text-center capitalize">{formatName(berry.name)} Berry</span>
			</a>
		{/each}
	</div>
</div>
