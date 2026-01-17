import type { Request, Response } from 'express'
import getAllLoanController from '../controllers/loan.controller.js'
import { HTTP_STATUS_CODE } from '../lib/constants.js'

export const getAllLoanHandler = async (_: Request, res: Response) => {
	let loans = await getAllLoanController()

	if (!loans) {
		return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
			success: false,
			error: 'not_found',
			message: 'no loans found'
		})
	}

	return res.status(HTTP_STATUS_CODE.OK).json({
		success: true,
		data: loans,
		message: 'all loans fetched successfully'
	})
}
