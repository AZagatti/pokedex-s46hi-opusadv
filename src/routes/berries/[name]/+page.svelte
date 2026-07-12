<script lang="ts">
	import { base } from '$app/paths';
	import { ArrowLeft } from 'lucide-svelte';
	import { formatName } from '$lib/utils/types.js';
	import type { PageData } from './$types';

	interface Props { data: PageData }
	let { data }: Props = $props();
	let { berry } = $derived(data);

	const FLAVOR_COLORS: Record<string, string> = {
		spicy: '#F44336',
		dry: '#2196F3',
		sweet: '#E91E63',
		bitter: '#4CAF50',
		sour: '#FFEB3B'
	};

	const maxPotency = $derived(Math.max(...berry.flavors.map((f) => f.potency), 1));
</script>

<svelte:head>
	<title>{formatName(berry.name)} Berry — Pokédex</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-6">
	<a
		href="{base}/berries"
		class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
	>
		<ArrowLeft size={16} aria-hidden="true" /> Back to Berries
	</a>

	<div class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
		<div class="flex items-center gap-6 mb-8">
			<span class="text-7xl" aria-hidden="true">🍒</span>
			<div>
				<h1 class="text-2xl font-bold">{formatName(berry.name)} Berry</h1>
				<p class="text-sm text-gray-500 capitalize">#{berry.id} · {formatName(berry.firmness.name)} firmness</p>
			</div>
		</div>

		<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
			{#each ([['Growth Time', `${berry.growth_time}h`], ['Max Harvest', berry.max_harvest], ['Size', `${berry.size}mm`], ['Smoothness', berry.smoothness]] as const) as [label, value] (label)}
				<div class="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
					<p class="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
					<p class="font-bold text-lg">{value}</p>
				</div>
			{/each}
		</div>

		<section aria-label="Flavor profile">
			<h2 class="font-bold mb-4">Flavor Profile</h2>
			<div class="flex flex-col gap-3">
				{#each berry.flavors as flavor (flavor.flavor.name)}
					{@const pct = Math.round((flavor.potency / maxPotency) * 100)}
					{@const color = FLAVOR_COLORS[flavor.flavor.name] ?? '#888'}
					<div class="flex items-center gap-3">
						<span class="text-sm capitalize w-16 shrink-0 font-medium">{flavor.flavor.name}</span>
						<span class="text-sm w-8 text-right shrink-0 text-gray-500">{flavor.potency}</span>
						<div class="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
							<div
								class="h-full rounded-full stat-bar"
								style="width:{pct}%;background-color:{color};"
								role="progressbar"
								aria-valuenow={flavor.potency}
								aria-valuemin={0}
								aria-valuemax={maxPotency}
								aria-label="{flavor.flavor.name}: {flavor.potency}"
							></div>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
			<p class="text-sm text-gray-500">
				Natural Gift Type: <span class="font-semibold capitalize">{formatName(berry.natural_gift_type.name)}</span>
				· Power: <span class="font-semibold">{berry.natural_gift_power}</span>
			</p>
		</div>
	</div>
</div>
