import type { Chain } from "@chain-scan/types"
import * as crypto from "node:crypto"
import { LmdbLruCache } from "./lru"
import {
  type RootDatabaseOptionsWithPath,
  type DatabaseOptions,
  open,
} from "lmdb"

export class LmdbCache<TBlock, TTransaction>
  implements Chain<TBlock, TTransaction>
{
  private constructor(
    private readonly cache: LmdbLruCache<string, unknown>,
    private readonly chain: Chain<TBlock, TTransaction>,
  ) {}

  static build = () => {
    return {
      setMaxLruSize: (capacity: { size: number }) => {
        return {
          setRootDbImpl: (opts: RootDatabaseOptionsWithPath) => {
            const root = open(opts)
            return {
              setMainDbName: (db: { name: string }) => {
                return {
                  setMainDbOpts: (opts: DatabaseOptions) => {
                    const lruc = LmdbLruCache.build()
                      .setMaxLruSize(capacity)
                      .setRootDbImpl(root)
                      .setMainDbName(db)
                      .setMainDbOpts(opts)

                    return {
                      connect<TBlock, TTransaction>(
                        chain: Chain<TBlock, TTransaction>,
                      ) {
                        return new LmdbCache(lruc, chain)
                      },
                    }
                  },
                }
              },
            }
          },
        }
      },
    }
  }

  private buildCacheKey = (methods: string[], params: crypto.BinaryLike[]) => {
    const key = crypto.createHash("md5")
    key.update(this.chain.ID())
    methods.forEach((m) => key.update(m))
    params.forEach((p) => key.update(p))
    return key.digest().toString("hex")
  }

  ID() {
    return crypto
      .createHash("md5")
      .update(LmdbCache.name)
      .update(this.chain.ID())
      .digest()
      .toString("hex")
  }

  getLatestBlockNumber = async () => {
    return await this.chain.getLatestBlockNumber()
  }

  getLatestTransactions = async (limit: number) => {
    const txs = new Array<TTransaction>()
    for (let i = await this.getLatestBlockNumber(); ; i--) {
      const { transactions } = await this.getBlockByNumber(i).withTransactions()
      for (const t of transactions) {
        if (txs.length >= limit) {
          return txs
        } else {
          txs.push(t)
        }
      }
    }
  }

  getTransactionByID = async (id: string) => {
    const cacheKey = this.buildCacheKey([this.getTransactionByID.name], [id])
    const cacheVal = this.cache.get(cacheKey)
    if (cacheVal != null) {
      return cacheVal as TTransaction
    }

    const result = await this.chain.getTransactionByID(id)
    this.cache.put(cacheKey, result)
    return result
  }

  getLatestBlocks = async (limit: number) => {
    const latestBlockNumber = await this.getLatestBlockNumber()

    const results = await Promise.allSettled(
      Array.from({ length: limit }).map(async (_, i) => {
        return await this.getBlockByNumber(latestBlockNumber - BigInt(i)).asIs()
      }),
    )

    const blocks = new Array<TBlock>()
    results.forEach((r) => {
      if (r.status === "rejected") {
        throw new Error(r.reason)
      } else {
        blocks.push(r.value)
      }
    })

    return blocks
  }

  getBlockByNumber = (num?: number | bigint | undefined) => {
    const fn = this.chain.getBlockByNumber(num)
    return {
      asIs: async () => {
        const blockNum = num != null ? num : await this.getLatestBlockNumber()
        const cacheKey = this.buildCacheKey(
          [this.getBlockByNumber.name, fn.asIs.name],
          [blockNum.toString()],
        )

        const cacheVal = this.cache.get(cacheKey)
        if (cacheVal != null) {
          type T = Awaited<ReturnType<typeof fn.asIs>>
          return cacheVal as T
        }

        const result = await fn.asIs()
        this.cache.put(cacheKey, result)
        return result
      },
      withTransactions: async () => {
        const blockNum = num != null ? num : await this.getLatestBlockNumber()
        const cacheKey = this.buildCacheKey(
          [this.getBlockByNumber.name, fn.withTransactions.name],
          [blockNum.toString()],
        )

        const cacheVal = this.cache.get(cacheKey)
        if (cacheVal != null) {
          type T = Awaited<ReturnType<typeof fn.withTransactions>>
          return cacheVal as T
        }

        const result = await fn.withTransactions()
        this.cache.put(cacheKey, result)
        return result
      },
    }
  }
}
