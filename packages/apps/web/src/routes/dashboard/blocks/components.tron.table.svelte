<script lang="ts">
	import Loading from '$lib/client/components/loading.svelte'
	import type { api } from '$lib/server/api'
	const pageProps: {
		blocks: ReturnType<typeof api.chains.tron.blocks.list.handler>
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
				<th>Block Number</th>
				<th>Block Timestamp</th>
				<th>Version</th>
				<th class="!text-right">Transaction Count</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row, i (i)}
				<tr>
					<td>{row.blockID}</td>
					<td>{row.block_header.raw_data.number}</td>
					<td>{row.block_header.raw_data.timestamp}</td>
					<td>{row.block_header.raw_data.version}</td>
					<td class="text-right">{row.transactions?.length ?? 0}</td>
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
