<script lang="ts">
	import Loading from '$lib/client/components/loading.svelte'
	import type { api } from '$lib/server/api'
	const pageProps: {
		transactions: ReturnType<typeof api.chains.aptos.transactions.list.handler>
	} = $props()
</script>

{#await pageProps.transactions}
	<Loading />
{:then rows}
	<table class="table caption-bottom">
		<caption class="pt-4">A list of transactions.</caption>
		<thead>
			<tr>
				<th>Transaction Hash</th>
				<th>Transaction Type</th>
				<th>Gas Used</th>
				<th>Timestamp</th>
				<th class="!text-right">Status</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row, i (i)}
				{#if row.type === 'user_transaction' || row.type === 'block_epilogue_transaction' || row.type === 'state_checkpoint_transaction' || row.type === 'validator_transaction' || row.type === 'block_metadata_transaction'}
					<tr>
						<td>{row.hash}</td>
						<td>{row.type}</td>
						<td>{row.gas_used}</td>
						<td>{row.timestamp}</td>
						<td class="text-right">{row.success ? 'success' : 'fail'}</td>
					</tr>
				{/if}
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<td colspan="4">Total</td>
				<td class="text-right">{rows.length ?? 0} Items</td>
			</tr>
		</tfoot>
	</table>
{/await}
