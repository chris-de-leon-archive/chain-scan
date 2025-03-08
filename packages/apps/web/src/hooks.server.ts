import { svelteKitHandler } from 'better-auth/svelte-kit'
import { auth } from '$lib/server/providers/auth'

export async function handle({ event, resolve }) {
	return svelteKitHandler({ event, resolve, auth })
}
