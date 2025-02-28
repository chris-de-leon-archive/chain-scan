import { type Block, RpcProvider, type TransactionReceipt } from "starknet"
import type { Chain } from "@chain-scan/types"

export class Starknet implements Chain<Block, TransactionReceipt> {
  private readonly client: RpcProvider

  constructor(url: string) {
    this.client = new RpcProvider({ nodeUrl: url })
  }

  getTransactionByID = async (id: string) => {
    const tx = await this.client.getTransactionReceipt(id)
    if (tx.isSuccess()) {
      return tx
    } else {
      throw new Error(`failed to get transaction with ID "${id}"`)
    }
  }

  getLatestTransactions = async (limit: number) => {
    const latestBlock = await this.getBlockByHeight()

    const results = await Promise.allSettled(
      Array.from({ length: limit }).map(async (_, i) => {
        return await this.client.getBlockWithReceipts(
          latestBlock.block_number - i,
        )
      }),
    )

    const txs = new Array<TransactionReceipt>()
    results.forEach((r) => {
      if (r.status === "rejected") {
        throw new Error(r.reason)
      } else {
        txs.push(...r.value.transactions.map((t) => t.receipt))
      }
    })

    return txs
  }

  getLatestBlocks = async (limit: number) => {
    const latestBlock = await this.getBlockByHeight()

    const results = await Promise.allSettled(
      Array.from({ length: limit }).map(async (_, i) => {
        return await this.getBlockByHeight(latestBlock.block_number - i)
      }),
    )

    const blocks = new Array<typeof latestBlock>()
    results.forEach((r) => {
      if (r.status === "rejected") {
        throw new Error(r.reason)
      } else {
        blocks.push(r.value)
      }
    })

    return blocks
  }

  getBlockByHeight = async (height?: bigint | number | undefined) => {
    const h = height != null
      ? height
      : await this.client.getBlockLatestAccepted().then((res) =>
        res.block_number
      )

    while (true) {
      const block = await this.client.getBlock(h)
      if (block.status === "PENDING") {
        await this.client.waitForBlock(h)
        continue
      } else {
        return block
      }
    }
  }
}
