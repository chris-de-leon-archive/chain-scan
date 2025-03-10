import { schema } from '$lib/server/providers/db/schema'
import { createUpdateSchema } from 'drizzle-zod'
import { db } from '$lib/server/providers/db'
import type { Session } from 'better-auth'
import { ChainType } from '$lib/enums'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

const zSchema = createUpdateSchema(schema.datasource, {
	chain: z.nativeEnum(ChainType).optional(),
	name: (s) => s.min(1),
	url: (s) => s.url(),
	id: z.string().uuid(),
}).omit({
	userId: true,
})

const handler = async (sess: Session, input: z.infer<typeof zSchema>) => {
	const { id, ...values } = input

	if (Object.values(values).every((v) => v == null)) {
		return []
	}

	return await db.transaction(async (tx) => {
		if (values.isActive != null && values.isActive) {
			await tx
				.update(schema.datasource)
				.set({ isActive: false })
				.where(eq(schema.datasource.userId, sess.userId))
		}

		return await tx
			.update(schema.datasource)
			.set(values)
			.where(and(eq(schema.datasource.userId, sess.userId), eq(schema.datasource.id, id)))
			.returning()
	})
}

export const edit = {
	schema: zSchema,
	handler,
}
