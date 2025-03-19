import { cache } from '$lib/server/providers/cache'
import { Solana } from '@chain-scan/chains-solana'

export const solana = {
	withUrl: (url: string) => cache.connect(new Solana(url)),
}
