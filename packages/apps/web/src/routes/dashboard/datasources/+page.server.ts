import { message, superValidate } from 'sveltekit-superforms'
import { protect } from '$lib/server/providers/auth'
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from './$types'
import type { Actions } from '@sveltejs/kit'
import { api } from '$lib/server/api'

export const load: PageServerLoad = async (event) => {
	const { auth } = await event.parent()
	return {
		datasources: await api.datasources.list.handler(auth.session),
		form: {
			remove: await superValidate({}, zod(api.datasources.remove.schema)),
			edit: await superValidate({}, zod(api.datasources.edit.schema)),
		},
	}
}

export const actions = {
	remove: async (event) => {
		const { session } = await protect(event)

		const form = await superValidate(event.request, zod(api.datasources.remove.schema))
		if (!form.valid) {
			return message(form, { type: 'error', text: 'invalid input' })
		} else {
			return await api.datasources.remove.handler(session, form.data).then(() => {
				return message(form, { type: 'success', text: 'success' })
			})
		}
	},
	edit: async (event) => {
		const { session } = await protect(event)

		const form = await superValidate(event.request, zod(api.datasources.edit.schema))
		if (!form.valid) {
			return message(form, { type: 'error', text: 'invalid input' })
		} else {
			return await api.datasources.edit.handler(session, form.data).then(() => {
				return message(form, { type: 'success', text: 'success' })
			})
		}
	},
} satisfies Actions
