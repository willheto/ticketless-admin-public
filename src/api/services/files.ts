import BaseService from './base';

class FilesService extends BaseService<FileInterface> {}

const files = new FilesService({
	serviceURL: `superadmin/files`,
	keyParameter: 'fileID',
	crudResponseObject: 'file',
	crudResponseArray: 'files',
});

export default files;
