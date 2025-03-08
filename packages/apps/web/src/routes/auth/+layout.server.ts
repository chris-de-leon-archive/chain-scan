import { block } from '$lib/server/providers/auth'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
	await block(event)
}
