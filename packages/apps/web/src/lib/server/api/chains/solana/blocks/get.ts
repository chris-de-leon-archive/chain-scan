import type { Session } from 'better-auth'
import { z } from 'zod'

const zSchema = z.object({
	height: z.number().int().min(0),
	url: z.string().url(),
})

const handler = async (_: Session, input: z.infer<typeof zSchema>) => {
	const { Solana } = await import('@chain-scan/chains-solana')
	return await new Solana(input.url)
		.getBlockByHeight(input.height)
		.then((res) => structuredClone(res))
}

export const get = {
	schema: zSchema,
	handler,
}
