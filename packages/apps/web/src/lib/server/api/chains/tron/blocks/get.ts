import type { Session } from 'better-auth'
import { tron } from '../utils'
import { z } from 'zod'

const zSchema = z.object({
	id: z.bigint().min(0n),
	url: z.string().url(),
})

const handler = async (_: Session, input: z.infer<typeof zSchema>) => {
	return await tron.withUrl(input.url).getBlockByNumber(input.id).withTransactions()
}

export const get = {
	schema: zSchema,
	handler,
}
