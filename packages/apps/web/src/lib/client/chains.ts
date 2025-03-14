export class Chains {
	/**
	 * https://developers.flow.com/networks/access-onchain-data#transaction-status
	 */
	static interpretFlowTransactionStatus(status: number) {
		if (status === 0) {
			return 'UNKNOWN'
		}
		if (status === 1) {
			return 'PENDING'
		}
		if (status === 2) {
			return 'FINALIZED'
		}
		if (status === 3) {
			return 'EXECUTED'
		}
		if (status === 4) {
			return 'SEALED'
		}
		if (status === 5) {
			return 'EXPIRED'
		}
		return 'N/A'
	}
}
