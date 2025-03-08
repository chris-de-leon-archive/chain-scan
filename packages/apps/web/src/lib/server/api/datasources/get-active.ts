import { schema } from '$lib/server/providers/db/schema'
import { db } from '$lib/server/providers/db'
import type { Session } from 'better-auth'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

const zSchema = z.object({})

const handler = async (sess: Session) => {
	return await db.query.datasource.findFirst({
		where: and(eq(schema.datasource.userId, sess.userId), eq(schema.datasource.isActive, true)),
	})
}

export const getActive = {
	schema: zSchema,
	handler,
}
