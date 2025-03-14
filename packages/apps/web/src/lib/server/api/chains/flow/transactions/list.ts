import type { Session } from 'better-auth'
import { tx } from '../utils'
import { z } from 'zod'

const zSchema = z.object({
	limit: z.number().int().min(1),
	url: z.string().url(),
})

const handler = async (_: Session, input: z.infer<typeof zSchema>) => {
	const { Flow } = await import('@chain-scan/chains-flow')
	const result = await new Flow(input.url).getLatestTransactions(input.limit)
	return await Promise.all(result.map(tx)).then((res) => structuredClone(res))
}

export const list = {
	schema: zSchema,
	handler,
}
