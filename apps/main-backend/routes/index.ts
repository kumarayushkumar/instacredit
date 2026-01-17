import { Router } from 'express'

import { HTTP_STATUS_CODE } from '../lib/constants.js'
import logger from '../lib/logger.js'
import { limiter } from '../middlewares/rate-limiter.js'
import loanRouter from './loan.route.js'

const router: Router = Router()

router.get('/health', limiter, (_, res) => {
	logger.info('Health check endpoint called')
	return res.status(HTTP_STATUS_CODE.OK).json({
		success: true,
		data: {
			timestamp: new Date().toString(),
			uptime: process.uptime()
		},
		message: 'service is healthy and running'
	})
})

router.use('/api/loan', loanRouter)

export default router
