import { schema } from '$lib/server/providers/db/schema'
import { createInsertSchema } from 'drizzle-zod'
import { db } from '$lib/server/providers/db'
import type { Session } from 'better-auth'
import { ChainType } from '$lib/enums'
import { randomUUIDv7 } from 'bun'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const zSchema = createInsertSchema(schema.datasource, {
	chain: z.nativeEnum(ChainType),
	name: (s) => s.min(1),
	url: (s) => s.url(),
}).omit({
	userId: true,
	id: true,
})

const handler = async (sess: Session, input: z.infer<typeof zSchema>) => {
	return await db.transaction(async (tx) => {
		if (input.isActive) {
			await db
				.update(schema.datasource)
				.set({ isActive: false })
				.where(eq(schema.datasource.userId, sess.userId))
		}

		return await tx
			.insert(schema.datasource)
			.values({
				...input,
				userId: sess.userId,
				id: randomUUIDv7(),
			})
			.returning()
	})
}

export const create = {
	schema: zSchema,
	handler,
}
