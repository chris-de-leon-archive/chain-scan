import { drizzle } from 'drizzle-orm/bun-sqlite'
import { env } from '$env/dynamic/private'
import { Database } from 'bun:sqlite'

const url = env.DATABASE_URL

if (url == null) {
	throw new Error('DATABASE_URL is not set')
}

export const db = drizzle(new Database(url))
