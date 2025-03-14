import { createGrpcWebTransport } from "@connectrpc/connect-node"
import { type Client, createClient } from "@connectrpc/connect"
import type { Chain } from "@chain-scan/types"
import * as fcl from "@onflow/fcl"
import * as flow from "./client"

export type Transaction = flow.TransactionResultResponse
export type Block = NonNullable<flow.BlockResponse["block"]>

// NOTE: https://developers.flow.com/tools/clients/fcl-js/api
// NOTE: https://developers.flow.com/networks/access-onchain-data
export class Flow implements Chain<Block, Transaction> {
  private readonly client: Client<typeof flow.AccessAPI>

  constructor(url: string) {
    this.client = createClient(
      flow.AccessAPI,
      createGrpcWebTransport({
        baseUrl: url,
        httpVersion: "1.1",
      }),
    )
  }

  static decodeEvents = async (
    tx: Transaction
  ): Promise<
    {
      type: string
      transactionId: string
      transactionIndex: number
      eventIndex: number
      data: unknown
    }[]
  > => {
    return await fcl
      .decode({
        tag: "GET_TRANSACTION_STATUS",
        transactionId: Buffer.from(tx.transactionId).toString("hex"),
        transactionStatus: {
          blockId: Buffer.from(tx.blockId).toString("hex"),
          status: tx.status,
          statusString: "",
          statusCode: tx.statusCode,
          errorMessage: tx.errorMessage,
          events: tx.events.map((event, i) => {
            return {
              type: event.type,
              transactionId: Buffer.from(tx.transactionId).toString("hex"),
              transactionIndex: event.transactionIndex,
              eventIndex: i,
              payload: JSON.parse(Buffer.from(event.payload).toString("utf-8")),
            }
          }),
        },
      })
      .then((result) => result.events)
  }

  getTransactionByID = async (id: string) => {
    return await this.client.getTransactionResult({
      id: Buffer.from(id.startsWith("0x") ? id.slice(2) : id, "hex"),
    })
  }

  getLatestTransactions = async (limit: number) => {
    const latestBlock = await this.getBlockByID().asIs()

    const results = await Promise.allSettled(
      Array.from({ length: limit }).flatMap(async (_, i) => {
        const block = await this.getBlockByID(
          latestBlock.height - BigInt(i),
        ).asIs()
        return await this.client
          .getTransactionResultsByBlockID({ blockId: block.id })
          .then((res) => res.transactionResults)
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
        return await this.getBlockByID(latestBlock.height - BigInt(i)).asIs()
      }),
    )

    const blocks = new Array<Block>()
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
        const { block } = await this.client.getLatestBlock({ isSealed: true })
        if (block == null) {
          throw new Error("failed to retrieve latest block")
        } else {
          return block
        }
      }

      const { block } = await this.client.getBlockByHeight({
        height: BigInt(id),
      })
      if (block == null) {
        throw new Error(`failed to retrieve block at height "${id}"`)
      } else {
        return block
      }
    }

    return {
      asIs: getBlock,
      withTransactions: async () => {
        const block = await getBlock()
        return {
          block,
          transactions: await this.client
            .getTransactionResultsByBlockID({ blockId: block.id })
            .then((res) => res.transactionResults),
        }
      },
    }
  }
}
