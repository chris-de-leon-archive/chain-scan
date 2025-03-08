<script lang="ts">
	import Loading from '$lib/client/components/loading.svelte'
	import type { api } from '$lib/server/api'
	const pageProps: {
		transactions: ReturnType<typeof api.chains.starknet.transactions.list.handler>
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
				<th>Transaction Fee</th>
				<th>Execution Status</th>
				<th class="!text-right">Finality Status</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row, i (i)}
				<tr>
					<td>{row.transaction_hash}</td>
					<td>{row.type}</td>
					<td>{parseInt(row.actual_fee.amount, 16)} {row.actual_fee.unit}</td>
					<td>{row.execution_status}</td>
					<td class="text-right">{row.finality_status}</td>
				</tr>
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
