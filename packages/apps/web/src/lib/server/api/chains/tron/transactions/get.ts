import type { Session } from 'better-auth'
import { z } from 'zod'

const zSchema = z.object({
	id: z.string(),
	url: z.string().url(),
})

const handler = async (_: Session, input: z.infer<typeof zSchema>) => {
	const { Tron } = await import('@chain-scan/chains-tron')
	return await new Tron(input.url).getTransactionByID(input.id)
}

export const get = {
	schema: zSchema,
	handler,
}
