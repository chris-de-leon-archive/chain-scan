import { cache } from '$lib/server/providers/cache'
import { Flow } from '@chain-scan/chains-flow'

export const flow = {
	withUrl: (url: string) => cache.connect(new Flow(url)),
}
