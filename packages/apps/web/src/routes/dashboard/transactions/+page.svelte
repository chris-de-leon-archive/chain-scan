<script lang="ts">
	import { Popover, Combobox } from '@skeletonlabs/skeleton-svelte'
	import { SlidersHorizontalIcon } from 'lucide-svelte'
	import type { PageProps } from './$types'
	import { ChainType } from '$lib/enums'
	import { page } from '$app/state'
	const pageProps: PageProps = $props()

	let selectedDatasource = $state(pageProps.data.datasource)
	let transactionID = $state('')
	let isOpen = $state(false)
</script>

<!-- TODO: make limit configurable and standardize its meaning -->
<!-- TODO: refresh rate should be updated using a button -->
<div class="flex flex-col gap-y-12">
	<div class="flex flex-row items-center">
		<form
			class="mx-auto w-full space-y-4"
			method="GET"
			action={page.url.pathname.concat(`/${transactionID}`)}
		>
			<div class="input-group grid-cols-[auto_1fr_auto]">
				<Popover
					open={isOpen}
					onOpenChange={(e) => (isOpen = e.open)}
					positioning={{ placement: 'bottom-end' }}
					triggerBase="ig-btn preset-tonal w-full h-full"
					contentBase="card bg-surface-200-800 p-4 space-y-4 max-w-[320px]"
					arrowBackground="!bg-surface-200 dark:!bg-surface-800"
					arrow
				>
					{#snippet trigger()}
						<SlidersHorizontalIcon size={16} />
					{/snippet}
					{#snippet content()}
						<form class="mx-auto w-full" method="GET" action={page.url.pathname}>
							<div class="flex flex-col gap-y-4">
								<Combobox
									data={pageProps.data.datasources.map((d) => ({ label: d.name, value: d.id }))}
									label="Datasource"
									placeholder={selectedDatasource?.name ?? ''}
									disabled={pageProps.data.datasources.length === 0}
									onValueChange={({ value: [id] }) => {
										selectedDatasource = pageProps.data.datasources.find((d) => d.id === id)
									}}
								/>
								<input type="hidden" name="datasourceId" value={selectedDatasource?.id} />
								<button
									class="btn preset-filled-primary-500 hover:preset-filled-surface-50-950 w-full transition ease-linear"
									type="submit"
								>
									Update
								</button>
							</div>
						</form>
					{/snippet}
				</Popover>
				<input class="ig-input" type="search" bind:value={transactionID} placeholder="Search..." />
				<input type="hidden" name="datasourceId" value={pageProps.data.datasource?.id} />
				<button
					class="ig-btn preset-filled-primary-500 hover:preset-filled-surface-50-950 transition ease-linear"
					type="submit"
				>
					Submit
				</button>
			</div>
		</form>
	</div>
	<div class="table-wrap">
		{#if pageProps.data.datasource != null}
			{#if pageProps.data.datasource.chain === ChainType.SOLANA}
				{#await import('./components.solana.table.svelte') then { default: SolanaTransactionsTable }}
					<SolanaTransactionsTable transactions={pageProps.data.solana} />
				{/await}
			{:else if pageProps.data.datasource.chain === ChainType.STARKNET}
				{#await import('./components.starknet.table.svelte') then { default: StarknetTransactionsTable }}
					<StarknetTransactionsTable transactions={pageProps.data.starknet} />
				{/await}
			{:else if pageProps.data.datasource.chain === ChainType.APTOS}
				{#await import('./components.aptos.table.svelte') then { default: AptosTransactionsTable }}
					<AptosTransactionsTable transactions={pageProps.data.aptos} />
				{/await}
			{:else if pageProps.data.datasource.chain === ChainType.TRON}
				{#await import('./components.tron.table.svelte') then { default: TronTransactionsTable }}
					<TronTransactionsTable transactions={pageProps.data.tron} />
				{/await}
			{:else if pageProps.data.datasource.chain === ChainType.FLOW}
				{#await import('./components.flow.table.svelte') then { default: FlowTransactionsTable }}
					<FlowTransactionsTable transactions={pageProps.data.flow} />
				{/await}
			{:else if pageProps.data.datasource.chain === ChainType.ETH}
				{#await import('./components.eth.table.svelte') then { default: EthTransactionsTable }}
					<EthTransactionsTable transactions={pageProps.data.eth} />
				{/await}
			{:else}
				<div>Unsupported chain: {pageProps.data.datasource.chain}</div>
			{/if}
		{:else}
			<div>No data</div>
		{/if}
	</div>
</div>
