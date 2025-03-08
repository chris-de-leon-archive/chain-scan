<script lang="ts">
	import { AUTH_REDIRECT_URL, AUTH_SIGN_IN_URL } from '$lib/constants'
	import { auth } from '$lib/client/providers/auth'

	let error = $state<Error | undefined>(undefined)
	let info = $state({ password: '', email: '', name: '' })

	async function signUp() {
		await auth.signUp.email(
			{
				...info,
				callbackURL: AUTH_REDIRECT_URL,
			},
			{
				onError: (ctx) => {
					error = new Error(ctx.error.message)
				},
			},
		)
	}
</script>

<main>
	<div class="flex max-h-screen min-h-screen flex-col items-center justify-center">
		<div
			class="card preset-filled-surface-100-900 border-surface-200-800 divide-surface-200-800 block w-1/5 overflow-hidden border-[1px] p-10"
		>
			<header class="mb-4">
				<div class="flex flex-col items-center justify-center">
					<span class="text-2xl font-bold"> Welcome </span>
					<span class="text-center opacity-50">Sign up for a new account</span>
				</div>
			</header>
			<article>
				<form class="mx-auto w-full">
					<div class="flex flex-col gap-y-4">
						<label class="label">
							<span class="label-text">Name</span>
							<input class="input" type="text" bind:value={info.name} required />
						</label>
						<label class="label">
							<span class="label-text">Email</span>
							<input class="input" type="email" bind:value={info.email} required />
						</label>
						<label class="label">
							<span class="label-text">Password</span>
							<input class="input" type="password" bind:value={info.password} required />
						</label>
						{#if error != null}
							<span class="text-error-500 text-center">{error.message}</span>
						{/if}
						<button
							class="btn preset-filled-primary-500 hover:preset-filled-surface-50-950 w-full rounded-full"
							type="submit"
							onclick={signUp}
						>
							Sign Up
						</button>
						<div class="text-center text-sm">
							Already have an account?
							<a class="underline underline-offset-4" href={AUTH_SIGN_IN_URL}> Sign In </a>
						</div>
					</div>
				</form>
			</article>
		</div>
	</div>
</main>
