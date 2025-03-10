<script lang="ts">
	import DatasourceForm from './components.datasource.form.svelte'
	import { Modal, Tabs } from '@skeletonlabs/skeleton-svelte'
	import { MoveUpRightIcon } from 'lucide-svelte'
	import type { PageProps } from './$types'
	import { ChainType } from '$lib/enums'

	const tabs = { preset: 'Preset', custom: 'Custom' }
	const pageProps: PageProps & {
		datasources: { name: string; url: string }[]
		chain: ChainType
		image: string
	} = $props()

	let currTab = $state(tabs.preset)
	let isOpen = $state(false)
	const setIsOpen = (open: boolean) => (isOpen = open)
</script>

<Modal
	open={isOpen}
	onOpenChange={(e) => setIsOpen(e.open)}
	triggerBase="btn preset-filled-primary-500 hover:preset-filled-surface-50-950 rounded-full"
	contentBase="card bg-surface-100-900 p-8 space-y-4 shadow-xl w-1/4"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet trigger()}
		<MoveUpRightIcon />
	{/snippet}
	{#snippet content()}
		<header class="flex justify-between">
			<h2 class="h2">Create a Datasource</h2>
		</header>
		<article>
			<Tabs value={currTab} onValueChange={(e) => (currTab = e.value)} fluid>
				{#snippet list()}
					<Tabs.Control value={tabs.preset}>{tabs.preset}</Tabs.Control>
					<Tabs.Control value={tabs.custom}>{tabs.custom}</Tabs.Control>
				{/snippet}
				{#snippet content()}
					<Tabs.Panel value={tabs.preset}>
						<DatasourceForm
							{...pageProps}
							key={pageProps.chain.concat(tabs.preset)}
							datasources={pageProps.datasources}
							onsuccess={() => setIsOpen(false)}
							onfailure={() => setIsOpen(false)}
							chain={pageProps.chain}
						/>
					</Tabs.Panel>
					<Tabs.Panel value={tabs.custom}>
						<DatasourceForm
							{...pageProps}
							key={pageProps.chain.concat(tabs.custom)}
							datasources={undefined}
							onsuccess={() => setIsOpen(false)}
							onfailure={() => setIsOpen(false)}
							chain={pageProps.chain}
						/>
					</Tabs.Panel>
				{/snippet}
			</Tabs>
		</article>
	{/snippet}
</Modal>
