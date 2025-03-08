import createClient, { type Client } from "openapi-fetch"
import { type paths, type components } from "./client"
import type { Chain } from "@chain-scan/types"

type types = components["schemas"]

export class Aptos implements Chain<types["Block"], types["Transaction"]> {
  private readonly client: Client<paths>

  constructor(url: string) {
    this.client = createClient<paths>({ baseUrl: url })
  }

  private safeCastStringToNumber = (n: string) => {
    if (BigInt(n) > Number.MAX_SAFE_INTEGER) {
      throw new Error(`cannot safely convert "${n}" to number`)
    } else {
      return parseInt(n, 10)
    }
  }

  private getLedgerInfo = async () => {
    const { data, error } = await this.client.GET("/")
    if (error != null) {
      throw new Error(
        `failed to get ledger info:\n${JSON.stringify(error, null, 2)}`,
      )
    }
    if (Array.isArray(data)) {
      throw new Error(
        `failed to parse ledger info:\n${JSON.stringify(data, null, 2)}`,
      )
    }
    return data
  }

  getTransactionByID = async (id: string) => {
    const { data, error } = await this.client.GET(
      "/transactions/by_hash/{txn_hash}",
      {
        params: {
          path: { txn_hash: id },
        },
      },
    )

    if (error != null) {
      throw new Error(JSON.stringify(error, null, 2))
    }

    if (!("type" in data)) {
      throw new Error(
        `failed to parse transaction:\n${JSON.stringify(data, null, 2)}`,
      )
    }

    return data
  }

  getLatestTransactions = async (limit: number) => {
    const { data, error } = await this.client.GET("/transactions", {
      params: {
        query: { limit },
      },
    })

    if (error != null) {
      throw new Error(JSON.stringify(error, null, 2))
    }

    const txs = new Array<types["Transaction"]>()
    data.forEach((d) => {
      if (typeof d === "number") {
        throw new Error(`expected JSON result but got "${d}"`)
      } else {
        txs.push(d)
      }
    })

    return txs
  }

  getLatestBlocks = async (limit: number) => {
    const { block_height } = await this.getLedgerInfo()

    const results = await Promise.allSettled(
      Array.from({ length: limit }).map(async (_, i) => {
        return await this.getBlockByHeight(
          this.safeCastStringToNumber(block_height) - i,
        )
      }),
    )

    const blocks = new Array<types["Block"]>()
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
        : await this.getLedgerInfo().then((res) => res.block_height)

    const { data, error } = await this.client.GET(
      "/blocks/by_height/{block_height}",
      {
        params: {
          path: {
            block_height: this.safeCastStringToNumber(blockHeight.toString()),
          },
        },
      },
    )

    if (error != null) {
      throw new Error(
        `failed to retrieve block at height "${blockHeight}":\n${JSON.stringify(error, null, 2)}`,
      )
    }
    if (Array.isArray(data)) {
      throw new Error(
        `failed to parse block info:\n${JSON.stringify(data, null, 2)}`,
      )
    }

    return data
  }
}
