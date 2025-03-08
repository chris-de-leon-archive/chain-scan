import type { Session } from 'better-auth'
import { z } from 'zod'

const zSchema = z.object({
	height: z.number().int().min(0),
	url: z.string().url(),
})

const handler = async (_: Session, input: z.infer<typeof zSchema>) => {
	const { Eth } = await import('@chain-scan/chains-eth')
	return await new Eth(input.url).getBlockByHeight(input.height).then((block) => {
		return structuredClone({
			...block,
			baseFeePerGas: block.baseFeePerGas?.toString(),
			excessBlobGas: block.excessBlobGas?.toString(),
			blobGasUsed: block.blobGasUsed?.toString(),
			difficulty: block.difficulty.toString(),
			gasLimit: block.gasLimit.toString(),
			gasUsed: block.gasUsed.toString(),
		})
	})
}

export const get = {
	schema: zSchema,
	handler,
}
