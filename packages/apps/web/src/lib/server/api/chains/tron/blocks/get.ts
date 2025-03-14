import type { Session } from 'better-auth'
import { z } from 'zod'

const zSchema = z.object({
	id: z.bigint().min(0n),
	url: z.string().url(),
})

const handler = async (_: Session, input: z.infer<typeof zSchema>) => {
	const { Tron } = await import('@chain-scan/chains-tron')
	return await new Tron(input.url).getBlockByID(input.id).withTransactions()
}

export const get = {
	schema: zSchema,
	handler,
}
