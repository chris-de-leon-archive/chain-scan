<script lang="ts">
	import DeleteModal from './components.delete.modal.svelte'
	import { Popover } from '@skeletonlabs/skeleton-svelte'
	import EditModal from './components.edit.modal.svelte'
	import type { PageProps } from './$types'
	import { Ellipsis } from 'lucide-svelte'

	type ComponentProps = {
		row: PageProps['data']['datasources'][number]
	}

	const pageProps: PageProps & ComponentProps = $props()

	let isOpen = $state(false)
	const setIsOpen = (open: boolean) => (isOpen = open)
</script>

<Popover
	open={isOpen}
	onOpenChange={(e) => setIsOpen(e.open)}
	positioning={{ placement: 'bottom' }}
	contentBase="card bg-surface-200-800 p-4 space-y-4 max-w-[320px]"
	arrowBackground="!bg-surface-200 dark:!bg-surface-800"
	triggerBase="btn preset-tonal"
	arrow
>
	{#snippet trigger()}
		<Ellipsis />
	{/snippet}
	{#snippet content()}
		<div class="flex flex-col gap-y-4">
			<EditModal
				{...pageProps}
				onsuccess={() => setIsOpen(false)}
				onfailure={() => setIsOpen(false)}
				oncancel={() => setIsOpen(false)}
				row={pageProps.row}
			/>
			<DeleteModal
				{...pageProps}
				onsuccess={() => setIsOpen(false)}
				onfailure={() => setIsOpen(false)}
				oncancel={() => setIsOpen(false)}
				rowId={pageProps.row.id}
			/>
		</div>
	{/snippet}
</Popover>
