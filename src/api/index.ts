import events from './services/events';
import organizations from './services/organizations';
import * as auth from './services/auth';
import overview from './services/overview';
import users from './services/users';
import tickets from './services/tickets';
import advertisements from './services/advertisements';
import files from './services/files';

const api = {
	events,
	auth,
	organizations,
	overview,
	users,
	tickets,
	advertisements,
	files,
};

export default api;
