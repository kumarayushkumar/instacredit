import type { NextFunction, Request, Response } from 'express'
import { NODE_ENV } from '../config/env.js'
import { HTTP_STATUS_CODE } from '../lib/constants.js'
import logger from '../lib/logger.js'

const errorHandler = (
	err: Error | any,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	logger.error(
		`${err.message}, error code: ${err.code || ''}, error stack: ${err.stack || ''} `,
		err
	)

	return res.status(err.status || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
		success: false,
		error: 'internal_server_error',
		message:
			NODE_ENV === 'production'
				? 'an unexpected error occurred'
				: err.message + ' | ' + err.stack
	})
}

export default errorHandler
