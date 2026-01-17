import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table'
import { type Loan } from '@/types/loan'
import { ChevronDown, ChevronRight, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { StatusTimeline } from './StatusTimeline'

interface LoansTableProps {
	loans: Loan[]
}

export function LoansTable({ loans }: LoansTableProps) {
	const [expandedLoanId, setExpandedLoanId] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [statusFilter, setStatusFilter] = useState<string>('ALL')

	const handleRowClick = (loanId: string) => {
		setExpandedLoanId(expandedLoanId === loanId ? null : loanId)
	}

	const filteredLoans = useMemo(() => {
		let filtered = loans

		if (searchQuery) {
			const query = searchQuery.toLowerCase()
			filtered = filtered.filter(
				loan =>
					loan.loanId.toLowerCase().includes(query) ||
					loan.userId.toLowerCase().includes(query) ||
					loan.approvedAmount?.toString().includes(query)
			)
		}

		// Filter by status
		if (statusFilter !== 'ALL') {
			filtered = filtered.filter(loan => {
				const latestStatus =
					loan.statusHistory.length > 0
						? loan.statusHistory.reduce((latest, current) =>
								new Date(current.changedAt) > new Date(latest.changedAt)
									? current
									: latest
							).status
						: null
				return latestStatus === statusFilter
			})
		}

		return filtered
	}, [loans, searchQuery, statusFilter])

	return (
		<div className="mt-6">
			<div className="mb-4 flex gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
					<input
						type="text"
						placeholder="Search by Loan ID, User ID, or Amount..."
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
				</div>
				<select
					value={statusFilter}
					onChange={e => setStatusFilter(e.target.value)}
					className="px-4 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[150px]">
					<option value="ALL">All Status</option>
					<option value="APPLIED">Applied</option>
					<option value="APPROVED">Approved</option>
					<option value="DISBURSED">Disbursed</option>
					<option value="REJECTED">Rejected</option>
				</select>
			</div>
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
						{filteredLoans.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="text-center text-gray-500">
									{searchQuery || statusFilter !== 'ALL'
										? 'No loans match your filters'
										: 'No loans found'}
								</TableCell>
							</TableRow>
						) : (
							filteredLoans.map(loan => (
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
										<TableCell>
											{loan.approvedAmount?.toLocaleString()}
										</TableCell>
										<TableCell>
											{new Date(loan.createdAt).toLocaleDateString()}
										</TableCell>
									</TableRow>
									{expandedLoanId === loan.loanId && (
										<TableRow key={`${loan.loanId}-expanded`}>
											<TableCell colSpan={5} className="bg-gray-100 px-10 py-4">
												<div className="flex flex-col gap-4">
													<h3 className="text-sm font-semibold text-gray-700">
														Status History
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
		</div>
	)
}
