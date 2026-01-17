import { type StatusHistory } from '@/types/loan'

interface StatusTimelineProps {
	statusHistory: StatusHistory[]
}

export function StatusTimeline({ statusHistory }: StatusTimelineProps) {
	const sortedHistory = [...statusHistory].sort(
		(a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime()
	)

	// All possible statuses in order
	const allStatuses = ['APPLIED', 'APPROVED', 'DISBURSED', 'REJECTED']

	// Get the latest status
	const latestStatus = sortedHistory[sortedHistory.length - 1]?.status

	return (
		<div className="relative px-4">
			<div
				className="absolute top-0 left-4 right-4 h-0.5 bg-gray-400"
				style={{ top: '9px' }}></div>

			<div className="relative flex justify-between">
				{allStatuses.map(status => {
					const historyItem = sortedHistory.find(h => h.status === status)
					const isLatest = status === latestStatus

					return (
						<div key={status} className="flex flex-col items-center">
							<div
								className={`w-5 h-5 rounded-full ${
									isLatest ? 'bg-green-500' : 'bg-gray-400'
								} flex items-center justify-center text-white font-bold z-10 shrink-0`}></div>

							<div className="mt-4 text-center">
								<p className="font-semibold text-sm">{status}</p>
								{historyItem && (
									<p className="text-xs text-gray-500 mt-1">
										{new Date(historyItem.changedAt).toLocaleString('en-US', {
											month: 'short',
											day: 'numeric',
											year: 'numeric',
											hour: '2-digit',
											minute: '2-digit'
										})}
									</p>
								)}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
