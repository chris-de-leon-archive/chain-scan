import { schema } from '$lib/server/providers/db/schema'
import { db } from '$lib/server/providers/db'
import type { Session } from 'better-auth'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const zSchema = z.object({})

const handler = async (sess: Session) => {
	return await db.query.datasource.findMany({
		where: eq(schema.datasource.userId, sess.userId),
	})
}

export const list = {
	schema: zSchema,
	handler,
}
