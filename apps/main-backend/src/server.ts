import compression from 'compression'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import http from 'http'

import { allowedDomains } from './config/cors.js'
import { NODE_ENV, PORT } from './config/env.js'
import { startLenderPollingCron } from './cron/call-lender.js'
import logger from './lib/logger.js'
import errorHandler from './middlewares/handle-error.js'
import router from './routes/index.js'

const app = express()

// Error handling middleware
process.on('uncaughtException', error => {
	logger.error(
		`uncaught exception: error: ${error} stack: ${error.stack} timestamp: ${new Date().toISOString()}`
	)
	process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
	logger.error(
		`uncaught rejection at: ${promise} reason: ${reason} timestamp: ${new Date().toISOString()}`
	)
	process.exit(1)
})

// Graceful shutdown handlers
process.on('SIGTERM', () => {
	logger.info('SIGTERM received. shutting down gracefully...')
	process.exit(0)
})

process.on('SIGINT', () => {
	logger.info('SIGINT received. shutting down gracefully...')
	process.exit(0)
})

const serverConfig = () => {
	app.use(helmet())
	app.use(compression())

	app.use(
		cors({
			origin: (origin, callback) => {
				if (!origin || allowedDomains.includes(origin)) {
					callback(null, true)
				} else {
					callback(new Error('Not allowed by CORS'))
				}
			},
			credentials: true,
			methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
			allowedHeaders: 'Content-Type, Authorization'
		})
	)

	app.use(express.json({ limit: '10mb' }))
	app.use(express.urlencoded({ extended: true, limit: '10mb' }))

	app.use(router)
	app.use(errorHandler)

	http.createServer(app).listen(PORT, () => {
		console.log(
			`express is listening at http://localhost:${PORT} environment:${NODE_ENV}`
		)

		// Start lender polling cron job
		startLenderPollingCron()
	})
}

serverConfig()
