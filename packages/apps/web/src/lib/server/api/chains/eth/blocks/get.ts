import type { Session } from 'better-auth'
import { tx, block } from '../utils'
import { z } from 'zod'

const zSchema = z.object({
	id: z.bigint().min(0n),
	url: z.string().url(),
})

const handler = async (_: Session, input: z.infer<typeof zSchema>) => {
	const { Eth } = await import('@chain-scan/chains-eth')
	const result = await new Eth(input.url).getBlockByID(input.id).withTransactions()
	return structuredClone({
		transactions: result.transactions.map(tx),
		block: block(result.block),
	})
}

export const get = {
	schema: zSchema,
	handler,
}
