import type { Session } from 'better-auth'
import { aptos } from '../utils'
import { z } from 'zod'

const zSchema = z.object({
	limit: z.number().int().min(1),
	url: z.string().url(),
})

const handler = async (_: Session, input: z.infer<typeof zSchema>) => {
	return await aptos.withUrl(input.url).getLatestTransactions(input.limit)
}

export const list = {
	schema: zSchema,
	handler,
}
