import { Starknet } from '@chain-scan/chains-starknet'
import { cache } from '$lib/server/providers/cache'

export const starknet = {
	withUrl: (url: string) => cache.connect(new Starknet(url)),
}
