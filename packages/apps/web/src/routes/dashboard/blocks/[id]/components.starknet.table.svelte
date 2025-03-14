<script lang="ts">
	import Loading from '$lib/client/components/loading.svelte'
	import { Tabs } from '@skeletonlabs/skeleton-svelte'
	import { Currency } from '$lib/client/currency'
	import type { api } from '$lib/server/api'
	import { Fmt } from '$lib/client/fmt'

	const tabs = { transactions: 'Transactions' }
	let currTab = $state(tabs.transactions)

	const pageProps: {
		block: ReturnType<typeof api.chains.starknet.blocks.get.handler> | Promise<undefined>
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
							<td class="text-right">{result.block.block_number}</td>
						</tr>
						<tr>
							<td>Block Timestamp</td>
							<td class="text-right">{result.block.timestamp}</td>
						</tr>
						<tr>
							<td>Block Hash</td>
							<td class="text-right">{result.block.block_hash}</td>
						</tr>
						<tr>
							<td>L1 Gas Price</td>
							<td class="text-right">
								{Fmt.prettyPrintNumber(
									Currency.convertFriToStark(result.block.l1_gas_price.price_in_fri),
								)} STARK
							</td>
						</tr>
						<tr>
							<td>Parent Hash</td>
							<td class="text-right">{result.block.parent_hash}</td>
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
							{#each result.transactions as tx (tx.transaction_hash)}
								<div class="card bg-surface-100-900 space-y-4 p-8">
									<article>
										<div class="card bg-surface-50-950 p-8">
											<div class="table-wrap">
												<table class="table">
													<tbody>
														<tr>
															<td>Transaction ID</td>
															<td class="text-right">{tx.transaction_hash}</td>
														</tr>
														<tr>
															<td>Transaction Type</td>
															<td class="text-right">{tx.type}</td>
														</tr>
														<tr>
															<td>Transaction Fee</td>
															<td class="text-right">
																{Fmt.prettyPrintNumber(
																	tx.actual_fee.unit === 'WEI'
																		? Currency.convertWeiToEthers(tx.actual_fee.amount)
																		: Currency.convertFriToStark(tx.actual_fee.amount),
																)}
																{tx.actual_fee.unit === 'WEI' ? 'ETH' : 'STARK'}
															</td>
														</tr>
														<tr>
															<td>Finality Status</td>
															<td class="text-right">{tx.finality_status}</td>
														</tr>
														<tr>
															<td>Execution Status</td>
															<td class="text-right">{tx.execution_status}</td>
														</tr>
														<tr>
															<td>Event Count</td>
															<td class="text-right">{tx.events.length}</td>
														</tr>
													</tbody>
												</table>
											</div>
										</div>
									</article>
									<footer>
										<div class="card bg-surface-50-950 max-h-80 overflow-auto p-8">
											<div class="flex flex-col">
												<pre>{JSON.stringify(tx.events, null, 2)}</pre>
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
