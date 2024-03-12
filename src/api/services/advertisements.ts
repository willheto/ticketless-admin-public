import BaseService from './base';

class AdvertisementsService extends BaseService<AdvertisementInterface> {}

const advertisements = new AdvertisementsService({
	serviceURL: `superadmin/advertisements`,
	keyParameter: 'advertisementID',
	crudResponseObject: 'advertisement',
	crudResponseArray: 'advertisements',
});

export default advertisements;
