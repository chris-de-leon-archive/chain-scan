export interface Chain<TBlock, TTransaction> {
  getLatestTransactions(limit: number): Promise<TTransaction[]>
  getLatestBlocks(limit: number): Promise<TBlock[]>
  getTransactionByID(id: string): Promise<TTransaction>
  getBlockByHeight(height?: bigint | number | undefined): Promise<TBlock>
}
