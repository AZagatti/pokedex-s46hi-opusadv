<script lang="ts">
	import { base } from '$app/paths';
	import { Sun, Moon, Star, BookOpen, Cherry } from 'lucide-svelte';
	import { theme } from '$lib/stores/theme.svelte.js';
	import { page } from '$app/state';

	const navLinks = [
		{ href: `${base}/`, label: 'Pokédex', icon: BookOpen },
		{ href: `${base}/berries`, label: 'Berries', icon: Cherry },
		{ href: `${base}/favorites`, label: 'Favorites', icon: Star }
	];

	let currentPath = $derived(page.url.pathname);

	function isActive(href: string) {
		if (href === `${base}/`) return currentPath === href || currentPath === `${base}`;
		return currentPath.startsWith(href);
	}
</script>

<header class="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-100 dark:border-gray-800">
	<nav class="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
		<a href="{base}/" class="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
			<span aria-hidden="true">🔴</span> Pokédex
		</a>

		<div class="flex items-center gap-1">
			{#each navLinks as link (link.href)}
				<a
					href={link.href}
					class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
					class:bg-gray-100={isActive(link.href)}
					class:dark:bg-gray-800={isActive(link.href)}
					class:text-gray-900={isActive(link.href)}
					class:dark:text-white={isActive(link.href)}
					class:text-gray-600={!isActive(link.href)}
					class:dark:text-gray-400={!isActive(link.href)}
					class:hover:bg-gray-50={!isActive(link.href)}
					class:dark:hover:bg-gray-800={!isActive(link.href)}
					aria-current={isActive(link.href) ? 'page' : undefined}
				>
					<link.icon size={16} aria-hidden="true" />
					<span class="hidden sm:inline">{link.label}</span>
				</a>
			{/each}

			<button
				onclick={() => theme.toggle()}
				aria-label={theme.isDark ? 'Switch to light mode' : 'Switch to dark mode'}
				class="ml-2 p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
			>
				{#if theme.isDark}
					<Sun size={18} aria-hidden="true" />
				{:else}
					<Moon size={18} aria-hidden="true" />
				{/if}
			</button>
		</div>
	</nav>
</header>
