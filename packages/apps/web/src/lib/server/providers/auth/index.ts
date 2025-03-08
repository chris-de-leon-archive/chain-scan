import { type ServerLoadEvent, type RequestEvent } from '@sveltejs/kit'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { AUTH_REDIRECT_URL, AUTH_SIGN_IN_URL } from '../../../constants'
import { redirectTo } from '../../../utils'
import { betterAuth } from 'better-auth'
import { db } from '../db'

const getAuthContext = async <TEvent extends RequestEvent | ServerLoadEvent>(event: TEvent) => {
	if (event.locals.auth != null) {
		return event.locals.auth
	}

	const res = await auth.api.getSession({
		headers: event.request.headers,
	})
	if (res != null) {
		event.locals.auth = { session: res.session, user: res.user }
	}

	return res
}

/**
 * Redirects the user to `AUTH_SIGN_IN_URL` if they are
 * not authenticated.
 */
export const protect = async <TEvent extends RequestEvent | ServerLoadEvent>(event: TEvent) => {
	const ctx = await getAuthContext(event)
	if (ctx == null) {
		return redirectTo(AUTH_SIGN_IN_URL)
	} else {
		return ctx
	}
}

/**
 * Blocks the user from accessing the current page if they
 * are already authenticated. The user will be redirected
 * to `AUTH_REDIRECT_URL`.
 */
export const block = async <TEvent extends RequestEvent | ServerLoadEvent>(event: TEvent) => {
	const ctx = await getAuthContext(event)
	if (ctx != null) {
		return redirectTo(AUTH_REDIRECT_URL)
	} else {
		return ctx
	}
}

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
	},
	database: drizzleAdapter(db, {
		provider: 'sqlite',
	}),
	user: {
		changeEmail: {
			enabled: true,
		},
	},
})
