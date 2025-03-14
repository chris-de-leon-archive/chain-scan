<script lang="ts">
	import Loading from '$lib/client/components/loading.svelte'
	import { Tabs } from '@skeletonlabs/skeleton-svelte'
	import type { api } from '$lib/server/api'

	const tabs = { transactions: 'Transactions' }
	let currTab = $state(tabs.transactions)

	const pageProps: {
		block: ReturnType<typeof api.chains.eth.blocks.get.handler> | Promise<undefined>
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
							<td class="text-right">{result.block.number}</td>
						</tr>
						<tr>
							<td>Block Timestamp</td>
							<td class="text-right">{result.block.timestamp}</td>
						</tr>
						<tr>
							<td>Block Hash</td>
							<td class="text-right">{result.block.hash}</td>
						</tr>
						<tr>
							<td>Parent Hash</td>
							<td class="text-right">{result.block.parentHash}</td>
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
							{#each result.transactions as tx (tx.hash)}
								<div class="card bg-surface-100-900 space-y-4 p-8">
									<article>
										<div class="card bg-surface-50-950 p-8">
											<div class="table-wrap">
												<table class="table">
													<tbody>
														<tr>
															<td>Transaction ID</td>
															<td class="text-right">{tx.hash}</td>
														</tr>
														<tr>
															<td>Transaction Index</td>
															<td class="text-right">{tx.index}</td>
														</tr>
														<tr>
															<td>Transaction Gas Price</td>
															<td class="text-right">{tx.gasPrice}</td>
														</tr>
														<tr>
															<td>Transaction Gas Limit</td>
															<td class="text-right">
																{tx.gasLimit}
															</td>
														</tr>
														<tr>
															<td>Transaction Sender</td>
															<td class="text-right">
																{tx.from}
															</td>
														</tr>
														<tr>
															<td>Transaction Receiver</td>
															<td class="text-right">{tx.to}</td>
														</tr>
													</tbody>
												</table>
											</div>
										</div>
									</article>
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
