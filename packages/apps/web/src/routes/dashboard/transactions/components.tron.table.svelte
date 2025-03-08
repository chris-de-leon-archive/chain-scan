<script lang="ts">
	import Loading from '$lib/client/components/loading.svelte'
	import type { api } from '$lib/server/api'
	const pageProps: {
		transactions: ReturnType<typeof api.chains.tron.transactions.list.handler>
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
				<th>Fee Limit</th>
				<th>Timestamp</th>
				<th>Expiration</th>
				<th class="!text-right">Block Hash</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row, i (i)}
				<tr>
					<td>0x{row.txID}</td>
					<td>{row.raw_data.fee_limit}</td>
					<td>{row.raw_data.timestamp}</td>
					<td>{row.raw_data.expiration}</td>
					<td class="text-right">0x{row.raw_data.ref_block_hash}</td>
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
