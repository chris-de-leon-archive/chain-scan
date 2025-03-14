import { RpcProvider, type Block, type TransactionReceipt as Transaction } from "starknet"
import type { Chain } from "@chain-scan/types"

export type {
  Transaction,
  Block
}

export class Starknet implements Chain<Block, Transaction> {
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
    const latestBlock = await this.getBlockByID().asIs()

    const results = await Promise.allSettled(
      Array.from({ length: limit }).map(async (_, i) => {
        return await this.client.getBlockWithReceipts(
          latestBlock.block_number - i,
        )
      }),
    )

    const txs = new Array<Transaction>()
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
    const latestBlock = await this.getBlockByID().asIs()

    const results = await Promise.allSettled(
      Array.from({ length: limit }).map(async (_, i) => {
        return await this.getBlockByID(latestBlock.block_number - i).asIs()
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

  getBlockByID = (id?: bigint | number | undefined) => {
    const getBlock = async () => {
      const num =
        id != null
          ? id.toString()
          : await this.client
              .getBlockLatestAccepted()
              .then((res) => res.block_number.toString())

      while (true) {
        const b = await this.client.getBlock(num)
        if (b.status === "PENDING") {
          await this.client.waitForBlock(num)
          continue
        } else {
          return b
        }
      }
    }

    return {
      asIs: getBlock,
      withTransactions: async () => {
        const block = await getBlock()
        return {
          block,
          transactions: await this.client
            .getBlockWithReceipts(block.block_number)
            .then(({ transactions }) =>
              transactions.map(({ receipt }) => receipt),
            ),
        }
      },
    }
  }
}
