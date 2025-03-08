import { protect } from '$lib/server/providers/auth'
import type { LayoutServerLoad } from './$types'
import { api } from '$lib/server/api'

export const load: LayoutServerLoad = async (event) => {
	const auth = await protect(event)
	return {
		datasources: await api.datasources.list.handler(auth.session),
		auth,
	}
}
