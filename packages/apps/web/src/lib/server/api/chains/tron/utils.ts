import { cache } from '$lib/server/providers/cache'
import { Tron } from '@chain-scan/chains-tron'

export const tron = {
	withUrl: (url: string) => cache.connect(new Tron(url)),
}
