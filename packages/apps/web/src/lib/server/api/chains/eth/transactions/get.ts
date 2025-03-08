import type { Session } from 'better-auth'
import { z } from 'zod'

const zSchema = z.object({
	id: z.string(),
	url: z.string().url(),
})

const handler = async (_: Session, input: z.infer<typeof zSchema>) => {
	const { Eth } = await import('@chain-scan/chains-eth')
	return await new Eth(input.url).getTransactionByID(input.id).then((tx) => {
		return structuredClone({
			...tx,
			maxPriorityFeePerGas: tx.maxPriorityFeePerGas?.toString(),
			maxFeePerBlobGas: tx.maxFeePerBlobGas?.toString(),
			maxFeePerGas: tx.maxFeePerGas?.toString(),
			gasLimit: tx.gasLimit.toString(),
			gasPrice: tx.gasPrice.toString(),
			chainId: tx.chainId.toString(),
			value: tx.value.toString(),
			signature: {
				...tx.signature,
				networkV: tx.signature.networkV?.toString(),
				legacyChainId: tx.signature.legacyChainId?.toString(),
			},
		})
	})
}

export const get = {
	schema: zSchema,
	handler,
}
