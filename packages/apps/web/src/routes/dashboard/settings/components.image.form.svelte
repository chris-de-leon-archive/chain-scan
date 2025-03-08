<script lang="ts">
	import { Modal, type ToastContext } from '@skeletonlabs/skeleton-svelte'
	import { superForm } from 'sveltekit-superforms'
	import type { PageProps } from './$types'
	import { EditIcon } from 'lucide-svelte'
	import { getContext } from 'svelte'

	const toast: ToastContext = getContext('toast')
	const pageProps: PageProps = $props()

	let isOpen = $state(false)

	const { form, errors, message, reset, enhance } = superForm(pageProps.data.form.image, {
		onResult: (event) => {
			if (event.result.type === 'success') {
				reset({ keepMessage: false, newState: $form, data: $form })
				toast.create({
					description: 'Successfully updated image',
					title: 'Success',
					type: 'success',
				})
				isOpen = false
			}
		},
	})
</script>

<Modal
	open={isOpen}
	onOpenChange={(e) => (isOpen = e.open)}
	triggerBase="label flex flex-col items-start justify-start w-full"
	contentBase="card bg-surface-100-900 p-8 space-y-4 shadow-xl w-1/4"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet trigger()}
		<span class="label-text">Image</span>
		<div class="input-group flex w-full flex-row">
			<div class="ig-cell preset-tonal">
				<EditIcon size={16} />
			</div>
			<div class="ig-cell p-2 opacity-50">
				<span>{pageProps.data.auth.user.image ?? 'http://'}</span>
			</div>
		</div>
	{/snippet}
	{#snippet content()}
		<header>
			<span class="text-xl font-bold">Update Image</span>
			<p class="text-sm opacity-50">Update your account photo.</p>
		</header>
		<form class="mx-auto w-full" method="POST" action="?/updateInfo" use:enhance>
			<div class="flex flex-col gap-y-4">
				<label class="label">
					<span class="label-text">New Image</span>
					<input
						class="ig-input w-full"
						name="image"
						type="url"
						placeholder={pageProps.data.auth.user.image}
						bind:value={$form.image}
						required
					/>
					{#if $errors.image != null}
						<span class="text-error-500">{$errors.image}</span>
					{/if}
				</label>
				{#if $message != null && $message.type === 'error'}
					<span class="text-error-500 text-center">{$message.text}</span>
				{/if}
				<button
					class="btn preset-filled-primary-500 hover:preset-filled-surface-50-950"
					type="submit"
				>
					Update
				</button>
			</div>
		</form>
	{/snippet}
</Modal>
