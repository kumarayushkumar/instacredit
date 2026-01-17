export interface StatusHistory {
	id: string
	loanId: string
	status: 'APPLIED' | 'APPROVED' | 'DISBURSED' | 'REJECTED'
	changedAt: string
}

export interface Loan {
	loanId: string
	userId: string
	approvedAmount: number
	statusHistory: StatusHistory[]
	createdAt: string
	updatedAt: string
}
