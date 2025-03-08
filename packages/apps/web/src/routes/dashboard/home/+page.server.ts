import { message, superValidate } from 'sveltekit-superforms'
import type { Actions, PageServerLoad } from './$types'
import { protect } from '$lib/server/providers/auth'
import { zod } from 'sveltekit-superforms/adapters'
import { URL_PLACEHOLDER } from '$lib/constants'
import { api } from '$lib/server/api'

export const load: PageServerLoad = async () => {
	return {
		form: {
			datasource: await superValidate(
				{ name: 'My Datasource', url: URL_PLACEHOLDER },
				zod(api.datasources.create.schema),
			),
		},
	}
}

export const actions = {
	createDatasource: async (event) => {
		const { session } = await protect(event)

		const form = await superValidate(event.request, zod(api.datasources.create.schema))
		if (!form.valid) {
			return message(form, { type: 'error', text: 'invalid input' })
		}

		return await api.datasources.create.handler(session, form.data).then(() => {
			return message(form, { type: 'success', text: 'success' })
		})
	},
} satisfies Actions
