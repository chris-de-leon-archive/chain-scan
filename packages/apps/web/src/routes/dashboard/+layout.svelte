<script lang="ts">
	import { AppBar, Navigation, ToastProvider } from '@skeletonlabs/skeleton-svelte'
	import type { LayoutProps } from './$types'
	import { page } from '$app/state'
	import {
		SettingsIcon,
		DatabaseIcon,
		CodeXmlIcon,
		BlocksIcon,
		LayersIcon,
		HomeIcon,
	} from 'lucide-svelte'

	let { data, children }: LayoutProps = $props()

	const pathname = $derived(page.url.pathname)
	const routes = {
		home: '/dashboard/home',
		transactions: '/dashboard/transactions',
		blocks: '/dashboard/blocks',
		contracts: '/dashboard/contracts',
		datasources: '/dashboard/datasources',
		settings: '/dashboard/settings',
	}
</script>

<main class="max-h-screen">
	<div class="card border-surface-100-900 grid min-h-screen w-full grid-cols-[auto_1fr]">
		<Navigation.Rail>
			{#snippet header()}
				<Navigation.Tile href={routes.home} title="Menu" selected={pathname === routes.home}>
					<HomeIcon />
				</Navigation.Tile>
			{/snippet}
			{#snippet tiles()}
				<div class="flex h-full flex-col items-center justify-start">
					<Navigation.Tile
						id="0"
						label="Blocks"
						selected={pathname === routes.blocks}
						href={routes.blocks}
					>
						<BlocksIcon />
					</Navigation.Tile>
					<Navigation.Tile
						id="1"
						label="Transactions"
						selected={pathname === routes.transactions}
						href={routes.transactions}
					>
						<LayersIcon />
					</Navigation.Tile>
					<Navigation.Tile
						id="2"
						label="Contracts"
						selected={pathname === routes.contracts}
						href={routes.contracts}
					>
						<CodeXmlIcon />
					</Navigation.Tile>
					<Navigation.Tile
						id="3"
						label="Datasources"
						selected={pathname === routes.datasources}
						href={routes.datasources}
					>
						<DatabaseIcon />
					</Navigation.Tile>
				</div>
			{/snippet}
			{#snippet footer()}
				<Navigation.Tile
					labelExpanded="Settings"
					selected={pathname === routes.settings}
					href={routes.settings}
					title="settings"
				>
					<SettingsIcon />
				</Navigation.Tile>
			{/snippet}
		</Navigation.Rail>
		<section class="section">
			<div class="container mx-auto">
				<AppBar classes="mb-8" background="bg-preset-filled-surface-100-900">
					{#snippet lead()}
						<h2 class="h2">Chain Scan Explorer</h2>
					{/snippet}
				</AppBar>
				<ToastProvider>
					{@render children()}
				</ToastProvider>
			</div>
		</section>
	</div>
</main>
