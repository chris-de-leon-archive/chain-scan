import type { Session } from 'better-auth'
import { tx } from '../utils'
import { z } from 'zod'

const zSchema = z.object({
	id: z.string(),
	url: z.string().url(),
})

const handler = async (_: Session, input: z.infer<typeof zSchema>) => {
	const { Flow } = await import('@chain-scan/chains-flow')
	const result = await new Flow(input.url).getTransactionByID(input.id)
	return await tx(result).then((res) => structuredClone(res))
}

export const get = {
	schema: zSchema,
	handler,
}
