<script lang="ts">
	import Loading from '$lib/client/components/loading.svelte'
	import { Tabs } from '@skeletonlabs/skeleton-svelte'
	import type { api } from '$lib/server/api'

	const tabs = { transactions: 'Transactions', rewards: 'Rewards' }
	let currTab = $state(tabs.transactions)

	const pageProps: {
		block: ReturnType<typeof api.chains.solana.blocks.get.handler> | Promise<undefined>
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
							<td class="text-right">{result.block.slot}</td>
						</tr>
						<tr>
							<td>Block Timestamp</td>
							<td class="text-right">{result.block.blockTime}</td>
						</tr>
						<tr>
							<td>Block Hash</td>
							<td class="text-right">{result.block.blockhash}</td>
						</tr>
						<tr>
							<td>Parent ID</td>
							<td class="text-right">{result.block.parentSlot}</td>
						</tr>
						<tr>
							<td>Parent Hash</td>
							<td class="text-right">{result.block.previousBlockhash}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<Tabs value={currTab} onValueChange={(e) => (currTab = e.value)} fluid>
				{#snippet list()}
					<Tabs.Control value={tabs.transactions}>{tabs.transactions}</Tabs.Control>
					<Tabs.Control value={tabs.rewards}>{tabs.rewards}</Tabs.Control>
				{/snippet}
				{#snippet content()}
					<Tabs.Panel value={tabs.transactions}>
						<div class="flex flex-col gap-y-6">
							{#each result.block.transactions as tx (tx.transaction.signatures)}
								<div class="card bg-surface-100-900 space-y-4 p-8">
									<article>
										<div class="card bg-surface-50-950 p-8">
											<div class="table-wrap">
												<table class="table">
													<tbody>
														<tr>
															<td>Transaction ID</td>
															<td class="text-right">{tx.transaction.signatures.at(0)}</td>
														</tr>
														<tr>
															<td>Transaction Version</td>
															<td class="text-right">{tx.version}</td>
														</tr>
														<tr>
															<td>Compute Units Consumed</td>
															<td class="text-right">{tx.meta?.computeUnitsConsumed}</td>
														</tr>
														<tr>
															<td>Fee</td>
															<td class="text-right">{tx.meta?.fee}</td>
														</tr>
														<tr>
															<td>Status</td>
															<td class="text-right">
																{tx.meta?.err == null ? 'SUCCESS' : 'FAILED'}
															</td>
														</tr>
													</tbody>
												</table>
											</div>
										</div>
									</article>
									<footer>
										<div class="card bg-surface-50-950 max-h-80 overflow-auto p-8">
											<div class="flex flex-col">
												{#each tx.meta?.logMessages ?? [] as log, i (i)}
													<code>{log}</code>
												{/each}
											</div>
										</div>
									</footer>
								</div>
							{/each}
						</div>
					</Tabs.Panel>
					<Tabs.Panel value={tabs.rewards}>
						<div class="flex flex-col gap-y-6">
							{#each result.block.rewards ?? [] as reward (reward)}
								<div class="card bg-surface-100-900 space-y-4 p-8">
									<article>
										<div class="card bg-surface-50-950 p-8">
											<div class="table-wrap">
												<table class="table">
													<tbody>
														<tr>
															<td>Address</td>
															<td class="text-right">{reward.pubkey}</td>
														</tr>
														<tr>
															<td>Type</td>
															<td class="text-right">{reward.rewardType}</td>
														</tr>
														<tr>
															<td>Lamports</td>
															<td class="text-right">{reward.lamports}</td>
														</tr>
														<tr>
															<td>Post Balance</td>
															<td class="text-right">{reward.postBalance}</td>
														</tr>
														<tr>
															<td>Commission</td>
															<td class="text-right">{reward.commission ?? 'N/A'}</td>
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
