import { LmdbCache } from '@chain-scan/cache-lmdb'
import { env } from '$env/dynamic/private'

export const cache = LmdbCache
.build()
.setMaxLruSize({ size: parseInt(env.CACHE_LIM, 10) })
.setRootDbImpl({ path: env.CACHE_URL })
.setMainDbName({ name: env.CACHE_NAME })
.setMainDbOpts({
  sharedStructuresKey: Symbol.for(env.CACHE_NAME.concat(':shared-structures')),
	compression: true,
})
