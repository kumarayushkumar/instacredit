import { NODE_ENV } from './env.js'

export const allowedDomains = ['']

if (NODE_ENV !== 'production') {
	allowedDomains.push(
		'http://localhost:3000',
		'http://localhost:3001',
		'http://127.0.0.1:3000',
		'http://127.0.0.1:3001'
	)
}
