export interface Chain<TBlock, TTransaction> {
  getLatestTransactions(limit: number): Promise<TTransaction[]>
  getLatestBlocks(limit: number): Promise<TBlock[]>
  getTransactionByID(id: string): Promise<TTransaction>
  getBlockByID(id?: number | bigint | undefined): {
    asIs: () => Promise<TBlock>,
    withTransactions: () => Promise<{
      block: TBlock,
      transactions: TTransaction[]
    }>
  }
}
