import { redirect } from '@sveltejs/kit'

export const AssertUnreachable = (v: never) => {
	throw new Error(`unreachable check failed: ${v}`)
}

export const redirectTo = (loc: string | URL) => {
	redirect(302, loc)
}
