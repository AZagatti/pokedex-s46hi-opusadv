<script lang="ts">
	import './layout.css';
	import Header from '$lib/components/Header.svelte';
	import { theme } from '$lib/stores/theme.svelte.js';
	import { favorites } from '$lib/stores/favorites.svelte.js';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		theme.init();
		favorites.init();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Pokédex</title>
	<meta name="description" content="Browse all Pokémon with stats, evolutions, and more." />
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
	<Header />
	<main id="main-content" class="page-enter">
		{@render children()}
	</main>
</div>
