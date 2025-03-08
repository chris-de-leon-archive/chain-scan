export type ApiErrorMetadata = {
	message: string
	code: string | HttpCode
}

export enum HttpCode {
	INTERNAL_SERVER_ERROR = 'Internal Server Error',
	BAD_REQUEST = 'Bad Request',
}

export enum HttpStatus {
	INTERNAL_SERVER_ERROR = 500,
	BAD_REQUEST = 400,
}

export class ApiError extends Error {
	constructor(
		public readonly status: HttpStatus,
		public readonly metadata: ApiErrorMetadata,
	) {
		super(metadata.message)
	}
}
