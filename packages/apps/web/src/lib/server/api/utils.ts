import { ApiError, HttpCode, HttpStatus } from './errors'
import { z } from 'zod'

export const safeParseQueryParams = <T extends z.ZodTypeAny>(
	url: URL,
	schema: T,
): { data: undefined; error: ApiError } | { data: z.infer<T>; error: undefined } => {
	const params = new Map<string, string | string[]>()
	url.searchParams.entries().forEach(([k, v]) => {
		const value = params.get(k)
		if (value != null) {
			params.set(k, Array.isArray(value) ? value.concat(v) : [value, v])
		} else {
			params.set(k, v)
		}
	})

	const result = schema.safeParse(Object.fromEntries(params.entries()))
	if (result.error != null) {
		return {
			data: undefined,
			error: new ApiError(HttpStatus.BAD_REQUEST, {
				message: result.error.message,
				code: HttpCode.BAD_REQUEST,
			}),
		}
	} else {
		return {
			data: result.data,
			error: undefined,
		}
	}
}
