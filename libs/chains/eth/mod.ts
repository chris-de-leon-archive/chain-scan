import type { Chain } from "@chain-scan/types"
import { ethers } from "ethers"

export class Eth implements Chain<ethers.Block, ethers.TransactionResponse> {
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
    const latestBlock = await this.getBlockByHeight()

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

    const txs = new Array<ethers.TransactionResponse>()
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
        return await this.getBlockByHeight(blockHeight - i)
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

  getBlockByHeight = async (height?: bigint | number | undefined) => {
    const blockHeight = height != null
      ? height
      : await this.client.getBlockNumber()

    const block = await this.client.getBlock(blockHeight)
    if (block == null) {
      throw new Error(`block with number "${height}" does not exist`)
    } else {
      return block
    }
  }
}
