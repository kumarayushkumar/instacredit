import { prisma } from '../config/prisma.js'

const getAllLoanController = async () => {
	return await prisma.loans.findMany({
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			statusHistory: {
				orderBy: { changedAt: 'desc' }
			}
		}
	})
}

export default getAllLoanController
