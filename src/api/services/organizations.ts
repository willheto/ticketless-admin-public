import BaseService from './base';
import axiosInstance from '../axiosInstance';

class OrganizationService extends BaseService<OrganizationInterface> {
	addMemberByEmail = async (
		organizationID: number,
		email: string,
		role: 'admin' | 'user' = 'user',
	) => {
		try {
			const response = await axiosInstance.patch(
				`organization/${organizationID}/members`,
				{ email, role },
			);
			return response;
		} catch (error) {
			return error;
		}
	};
}

const organizations = new OrganizationService({
	serviceURL: `superadmin/organizations`,
	keyParameter: 'organizationID',
	crudResponseObject: 'organization',
	crudResponseArray: 'organizations',
});

export default organizations;
