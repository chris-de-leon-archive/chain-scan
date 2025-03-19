import { RpcProvider, type Block, type TransactionReceipt } from "starknet"
import type { Chain } from "@chain-scan/types"
import * as crypto from "node:crypto"

export type SerializableTransaction = Pick<
  TransactionReceipt,
  | "type"
  | "block_hash"
  | "block_number"
  | "transaction_hash"
  | "finality_status"
  | "execution_status"
  | "actual_fee"
  | "events"
>

export type SerializableBlock = Pick<
  Block,
  | "block_hash"
  | "block_number"
  | "transactions"
  | "timestamp"
  | "status"
  | "parent_hash"
  | "l1_gas_price"
>

export class Starknet
  implements Chain<SerializableBlock, SerializableTransaction>
{
  private readonly client: RpcProvider

  constructor(private readonly url: string) {
    this.client = new RpcProvider({ nodeUrl: url })
  }

  static toSerializableTransaction = (
    tx: TransactionReceipt,
  ): SerializableTransaction => {
    return {
      transaction_hash: tx.transaction_hash,
      execution_status: tx.execution_status,
      finality_status: tx.finality_status,
      block_number: tx.block_number,
      block_hash: tx.block_hash,
      actual_fee: tx.actual_fee,
      events: tx.events,
      type: tx.type,
    }
  }

  static toSerializableBlock = (block: Block): SerializableBlock => {
    return {
      block_number: block.block_number,
      l1_gas_price: block.l1_gas_price,
      transactions: block.transactions,
      parent_hash: block.parent_hash,
      block_hash: block.block_hash,
      timestamp: block.timestamp,
      status: block.status,
    }
  }

  ID = () => {
    return crypto
      .createHash("md5")
      .update(Starknet.name.toLowerCase())
      .update(this.url)
      .digest()
      .toString("hex")
  }

  getTransactionByID = async (id: string) => {
    const tx = await this.client.getTransactionReceipt(id)
    if (tx.isSuccess()) {
      return Starknet.toSerializableTransaction(tx)
    } else {
      throw new Error(`failed to get transaction with ID "${id}"`)
    }
  }

  getLatestBlockNumber = async () => {
    return await this.client.getBlockNumber().then((n) => BigInt(n))
  }

  getBlockByNumber = (num?: bigint | number | undefined) => {
    const getBlock = async () => {
      const n =
        num != null
          ? num.toString()
          : await this.client
              .getBlockLatestAccepted()
              .then((res) => res.block_number.toString())

      while (true) {
        const b = await this.client.getBlock(n)
        if (b.status === "PENDING") {
          await this.client.waitForBlock(n)
          continue
        } else {
          return b
        }
      }
    }

    return {
      asIs: async () => await getBlock().then(Starknet.toSerializableBlock),
      withTransactions: async () => {
        const block = await getBlock()
        return {
          block: Starknet.toSerializableBlock(block),
          transactions: await this.client
            .getBlockWithReceipts(block.block_number)
            .then(({ transactions }) =>
              transactions.map(({ receipt }) =>
                Starknet.toSerializableTransaction(receipt),
              ),
            ),
        }
      },
    }
  }
}
