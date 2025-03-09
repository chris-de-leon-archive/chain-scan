<script lang="ts">
	import Loading from '$lib/client/components/loading.svelte'
	import type { api } from '$lib/server/api'
	const pageProps: {
		blocks: ReturnType<typeof api.chains.aptos.blocks.list.handler>
	} = $props()
</script>

{#await pageProps.blocks}
	<Loading />
{:then rows}
	<table class="table caption-bottom">
		<caption class="pt-4">A list of blocks.</caption>
		<thead>
			<tr>
				<th>Block Hash</th>
				<th>Block Height</th>
				<th>Block Timestamp</th>
				<th>Last Version</th>
				<th class="!text-right">First Version</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row, i (i)}
				<tr>
					<td>{row.block_hash}</td>
					<td>{row.block_height}</td>
					<td>{row.block_timestamp}</td>
					<td>{row.last_version}</td>
					<td class="text-right">{row.first_version}</td>
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
