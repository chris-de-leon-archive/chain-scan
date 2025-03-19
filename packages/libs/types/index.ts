/**
 * Represents a blockchain interface that provides access to blocks and transactions.
 * It is VERY important that TBlock and TTransaction are JSON serializable. If this is
 * not the case, then issues will arise in other components like Svelte server actions
 * and caching (e.g. redis / LMDB)
 *
 * @template TBlock - The type representing a blockchain block.
 * @template TTransaction - The type representing a blockchain transaction.
 */
export interface Chain<TBlock, TTransaction> {
  ID(): string
  getTransactionByID(id: string): Promise<TTransaction>
  getLatestBlockNumber(): Promise<bigint>
  getBlockByNumber(num?: number | bigint | undefined): {
    asIs: () => Promise<TBlock>
    withTransactions: () => Promise<{
      block: TBlock
      transactions: TTransaction[]
    }>
  }
}
