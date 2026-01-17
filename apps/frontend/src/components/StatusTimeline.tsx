import { type StatusHistory } from '@/types/loan'

interface StatusTimelineProps {
	statusHistory: StatusHistory[]
}

const statusColors = {
	APPLIED: 'bg-blue-500',
	APPROVED: 'bg-green-500',
	DISBURSED: 'bg-purple-500',
	REJECTED: 'bg-red-500'
}

export function StatusTimeline({ statusHistory }: StatusTimelineProps) {
	// Sort by changedAt ascending (oldest to newest)
	const sortedHistory = [...statusHistory].sort(
		(a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime()
	)

	return (
		<div className="relative">
			<div className="flex items-center justify-between gap-4 px-4">
				{sortedHistory.map((item, index) => (
					<div key={item.id} className="flex-1 flex flex-col items-center">
						{/* Timeline Node */}
						<div className="relative flex items-center w-full">
							{/* Line before */}
							{index > 0 && (
								<div className="flex-1 h-1 bg-gray-300 -ml-4"></div>
							)}

							{/* Circle */}
							<div
								className={`w-10 h-10 rounded-full ${
									statusColors[item.status]
								} flex items-center justify-center text-white font-bold z-10 shrink-0`}>
								{index + 1}
							</div>

							{/* Line after */}
							{index < sortedHistory.length - 1 && (
								<div className="flex-1 h-1 bg-gray-300 -mr-4"></div>
							)}
						</div>

						{/* Status Info */}
						<div className="mt-4 text-center">
							<p className="font-semibold text-sm">{item.status}</p>
							<p className="text-xs text-gray-500 mt-1">
								{new Date(item.changedAt).toLocaleString('en-US', {
									month: 'short',
									day: 'numeric',
									year: 'numeric',
									hour: '2-digit',
									minute: '2-digit'
								})}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
