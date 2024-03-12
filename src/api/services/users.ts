import axiosInstance from '../axiosInstance';
import BaseService from './base';

class UsersService extends BaseService<UserInterface> {
	public async deleteSingleUser(userID: number) {
		const payload = {
			userToDelete: userID,
		};
		const url = `${this.baseURL}`;

		return await axiosInstance.delete(url, { data: payload });
	}

	public async updateUser(data: Partial<UserInterface>) {
		data = this.beforePatch(data);

		const baseUrl = `${this.baseURL}`;
		return await axiosInstance.patch(baseUrl, data);
	}
}

const users = new UsersService({
	serviceURL: `superadmin/users`,
	keyParameter: 'userID',
	crudResponseObject: 'user',
	crudResponseArray: 'users',
});

export default users;
