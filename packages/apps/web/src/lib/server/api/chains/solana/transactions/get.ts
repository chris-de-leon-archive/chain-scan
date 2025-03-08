import type { Session } from 'better-auth'
import { z } from 'zod'

const zSchema = z.object({
	id: z.string(),
	url: z.string().url(),
})

const handler = async (_: Session, input: z.infer<typeof zSchema>) => {
	const { Solana } = await import('@chain-scan/chains-solana')
	return await new Solana(input.url).getTransactionByID(input.id).then(structuredClone)
}

export const get = {
	schema: zSchema,
	handler,
}
