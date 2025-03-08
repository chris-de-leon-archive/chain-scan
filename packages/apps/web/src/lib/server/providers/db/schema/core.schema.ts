import { sqliteTable, integer, check, text, index } from 'drizzle-orm/sqlite-core'
import { ChainType } from '../../../../enums'
import { CurrentMsTimestamp } from './sql'
import { user } from './auth.schema'
import { sql } from 'drizzle-orm'

const withEnumCheck = <T>(n: string, c: T, e: Record<string, string>) => {
	return check(
		n,
		sql`${c} IN (${sql.join(
			Object.values(e).map((v) => sql.raw("'" + v + "'")),
			sql`,`,
		)})`,
	)
}

export const datasource = sqliteTable(
	'datasource',
	{
		id: text('id').primaryKey(),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.notNull()
			.default(CurrentMsTimestamp),
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		name: text('name').notNull(),
		chain: text('chain').$type<ChainType>().notNull(),
		isActive: integer('is_active', { mode: 'boolean' }).notNull(),
		url: text('url').notNull(),
	},
	(t) => [
		index('exactly_one_active_datasource')
			.on(t.userId)
			.where(sql`${t.isActive} = TRUE`),
		withEnumCheck('valid_chain', t.chain, ChainType),
	],
)
