import { useEffect, useState } from 'react'

import { getAllLoans } from '@/api/api'
import { REFRESH_INTERVAL } from '@/lib/constants'
import { type Loan } from '@/types/loan'
import { LoansTable } from './LoansTable'

export default function Loan() {
	const [loans, setLoans] = useState<Loan[]>([])
	const [loading, setLoading] = useState(true)
	const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

	const fetchLoans = async (silent = false) => {
		if (!silent) setLoading(true)
		const data = await getAllLoans()
		if (data) {
			setLoans(data)
			setLastUpdated(new Date())
		}
		if (!silent) setLoading(false)
	}

	useEffect(() => {
		fetchLoans()
	}, [])

	useEffect(() => {
		const interval = setInterval(() => {
			fetchLoans(true)
		}, REFRESH_INTERVAL)

		return () => clearInterval(interval)
	}, [])

	return (
		<div className="container mx-auto py-10">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Loans Dashboard</h1>
				<div className="flex items-center gap-4">
					Last updated: {lastUpdated.toLocaleTimeString()}
				</div>
			</div>

			{loading ? (
				<div className="text-center py-10">
					<p className="text-gray-500">Loading loans...</p>
				</div>
			) : (
				<LoansTable loans={loans} />
			)}
		</div>
	)
}
