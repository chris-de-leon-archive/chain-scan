import type { Session } from 'better-auth'
import { z } from 'zod'

const zSchema = z.object({
	height: z.number().int().min(0),
	url: z.string().url(),
})

const handler = async (_: Session, input: z.infer<typeof zSchema>) => {
	const { Starknet } = await import('@chain-scan/chains-starknet')
	return await new Starknet(input.url).getBlockByHeight(input.height)
}

export const get = {
	schema: zSchema,
	handler,
}
