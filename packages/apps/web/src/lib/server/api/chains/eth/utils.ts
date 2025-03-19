import { cache } from '$lib/server/providers/cache'
import { Eth } from '@chain-scan/chains-eth'

export const eth = {
	withUrl: (url: string) => cache.connect(new Eth(url)),
}
