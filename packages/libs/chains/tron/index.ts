import type { Chain } from "@chain-scan/types"
import { TronWeb } from "tronweb"

type Transaction = Awaited<ReturnType<TronWeb["trx"]["getTransaction"]>>
type Block = Awaited<ReturnType<TronWeb["trx"]["getBlock"]>>

export class Tron implements Chain<Block, Transaction> {
  private readonly client: TronWeb

  constructor(url: string) {
    this.client = new TronWeb({ fullHost: url })
  }

  getTransactionByID = async (id: string) => {
    return await this.client.trx.getTransaction(id)
  }

  getLatestTransactions = async (limit: number) => {
    const latestBlock = await this.getBlockByHeight()

    const results = await Promise.allSettled(
      Array.from({ length: limit }).map(async (_, i) => {
        try {
          return await this.client.trx.getTransactionsFromBlock(
            latestBlock.block_header.raw_data.number - i,
          )
        } catch (err) {
          if (err instanceof Error) {
            // NOTE: if a block does not have transactions, then apparently the
            // Tron SDK throws an error instead of returning an empty array :(
            if (err.message.includes("Transaction not found in block")) {
              return []
            } else {
              throw err
            }
          } else {
            throw err
          }
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
    const latestBlock = await this.getBlockByHeight()

    const results = await Promise.allSettled(
      Array.from({ length: limit }).map(async (_, i) => {
        return await this.getBlockByHeight(
          latestBlock.block_header.raw_data.number - i,
        )
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
    if (height == null) {
      return await this.client.trx.getBlock("latest")
    } else {
      return await this.client.trx.getBlock(height.toString())
    }
  }
}
