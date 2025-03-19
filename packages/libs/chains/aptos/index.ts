import createClient, { type Client } from "openapi-fetch"
import { type paths, type components } from "./client"
import type { Chain } from "@chain-scan/types"
import * as crypto from "node:crypto"

type types = components["schemas"]

export type Transaction = types["Transaction"]
export type Block = types["Block"]

export class Aptos implements Chain<Block, Transaction> {
  private readonly client: Client<paths>

  constructor(private readonly url: string) {
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

  ID = () => {
    return crypto
      .createHash("md5")
      .update(Aptos.name.toLowerCase())
      .update(this.url)
      .digest()
      .toString("hex")
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

  getLatestBlockNumber = async () => {
    return await this.getLedgerInfo().then((res) => BigInt(res.block_height))
  }

  getBlockByNumber = (num?: bigint | number | undefined) => {
    const getBlock = async () => {
      const blockHeight = num != null ? num : await this.getLatestBlockNumber()

      const { data, error } = await this.client.GET(
        "/blocks/by_height/{block_height}",
        {
          params: {
            path: {
              block_height: this.safeCastStringToNumber(blockHeight.toString()),
            },
            query: {
              with_transactions: true,
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

    return {
      asIs: getBlock,
      withTransactions: async () => {
        const block = await getBlock()
        return {
          block,
          transactions: block.transactions ?? [],
        }
      },
    }
  }
}
