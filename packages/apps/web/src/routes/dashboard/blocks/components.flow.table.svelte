<script lang="ts">
	import Loading from '$lib/client/components/loading.svelte'
	import type { api } from '$lib/server/api'
	const pageProps: {
		blocks: ReturnType<typeof api.chains.flow.blocks.list.handler>
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
				<th>Timestamp</th>
				<th class="!text-right">Parent Hash</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row, i (i)}
				<tr>
					<td>{row.height}</td>
					<td>{row.id}</td>
					<td>{row.timestamp}</td>
					<td class="text-right">{row.parentId}</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<td colspan="3">Total</td>
				<td class="text-right">{rows.length ?? 0} Items</td>
			</tr>
		</tfoot>
	</table>
{/await}
