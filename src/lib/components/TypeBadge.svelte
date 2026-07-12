<script lang="ts">
	import { formatName, TYPE_COLORS } from '$lib/utils/types.js';

	interface Props {
		type: string;
		size?: 'sm' | 'md';
	}

	let { type, size = 'md' }: Props = $props();

	const color = $derived(TYPE_COLORS[type] ?? '#888');
	const classes = $derived(size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm');
</script>

<span
	class="inline-block rounded-full font-semibold text-white capitalize {classes}"
	style="background-color: {color};"
>
	{formatName(type)}
</span>
