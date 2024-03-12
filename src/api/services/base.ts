/* eslint-disable no-unused-vars */
import axiosInstance from '../axiosInstance';
// import jwt from 'jsonwebtoken';

declare const API_BASE_URL: string;

const INVALID_RESPONSE = { details: 'Invalid response from the server.' };
const MISSING_PARAMETERS = { details: `Missing parameter in request.` };

interface BaseServiceConfig {
	serviceURL: string;
	crudResponseObject: string;
	crudResponseArray?: string;
	keyParameter?: string;
	baseURL?: string;
}

// const _getKeyValue = (key: string) => (obj: Record<string, string | number>) => obj[key];

class BaseService<ResourceType> {
	serviceURL: string;
	baseURL: string;
	crudResponseObject: string;
	crudResponseArray: string;
	keyParameter: string;
	eventID?: string | undefined;

	constructor(config: BaseServiceConfig) {
		this.serviceURL = config.serviceURL || '';
		this.baseURL = `${API_BASE_URL}/${config.serviceURL}`;
		this.crudResponseObject = config.crudResponseObject;
		this.crudResponseArray = config.crudResponseArray || config.serviceURL;
		this.keyParameter = config.keyParameter || 'id';
	}

	beforeCreate = (data: object) => data;
	beforePatch = (data: object) => data;

	/**
	 * Make GET request.
	 *
	 * @param {string} url
	 * @param {object} _options
	 * @returns {Promise}
	 */

	makeGetRequest(url: string, _options?: object): Promise<any> {
		// Make the GET request.
		return axiosInstance.get(url);
	}

	/**
	 * Get single resource by id.
	 *
	 * @param {number} id
	 * @returns {object}
	 */
	async getSingle(id: number | string): Promise<ResourceType> {
		if (!id) {
			throw MISSING_PARAMETERS;
		}

		const url = `${this.baseURL}/${id}`;

		// Make API call
		const response = await this.makeGetRequest(url);

		// Type guard for response.
		if (typeof response !== 'object') {
			throw INVALID_RESPONSE;
		} else if (!response || this.crudResponseObject in response === false) {
			console.error(
				`[BaseService] object returned from API does not contain ${this.crudResponseObject} property.`,
			);
			throw {
				...INVALID_RESPONSE,
				details: `Failed to fetch ${this.crudResponseObject}. Invalid response from the server.`,
			};
		}

		return response[this.crudResponseObject];
	}

	/**
	 * @name getAll
	 * @desc Get all resources.
	 * @returns {array}
	 */
	async getAll(): Promise<Array<ResourceType> | any> {
		// Make API call
		const response = await this.makeGetRequest(this.baseURL);

		// Type guard for response.
		if (typeof response !== 'object') {
			throw INVALID_RESPONSE;
		} else if (this.crudResponseArray in response === false) {
			console.error(
				`[BaseService] object returned from API does not contain ${this.crudResponseArray} property.`,
			);
			throw {
				...INVALID_RESPONSE,
				details: `Failed to fetch ${this.crudResponseArray}. Invalid response from the server.`,
			};
		}

		return response[this.crudResponseArray];
	}

	/**
	 * Get all resources by user id.
	 * @param userID
	 */
	async getAllByUserID(userID: number): Promise<Array<ResourceType> | any> {
		// Make API call
		const url = `${API_BASE_URL}/users/${userID}/${this.serviceURL}`;
		const response = await this.makeGetRequest(url);

		// Type guard for response.
		if (typeof response !== 'object') {
			throw INVALID_RESPONSE;
		} else if (this.crudResponseArray in response === false) {
			console.error(
				`[BaseService] object returned from API does not contain ${this.crudResponseArray} property.`,
			);
			throw {
				...INVALID_RESPONSE,
				details: `Failed to fetch ${this.crudResponseArray}. Invalid response from the server.`,
			};
		}

		return response[this.crudResponseArray];
	}

	/**
	 * Get all resources by event id.
	 * @param eventID
	 */
	async getAllByEventID(eventID: number): Promise<Array<ResourceType> | any> {
		// Make API call
		const url = `${API_BASE_URL}/events/${eventID}/${this.serviceURL}`;
		const response = await this.makeGetRequest(url);

		// Type guard for response.
		if (typeof response !== 'object') {
			throw INVALID_RESPONSE;
		} else if (this.crudResponseArray in response === false) {
			console.error(
				`[BaseService] object returned from API does not contain ${this.crudResponseArray} property.`,
			);
			throw {
				...INVALID_RESPONSE,
				details: `Failed to fetch ${this.crudResponseArray}. Invalid response from the server.`,
			};
		}

		return response[this.crudResponseArray];
	}

	/**
	 * @name create
	 * @desc Create resource.
	 * @param {object} data
	 * @returns {object}
	 */
	create = async (
		data: object,
		callback?: (_response) => void,
	): Promise<any> => {
		if (typeof this.beforeCreate === 'function') {
			data = this.beforeCreate(data);
		}
		const url = `${this.baseURL}`;
		// Make API call
		const response = await axiosInstance.post(url, data);

		if (!response) {
			if (
				!response ||
				(this.crudResponseObject && !response[this.crudResponseObject])
			) {
				throw INVALID_RESPONSE;
			}
		}

		if (typeof callback === 'function') {
			try {
				callback(response[this.crudResponseObject]);
			} catch (error) {
				console.log(`Delete callback failed.`, error);
			}
		}

		return response;
	};

	/**
	 * @name update
	 * @desc Update resource, data must contain id.
	 * @param {object} data
	 * @returns {object}
	 */
	patch = async (data: any, url?: string): Promise<any> => {
		const id = data[this.keyParameter];
		if (!id) {
			throw { details: `Missing ${this.keyParameter}` };
		}
		if (typeof this.beforePatch === 'function') {
			data = this.beforePatch(data);
		}
		const baseUrl = `${this.baseURL}`;
		const response = await axiosInstance.patch(
			url ? `${baseUrl}/${url}` : baseUrl,
			data,
		);

		if (!response || !response[this.crudResponseObject]) {
			throw INVALID_RESPONSE;
		}

		return response;
	};

	/**
	 * @name save
	 * @desc Create/update resource.
	 * @param {object} data
	 * @returns {object}
	 */

	save = (data: any): any => {
		const id = data[this.keyParameter];
		if (!id) {
			if (id === null) {
				delete data[this.keyParameter];
			}
			return this.create(data);
		} else {
			return this.patch(data);
		}
	};

	/**
	 * Delete single resource by id.
	 *
	 * @param {number} resourceID
	 * @returns {object}
	 */
	deleteSingle = async (resourceID: number) => {
		if (!resourceID) {
			throw { details: 'Invalid resourceID provided on delete.' };
		}

		const url = `${this.baseURL}`;
		const data = { [this.keyParameter]: resourceID };
		const response = await axiosInstance.delete(url, { data });

		return response;
	};
}

export default BaseService;
