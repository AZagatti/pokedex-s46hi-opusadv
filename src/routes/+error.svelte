<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} — Pokédex</title>
</svelte:head>

<div class="max-w-xl mx-auto px-4 py-24 text-center">
	<p class="text-8xl mb-6" aria-hidden="true">
		{page.status === 404 ? '🔍' : '⚠️'}
	</p>
	<h1 class="text-3xl font-bold mb-3">
		{page.status === 404 ? 'Not Found' : 'Something went wrong'}
	</h1>
	<p class="text-gray-500 dark:text-gray-400 mb-8">
		{page.error?.message ?? 'An unexpected error occurred.'}
	</p>
	<a
		href="{base}/"
		class="inline-flex px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
	>
		Go to Pokédex
	</a>
</div>
