import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { type Loan } from '@/types/loan'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { StatusTimeline } from './StatusTimeline'

interface LoansTableProps {
	loans: Loan[]
}

export function LoansTable({ loans }: LoansTableProps) {
	const [expandedLoanId, setExpandedLoanId] = useState<string | null>(null)

	const handleRowClick = (loanId: string) => {
		setExpandedLoanId(expandedLoanId === loanId ? null : loanId)
	}

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-12"></TableHead>
						<TableHead>Loan ID</TableHead>
						<TableHead>User ID</TableHead>
						<TableHead>Approved Amount</TableHead>
						<TableHead>Created At</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{loans.length === 0 ? (
						<TableRow>
							<TableCell colSpan={5} className="text-center text-gray-500">
								No loans found
							</TableCell>
						</TableRow>
					) : (
						loans.map(loan => (
							<>
								<TableRow
									key={loan.loanId}
									onClick={() => handleRowClick(loan.loanId)}
									className="cursor-pointer hover:bg-gray-50">
									<TableCell>
										{expandedLoanId === loan.loanId ? (
											<ChevronDown className="h-4 w-4" />
										) : (
											<ChevronRight className="h-4 w-4" />
										)}
									</TableCell>
									<TableCell className="font-medium">{loan.loanId}</TableCell>
									<TableCell>{loan.userId}</TableCell>
									<TableCell>{loan.approvedAmount?.toLocaleString()}</TableCell>
									<TableCell>
										{new Date(loan.createdAt).toLocaleDateString()}
									</TableCell>
								</TableRow>
								{expandedLoanId === loan.loanId && (
									<TableRow key={`${loan.loanId}-expanded`}>
										<TableCell colSpan={5} className="bg-gray-50 p-6">
											<div className="space-y-3">
												<h3 className="text-sm font-semibold text-gray-700">
													Status History for {loan.loanId}
												</h3>
												<StatusTimeline statusHistory={loan.statusHistory} />
											</div>
										</TableCell>
									</TableRow>
								)}
							</>
						))
					)}
				</TableBody>
			</Table>
		</div>
	)
}
