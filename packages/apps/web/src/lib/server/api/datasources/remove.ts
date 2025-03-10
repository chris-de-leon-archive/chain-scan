import { schema } from '$lib/server/providers/db/schema'
import { and, desc, eq, inArray } from 'drizzle-orm'
import { db } from '$lib/server/providers/db'
import type { Session } from 'better-auth'
import { z } from 'zod'

const zSchema = z.object({
	id: z.string().uuid(),
})

const handler = async (sess: Session, input: z.infer<typeof zSchema>) => {
	return await db.transaction(async (tx) => {
		const results = await tx
			.delete(schema.datasource)
			.where(and(eq(schema.datasource.userId, sess.userId), eq(schema.datasource.id, input.id)))
			.returning()

		if (results.some((r) => r.isActive)) {
			await tx
				.update(schema.datasource)
				.set({ isActive: true })
				.where(
					and(
						eq(schema.datasource.userId, sess.userId),
						inArray(
							schema.datasource.id,
							tx
								.select({ id: schema.datasource.id })
								.from(schema.datasource)
								.where(eq(schema.datasource.userId, sess.userId))
								.limit(1)
								.orderBy(desc(schema.datasource.createdAt)),
						),
					),
				)
		}

		return results
	})
}

export const remove = {
	schema: zSchema,
	handler,
}
