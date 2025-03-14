import type { Session } from 'better-auth'
import { z } from 'zod'
import { block, tx } from '../utils'

const zSchema = z.object({
	id: z.bigint().min(0n),
	url: z.string().url(),
})

const handler = async (_: Session, input: z.infer<typeof zSchema>) => {
	const { Flow } = await import('@chain-scan/chains-flow')
	const result = await new Flow(input.url).getBlockByID(input.id).withTransactions()
	return structuredClone({
		transactions: await Promise.all(result.transactions.map(tx)),
		block: block(result.block),
	})
}

export const get = {
	schema: zSchema,
	handler,
}
