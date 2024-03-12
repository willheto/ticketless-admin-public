import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * Create new axios instance
 */
const config: AxiosRequestConfig = {
	baseURL: API_BASE_URL,
	timeout: 60000,
};
const axiosInstance: AxiosInstance = axios.create(config);

axiosInstance.interceptors.request.use(
	config => {
		const token = localStorage.getItem('ticketlessAdminAuthToken');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	error => {
		// Do something with request error
		return Promise.reject(error);
	},
);

axiosInstance.interceptors.response.use(
	response => {
		if ((!response || !response.data) && response.status !== 204) {
			throw response;
		}
		if (response.data) {
			return response.data;
		}
		return response;
	},
	error => {
		if (error.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			if (error.response.status === 401) {
				if (
					error.response.data.error === 'Missing token' ||
					error.response.data.error === 'Invalid token'
				) {
					// Redirect to login page if the token is invalid
					// Only if the requested endpoint is users/auth
					if (error.response.config.url !== '/users/auth') {
						window.location.href = '/profile';
					}
				}
			}
			if (error.response.data) {
				throw error.response.data;
			}
			throw error.response;
		} else if (error.request) {
			// The request was made but no response was received
			// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
			// http.ClientRequest in node.js
			let errorObject = {
				code: 9999,
				title: 'Connectivity error',
				details:
					'There seems to be a connection problem. Please try again.',
				errors: [],
			};
			throw errorObject;
			// throw error.request
		} else {
			// Something happened in setting up the request that triggered an Error
		}
		throw error;
	},
);

export default axiosInstance;
