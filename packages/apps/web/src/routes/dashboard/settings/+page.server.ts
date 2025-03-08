import { message, superValidate, type ErrorStatus } from 'sveltekit-superforms'
import type { SuperValidated } from 'sveltekit-superforms/server'
import { zod } from 'sveltekit-superforms/adapters'
import { auth } from '$lib/server/providers/auth'
import { URL_PLACEHOLDER } from '$lib/constants'
import type { PageServerLoad } from './$types'
import type { Actions } from '@sveltejs/kit'
import { APIError } from 'better-auth/api'
import { z } from 'zod'

const zPasswordSchema = z.object({
	currentPassword: z.string(),
	newPassword: z.string(),
})

const zEmailSchema = z.object({
	email: z.string().email(),
})

const zImageSchema = z.object({
	image: z.string().url(),
})

const zNameSchema = z.object({
	name: z.string().min(1),
})

const zInfoSchema = z.union([zImageSchema, zNameSchema])

const handleAuth = async <
	T,
	Out extends Record<string, unknown>,
	In extends Record<string, unknown>,
>(
	form: SuperValidated<Out, App.Superforms.Message, In>,
	cb: () => Promise<T>,
) => {
	try {
		return await cb().then(() => message(form, { type: 'success', text: 'success' }))
	} catch (err) {
		if (err instanceof APIError) {
			return message(
				form,
				{ type: 'error', text: err.message },
				{ status: err.statusCode as ErrorStatus },
			)
		} else {
			throw err
		}
	}
}

export const load: PageServerLoad = async (event) => {
	const { auth } = await event.parent()
	return {
		auth,
		form: {
			password: await superValidate({ currentPassword: '', newPassword: '' }, zod(zPasswordSchema)),
			image: await superValidate({ image: auth.user.image ?? URL_PLACEHOLDER }, zod(zImageSchema)),
			email: await superValidate({ email: auth.user.email }, zod(zEmailSchema)),
			name: await superValidate({ name: auth.user.name }, zod(zNameSchema)),
		},
	}
}

export const actions = {
	updatePassword: async (event) => {
		const form = await superValidate(event.request, zod(zPasswordSchema))
		if (!form.valid) {
			return message(form, { type: 'error', text: 'invalid input' })
		} else {
			return await handleAuth(form, async () => {
				return await auth.api.changePassword({
					headers: event.request.headers,
					body: form.data,
				})
			})
		}
	},
	updateEmail: async (event) => {
		const form = await superValidate(event.request, zod(zEmailSchema))
		if (!form.valid) {
			return message(form, { type: 'error', text: 'invalid input' })
		} else {
			return await handleAuth(form, async () => {
				return await auth.api.changeEmail({
					headers: event.request.headers,
					body: {
						newEmail: form.data.email,
					},
				})
			})
		}
	},
	updateInfo: async (event) => {
		const form = await superValidate(event.request, zod(zInfoSchema))
		if (!form.valid) {
			return message(form, { type: 'error', text: 'invalid input' })
		} else {
			return await handleAuth(form, async () => {
				return await auth.api.updateUser({
					headers: event.request.headers,
					body: form.data,
				})
			})
		}
	},
} satisfies Actions
