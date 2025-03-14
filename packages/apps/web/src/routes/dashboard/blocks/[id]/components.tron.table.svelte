<script lang="ts">
	import Loading from '$lib/client/components/loading.svelte'
	import { Tabs } from '@skeletonlabs/skeleton-svelte'
	import type { api } from '$lib/server/api'

	const tabs = { transactions: 'Transactions' }
	let currTab = $state(tabs.transactions)

	const pageProps: {
		block: ReturnType<typeof api.chains.tron.blocks.get.handler> | Promise<undefined>
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
							<td class="text-right">{result.block.block_header.raw_data.number}</td>
						</tr>
						<tr>
							<td>Block Timestamp</td>
							<td class="text-right">{result.block.block_header.raw_data.timestamp}</td>
						</tr>
						<tr>
							<td>Block Hash</td>
							<td class="text-right">{result.block.blockID}</td>
						</tr>
						<tr>
							<td>Parent Hash</td>
							<td class="text-right">{result.block.block_header.raw_data.parentHash}</td>
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
							{#each result.transactions as tx (tx.txID)}
								<div class="card bg-surface-100-900 space-y-4 p-8">
									<article>
										<div class="card bg-surface-50-950 p-8">
											<div class="table-wrap">
												<table class="table">
													<tbody>
														<tr>
															<td>Transaction ID</td>
															<td class="text-right">{tx.txID}</td>
														</tr>
														<tr>
															<td>Transaction Timestamp</td>
															<td class="text-right">{tx.raw_data.timestamp}</td>
														</tr>
														<tr>
															<td>Transaction Fee Limit</td>
															<td class="text-right">
																{tx.raw_data.fee_limit}
															</td>
														</tr>
														<tr>
															<td>Expiration</td>
															<td class="text-right">{tx.raw_data.expiration}</td>
														</tr>
													</tbody>
												</table>
											</div>
										</div>
									</article>
									<footer>
										<div class="card bg-surface-50-950 max-h-80 overflow-auto p-8">
											<div class="flex flex-col">
												<pre>{JSON.stringify(tx.raw_data.contract, null, 2)}</pre>
											</div>
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
