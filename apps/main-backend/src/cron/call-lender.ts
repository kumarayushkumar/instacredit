import cron from 'node-cron'
import { LoanStatus } from '../../generated/prisma/enums.js'
import { LENDER_API_URL } from '../config/env.js'
import { prisma } from '../config/prisma.js'
import logger from '../lib/logger.js'

interface LenderLoanResponse {
	loan_id: string
	user_id: string
	status: 'Applied' | 'Approved' | 'Disbursed' | 'Rejected'
	approved_amount: number | null
	updated_at: string
}

const processLoan = async (loanData: LenderLoanResponse) => {
	try {
		const { loan_id, user_id, status, approved_amount } = loanData
		const mappedStatus = status.toUpperCase() as keyof typeof LoanStatus

		// Check if loan exists in database
		const existingLoan = await prisma.loans.findUnique({
			where: { loanId: loan_id },
			include: {
				statusHistory: {
					orderBy: { changedAt: 'desc' },
					take: 1
				}
			}
		})

		if (!existingLoan) {
			// Loan doesn't exist, create it
			logger.info(`Creating new loan: ${loan_id} for user: ${user_id}`)

			// Ensure user exists first
			await prisma.user.upsert({
				where: { userId: user_id },
				update: {},
				create: { userId: user_id }
			})

			// Create loan with initial status history
			await prisma.loans.create({
				data: {
					loanId: loan_id,
					userId: user_id,
					approvedAmount: approved_amount || 0,
					statusHistory: {
						create: {
							status: mappedStatus
						}
					}
				}
			})

			logger.info(
				`Loan ${loan_id} created successfully with status: ${mappedStatus}`
			)
		} else {
			// Loan exists, check if status has changed
			const latestStatus = existingLoan.statusHistory[0]?.status

			if (latestStatus !== mappedStatus) {
				logger.info(
					`Status changed for loan ${loan_id}: ${latestStatus} -> ${mappedStatus}`
				)

				// Update loan and create status history
				await prisma.loans.update({
					where: { loanId: loan_id },
					data: {
						approvedAmount: approved_amount || existingLoan.approvedAmount,
						statusHistory: {
							create: {
								status: mappedStatus
							}
						}
					}
				})

				logger.info(`Loan ${loan_id} status updated to: ${mappedStatus}`)
			} else {
				// Status unchanged, optionally update approved amount if changed
				if (
					approved_amount &&
					approved_amount !== existingLoan.approvedAmount
				) {
					await prisma.loans.update({
						where: { loanId: loan_id },
						data: {
							approvedAmount: approved_amount
						}
					})
					logger.info(
						`Loan ${loan_id} approved amount updated to: ${approved_amount}`
					)
				}
			}
		}
	} catch (error) {
		logger.error(`Error processing loan ${loanData.loan_id}: ${error}`)
	}
}

const fetchAndProcessLoans = async () => {
	try {
		logger.info(
			`[${new Date().toISOString()}] Fetching loans from lender API...`
		)

		const response = await fetch(`${LENDER_API_URL}/api/lender/loan-status`)

		if (!response.ok) {
			throw new Error(`Lender API returned status: ${response.status}`)
		}

		const data = await response.json()

		const loans: LenderLoanResponse[] = Array.isArray(data) ? data : [data]

		logger.info(`Received ${loans.length} loan(s) from lender API`)

		for (const loan of loans) {
			await processLoan(loan)
		}

		logger.info('Loan processing completed successfully')
	} catch (error) {
		logger.error(`Error fetching or processing loans from lender API: ${error}`)
	}
}

export const startLenderPollingCron = () => {
	// Run every 30 seconds
	cron.schedule('*/30 * * * * *', async () => {
		await fetchAndProcessLoans()
	})

	logger.info('Lender polling cron job started - running every 30 seconds')

	// Run immediately on startup
	fetchAndProcessLoans()
}
