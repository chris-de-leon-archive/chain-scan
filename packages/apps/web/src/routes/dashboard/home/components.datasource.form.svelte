<script lang="ts">
	import type { ToastContext } from '@skeletonlabs/skeleton-svelte'
	import { superForm } from 'sveltekit-superforms'
	import { URL_PLACEHOLDER } from '$lib/constants'
	import type { ChainType } from '$lib/enums'
	import type { PageProps } from './$types'
	import { getContext } from 'svelte'

	type ComponentProps = {
		datasources?: { name: string; url: string }[]
		onsuccess: () => void
		onfailure: () => void
		chain: ChainType
		key: string
	}

	const pageProps: PageProps & ComponentProps = $props()
	const toast: ToastContext = getContext('toast')

	const { form, errors, message, reset, enhance } = superForm(pageProps.data.form.datasource, {
		id: pageProps.key,
		onResult: (event) => {
			if (event.result.type === 'success') {
				reset({ keepMessage: false, newState: $form, data: $form })
				pageProps.onsuccess()
				toast.create({
					description: 'Successfully created datasource',
					title: 'Success',
					type: 'success',
				})
			}
			if (event.result.type === 'failure') {
				pageProps.onfailure()
				toast.create({
					description: $message?.text ?? 'An unknown error occurred',
					title: 'Error',
					type: 'error',
				})
			}
		},
	})
</script>

<form class="mx-auto w-full" method="POST" action="?/createDatasource" use:enhance>
	<div class="flex flex-col gap-y-6">
		<label class="label">
			<span class="label-text">Name</span>
			<input
				class="input"
				name="name"
				type="text"
				placeholder="Name"
				minlength={1}
				bind:value={$form.name}
				required
			/>
			{#if $errors.name != null}
				<span class="text-error-500">{$errors.name}</span>
			{/if}
		</label>
		<label class="label">
			{#if pageProps.datasources != null}
				<span class="label-text">Network</span>
				<select class="select" name="url" bind:value={$form.url} required>
					{#each pageProps.datasources as datasource (datasource.name)}
						<option value={datasource.url}>
							{datasource.name}
						</option>
					{/each}
				</select>
			{:else}
				<span class="label-text">Url</span>
				<input
					class="input"
					name="url"
					type="url"
					placeholder={URL_PLACEHOLDER}
					minlength={1}
					bind:value={$form.url}
					required
				/>
			{/if}
			{#if $errors.url != null}
				<span class="text-error-500">{$errors.url}</span>
			{/if}
		</label>
		{#if $message != null && $message.type === 'error'}
			<span class="text-error-500 text-center">{$message.text}</span>
		{/if}
		<input class="input" name="chain" type="hidden" value={pageProps.chain} required />
		<input class="input" name="isActive" type="hidden" value={true} required />
		<button class="btn preset-filled-primary-500 hover:preset-filled-surface-50-950" type="submit">
			Submit
		</button>
	</div>
</form>
