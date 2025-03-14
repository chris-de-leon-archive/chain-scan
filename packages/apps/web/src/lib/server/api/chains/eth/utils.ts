import type { Block, Transaction } from '@chain-scan/chains-eth'

export const block = (b: Block) => {
	return {
		...b,
		baseFeePerGas: b.baseFeePerGas?.toString(),
		excessBlobGas: b.excessBlobGas?.toString(),
		blobGasUsed: b.blobGasUsed?.toString(),
		difficulty: b.difficulty.toString(),
		gasLimit: b.gasLimit.toString(),
		gasUsed: b.gasUsed.toString(),
	}
}

export const tx = (t: Transaction) => {
	return {
		...t,
		maxPriorityFeePerGas: t.maxPriorityFeePerGas?.toString(),
		maxFeePerBlobGas: t.maxFeePerBlobGas?.toString(),
		maxFeePerGas: t.maxFeePerGas?.toString(),
		gasLimit: t.gasLimit.toString(),
		gasPrice: t.gasPrice.toString(),
		chainId: t.chainId.toString(),
		value: t.value.toString(),
		signature: {
			...t.signature,
			networkV: t.signature.networkV?.toString(),
			legacyChainId: t.signature.legacyChainId?.toString(),
		},
	}
}
