import BaseService from './base';
import axiosInstance from '../axiosInstance';

class OverviewService extends BaseService<EventInterface> {
	public getSuperAdminMeta = async () => {
		const url = `${API_BASE_URL}/superadmin/meta`;
		const response = await axiosInstance.get(url);
		return response;
	};
}

const overview = new OverviewService({
	serviceURL: `meta`,
	crudResponseObject: 'meta',
});

export default overview;
