<script lang="ts">
	import { Modal, Switch, type ToastContext } from '@skeletonlabs/skeleton-svelte'
	import { superForm } from 'sveltekit-superforms'
	import type { PageProps } from './$types'
	import { EditIcon } from 'lucide-svelte'
	import { getContext } from 'svelte'
	import { ChainType } from '$lib/enums'

	type ComponentProps = {
		onsuccess: () => void
		onfailure: () => void
		oncancel: () => void
		row: PageProps['data']['datasources'][number]
	}

	const pageProps: PageProps & ComponentProps = $props()
	const toast: ToastContext = getContext('toast')

	let isOpen = $state(false)
	const setIsOpen = (open: boolean) => (isOpen = open)

	const { form, message, errors, reset, enhance } = superForm(pageProps.data.form.edit, {
		id: 'edit-'.concat(pageProps.row.id),
		onResult: (event) => {
			if (event.result.type === 'success') {
				reset({ keepMessage: false, data: $form, newState: $form })
				pageProps.onsuccess()
				setIsOpen(false)
				toast.create({
					description: 'Successfully updated datasource',
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

	reset({
		data: {
			isActive: pageProps.row.isActive,
			chain: pageProps.row.chain,
			name: pageProps.row.name,
			url: pageProps.row.url,
		},
	})
</script>

<Modal
	open={isOpen}
	onOpenChange={(e) => setIsOpen(e.open)}
	triggerBase="btn preset-filled-primary-500 hover:preset-filled-surface-50-950 w-full"
	contentBase="card bg-surface-100-900 p-8 space-y-4 shadow-xl w-1/4"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet trigger()}
		<div class="flex w-full flex-row gap-x-4">
			<div class="flex items-center justify-center">
				<EditIcon />
			</div>
			<span>Edit</span>
		</div>
	{/snippet}
	{#snippet content()}
		<header class="flex justify-between">
			<h2 class="h2">Edit Datasource</h2>
		</header>
		<article>
			<form class="mx-auto w-full" method="POST" action="?/edit" use:enhance>
				<div class="flex flex-col gap-y-6">
					<input type="hidden" name="id" value={pageProps.row.id} />
					<label class="label">
						<span class="label-text">Name</span>
						<input
							class="input"
							name="name"
							type="text"
							placeholder={pageProps.row.name}
							minlength={1}
							bind:value={$form.name}
						/>
						{#if $errors.name != null}
							<span class="text-error-500">{$errors.name}</span>
						{/if}
					</label>
					<label class="label">
						<span class="label-text">URL</span>
						<input
							class="input"
							name="url"
							type="url"
							placeholder={pageProps.row.url}
							minlength={1}
							bind:value={$form.url}
						/>
						{#if $errors.name != null}
							<span class="text-error-500">{$errors.name}</span>
						{/if}
					</label>
					<label class="label">
						<span class="label-text">Chain</span>
						<select class="select" name="chain" bind:value={$form.chain}>
							{#each Object.values(ChainType) as ct (ct)}
								<option value={ct}>
									{ct.toUpperCase()}
								</option>
							{/each}
						</select>
						{#if $errors.chain != null}
							<span class="text-error-500">{$errors.chain}</span>
						{/if}
					</label>
					<label class="label">
						<span class="label-text">Set as Default</span>
						<input class="input" name="isActive" type="hidden" value={$form.isActive} />
						<Switch
							checked={$form.isActive}
							onCheckedChange={(e) => ($form.isActive = e.checked)}
						/>
						{#if $errors.isActive != null}
							<span class="text-error-500">{$errors.isActive}</span>
						{/if}
					</label>
					{#if $message != null && $message.type === 'error'}
						<span class="text-error-500 text-center">{$message.text}</span>
					{/if}
					<div class="flex justify-end gap-4">
						<button type="button" class="btn preset-tonal" onclick={() => pageProps.oncancel()}>
							Cancel
						</button>
						<button
							type="submit"
							class="btn preset-filled-primary-500 hover:preset-filled-surface-50-950"
						>
							Confirm
						</button>
					</div>
				</div>
			</form>
		</article>
	{/snippet}
</Modal>
