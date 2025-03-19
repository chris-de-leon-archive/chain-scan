import { CACHE_NAME, CACHE_PATH, CACHE_SIZE } from "../constants"
import { LmdbCache } from "@chain-scan/cache-lmdb"
import * as path from "node:path"

export const cache = {
  setdir: (cacheDir: string) =>
    LmdbCache.build()
      .setMaxLruSize({ size: CACHE_SIZE })
      .setRootDbImpl({ path: path.join(cacheDir, CACHE_PATH) })
      .setMainDbName({ name: CACHE_NAME })
      .setMainDbOpts({
        sharedStructuresKey: Symbol.for(
          CACHE_NAME.concat(":shared-structures"),
        ),
        compression: true,
      }),
}
