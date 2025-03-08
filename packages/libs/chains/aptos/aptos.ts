import type { Chain } from "@chain-scan/types"
import {
  Aptos as AptosClient,
  AptosConfig,
  Network,
  type Block,
  type TransactionResponse,
} from "@aptos-labs/ts-sdk"

export class Aptos implements Chain<Block, TransactionResponse> {
  private readonly client: AptosClient

  constructor(url: string) {
    this.client = new AptosClient(
      new AptosConfig({
        network: Network.CUSTOM,
        fullnode: url,
      }),
    )
  }

  getTransactionByID = async (id: string) => {
    return await this.client.getTransactionByHash({ transactionHash: id })
  }

  getLatestTransactions = async (limit?: number | undefined) => {
    return await this.client.getTransactions({ options: { limit } })
  }

  getLatestBlocks = async (limit: number) => {
    const { block_height } = await this.client.getLedgerInfo()

    const results = await Promise.allSettled(
      Array.from({ length: limit }).map(async (_, i) => {
        return await this.getBlockByHeight(parseInt(block_height, 10) - i)
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
    const blockHeight =
      height != null
        ? height
        : await this.client
            .getLedgerInfo()
            .then(({ block_height }) => BigInt(block_height))

    return await this.client.getBlockByHeight({ blockHeight })
  }
}
