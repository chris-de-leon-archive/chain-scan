<script lang="ts">
	import Loading from '$lib/client/components/loading.svelte'
	import type { api } from '$lib/server/api'
	const pageProps: {
		transactions: ReturnType<typeof api.chains.eth.transactions.list.handler>
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
				<th>Block Number</th>
				<th>Block Hash</th>
				<th>Gas Limit</th>
				<th class="!text-right">Sender</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row, i (i)}
				<tr>
					<td>{row.hash}</td>
					<td>{row.blockNumber}</td>
					<td>{row.blockHash}</td>
					<td>{row.gasLimit}</td>
					<td class="text-right">{row.from}</td>
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
