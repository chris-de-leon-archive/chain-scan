import type { Chain } from "@chain-scan/types"
import * as crypto from "node:crypto"
import { TronWeb } from "tronweb"

export type Transaction = Awaited<ReturnType<TronWeb["trx"]["getTransaction"]>>
export type Block = Awaited<ReturnType<TronWeb["trx"]["getBlock"]>>

export class Tron implements Chain<Block, Transaction> {
  private readonly client: TronWeb

  constructor(private readonly url: string) {
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

  ID = () => {
    return crypto
      .createHash("md5")
      .update(Tron.name.toLowerCase())
      .update(this.url)
      .digest()
      .toString("hex")
  }

  getTransactionByID = async (id: string) => {
    return await this.client.trx.getTransaction(id)
  }

  getLatestBlockNumber = async () => {
    return await this.client.trx
      .getCurrentBlock()
      .then((b) => BigInt(b.block_header.raw_data.number))
  }

  getBlockByNumber = (num?: bigint | number | undefined) => {
    const getBlock = async () => {
      if (num == null) {
        return await this.client.trx.getBlock("latest")
      } else {
        return await this.client.trx.getBlock(num.toString())
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
