<script lang="ts">
	import Loading from '$lib/client/components/loading.svelte'
	import type { api } from '$lib/server/api'
	const pageProps: {
		transactions: ReturnType<typeof api.chains.solana.transactions.list.handler>
	} = $props()
</script>

{#await pageProps.transactions}
	<Loading />
{:then rows}
	<table class="table caption-bottom">
		<caption class="pt-4">A list of transactions.</caption>
		<thead>
			<tr>
				<th>Transaction Signature</th>
				<th>Transaction Version</th>
				<th>Transaction Fee</th>
				<th>Slot Number</th>
				<th class="!text-right">Block Time</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row, i (i)}
				<tr>
					<td>{row.transaction.signatures.at(0) ?? 'unknown'}</td>
					<td>{row.version ?? 'unknown'}</td>
					<td>{row.meta?.fee ?? 'unknown'}</td>
					<td>{row.slot}</td>
					<td class="text-right">{row.blockTime ?? 'unknown'}</td>
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
