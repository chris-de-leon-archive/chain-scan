import type { Session } from 'better-auth'
import { tx } from '../utils'
import { z } from 'zod'

const zSchema = z.object({
	id: z.string(),
	url: z.string().url(),
})

const handler = async (_: Session, input: z.infer<typeof zSchema>) => {
	const { Eth } = await import('@chain-scan/chains-eth')
	const result = await new Eth(input.url).getTransactionByID(input.id)
  return structuredClone(tx(result))
}

export const get = {
	schema: zSchema,
	handler,
}
