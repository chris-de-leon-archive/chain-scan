<script lang="ts">
	import Loading from '$lib/client/components/loading.svelte'
	import type { api } from '$lib/server/api'
	const pageProps: {
		blocks: ReturnType<typeof api.chains.solana.blocks.list.handler>
	} = $props()
</script>

{#await pageProps.blocks}
	<Loading />
{:then rows}
	<table class="table caption-bottom">
		<caption class="pt-4">A list of blocks.</caption>
		<thead>
			<tr>
				<th>Block ID</th>
				<th>Block Hash</th>
				<th>Parent ID</th>
				<th>Parent Block Hash</th>
				<th class="!text-right">Transaction Count</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row, i (i)}
				<tr>
					<td>{row.slot}</td>
					<td>{row.blockhash}</td>
					<td>{row.parentSlot}</td>
					<td>{row.previousBlockhash}</td>
					<td class="text-right">{row.transactions.length}</td>
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
