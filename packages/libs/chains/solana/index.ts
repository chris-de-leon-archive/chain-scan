import type { Chain } from "@chain-scan/types"
import * as sol from "@solana/web3.js"

// https://solana.com/developers/guides/advanced/versions#current-transaction-versions
const maxSupportedTransactionVersion = 0

type Block = sol.VersionedBlockResponse & { slot: number }

export class Solana implements Chain<Block, sol.VersionedTransactionResponse> {
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
    const latestBlock = await this.getBlockByHeight()

    const blocks = new Array<Block>()
    while (blocks.length < limit) {
      const lastBlock = blocks.at(-1) ?? latestBlock
      const nextBlock = await this.getBlockByHeight(lastBlock.parentSlot)
      blocks.push({ ...nextBlock, slot: lastBlock.parentSlot })
    }

    return blocks
  }

  getBlockByHeight = async (height?: bigint | number | undefined) => {
    const slot = parseInt(
      (height ?? (await this.client.getSlot())).toString(),
      10,
    )

    if (Number.isNaN(slot)) {
      throw new Error("failed to parse integer")
    }

    const block = await this.client.getBlock(slot, {
      maxSupportedTransactionVersion,
      transactionDetails: "full",
    })

    if (block == null) {
      throw new Error(`failed to retrieve block at slot "${slot}"`)
    } else {
      return { ...block, slot: slot }
    }
  }
}
