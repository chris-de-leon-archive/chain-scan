import type { Chain } from "@chain-scan/types"
import * as sol from "@solana/web3.js"
import * as crypto from "node:crypto"

// https://solana.com/developers/guides/advanced/versions#current-transaction-versions
const maxSupportedTransactionVersion = 0

export type Transaction = Block["transactions"][number]
export type Block = sol.VersionedBlockResponse & { slot: number }

export class Solana implements Chain<Block, Transaction> {
  private readonly client: sol.Connection

  constructor(private readonly url: string) {
    this.client = new sol.Connection(url)
  }

  static toSerializableTransaction = (tx: Transaction) => {
    return structuredClone(tx)
  }

  static toSerializableBlock = (block: Block) => {
    if (block.transactions == null) {
      return structuredClone({ ...block, transactions: [] })
    } else {
      return structuredClone(block)
    }
  }

  ID = () => {
    return crypto
      .createHash("md5")
      .update(Solana.name.toLowerCase())
      .update(this.url)
      .digest()
      .toString("hex")
  }

  getTransactionByID = async (id: string) => {
    const tx = await this.client.getTransaction(id, {
      maxSupportedTransactionVersion,
    })
    if (tx == null) {
      throw new Error(`failed to get transaction with ID "${id}"`)
    } else {
      return Solana.toSerializableTransaction(tx)
    }
  }

  getLatestBlockNumber = async () => {
    return await this.client.getSlot().then((s) => BigInt(s))
  }

  getBlockByNumber = (num?: bigint | number | undefined) => {
    const getBlock = async (withTransactions: boolean) => {
      const slot = parseInt(
        (num ?? (await this.client.getSlot())).toString(),
        10,
      )

      if (Number.isNaN(slot)) {
        throw new Error("failed to parse integer")
      }

      // NOTE: if `transactionDetails` is 'none' then the `block.transactions`
      // field will not be present. The Solana TS SDK types are NOT accurate.
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
      asIs: async () => await getBlock(false).then(Solana.toSerializableBlock),
      withTransactions: async () => {
        const block = await getBlock(true)
        return {
          block: Solana.toSerializableBlock(block),
          transactions: block.transactions.map(
            Solana.toSerializableTransaction,
          ),
        }
      },
    }
  }
}
