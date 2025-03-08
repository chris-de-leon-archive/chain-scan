import type { Session } from 'better-auth'
import { z } from 'zod'

const zSchema = z.object({
	limit: z.number().int().min(1),
	url: z.string().url(),
})

const handler = async (_: Session, input: z.infer<typeof zSchema>) => {
	const { Eth } = await import('@chain-scan/chains-eth')
	return await new Eth(input.url).getLatestTransactions(input.limit).then((txs) => {
		return structuredClone(
			txs.map((tx) => ({
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
			})),
		)
	})
}

export const list = {
	schema: zSchema,
	handler,
}
