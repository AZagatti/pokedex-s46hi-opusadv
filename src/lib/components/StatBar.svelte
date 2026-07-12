<script lang="ts">
	import { STAT_COLORS, STAT_LABELS } from '$lib/utils/types.js';

	interface Props {
		name: string;
		value: number;
		max?: number;
	}

	let { name, value, max = 255 }: Props = $props();

	const pct = $derived(Math.min(100, Math.round((value / max) * 100)));
	const color = $derived(STAT_COLORS[name] ?? '#888');
	const label = $derived(STAT_LABELS[name] ?? name);
</script>

<div class="flex items-center gap-3">
	<span class="text-xs font-semibold text-gray-500 dark:text-gray-400 w-8 text-right shrink-0"
		>{label}</span
	>
	<span class="text-sm font-bold text-gray-800 dark:text-white w-8 shrink-0">{value}</span>
	<div class="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
		<div
			class="stat-bar h-full rounded-full"
			style="width:{pct}%;background-color:{color};"
			role="progressbar"
			aria-valuenow={value}
			aria-valuemin={0}
			aria-valuemax={max}
			aria-label="{label}: {value}/{max}"
		></div>
	</div>
</div>
