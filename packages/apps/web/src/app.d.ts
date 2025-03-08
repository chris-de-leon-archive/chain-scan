// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { ApiErrorMetadata } from '$lib/server/api'
import type { Session, User } from 'better-auth'

declare global {
	namespace App {
		namespace Superforms {
			type Message = {
				type: 'error' | 'success'
				text: string
			}
		}
		interface Locals {
			auth:
				| {
						session: Session
						user: User
				  }
				| undefined
		}
		interface Error {
			metadata: ApiErrorMetadata
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
