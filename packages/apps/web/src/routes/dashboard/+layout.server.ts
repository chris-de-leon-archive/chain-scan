import { protect } from '$lib/server/providers/auth'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
	return { auth: await protect(event) }
}
