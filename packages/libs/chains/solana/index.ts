import type { Chain } from "@chain-scan/types"
import * as sol from "@solana/web3.js"

// https://solana.com/developers/guides/advanced/versions#current-transaction-versions
const maxSupportedTransactionVersion = 0

export type Transaction = Block['transactions'][number]
export type Block = sol.VersionedBlockResponse & { slot: number }

export class Solana implements Chain<Block, Transaction> {
  private readonly client: sol.Connection

  constructor(url: string) {
    this.client = new sol.Connection(url)
  }

  getTransactionByID = async (id: string) => {
    const tx = await this.client.getTransaction(id, {
      maxSupportedTransactionVersion,
    })
    if (tx == null) {
      throw new Error(`failed to get transaction with ID "${id}"`)
    } else {
      return tx
    }
  }

  getLatestTransactions = async (limit: number) => {
    const blocks = await this.getLatestBlocks(limit)
    return blocks.flatMap((b) =>
      b.transactions.map((t) => ({
        ...t,
        blockTime: b.blockTime,
        slot: b.slot,
      })),
    )
  }

  getLatestBlocks = async (limit: number) => {
    const latestBlock = await this.getBlockByID().asIs()

    const blocks = new Array<Block>()
    while (blocks.length < limit) {
      const lastBlock = blocks.at(-1) ?? latestBlock
      const nextBlock = await this.getBlockByID(lastBlock.parentSlot).asIs()
      blocks.push({ ...nextBlock, slot: lastBlock.parentSlot })
    }

    return blocks
  }

  getBlockByID = (id?: bigint | number | undefined) => {
    const getBlock = async (withTransactions: boolean) => {
      const slot = parseInt(
        (id ?? (await this.client.getSlot())).toString(),
        10,
      )

      if (Number.isNaN(slot)) {
        throw new Error("failed to parse integer")
      }

      const block = await this.client.getBlock(slot, {
        maxSupportedTransactionVersion,
        transactionDetails: withTransactions ? "full" : "none",
      })

      if (block == null) {
        throw new Error(`failed to retrieve block at slot "${slot}"`)
      } else {
        return { ...block, slot: slot }
      }
    }

    return {
      asIs: async () => await getBlock(false),
      withTransactions: async () => {
        const block = await getBlock(true)
        return {
          block,
          transactions: block.transactions,
        }
      },
    }
  }
}
