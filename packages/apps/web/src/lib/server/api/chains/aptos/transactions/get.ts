import type { Session } from 'better-auth'
import { z } from 'zod'

const zSchema = z.object({
	id: z.string(),
	url: z.string().url(),
})

const handler = async (_: Session, input: z.infer<typeof zSchema>) => {
	const { Aptos } = await import('@chain-scan/chains-aptos')
	return await new Aptos(input.url).getTransactionByID(input.id)
}

export const get = {
	schema: zSchema,
	handler,
}
