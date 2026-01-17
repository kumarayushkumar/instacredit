import { NODE_ENV } from './env.js'

export const allowedDomains = ['http://localhost:5173', 'http://127.0.0.1:5173']

if (NODE_ENV !== 'production') {
	allowedDomains.push(
		'http://localhost:3000',
		'http://localhost:3001',
		'http://127.0.0.1:3000',
		'http://127.0.0.1:3001',
		'http://localhost:5173',
		'http://127.0.0.1:5173'
	)
}
