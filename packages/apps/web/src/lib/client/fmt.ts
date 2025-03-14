export class Fmt {
	static prettyPrintNumber(n: number) {
		return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(n)
	}
}
