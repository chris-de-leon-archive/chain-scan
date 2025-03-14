import type { Chain } from "@chain-scan/types"
import { TronWeb } from "tronweb"

export type Transaction = Awaited<ReturnType<TronWeb["trx"]["getTransaction"]>>
export type Block = Awaited<ReturnType<TronWeb["trx"]["getBlock"]>>

export class Tron implements Chain<Block, Transaction> {
  private readonly client: TronWeb

  constructor(url: string) {
    this.client = new TronWeb({ fullHost: url })
  }

  private getTxsFromBlock = async (blockNum: number) => {
    try {
      return await this.client.trx.getTransactionsFromBlock(blockNum)
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
  }

  getTransactionByID = async (id: string) => {
    return await this.client.trx.getTransaction(id)
  }

  getLatestTransactions = async (limit: number) => {
    const latestBlock = await this.getBlockByID().asIs()

    const results = await Promise.allSettled(
      Array.from({ length: limit }).map(async (_, i) => {
        return await this.getTxsFromBlock(
          latestBlock.block_header.raw_data.number - i,
        )
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
    const latestBlock = await this.getBlockByID().asIs()

    const results = await Promise.allSettled(
      Array.from({ length: limit }).map(async (_, i) => {
        return await this.getBlockByID(
          latestBlock.block_header.raw_data.number - i,
        ).asIs()
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
      if (id == null) {
        return await this.client.trx.getBlock("latest")
      } else {
        return await this.client.trx.getBlock(id.toString())
      }
    }

    return {
      asIs: getBlock,
      withTransactions: async () => {
        const block = await getBlock()
        return {
          block,
          transactions: await this.getTxsFromBlock(
            block.block_header.raw_data.number,
          ),
        }
      },
    }
  }
}
