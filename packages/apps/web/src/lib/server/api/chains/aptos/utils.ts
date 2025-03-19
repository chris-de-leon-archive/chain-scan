import { cache } from '$lib/server/providers/cache'
import { Aptos } from '@chain-scan/chains-aptos'

export const aptos = {
	withUrl: (url: string) => cache.connect(new Aptos(url)),
}
