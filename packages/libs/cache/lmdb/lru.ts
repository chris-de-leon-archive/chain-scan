import type { DatabaseOptions, RootDatabase, Database } from "lmdb"

// NOTE: Bun doesn't support async transaction callbacks yet, so we need
// to use synchronous transactions to make things work - more info here:
// instead: https://github.com/kriszyp/lmdb-js/issues/259#issuecomment-1782254317
//
// NOTE: UUID v7 is used to keep track of the LRU ordering. This works because
// lmdb-js sorts strings lexically and the lexical order of UUIDv7s aligns with
// their chronological order. The consequence of this is that the LRU element
// will always correspond to the UUIDv7 with the oldest timestamp and ties are
// broken using the entropy bits.
export class LmdbLruCache<TKey extends string, TVal> {
  private constructor(
    private readonly root: RootDatabase,
    private readonly database: Database<TVal, TKey>,
    private readonly keyToIdx: Database<string, TKey>,
    private readonly idxToKey: Database<TKey, string>,
    private readonly capacity: number,
  ) {}

  static build = <TKey extends string, TVal>() => {
    return {
      setMaxLruSize: ({ size }: { size: number }) => {
        if (Number.isNaN(size) || !Number.isInteger(size) || size <= 0) {
          throw new Error(`LRU size must be a positive integer (got: ${size})`)
        }
        return {
          setRootDbImpl: (root: RootDatabase) => {
            return {
              setMainDbName: ({ name }: { name: string }) => {
                return {
                  setMainDbOpts: (opts: DatabaseOptions) => {
                    const database = root.openDB<TVal, TKey>(name, opts)
                    const keyToIdx = root.openDB<string, TKey>(
                      name.concat(":key-to-idx"),
                      {},
                    )
                    const idxToKey = root.openDB<TKey, string>(
                      name.concat(":idx-to-key"),
                      {},
                    )
                    return new LmdbLruCache(
                      root,
                      database,
                      keyToIdx,
                      idxToKey,
                      size,
                    )
                  },
                }
              },
            }
          },
        }
      },
    }
  }

  put = (key: TKey, val: TVal) => {
    this.root.transactionSync(() => {
      if (this.idxToKey.getKeysCount() >= this.capacity) {
        const lruEntry = this.idxToKey
          .getRange({ limit: 1, reverse: false })
          .asArray.at(0)

        if (lruEntry != null) {
          this.idxToKey.removeSync(lruEntry.key)
          this.keyToIdx.removeSync(lruEntry.value)
          this.database.removeSync(lruEntry.value)
        }
      }

      const newIdx = Bun.randomUUIDv7()
      this.idxToKey.putSync(newIdx, key)
      this.keyToIdx.putSync(key, newIdx)
      this.database.putSync(key, val)
    })
  }

  get = (key: TKey) => {
    const val = this.database.get(key)
    if (val == null) {
      return undefined
    }

    this.root.transactionSync(() => {
      const idx = this.keyToIdx.get(key)
      if (idx != null) {
        this.keyToIdx.removeSync(key)
        this.idxToKey.removeSync(idx)
      }

      const newIdx = Bun.randomUUIDv7()
      this.keyToIdx.putSync(key, newIdx)
      this.idxToKey.putSync(newIdx, key)
    })

    return val
  }
}
