<script lang="ts">
	import type { PageProps } from './$types'
	import { ChainType } from '$lib/enums'
	const pageProps: PageProps = $props()
</script>

{#await pageProps.data.datasource then datasource}
	{#if datasource != null}
		{#if datasource.chain === ChainType.SOLANA}
			{#await import('./components.solana.table.svelte') then { default: SolanaTransactionsTable }}
				<SolanaTransactionsTable block={pageProps.data.solana} />
			{/await}
		{:else if datasource.chain === ChainType.STARKNET}
			{#await import('./components.starknet.table.svelte') then { default: StarknetTransactionsTable }}
				<StarknetTransactionsTable block={pageProps.data.starknet} />
			{/await}
		{:else if datasource.chain === ChainType.APTOS}
			{#await import('./components.aptos.table.svelte') then { default: AptosTransactionsTable }}
				<AptosTransactionsTable block={pageProps.data.aptos} />
			{/await}
		{:else if datasource.chain === ChainType.TRON}
			{#await import('./components.tron.table.svelte') then { default: TronTransactionsTable }}
				<TronTransactionsTable block={pageProps.data.tron} />
			{/await}
		{:else if datasource.chain === ChainType.FLOW}
			{#await import('./components.flow.table.svelte') then { default: FlowTransactionsTable }}
				<FlowTransactionsTable block={pageProps.data.flow} />
			{/await}
		{:else if datasource.chain === ChainType.ETH}
			{#await import('./components.eth.table.svelte') then { default: EthTransactionsTable }}
				<EthTransactionsTable block={pageProps.data.eth} />
			{/await}
		{:else}
			<div>Unsupported chain: {datasource.chain}</div>
		{/if}
	{:else}
		<div>No data</div>
	{/if}
{/await}
