<script lang="ts">
	import { AUTH_REDIRECT_URL, AUTH_SIGN_UP_URL } from '$lib/constants'
	import { auth } from '$lib/client/providers/auth'

	let error = $state<Error | undefined>(undefined)
	let info = $state({ password: '', email: '' })

	async function signIn() {
		await auth.signIn.email(
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
					<span class="text-center opacity-50">Log into your account</span>
				</div>
			</header>
			<article>
				<form class="mx-auto w-full">
					<div class="flex flex-col gap-y-4">
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
							onclick={signIn}
						>
							Log In
						</button>
						<div class="text-center text-sm">
							Don't have an account?
							<a class="underline underline-offset-4" href={AUTH_SIGN_UP_URL}> Sign up </a>
						</div>
					</div>
				</form>
			</article>
		</div>
	</div>
</main>
