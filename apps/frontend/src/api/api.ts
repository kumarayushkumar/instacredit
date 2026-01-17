import { API_BASE_URL, API_TIMEOUT } from '@/lib/constants'
import axios from 'axios'
import { toast } from 'sonner'

const apiClient = axios.create({
	baseURL: `${API_BASE_URL}/api/`,
	headers: {
		'Content-Type': 'application/json'
	},
	timeout: API_TIMEOUT
})

// Check internet connectivity before making requests
apiClient.interceptors.request.use(
	config => {
		if (!navigator.onLine) {
			toast.error('No Internet Connection', {
				description: 'Please check your internet connection and try again.'
			})
			return Promise.reject(new Error('No internet connection'))
		}
		return config
	},
	error => Promise.reject(error)
)

export const getAllLoans = async () => {
	try {
		const response = await apiClient.get('loan/all-loans')
		// Return the data array from the response
		return response.data.data || response.data
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response) {
				toast.error('Server Error', {
					description: error.response.data.message || 'Failed to fetch loans'
				})
			} else if (error.request) {
				toast.error('Network Error', {
					description:
						'Unable to reach the server. Please check if the backend is running.'
				})
			}
		} else {
			toast.error('Error', {
				description:
					error instanceof Error
						? error.message
						: 'An unexpected error occurred'
			})
		}
		return null
	}
}
