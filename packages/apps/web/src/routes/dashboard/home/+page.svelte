<script lang="ts">
	import DatasourceModal from './components.datasource.modal.svelte'
	import type { PageProps } from './$types'
	import { chains } from '$lib/chains'
	const pageProps: PageProps = $props()
</script>

<div class="flex flex-col items-center justify-center gap-y-12">
	<div class="flex w-full flex-col items-start justify-start gap-y-2 p-4">
		<p class="text-2xl">Welcome!</p>
		<p>
			With Chain Scan Explorer, you can view the on-chain data of any chain using a single unified
			interface. Simply connect to a live on-chain network or a locally running devnet container and
			in just a few clicks you'll have a near real-time view of all the block and transaction data
			for your preferred chain! To get started, select a chain from the list below and we will guide
			you through the rest:
		</p>
	</div>
	<div class="grid grid-cols-3 gap-12">
		{#each chains as chain (chain.name)}
			<div
				class="card preset-filled-surface-100-900 border-surface-200-800 divide-surface-200-800 block max-w-md overflow-hidden border-[1px] p-4"
			>
				<div class="flex flex-col gap-y-4">
					<header>
						<div class="flex flex-row items-center justify-between">
							<div class="flex flex-row items-center justify-start gap-x-4">
								<div class="relative aspect-square w-1/8 overflow-clip rounded-full">
									<img
										class="top-0 left-0 h-full w-full object-fill"
										src={chain.img}
										alt={`${chain.name}-logo`}
									/>
								</div>
								<span class="text-2xl font-bold">{chain.name}</span>
							</div>
							<DatasourceModal
								{...pageProps}
								datasources={chain.datasources}
								chain={chain.type}
								image={chain.img}
							/>
						</div>
					</header>
					<p>
						{chain.description}
					</p>
				</div>
			</div>
		{/each}
	</div>
</div>
