<script lang="ts">
	import Loading from '$lib/client/components/loading.svelte'
	import { Tabs } from '@skeletonlabs/skeleton-svelte'
	import type { api } from '$lib/server/api'

	const tabs = { transactions: 'Transactions' }
	let currTab = $state(tabs.transactions)

	const pageProps: {
		block: ReturnType<typeof api.chains.aptos.blocks.get.handler> | Promise<undefined>
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
							<td class="text-right">{result.block.block_height}</td>
						</tr>
						<tr>
							<td>Block Timestamp</td>
							<td class="text-right">{result.block.block_timestamp}</td>
						</tr>
						<tr>
							<td>Block Hash</td>
							<td class="text-right">{result.block.block_hash}</td>
						</tr>
						<tr>
							<td>First Version</td>
							<td class="text-right">{result.block.first_version}</td>
						</tr>
						<tr>
							<td>Last Version</td>
							<td class="text-right">{result.block.last_version}</td>
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
							{#each result.block.transactions ?? [] as tx (tx.hash)}
								{#if tx.type === 'user_transaction' || tx.type === 'block_epilogue_transaction' || tx.type === 'state_checkpoint_transaction' || tx.type === 'validator_transaction' || tx.type === 'block_metadata_transaction'}
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
																<td>Transaction Version</td>
																<td class="text-right">{tx.version}</td>
															</tr>
															<tr>
																<td>Transaction Timestamp</td>
																<td class="text-right">{tx.timestamp}</td>
															</tr>
															<tr>
																<td>Transaction Type</td>
																<td class="text-right">{tx.type}</td>
															</tr>
															<tr>
																<td>Gas Used</td>
																<td class="text-right">{tx.gas_used}</td>
															</tr>
															<tr>
																<td>Status</td>
																<td class="text-right">{tx.success ? 'SUCCESS' : 'FAILED'}</td>
															</tr>
														</tbody>
													</table>
												</div>
											</div>
										</article>

										<footer>
											<div class="card bg-surface-50-950 max-h-80 overflow-auto p-8">
												<code>{tx.vm_status}</code>
											</div>
										</footer>
									</div>
								{/if}
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
