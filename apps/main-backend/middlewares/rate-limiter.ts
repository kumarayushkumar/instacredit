import { rateLimit } from 'express-rate-limit'
import { HTTP_STATUS_CODE } from '../lib/constants.js'
import logger from '../lib/logger.js'

export const limiter = rateLimit({
	windowMs: 1 * 1000, // 1 second
	limit: 5,
	standardHeaders: true,
	legacyHeaders: false,
	handler: (req, res) => {
		logger.error(
			`too many requests made to the request: ${req.method} | ${req.originalUrl || req.url || 'unknown path'} | from: ${req.ip}`
		)
		return res.status(HTTP_STATUS_CODE.TOO_MANY_REQUESTS).json({
			success: false,
			error: 'too_many_requests',
			message: 'slow down, take it easy'
		})
	}
})
