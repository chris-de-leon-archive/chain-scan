import { defineConfig } from 'drizzle-kit'

const url = process.env['DATABASE_URL']

if (url == null) {
	throw new Error('DATABASE_URL is not set')
}

export default defineConfig({
	schema: './src/lib/server/providers/db/schema/**/*.schema.ts',
	dbCredentials: { url },
	verbose: true,
	strict: true,
	dialect: 'sqlite',
})
