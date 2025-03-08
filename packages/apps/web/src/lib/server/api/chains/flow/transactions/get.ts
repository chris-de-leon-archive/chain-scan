import type { Session } from 'better-auth'
import { z } from 'zod'

const zSchema = z.object({
	id: z.string(),
	url: z.string().url(),
})

const handler = async (_: Session, input: z.infer<typeof zSchema>) => {
	const { Flow } = await import('@chain-scan/chains-flow')
	return await new Flow(input.url).getTransactionByID(input.id).then((tx) => {
		return structuredClone({
			...tx,
			computationUsage: tx.computationUsage.toString(),
		})
	})
}

export const get = {
	schema: zSchema,
	handler,
}
