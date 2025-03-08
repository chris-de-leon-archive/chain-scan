<script lang="ts">
	import PasswordForm from './components.password.form.svelte'
	import { Avatar } from '@skeletonlabs/skeleton-svelte'
	import EmailForm from './components.email.form.svelte'
	import ImageForm from './components.image.form.svelte'
	import NameForm from './components.name.form.svelte'
	import { auth } from '$lib/client/providers/auth'
	import { AUTH_SIGN_IN_URL } from '$lib/constants'
	import type { PageProps } from './$types'
	import { goto } from '$app/navigation'

	const pageProps: PageProps = $props()

	async function signOut() {
		await auth.signOut({
			fetchOptions: {
				onSuccess() {
					goto(AUTH_SIGN_IN_URL)
				},
				onError() {
					throw new Error('failed to sign out')
				},
			},
		})
	}
</script>

<div class="card preset-filled-surface-100-900 flex flex-row p-8">
	<div class="w-1/4">
		<div class="flex h-full flex-col items-center justify-center gap-y-4">
			<Avatar
				background="preset-filled-primary-500"
				src={pageProps.data.auth.user.image ?? undefined}
				name={pageProps.data.auth.user.name}
			/>
			<button
				class="btn preset-filled-primary-500 hover:preset-filled-surface-50-950"
				onclick={signOut}>Sign Out</button
			>
		</div>
	</div>
	<div class="w-3/4">
		<div class="mx-auto w-full">
			<div class="grid grid-cols-2 gap-4">
				<NameForm {...pageProps} />
				<ImageForm {...pageProps} />
				<EmailForm {...pageProps} />
				<PasswordForm {...pageProps} />
			</div>
		</div>
	</div>
</div>
