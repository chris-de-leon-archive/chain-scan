<script lang="ts">
	import { Modal, type ToastContext } from '@skeletonlabs/skeleton-svelte'
	import { superForm } from 'sveltekit-superforms'
	import { TrashIcon } from 'lucide-svelte'
	import type { PageProps } from './$types'
	import { getContext } from 'svelte'

	type ComponentProps = {
		onsuccess: () => void
		onfailure: () => void
		oncancel: () => void
		rowId: string
	}

	const pageProps: PageProps & ComponentProps = $props()
	const toast: ToastContext = getContext('toast')

	let isOpen = $state(false)
	const setIsOpen = (open: boolean) => (isOpen = open)

	const { message, reset, enhance } = superForm(pageProps.data.form.remove, {
		id: 'delete-'.concat(pageProps.rowId),
		onResult: async (event) => {
			if (event.result.type === 'success') {
				reset({ keepMessage: false })
				pageProps.onsuccess()
				setIsOpen(false)
				toast.create({
					description: 'Successfully removed datasource',
					title: 'Success',
					type: 'success',
				})
			}
			if (event.result.type === 'failure') {
				pageProps.onfailure()
				setIsOpen(false)
				toast.create({
					description: $message?.text ?? 'An unknown error occurred',
					title: 'Error',
					type: 'error',
				})
			}
		},
	})
</script>

<Modal
	open={isOpen}
	onOpenChange={(e) => setIsOpen(e.open)}
	triggerBase="btn preset-tonal-error hover:preset-filled-surface-50-950 w-full"
	contentBase="card bg-surface-100-900 p-8 space-y-4 shadow-xl w-1/4"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet trigger()}
		<div class="flex w-full flex-row gap-x-4">
			<div class="flex items-center justify-center">
				<TrashIcon />
			</div>
			<span>Delete</span>
		</div>
	{/snippet}
	{#snippet content()}
		<header class="flex justify-between">
			<h2 class="h2">Are you sure?</h2>
		</header>
		<article>
			<form class="mx-auto w-full" method="POST" action="?/remove" use:enhance>
				<div class="flex flex-col gap-y-6">
					<input type="hidden" name="id" value={pageProps.rowId} />
					<p class="opacity-60">
						The selected item will be permanently removed. This action cannot be undone.
					</p>
					{#if $message != null && $message.type === 'error'}
						<span class="text-error-500 text-center">{$message.text}</span>
					{/if}
					<div class="flex justify-end gap-4">
						<button type="button" class="btn preset-tonal" onclick={() => pageProps.oncancel()}>
							Cancel
						</button>
						<button type="submit" class="btn preset-tonal-error">Confirm</button>
					</div>
				</div>
			</form>
		</article>
	{/snippet}
</Modal>
