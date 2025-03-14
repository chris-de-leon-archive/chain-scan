import { Flow, type Block, type Transaction } from '@chain-scan/chains-flow'
import { toHexString } from '../../utils'

export const block = (b: Block) => {
	return {
		id: toHexString(b.id).withPrefix(),
		timestamp: b.timestamp?.seconds ?? 'N/A',
		height: b.height.toString(),
		parentId: toHexString(b.parentId).withPrefix(),
	}
}

export const tx = async (t: Transaction) => {
	return {
		transactionId: toHexString(t.transactionId).withPrefix(),
		collectionId: toHexString(t.collectionId).withPrefix(),
		computationUsage: t.computationUsage.toString(),
		events: await Flow.decodeEvents(t),
		status: t.status,
	}
}
