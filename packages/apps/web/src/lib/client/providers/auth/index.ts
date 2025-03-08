import { createAuthClient } from 'better-auth/svelte'
import { env } from '$env/dynamic/public'

export const auth = createAuthClient({
	baseURL: env.PUBLIC_BETTER_AUTH_URL,
})
