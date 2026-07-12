<script lang="ts">
	import { base } from '$app/paths';
	import TypeBadge from './TypeBadge.svelte';
	import FavoriteButton from './FavoriteButton.svelte';
	import { formatName, TYPE_COLORS } from '$lib/utils/types.js';
	import { getSpriteUrl } from '$lib/api/pokeapi.js';

	interface Props {
		id: number;
		name: string;
		types: string[];
	}

	let { id, name, types }: Props = $props();

	const primaryColor = $derived(TYPE_COLORS[types[0]] ?? '#A8A878');
	const href = $derived(`${base}/pokemon/${name}`);
	const imgSrc = $derived(getSpriteUrl(id));
</script>

<div class="group relative rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md hover:-translate-y-1">
	<!-- Color strip -->
	<div
		class="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl opacity-70 pointer-events-none"
		style="background-color:{primaryColor};"
	></div>

	<a
		{href}
		class="flex flex-col items-center p-4 gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 rounded-2xl"
		aria-label="View {formatName(name)} details"
	>
		<span class="text-xs text-gray-400 dark:text-gray-500 font-mono">#{id.toString().padStart(4, '0')}</span>

		<img
			src={imgSrc}
			alt={formatName(name)}
			width="96"
			height="96"
			loading="lazy"
			class="object-contain w-24 h-24 group-hover:scale-110 transition-transform duration-300"
		/>

		<p class="font-semibold text-gray-800 dark:text-white text-sm">{formatName(name)}</p>

		<div class="flex flex-wrap gap-1 justify-center">
			{#each types as type (type)}
				<TypeBadge {type} size="sm" />
			{/each}
		</div>
	</a>

	<FavoriteButton {id} class="absolute top-3 right-3 z-10" />
</div>
