import { schema } from '$lib/server/providers/db/schema'
import { db } from '$lib/server/providers/db'
import type { Session } from 'better-auth'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

const zSchema = z.object({
	id: z.string().uuid(),
})

const handler = async (sess: Session, input: z.infer<typeof zSchema>) => {
	return await db.query.datasource.findFirst({
		where: and(eq(schema.datasource.userId, sess.userId), eq(schema.datasource.id, input.id)),
	})
}

export const getByID = {
	schema: zSchema,
	handler,
}
