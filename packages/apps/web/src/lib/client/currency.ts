export class Currency {
	static convertFriToStark(fri: string) {
		return 10e-18 * (fri.startsWith('0x') ? parseInt(fri, 16) : parseInt(fri, 10))
	}

	static convertWeiToEthers(wei: string) {
		return 10e-18 * (wei.startsWith('0x') ? parseInt(wei, 16) : parseInt(wei, 10))
	}
}
