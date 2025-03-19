<script lang="ts">
	import Loading from '$lib/client/components/loading.svelte'
	import { Tabs } from '@skeletonlabs/skeleton-svelte'
	import type { api } from '$lib/server/api'

	const tabs = { transactions: 'Transactions' }
	let currTab = $state(tabs.transactions)

	const pageProps: {
		block: ReturnType<typeof api.chains.flow.blocks.get.handler> | Promise<undefined>
	} = $props()
</script>

{#await pageProps.block}
	<Loading />
{:then result}
	{#if result != null}
		<div class="flex flex-col gap-y-6">
			<div class="table-wrap">
				<table class="table">
					<tbody>
						<tr>
							<td>Block ID</td>
							<td class="text-right">{result.block.height}</td>
						</tr>
						<tr>
							<td>Block Timestamp</td>
							<td class="text-right">{result.block.timestamp?.toLocaleString()}</td>
						</tr>
						<tr>
							<td>Block Hash</td>
							<td class="text-right">{result.block.id}</td>
						</tr>
						<tr>
							<td>Parent Hash</td>
							<td class="text-right">{result.block.parentId}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<Tabs value={currTab} onValueChange={(e) => (currTab = e.value)} fluid>
				{#snippet list()}
					<Tabs.Control value={tabs.transactions}>{tabs.transactions}</Tabs.Control>
				{/snippet}
				{#snippet content()}
					<Tabs.Panel value={tabs.transactions}>
						<div class="flex flex-col gap-y-6">
							{#each result.transactions as tx (tx.transactionId)}
								<div class="card bg-surface-100-900 space-y-4 p-8">
									<article>
										<div class="card bg-surface-50-950 p-8">
											<div class="table-wrap">
												<table class="table">
													<tbody>
														<tr>
															<td>Transaction ID</td>
															<td class="text-right">{tx.transactionId}</td>
														</tr>
														<tr>
															<td>Collection ID</td>
															<td class="text-right">{tx.collectionId}</td>
														</tr>
														<tr>
															<td>Computation Usage</td>
															<td class="text-right">
																{tx.computationUsage}
															</td>
														</tr>
														<tr>
															<td>Status</td>
															<td class="text-right">
																{tx.status}
															</td>
														</tr>
													</tbody>
												</table>
											</div>
										</div>
									</article>
									<footer>
										<div class="card bg-surface-50-950 max-h-80 overflow-auto p-8">
											<pre>{JSON.stringify(tx.events, null, 2)}</pre>
										</div>
									</footer>
								</div>
							{/each}
						</div>
					</Tabs.Panel>
				{/snippet}
			</Tabs>
		</div>
	{:else}
		<p>No data</p>
	{/if}
{/await}
