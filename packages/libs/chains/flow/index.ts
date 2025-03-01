import { createGrpcWebTransport } from "@connectrpc/connect-node"
import { type Client, createClient } from "@connectrpc/connect"
import type { Chain } from "@chain-scan/types"
import * as flow from "./client"

type Block = NonNullable<flow.BlockResponse["block"]>

// NOTE: https://developers.flow.com/tools/clients/fcl-js/api
// NOTE: https://developers.flow.com/networks/access-onchain-data
export class Flow implements Chain<Block, flow.TransactionResultResponse> {
  private readonly client: Client<typeof flow.AccessAPI>

  constructor(url: string) {
    this.client = createClient(
      flow.AccessAPI,
      createGrpcWebTransport({
        httpVersion: "2",
        baseUrl: url,
      }),
    )
  }

  getTransactionByID = async (id: string) => {
    return await this.client.getTransactionResult({
      id: Buffer.from(id.startsWith("0x") ? id.slice(2) : id, "hex"),
    })
  }

  getLatestTransactions = async (limit: number) => {
    const latestBlock = await this.getBlockByHeight()

    const results = await Promise.allSettled(
      Array.from({ length: limit }).flatMap(async (_, i) => {
        const block = await this.getBlockByHeight(
          latestBlock.height - BigInt(i),
        )
        return await this.client
          .getTransactionResultsByBlockID({ blockId: block.id })
          .then((res) => res.transactionResults)
      }),
    )

    const txs = new Array<flow.TransactionResultResponse>()
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
        return await this.getBlockByHeight(latestBlock.height - BigInt(i))
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

  getBlockByHeight = async (height?: bigint | number | undefined) => {
    if (height == null) {
      const { block } = await this.client.getLatestBlock({ isSealed: true })
      if (block == null) {
        throw new Error("failed to retrieve latest block")
      } else {
        return block
      }
    }

    const { block } = await this.client.getBlockByHeight({
      height: BigInt(height),
    })
    if (block == null) {
      throw new Error(`failed to retrieve block at height "${height}"`)
    } else {
      return block
    }
  }
}
