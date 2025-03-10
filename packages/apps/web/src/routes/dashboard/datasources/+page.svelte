<script lang="ts">
	import Popover from './components.popover.svelte'
	import type { PageProps } from './$types'

	const pageProps: PageProps = $props()
</script>

<div class="flex flex-col gap-y-12">
	<div class="table-wrap">
		<table class="table">
			<thead>
				<tr>
					<th>Settings</th>
					<th>Creation Date</th>
					<th>Name</th>
					<th>Chain Family</th>
					<th>Url</th>
					<th class="!text-right">Is Default</th>
				</tr>
			</thead>
			<tbody>
				{#each pageProps.data.datasources as ds (ds.id)}
					<tr>
						<td><Popover {...pageProps} row={ds} /></td>
						<td>{ds.createdAt.toLocaleString()}</td>
						<td>{ds.name}</td>
						<td>{ds.chain.toUpperCase()}</td>
						<td>{ds.url}</td>
						<td class="text-right">{ds.isActive}</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<td colspan="5">Total</td>
					<td class="text-right">{pageProps.data.datasources.length ?? 0} Items</td>
				</tr>
			</tfoot>
		</table>
	</div>
</div>
