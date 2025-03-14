<script lang="ts">
	import Loading from '$lib/client/components/loading.svelte'
	import type { api } from '$lib/server/api'
	const pageProps: {
		blocks: ReturnType<typeof api.chains.eth.blocks.list.handler>
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
				<th>Block Timestamp</th>
				<th>Gas Used</th>
				<th class="!text-right">Difficulty</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row, i (i)}
				<tr>
					<td>{row.number}</td>
					<td>{row.hash}</td>
					<td>{row.timestamp}</td>
					<td>{row.gasUsed}</td>
					<td class="text-right">{row.difficulty}</td>
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
