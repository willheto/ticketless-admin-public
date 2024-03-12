import axiosInstance from '../axiosInstance';

/**
 * @name login
 * @desc Log user in.
 * @param {string} email
 * @param {string} password
 */
export const login = async (email: string, password: string) => {
	try {
		if (!email || !password) {
			throw {
				details: 'Missing parameters, check posted data.',
			};
		}

		let url = `${API_BASE_URL}/admin/user/login`;

		let payload = {
			email,
			password,
		};
		let options = {
			timeout: 60000,
		};

		// Make API call
		const response = await axiosInstance.post(url, payload, options);

		//@ts-expect-error
		if (!response?.token) {
			throw {
				details: 'Invalid response from the server.',
			};
		}

		return response;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const checkPassword = async (payload: {
	userID: number;
	password: string;
}) => {
	const { userID, password } = payload;
	if (!userID || !password) {
		throw {
			details: 'Missing parameters, check posted data.',
		};
	}

	let url = `${API_BASE_URL}/users/check-password`;

	let options = {
		timeout: 60000,
	};

	// Make API call
	return axiosInstance.post(url, { userID, password }, options);
};
