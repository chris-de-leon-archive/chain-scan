import type { Chain } from "@chain-scan/types"
import { ethers } from "ethers"

export type Transaction = ethers.TransactionResponse
export type Block = ethers.Block

export class Eth implements Chain<Block, Transaction> {
  private readonly client: ethers.JsonRpcProvider

  constructor(...args: ConstructorParameters<typeof ethers.JsonRpcProvider>) {
    this.client = new ethers.JsonRpcProvider(...args)
  }

  getTransactionByID = async (id: string) => {
    const tx = await this.client.getTransaction(id)
    if (tx == null) {
      throw new Error(`transaction with ID "${id}" does not exist`)
    } else {
      return tx
    }
  }

  getLatestTransactions = async (limit: number) => {
    const latestBlock = await this.getBlockByID().asIs()

    const results = await Promise.allSettled(
      Array.from({ length: limit }).flatMap(async (_, i) => {
        const height = latestBlock.number - i
        const block = await this.client.getBlock(height, true)
        if (block == null) {
          throw new Error(`failed to fetch block at height "${height}"`)
        } else {
          return block.prefetchedTransactions
        }
      }),
    )

    const txs = new Array<Transaction>()
    results.forEach((r) => {
      if (r.status === "rejected") {
        throw new Error(r.reason)
      } else {
        txs.push(...r.value)
      }
    })

    return txs
  }

  getLatestBlocks = async (limit: number) => {
    const blockHeight = await this.client.getBlockNumber()

    const results = await Promise.allSettled(
      Array.from({ length: limit }).map(async (_, i) => {
        return await this.getBlockByID(blockHeight - i).asIs()
      }),
    )

    const blocks = new Array<ethers.Block>()
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
    const getBlock = async (withTransactions: boolean) => {
      const blockHeight = id != null ? id : await this.client.getBlockNumber()

      const block = await this.client.getBlock(blockHeight, withTransactions)
      if (block == null) {
        throw new Error(`block with number "${id}" does not exist`)
      } else {
        return block
      }
    }

    return {
      asIs: async () => await getBlock(false),
      withTransactions: async () => {
        const block = await getBlock(true)
        return {
          block,
          transactions: block.transactions.map((hash) =>
            block.getPrefetchedTransaction(hash),
          ),
        }
      },
    }
  }
}
