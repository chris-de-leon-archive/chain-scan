import { block, protect } from '$lib/server/providers/auth'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	await protect(event)
	await block(event)
}
