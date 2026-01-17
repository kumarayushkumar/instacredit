export const NODE_ENV = process.env.NODE_ENV || 'development'
export const PORT = process.env.PORT || 8000

export const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
	throw new Error('DATABASE_URL is not defined in environment variables')
}
export const LENDER_API_URL =
	NODE_ENV == 'production'
		? process.env.LENDER_API_URL
		: 'http://localhost:8001'
if (!LENDER_API_URL) {
	throw new Error('LENDER_API_URL is not defined in environment variables')
}

export const LOKI_HOST = process.env.LOKI_HOST || 'http://localhost:3101'

export const LOKI_BASIC_AUTH =
	process.env.LOKI_BASIC_AUTH || 'username:password'
