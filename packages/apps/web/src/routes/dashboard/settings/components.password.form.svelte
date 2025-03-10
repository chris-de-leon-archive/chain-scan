<script lang="ts">
	import { Modal, type ToastContext } from '@skeletonlabs/skeleton-svelte'
	import { PWORD_PLACEHOLDER } from '$lib/constants'
	import { superForm } from 'sveltekit-superforms'
	import type { PageProps } from './$types'
	import { EditIcon } from 'lucide-svelte'
	import { getContext } from 'svelte'

	const toast: ToastContext = getContext('toast')
	const pageProps: PageProps = $props()

	let isOpen = $state(false)
	const setIsOpen = (open: boolean) => (isOpen = open)

	const { form, errors, message, reset, enhance } = superForm(pageProps.data.form.password, {
		onResult: (event) => {
			if (event.result.type === 'success') {
				reset({
					newState: { currentPassword: '', newPassword: '' },
					data: { currentPassword: '', newPassword: '' },
					keepMessage: false,
				})
				setIsOpen(false)
				toast.create({
					description: 'Successfully updated password',
					title: 'Success',
					type: 'success',
				})
			}
		},
	})
</script>

<Modal
	open={isOpen}
	onOpenChange={(e) => setIsOpen(e.open)}
	triggerBase="label flex flex-col items-start justify-start w-full"
	contentBase="card bg-surface-100-900 p-8 space-y-4 shadow-xl w-1/4"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet trigger()}
		<span class="label-text">Password</span>
		<div class="input-group flex w-full flex-row">
			<div class="ig-cell preset-tonal">
				<EditIcon size={16} />
			</div>
			<div class="ig-cell p-2 opacity-50">
				<span>{PWORD_PLACEHOLDER}</span>
			</div>
		</div>
	{/snippet}
	{#snippet content()}
		<header>
			<span class="text-xl font-bold">Update Password</span>
			<p class="text-sm opacity-50">Update your account password.</p>
		</header>
		<form class="mx-auto w-full" method="POST" action="?/updatePassword" use:enhance>
			<div class="flex flex-col gap-y-6">
				<label class="label">
					<span class="label-text">New Password</span>
					<input
						class="ig-input w-full"
						name="newPassword"
						type="password"
						placeholder={PWORD_PLACEHOLDER}
						bind:value={$form.newPassword}
						required
					/>
					{#if $errors.newPassword != null}
						<span class="text-error-500">{$errors.newPassword}</span>
					{/if}
				</label>
				<label class="label">
					<span class="label-text">Current Password</span>
					<input
						class="ig-input w-full"
						name="currentPassword"
						type="password"
						placeholder={PWORD_PLACEHOLDER}
						bind:value={$form.currentPassword}
						required
					/>
					{#if $errors.currentPassword != null}
						<span class="text-error-500">{$errors.currentPassword}</span>
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
