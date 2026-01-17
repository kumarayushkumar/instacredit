import { createLogger } from 'omnilogs'
import { LOKI_BASIC_AUTH, LOKI_HOST } from '../config/env.js'

const logger = createLogger({
	serviceName: 'main-backend',
	level: 'info',
	dateFormat: 'DD/MM/YYYY HH:mm:ss',
	transports: {
		console: {
			type: 'detailed'
		},
		loki: {
			host: LOKI_HOST!,
			basicAuth: LOKI_BASIC_AUTH!
		}
	}
})

export default logger
