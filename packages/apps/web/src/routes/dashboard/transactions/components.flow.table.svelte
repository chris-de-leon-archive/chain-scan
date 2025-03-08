<script lang="ts">
	import Loading from '$lib/client/components/loading.svelte'
	import type { api } from '$lib/server/api'
	const pageProps: {
		transactions: ReturnType<typeof api.chains.flow.transactions.list.handler>
	} = $props()
</script>

{#await pageProps.transactions}
	<Loading />
{:then rows}
	<table class="table caption-bottom">
		<caption class="pt-4">A list of transactions.</caption>
		<thead>
			<tr>
				<th>Transaction ID</th>
				<th>Block Height</th>
				<th>Block ID</th>
				<th>Computation Usage</th>
				<th class="!text-right">Status</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row, i (i)}
				<tr>
					<td>{row.transactionId}</td>
					<td>{row.blockHeight}</td>
					<td>{row.blockId}</td>
					<td>{row.computationUsage}</td>
					<td class="text-right">{row.status}</td>
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
