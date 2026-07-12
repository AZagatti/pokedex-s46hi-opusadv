<script lang="ts">
	import { Heart } from 'lucide-svelte';
	import { favorites } from '$lib/stores/favorites.svelte.js';

	interface Props {
		id: number;
		size?: number;
		class?: string;
	}

	let { id, size = 20, class: cls = '' }: Props = $props();

	let isFav = $derived(favorites.isFavorite(id));

	function toggle(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		favorites.toggle(id);
	}
</script>

<button
	onclick={toggle}
	aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
	aria-pressed={isFav}
	class="rounded-full p-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 {cls}"
	class:text-red-500={isFav}
	class:text-gray-400={!isFav}
	class:hover:text-red-400={!isFav}
>
	<Heart size={size} fill={isFav ? 'currentColor' : 'none'} />
</button>
